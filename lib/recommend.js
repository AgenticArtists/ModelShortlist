import { endpointSatisfies, modelCatalogSatisfies } from './openrouter.js'

export function isAliasModel(model) {
  return model?.is_alias === true
    || (typeof model?.model_id === 'string' && model.model_id.startsWith('~'))
}

// Resolve a requested model ID to a concrete catalog model. A "~...-latest"
// alias resolves through the alias_target OpenRouter publishes for it; a
// concrete ID resolves to itself. Returns null when nothing in the catalog
// corresponds to the request.
export function resolveModelId(modelsById, requestedId) {
  const direct = modelsById.get(requestedId)
  if (direct && !isAliasModel(direct)) return direct
  if (direct?.alias_target?.model_id) {
    return modelsById.get(direct.alias_target.model_id) ?? null
  }
  return null
}

function satisfiesHardConstraints(model, constraints, requiresZdr) {
  if (requiresZdr) {
    return (model.zdr_endpoint_options ?? [])
      .some((endpoint) => endpointSatisfies(endpoint, constraints))
  }
  return modelCatalogSatisfies(model, constraints)
}

function eligibleZdrEndpointsFor(model, constraints) {
  return (model.zdr_endpoint_options ?? [])
    .filter((endpoint) => endpointSatisfies(endpoint, constraints))
}

// Select the candidate pool for recommend_models.
//
// Rules, in order:
// - "~...-latest" alias entries are never candidates. An alias is a moving
//   target with no benchmark identity of its own; its concrete target is a
//   separate catalog entry and is considered directly.
// - Hard constraints (tools, context, price ceilings, ZDR) always apply,
//   including to incumbents.
// - Incumbents named by the caller are guaranteed a slot when they exist in
//   the catalog and satisfy the hard constraints. They bypass the discovery
//   filters (query/creator) and the limit slice, and each one gets an
//   explicit status entry either way.
// - Remaining slots are filled evidence-first: models with a confident
//   Artificial Analysis match come before unmatched models, with model_id
//   order as the deterministic tiebreak. Alphabetical order alone filled
//   small limits with whichever vendors sort first, benchmarked or not.
export function selectCandidates(models, args = {}) {
  const query = args.query?.trim().toLowerCase() || null
  const creator = args.creator?.trim().toLowerCase() || null
  const requiresZdr = args.requires_zdr === true
  const limit = args.limit ?? 50
  const constraints = {
    tools: args.requires_tools === true,
    minContext: args.min_context ?? null,
    maxInputPrice: args.max_input_price ?? null,
    maxOutputPrice: args.max_output_price ?? null,
  }

  const modelsById = new Map(models.map((model) => [model.model_id, model]))

  const incumbentStatus = []
  const incumbentModels = []
  const seenIncumbents = new Set()
  for (const requestedId of args.incumbent_model_ids ?? []) {
    const resolved = resolveModelId(modelsById, requestedId)
    if (!resolved) {
      incumbentStatus.push({
        requested_id: requestedId,
        resolved_model_id: null,
        status: 'not_found',
      })
      continue
    }
    if (!satisfiesHardConstraints(resolved, constraints, requiresZdr)) {
      incumbentStatus.push({
        requested_id: requestedId,
        resolved_model_id: resolved.model_id,
        status: 'excluded_by_constraints',
      })
      continue
    }
    incumbentStatus.push({
      requested_id: requestedId,
      resolved_model_id: resolved.model_id,
      status: 'included',
    })
    if (!seenIncumbents.has(resolved.model_id)) {
      seenIncumbents.add(resolved.model_id)
      incumbentModels.push(resolved)
    }
  }

  const discovered = []
  for (const model of models) {
    if (isAliasModel(model)) continue
    if (seenIncumbents.has(model.model_id)) continue

    if (query) {
      const haystack = [
        model.model_id,
        model.model_name,
        model.artificial_analysis?.name,
        model.artificial_analysis?.slug,
      ].filter(Boolean).join(' ').toLowerCase()
      if (!haystack.includes(query)) continue
    }

    if (creator) {
      const creatorText = `${model.author ?? ''} ${model.artificial_analysis?.creator ?? ''}`.toLowerCase()
      if (!creatorText.includes(creator)) continue
    }

    if (!satisfiesHardConstraints(model, constraints, requiresZdr)) continue
    discovered.push(model)
  }

  discovered.sort((a, b) => {
    const aMatched = a.artificial_analysis ? 0 : 1
    const bMatched = b.artificial_analysis ? 0 : 1
    if (aMatched !== bMatched) return aMatched - bMatched
    return a.model_id.localeCompare(b.model_id)
  })

  const selected = [
    ...incumbentModels,
    ...discovered.slice(0, Math.max(0, limit - incumbentModels.length)),
  ]

  const candidates = selected.map((model) => ({
    model,
    is_incumbent: seenIncumbents.has(model.model_id),
    eligibleZdrEndpoints: requiresZdr
      ? eligibleZdrEndpointsFor(model, constraints)
      : [],
  }))

  const aaMatchedCount = candidates
    .filter(({ model }) => model.artificial_analysis).length

  return {
    candidates,
    incumbent_status: incumbentStatus,
    evidence_coverage: {
      candidate_count: candidates.length,
      aa_matched_candidate_count: aaMatchedCount,
      aa_coverage_ratio: candidates.length
        ? Math.round((aaMatchedCount / candidates.length) * 1000) / 1000
        : null,
    },
  }
}

// Human-readable warning when the returned pool carries little or no
// benchmark evidence, so a degraded shortlist never wears a healthy label.
export function evidenceCoverageWarning(evidenceCoverage) {
  const { candidate_count: total, aa_matched_candidate_count: matched } =
    evidenceCoverage ?? {}
  if (!total) return null
  if (matched === 0) {
    return `None of the ${total} returned candidates have Artificial Analysis benchmark evidence (0/${total} matched). Do not present benchmark-based comparisons for this shortlist; the candidates are supported only by OpenRouter catalog data.`
  }
  if (matched / total < 0.5) {
    return `Only ${matched} of ${total} returned candidates have Artificial Analysis benchmark evidence. Benchmark-based comparisons cover a minority of this shortlist; say so when recommending.`
  }
  return null
}
