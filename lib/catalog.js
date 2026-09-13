import aliasesFile from '../config/aliases.json' with { type: 'json' }
import {
  compactArtificialAnalysisModel,
  fetchArtificialAnalysisModels,
} from './artificial-analysis.js'
import {
  buildOpenRouterCatalog,
  fetchOpenRouterModels,
  fetchOpenRouterZdrEndpoints,
} from './openrouter.js'
import { matchModels } from './match.js'

const DEFAULT_TTL_MS = 12 * 60 * 60 * 1000
let cached = null

function aliases() {
  return Object.fromEntries(
    Object.entries(aliasesFile).filter(([key]) => !key.startsWith('_')),
  )
}

export async function getMergedCatalog({ forceRefresh = false } = {}) {
  const ttl = Number(process.env.MODEL_SELECTOR_CACHE_TTL_MS ?? DEFAULT_TTL_MS)
  const now = Date.now()

  if (
    !forceRefresh &&
    cached &&
    Number.isFinite(ttl) &&
    ttl > 0 &&
    now - cached.cachedAt < ttl
  ) {
    return { ...cached.value, cache: { status: 'hit', ttl_ms: ttl } }
  }

  const [aaResult, openRouterRows, openRouterZdrEndpoints] = await Promise.all([
    fetchArtificialAnalysisModels(),
    fetchOpenRouterModels(),
    fetchOpenRouterZdrEndpoints(),
  ])

  const openRouterModels = buildOpenRouterCatalog(openRouterRows, openRouterZdrEndpoints)
  const aaModels = aaResult.models.map(compactArtificialAnalysisModel)
  const reconciliation = matchModels(openRouterModels, aaModels, aliases())

  const matchedById = new Map(
    reconciliation.matches.map((entry) => [entry.openRouter.model_id, entry]),
  )
  const unmatchedById = new Map(
    reconciliation.unmatched.map((entry) => [entry.openRouter.model_id, entry]),
  )
  const ambiguousById = new Map(
    reconciliation.ambiguous.map((entry) => [entry.openRouter.model_id, entry]),
  )

  const models = openRouterModels.map((openRouter) => {
    const matched = matchedById.get(openRouter.model_id)
    if (matched) {
      return {
        ...openRouter,
        artificial_analysis: matched.aa,
        reconciliation: matched.match,
      }
    }

    const ambiguous = ambiguousById.get(openRouter.model_id)
    if (ambiguous) {
      return {
        ...openRouter,
        artificial_analysis: null,
        reconciliation: {
          method: 'ambiguous',
          confidence: 'none',
          candidates: ambiguous.candidates,
        },
      }
    }

    return {
      ...openRouter,
      artificial_analysis: null,
      reconciliation: {
        method: 'unmatched',
        confidence: 'none',
        reason: unmatchedById.get(openRouter.model_id)?.reason ?? 'No Artificial Analysis match',
      },
    }
  })

  const value = {
    generated_at: new Date().toISOString(),
    models,
    diagnostics: {
      openrouter_model_count: openRouterModels.length,
      openrouter_zdr_endpoint_count: openRouterZdrEndpoints.length,
      openrouter_zdr_model_count: openRouterModels.filter((model) => model.zdr).length,
      artificial_analysis_model_count: aaModels.length,
      matched_model_count: reconciliation.matches.length,
      unmatched_model_count: reconciliation.unmatched.length,
      ambiguous_model_count: reconciliation.ambiguous.length,
      aa: aaResult.meta,
    },
    unmatched: reconciliation.unmatched.map(({ openRouter, reason }) => ({
      model_id: openRouter.model_id,
      model_name: openRouter.model_name,
      reason,
    })),
    ambiguous: reconciliation.ambiguous.map(({ openRouter, candidates }) => ({
      model_id: openRouter.model_id,
      model_name: openRouter.model_name,
      candidates,
    })),
  }

  cached = { cachedAt: now, value }
  return { ...value, cache: { status: 'miss', ttl_ms: ttl } }
}
