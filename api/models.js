import { timingSafeEqual } from 'node:crypto'
import { getMergedCatalog } from '../lib/catalog.js'
import { endpointSatisfies } from '../lib/openrouter.js'

function safeEqual(a, b) {
  const left = Buffer.from(String(a ?? ''))
  const right = Buffer.from(String(b ?? ''))
  if (left.length !== right.length) return false
  return timingSafeEqual(left, right)
}

function requestUrl(req) {
  const proto = req.headers['x-forwarded-proto'] ?? 'https'
  const host = req.headers.host ?? 'localhost'
  return new URL(req.url ?? '/api/models', `${proto}://${host}`)
}

function authorized(req, url) {
  const expected = process.env.MODEL_SELECTOR_ACCESS_TOKEN
  if (!expected) return { ok: false, status: 503, error: 'MODEL_SELECTOR_ACCESS_TOKEN is not configured' }

  const queryToken = url.searchParams.get('access')
  const authHeader = req.headers.authorization ?? ''
  const bearerToken = authHeader.startsWith('Bearer ')
    ? authHeader.slice('Bearer '.length)
    : null

  const supplied = bearerToken || queryToken
  return safeEqual(supplied, expected)
    ? { ok: true }
    : { ok: false, status: 401, error: 'Unauthorized' }
}

function boolParam(value) {
  if (value == null) return null
  const v = value.toLowerCase()
  if (['1', 'true', 'yes'].includes(v)) return true
  if (['0', 'false', 'no'].includes(v)) return false
  return null
}

function numberParam(value) {
  if (value == null || value === '') return null
  const n = Number(value)
  return Number.isFinite(n) ? n : null
}

function filterModels(models, url) {
  const q = url.searchParams.get('q')?.trim().toLowerCase() || null
  const tools = boolParam(url.searchParams.get('tools'))
  const minContext = numberParam(url.searchParams.get('min_context'))
  const maxOutputPrice = numberParam(url.searchParams.get('max_output_price'))
  const creator = url.searchParams.get('creator')?.trim().toLowerCase() || null

  const constraints = {
    tools: tools === true,
    minContext,
    maxOutputPrice,
  }

  return models
    .map((model) => {
      if (q) {
        const haystack = [
          model.model_id,
          model.model_name,
          model.artificial_analysis?.name,
          model.artificial_analysis?.slug,
        ].filter(Boolean).join(' ').toLowerCase()
        if (!haystack.includes(q)) return null
      }

      if (creator) {
        const value =
          `${model.author ?? ''} ${model.artificial_analysis?.creator ?? ''}`.toLowerCase()
        if (!value.includes(creator)) return null
      }

      const eligibleEndpoints = (model.zdr_endpoint_options ?? []).filter(
        (endpoint) => endpointSatisfies(endpoint, constraints),
      )

      const hasHardConstraints =
        tools === true || minContext != null || maxOutputPrice != null

      if (hasHardConstraints && eligibleEndpoints.length === 0) return null

      return {
        ...model,
        constraint_match: {
          eligible_zdr_endpoint_count: hasHardConstraints
            ? eligibleEndpoints.length
            : model.zdr_endpoint_count,
          eligible_zdr_providers: hasHardConstraints
            ? [...new Set(eligibleEndpoints.map((e) => e.provider).filter(Boolean))].sort()
            : model.zdr_providers,
        },
      }
    })
    .filter(Boolean)
}

function trimDiagnostics(catalog, includeDiagnostics) {
  if (includeDiagnostics) {
    return {
      diagnostics: catalog.diagnostics,
      unmatched: catalog.unmatched,
      ambiguous: catalog.ambiguous,
    }
  }

  return {
    diagnostics: {
      openrouter_zdr_model_count: catalog.diagnostics.openrouter_zdr_model_count,
      matched_model_count: catalog.diagnostics.matched_model_count,
      unmatched_model_count: catalog.diagnostics.unmatched_model_count,
      ambiguous_model_count: catalog.diagnostics.ambiguous_model_count,
      aa_rate_limit: catalog.diagnostics.aa?.rateLimit ?? null,
    },
  }
}

export default async function handler(req, res) {
  res.setHeader('Content-Type', 'application/json; charset=utf-8')
  res.setHeader('Cache-Control', 'private, no-store')
  res.setHeader('X-Robots-Tag', 'noindex, nofollow, noarchive')
  res.setHeader('Referrer-Policy', 'no-referrer')

  if (req.method !== 'GET') {
    res.statusCode = 405
    res.setHeader('Allow', 'GET')
    res.end(JSON.stringify({ error: 'Method not allowed' }))
    return
  }

  const url = requestUrl(req)
  const auth = authorized(req, url)
  if (!auth.ok) {
    res.statusCode = auth.status
    res.end(JSON.stringify({ error: auth.error }))
    return
  }

  try {
    const forceRefresh = boolParam(url.searchParams.get('refresh')) === true
    const includeDiagnostics =
      boolParam(url.searchParams.get('diagnostics')) === true
    const limit = Math.max(
      1,
      Math.min(200, Math.trunc(numberParam(url.searchParams.get('limit')) ?? 100)),
    )

    const catalog = await getMergedCatalog({ forceRefresh })
    const filtered = filterModels(catalog.models, url)
    const models = filtered.slice(0, limit)

    res.statusCode = 200
    res.end(JSON.stringify({
      generated_at: catalog.generated_at,
      source_attribution: {
        artificial_analysis: 'https://artificialanalysis.ai/',
        artificial_analysis_note:
          'Artificial Analysis Free API data; internal-use endpoint with attribution.',
        openrouter: 'https://openrouter.ai/',
        openrouter_note:
          'OpenRouter /api/v1/endpoints/zdr is the source of ZDR endpoint eligibility and operational metadata.',
      },
      usage_note:
        'Recommend only from returned models. ZDR eligibility is current to generated_at. For actual inference, also set provider.zdr=true in the OpenRouter request.',
      filters_applied: {
        q: url.searchParams.get('q'),
        tools: boolParam(url.searchParams.get('tools')),
        min_context: numberParam(url.searchParams.get('min_context')),
        max_output_price: numberParam(url.searchParams.get('max_output_price')),
        creator: url.searchParams.get('creator'),
        limit,
      },
      returned_model_count: models.length,
      matched_before_filters: catalog.models.length,
      models,
      ...trimDiagnostics(catalog, includeDiagnostics),
      cache: catalog.cache,
    }))
  } catch (error) {
    console.error('[model-selector]', error)
    const status = error?.status === 429 ? 429 : 502
    res.statusCode = status
    res.end(JSON.stringify({
      error: error?.message ?? 'Upstream request failed',
      upstream_status: error?.status ?? null,
    }))
  }
}
