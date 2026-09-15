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
const sourceCache = new Map()

const defaultFetchers = {
  artificialAnalysis: fetchArtificialAnalysisModels,
  openRouterModels: fetchOpenRouterModels,
  openRouterZdr: fetchOpenRouterZdrEndpoints,
}

function aliases() {
  return Object.fromEntries(
    Object.entries(aliasesFile).filter(([key]) => !key.startsWith('_')),
  )
}

function configuredTtl() {
  const value = Number(process.env.MODEL_SELECTOR_CACHE_TTL_MS ?? DEFAULT_TTL_MS)
  return Number.isFinite(value) && value >= 0 ? value : DEFAULT_TTL_MS
}

function safeError(error) {
  const status = Number.isFinite(Number(error?.status)) ? Number(error.status) : null
  let message

  if (status === 401) message = 'authentication failed (HTTP 401)'
  else if (status === 403) message = 'access forbidden (HTTP 403)'
  else if (status === 429) message = 'rate limited (HTTP 429)'
  else if (status != null && status >= 500) message = `upstream service error (HTTP ${status})`
  else if (error?.name === 'AbortError' || error?.name === 'TimeoutError') message = 'request timed out'
  else message = String(error?.message ?? 'request failed').slice(0, 300)

  return {
    message,
    status,
    retry_after: error?.retryAfter ?? null,
  }
}

function sourceHealth({ status, fetchedAt = null, now, error = null }) {
  return {
    status,
    fetched_at: fetchedAt == null ? null : new Date(fetchedAt).toISOString(),
    age_ms: fetchedAt == null ? null : Math.max(0, now - fetchedAt),
    error,
  }
}

async function loadSource({ name, fetcher, now, required = false, fallbackValue }) {
  try {
    const value = await fetcher()
    sourceCache.set(name, { value, fetchedAt: now })
    return {
      value,
      health: sourceHealth({ status: 'fresh', fetchedAt: now, now }),
    }
  } catch (error) {
    const previous = sourceCache.get(name)
    if (previous) {
      return {
        value: previous.value,
        health: sourceHealth({
          status: 'stale',
          fetchedAt: previous.fetchedAt,
          now,
          error: safeError(error),
        }),
      }
    }

    if (required) {
      const details = safeError(error)
      throw new Error(
        `OpenRouter model catalog is unavailable and no cached copy exists: ${details.message}`,
      )
    }

    return {
      value: fallbackValue,
      health: sourceHealth({
        status: 'unavailable',
        now,
        error: safeError(error),
      }),
    }
  }
}

async function fetchNonEmptyOpenRouterCatalog(fetcher) {
  const rows = await fetcher()
  if (!Array.isArray(rows) || rows.length === 0) {
    throw new Error('OpenRouter model catalog is empty')
  }
  return rows
}

function freshnessWithAges(freshness, now) {
  const sources = Object.fromEntries(
    Object.entries(freshness.sources).map(([name, source]) => {
      const fetchedAt = source.fetched_at ? Date.parse(source.fetched_at) : null
      return [name, {
        ...source,
        age_ms: Number.isFinite(fetchedAt) ? Math.max(0, now - fetchedAt) : null,
      }]
    }),
  )

  return { ...freshness, sources }
}

function buildFreshness(sources) {
  const warnings = []

  if (sources.openrouter_models.status !== 'fresh') {
    warnings.push(
      sources.openrouter_models.status === 'stale'
        ? 'OpenRouter model catalog refresh failed; cached model metadata is being used.'
        : 'OpenRouter model catalog is unavailable.',
    )
  }
  if (sources.artificial_analysis.status !== 'fresh') {
    warnings.push(
      sources.artificial_analysis.status === 'stale'
        ? 'Artificial Analysis refresh failed; cached benchmark/performance data is being used.'
        : 'Artificial Analysis data is unavailable; models remain eligible without benchmark fields.',
    )
  }
  if (sources.openrouter_zdr.status !== 'fresh') {
    warnings.push(
      sources.openrouter_zdr.status === 'stale'
        ? 'OpenRouter ZDR endpoint refresh failed; cached endpoint metadata is being used.'
        : 'OpenRouter ZDR endpoint data is unavailable; ZDR-required eligibility cannot be established safely.',
    )
  }

  return {
    state: warnings.length ? 'degraded' : 'current',
    warnings,
    sources,
  }
}

export function resetCatalogCacheForTests() {
  cached = null
  sourceCache.clear()
}

export async function getMergedCatalog({
  forceRefresh = false,
  fetchers = defaultFetchers,
  now = Date.now(),
} = {}) {
  const ttl = configuredTtl()

  if (!forceRefresh && cached && ttl > 0 && now - cached.cachedAt < ttl) {
    return {
      ...cached.value,
      freshness: freshnessWithAges(cached.value.freshness, now),
      cache: {
        status: 'hit',
        ttl_ms: ttl,
        age_ms: Math.max(0, now - cached.cachedAt),
      },
    }
  }

  const [aaSource, openRouterSource, zdrSource] = await Promise.all([
    loadSource({
      name: 'artificialAnalysis',
      fetcher: fetchers.artificialAnalysis,
      now,
      fallbackValue: { models: [], meta: null },
    }),
    loadSource({
      name: 'openRouterModels',
      fetcher: () => fetchNonEmptyOpenRouterCatalog(fetchers.openRouterModels),
      now,
      required: true,
      fallbackValue: [],
    }),
    loadSource({
      name: 'openRouterZdr',
      fetcher: fetchers.openRouterZdr,
      now,
      fallbackValue: [],
    }),
  ])

  const aaResult = aaSource.value
  const openRouterRows = openRouterSource.value
  const openRouterZdrEndpoints = zdrSource.value

  const openRouterModels = buildOpenRouterCatalog(openRouterRows, openRouterZdrEndpoints)
  const aaRows = Array.isArray(aaResult?.models) ? aaResult.models : []
  const aaModels = aaRows.map(compactArtificialAnalysisModel)
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

  const freshness = buildFreshness({
    openrouter_models: openRouterSource.health,
    openrouter_zdr: zdrSource.health,
    artificial_analysis: aaSource.health,
  })

  const value = {
    generated_at: new Date(now).toISOString(),
    freshness,
    models,
    diagnostics: {
      openrouter_model_count: openRouterModels.length,
      openrouter_zdr_endpoint_count: openRouterZdrEndpoints.length,
      openrouter_zdr_model_count: openRouterModels.filter((model) => model.zdr).length,
      artificial_analysis_model_count: aaModels.length,
      matched_model_count: reconciliation.matches.length,
      unmatched_model_count: reconciliation.unmatched.length,
      ambiguous_model_count: reconciliation.ambiguous.length,
      aa: aaResult?.meta ?? null,
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
  return {
    ...value,
    cache: { status: 'miss', ttl_ms: ttl, age_ms: 0 },
  }
}
