import test from 'node:test'
import assert from 'node:assert/strict'
import {
  getMergedCatalog,
  resetCatalogCacheForTests,
} from '../lib/catalog.js'

const OPENROUTER_MODELS = [{
  id: 'vendor/model-a',
  name: 'Model A',
  context_length: 128000,
  supported_parameters: ['tools'],
  pricing: { prompt: '0.000001', completion: '0.000003' },
  top_provider: { context_length: 128000, max_completion_tokens: 16000 },
}]

const AA_RESULT = {
  models: [{
    id: 'aa-1',
    slug: 'model-a',
    name: 'Model A',
    model_creator: { name: 'Vendor' },
    evaluations: { artificial_analysis_intelligence_index: 50 },
  }],
  meta: { tier: 'free' },
}

const ZDR_ENDPOINTS = [{
  model_id: 'vendor/model-a',
  model_name: 'Model A',
  provider_name: 'Provider One',
  context_length: 128000,
  supported_parameters: ['tools'],
  pricing: { prompt: '0.000001', completion: '0.000003' },
}]

function fetchers(overrides = {}) {
  return {
    artificialAnalysis: async () => AA_RESULT,
    openRouterModels: async () => OPENROUTER_MODELS,
    openRouterZdr: async () => ZDR_ENDPOINTS,
    ...overrides,
  }
}

test('reports current freshness when all upstreams succeed', async () => {
  resetCatalogCacheForTests()
  const result = await getMergedCatalog({
    forceRefresh: true,
    fetchers: fetchers(),
    now: 1_000,
  })

  assert.equal(result.freshness.state, 'current')
  assert.equal(result.freshness.sources.openrouter_models.status, 'fresh')
  assert.equal(result.freshness.sources.artificial_analysis.status, 'fresh')
  assert.equal(result.freshness.sources.openrouter_zdr.status, 'fresh')
  assert.equal(result.models.length, 1)
  assert.equal(result.models[0].artificial_analysis?.name, 'Model A')
})

test('keeps OpenRouter models eligible when Artificial Analysis is unavailable', async () => {
  resetCatalogCacheForTests()
  const result = await getMergedCatalog({
    forceRefresh: true,
    fetchers: fetchers({
      artificialAnalysis: async () => {
        const error = new Error('bad key details')
        error.status = 401
        throw error
      },
    }),
    now: 2_000,
  })

  assert.equal(result.freshness.state, 'degraded')
  assert.equal(result.freshness.sources.artificial_analysis.status, 'unavailable')
  assert.equal(result.freshness.sources.artificial_analysis.error.message, 'authentication failed (HTTP 401)')
  assert.equal(result.models.length, 1)
  assert.equal(result.models[0].artificial_analysis, null)
})

test('marks ZDR unavailable without removing the general OpenRouter catalog', async () => {
  resetCatalogCacheForTests()
  const result = await getMergedCatalog({
    forceRefresh: true,
    fetchers: fetchers({
      openRouterZdr: async () => {
        throw new Error('network unavailable')
      },
    }),
    now: 3_000,
  })

  assert.equal(result.freshness.state, 'degraded')
  assert.equal(result.freshness.sources.openrouter_zdr.status, 'unavailable')
  assert.equal(result.models.length, 1)
  assert.equal(result.models[0].zdr, false)
})

test('falls back to explicitly stale per-source data after a successful refresh', async () => {
  resetCatalogCacheForTests()
  await getMergedCatalog({
    forceRefresh: true,
    fetchers: fetchers(),
    now: 10_000,
  })

  const failed = async () => {
    const error = new Error('temporary outage')
    error.status = 503
    throw error
  }

  const result = await getMergedCatalog({
    forceRefresh: true,
    fetchers: fetchers({
      artificialAnalysis: failed,
      openRouterModels: failed,
      openRouterZdr: failed,
    }),
    now: 20_000,
  })

  assert.equal(result.freshness.state, 'degraded')
  assert.equal(result.freshness.sources.openrouter_models.status, 'stale')
  assert.equal(result.freshness.sources.artificial_analysis.status, 'stale')
  assert.equal(result.freshness.sources.openrouter_zdr.status, 'stale')
  assert.equal(result.freshness.sources.openrouter_models.age_ms, 10_000)
  assert.equal(result.models.length, 1)
  assert.equal(result.models[0].zdr, true)
})

test('fails closed when the OpenRouter catalog is unavailable with no cache', async () => {
  resetCatalogCacheForTests()
  await assert.rejects(
    getMergedCatalog({
      forceRefresh: true,
      fetchers: fetchers({
        openRouterModels: async () => {
          const error = new Error('upstream failure')
          error.status = 503
          throw error
        },
      }),
      now: 30_000,
    }),
    /OpenRouter model catalog is unavailable and no cached copy exists: upstream service error \(HTTP 503\)/,
  )
})

test('refuses an empty OpenRouter catalog', async () => {
  resetCatalogCacheForTests()
  await assert.rejects(
    getMergedCatalog({
      forceRefresh: true,
      fetchers: fetchers({ openRouterModels: async () => [] }),
      now: 40_000,
    }),
    /OpenRouter model catalog is empty/,
  )
})
