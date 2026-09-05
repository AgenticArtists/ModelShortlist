import aliasesFile from '../config/aliases.json' with { type: 'json' }
import {
  compactArtificialAnalysisModel,
  fetchArtificialAnalysisModels,
} from './artificial-analysis.js'
import {
  fetchOpenRouterZdrEndpoints,
  groupZdrEndpointsByModel,
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

  const [aaResult, openRouterEndpoints] = await Promise.all([
    fetchArtificialAnalysisModels(),
    fetchOpenRouterZdrEndpoints(),
  ])

  const openRouterModels = groupZdrEndpointsByModel(openRouterEndpoints)
  const aaModels = aaResult.models.map(compactArtificialAnalysisModel)
  const reconciliation = matchModels(openRouterModels, aaModels, aliases())

  const models = reconciliation.matches.map(({ openRouter, aa, match }) => ({
    ...openRouter,
    artificial_analysis: aa,
    reconciliation: match,
  }))

  const value = {
    generated_at: new Date().toISOString(),
    models,
    diagnostics: {
      openrouter_zdr_endpoint_count: openRouterEndpoints.length,
      openrouter_zdr_model_count: openRouterModels.length,
      artificial_analysis_model_count: aaModels.length,
      matched_model_count: models.length,
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
