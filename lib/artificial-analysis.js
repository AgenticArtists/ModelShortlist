import { fetchJson } from './http.js'

const AA_BASE_URL = 'https://artificialanalysis.ai/api/v2'

function requireApiKey() {
  const apiKey = process.env.ARTIFICIAL_ANALYSIS_API_KEY
  if (!apiKey) {
    throw new Error('ARTIFICIAL_ANALYSIS_API_KEY is not configured')
  }
  return apiKey
}

export async function fetchArtificialAnalysisModels() {
  const apiKey = requireApiKey()
  const models = []
  let page = 1
  let hasMore = true
  let tier = null
  let intelligenceIndexVersion = null
  let rateLimit = null

  while (hasMore) {
    if (page > 20) {
      throw new Error('Artificial Analysis pagination exceeded safety limit')
    }

    const url = new URL(`${AA_BASE_URL}/language/models/free`)
    url.searchParams.set('page', String(page))

    const { body, headers } = await fetchJson(url, {
      headers: {
        'x-api-key': apiKey,
        accept: 'application/json',
      },
    })

    if (!Array.isArray(body?.data)) {
      throw new Error('Unexpected Artificial Analysis response: data is not an array')
    }

    models.push(...body.data)
    tier = body.tier ?? headers.get('x-aa-tier') ?? tier
    intelligenceIndexVersion =
      body.intelligence_index_version ?? intelligenceIndexVersion
    rateLimit = {
      limit: numberOrNull(headers.get('x-ratelimit-limit')),
      remaining: numberOrNull(headers.get('x-ratelimit-remaining')),
      resetUnix: numberOrNull(headers.get('x-ratelimit-reset')),
    }

    hasMore = Boolean(body.pagination?.has_more)
    page += 1
  }

  return {
    models,
    meta: {
      tier,
      pagesFetched: page - 1,
      intelligenceIndexVersion,
      rateLimit,
    },
  }
}

function numberOrNull(value) {
  if (value == null || value === '') return null
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : null
}

export function compactArtificialAnalysisModel(model) {
  return {
    id: model.id ?? null,
    slug: model.slug ?? null,
    name: model.name ?? null,
    creator: model.model_creator?.name ?? null,
    release_date: model.release_date ?? null,
    evaluations: {
      intelligence_index:
        model.evaluations?.artificial_analysis_intelligence_index ?? null,
      coding_index:
        model.evaluations?.artificial_analysis_coding_index ?? null,
      agentic_index:
        model.evaluations?.artificial_analysis_agentic_index ?? null,
    },
    pricing_usd_per_1m_tokens: {
      input: model.pricing?.price_1m_input_tokens ?? null,
      output: model.pricing?.price_1m_output_tokens ?? null,
      cache_hit: model.pricing?.price_1m_cache_hit_tokens ?? null,
      cache_write: model.pricing?.price_1m_cache_write_tokens ?? null,
    },
    performance: {
      median_output_tokens_per_second:
        model.performance?.median_output_tokens_per_second ?? null,
      median_time_to_first_token_seconds:
        model.performance?.median_time_to_first_token_seconds ?? null,
      median_time_to_first_answer_token_seconds:
        model.performance?.median_time_to_first_answer_token_seconds ?? null,
      median_end_to_end_response_time_seconds:
        model.performance?.median_end_to_end_response_time_seconds ?? null,
    },
  }
}
