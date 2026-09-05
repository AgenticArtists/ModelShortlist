function ascii(value) {
  return String(value ?? '')
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
}

export function normalizeModelLabel(value) {
  return ascii(value)
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, '')
}

function normalizedVariantsForAa(model) {
  return new Set(
    [
      model.name,
      model.slug,
      model.creator && model.name ? `${model.creator} ${model.name}` : null,
    ]
      .filter(Boolean)
      .map(normalizeModelLabel)
      .filter(Boolean),
  )
}

function normalizedVariantsForOpenRouter(model) {
  const slugPart = model.model_id?.includes('/')
    ? model.model_id.slice(model.model_id.indexOf('/') + 1)
    : model.model_id

  return new Set(
    [model.model_name, slugPart, model.model_id]
      .filter(Boolean)
      .map(normalizeModelLabel)
      .filter(Boolean),
  )
}

export function matchModels(openRouterModels, aaModels, aliases = {}) {
  const aaBySlug = new Map(aaModels.map((m) => [m.slug, m]))
  const aaVariants = aaModels.map((model) => ({
    model,
    variants: normalizedVariantsForAa(model),
  }))

  const matches = []
  const unmatched = []
  const ambiguous = []

  for (const openRouter of openRouterModels) {
    const aliasSlug = aliases[openRouter.model_id]
    if (aliasSlug) {
      const aa = aaBySlug.get(aliasSlug)
      if (aa) {
        matches.push({
          openRouter,
          aa,
          match: { method: 'alias', confidence: 'verified' },
        })
        continue
      }
      unmatched.push({
        openRouter,
        reason: `Alias points to missing AA slug: ${aliasSlug}`,
      })
      continue
    }

    const orVariants = normalizedVariantsForOpenRouter(openRouter)
    const candidates = aaVariants.filter(({ variants }) =>
      [...orVariants].some((value) => variants.has(value)),
    )

    if (candidates.length === 1) {
      matches.push({
        openRouter,
        aa: candidates[0].model,
        match: { method: 'exact-normalized', confidence: 'high' },
      })
    } else if (candidates.length > 1) {
      ambiguous.push({
        openRouter,
        candidates: candidates.map(({ model }) => ({
          id: model.id,
          slug: model.slug,
          name: model.name,
          creator: model.creator,
        })),
      })
    } else {
      unmatched.push({
        openRouter,
        reason: 'No exact normalized AA name/slug match',
      })
    }
  }

  return { matches, unmatched, ambiguous }
}
