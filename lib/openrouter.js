import { fetchJson } from './http.js'

const MODELS_URL = 'https://openrouter.ai/api/v1/models'
const ZDR_URL = 'https://openrouter.ai/api/v1/endpoints/zdr'

function requireApiKey() {
  const apiKey = process.env.OPENROUTER_API_KEY
  if (!apiKey) {
    throw new Error('OPENROUTER_API_KEY is not configured')
  }
  return apiKey
}

function authHeaders() {
  return {
    authorization: `Bearer ${requireApiKey()}`,
    accept: 'application/json',
  }
}

export async function fetchOpenRouterModels() {
  const { body } = await fetchJson(MODELS_URL, { headers: authHeaders() })

  if (!Array.isArray(body?.data)) {
    throw new Error('Unexpected OpenRouter models response: data is not an array')
  }

  return body.data
}

export async function fetchOpenRouterZdrEndpoints() {
  const { body } = await fetchJson(ZDR_URL, { headers: authHeaders() })

  if (!Array.isArray(body?.data)) {
    throw new Error('Unexpected OpenRouter ZDR response: data is not an array')
  }

  return body.data
}

function finiteNumbers(values) {
  return values
    .filter((value) => value !== null && value !== undefined && value !== '')
    .map(Number)
    .filter(Number.isFinite)
}

function minOrNull(values) {
  const nums = finiteNumbers(values)
  return nums.length ? Math.min(...nums) : null
}

function maxOrNull(values) {
  const nums = finiteNumbers(values)
  return nums.length ? Math.max(...nums) : null
}

function medianOrNull(values) {
  const nums = finiteNumbers(values).sort((a, b) => a - b)
  if (!nums.length) return null
  const mid = Math.floor(nums.length / 2)
  return nums.length % 2 ? nums[mid] : (nums[mid - 1] + nums[mid]) / 2
}

function pricePerMillion(value) {
  if (value === null || value === undefined || value === '') return null
  const n = Number(value)
  return Number.isFinite(n) ? n * 1_000_000 : null
}

function supportsToolUse(parameters = []) {
  const set = new Set(parameters.map((v) => String(v).toLowerCase()))
  return set.has('tools')
}

function numberOrNull(value) {
  if (value === null || value === undefined || value === '') return null
  const n = Number(value)
  return Number.isFinite(n) ? n : null
}

function compactPricing(pricing) {
  const rows = Array.isArray(pricing)
    ? pricing
    : pricing && typeof pricing === 'object'
      ? [pricing]
      : []

  const tiers = rows.map((row, index) => ({
    min_context: numberOrNull(row.min_context) ?? (index === 0 ? 0 : null),
    input: pricePerMillion(row.prompt),
    output: pricePerMillion(row.completion),
  }))

  return {
    summary: {
      input: tiers[0]?.input ?? null,
      output: tiers[0]?.output ?? null,
    },
    tiers: Array.isArray(pricing) ? tiers : null,
  }
}

function priceSatisfiesCeiling(entity, field, ceiling) {
  if (ceiling == null) return true

  const tiers = entity.pricing_tiers_usd_per_1m_tokens
  if (Array.isArray(tiers) && tiers.length) {
    return tiers.every((tier) => {
      const value = tier?.[field]
      return value != null && value <= ceiling
    })
  }

  const value = entity.pricing_usd_per_1m_tokens?.[field]
  return value != null && value <= ceiling
}

function compactZdrEndpoint(row) {
  const pricing = compactPricing(row.pricing)
  return {
    provider: row.provider_name ?? null,
    context_length: numberOrNull(row.context_length),
    max_prompt_tokens: numberOrNull(row.max_prompt_tokens),
    max_completion_tokens: numberOrNull(row.max_completion_tokens),
    supports_tools: supportsToolUse(row.supported_parameters),
    supported_parameters: (row.supported_parameters ?? []).map(String).sort(),
    pricing_usd_per_1m_tokens: pricing.summary,
    pricing_tiers_usd_per_1m_tokens: pricing.tiers,
    performance: {
      latency_p50_seconds: numberOrNull(row.latency_last_30m?.p50),
      throughput_p50_tokens_per_second:
        numberOrNull(row.throughput_last_30m?.p50),
      uptime_last_1d_percent: numberOrNull(row.uptime_last_1d),
    },
  }
}

export function groupZdrEndpointsByModel(endpoints) {
  const grouped = new Map()

  for (const endpoint of endpoints) {
    if (!endpoint?.model_id) continue
    const list = grouped.get(endpoint.model_id) ?? []
    list.push(endpoint)
    grouped.set(endpoint.model_id, list)
  }

  return [...grouped.entries()].map(([modelId, rows]) => {
    const endpointOptions = rows.map(compactZdrEndpoint)
    const providers = [...new Set(rows.map((row) => row.provider_name).filter(Boolean))]
    const toolOptions = endpointOptions.filter((row) => row.supports_tools)
    const toolProviders = [...new Set(toolOptions.map((row) => row.provider).filter(Boolean))]
    const parameterSets = rows.map(
      (row) => new Set((row.supported_parameters ?? []).map(String)),
    )
    const union = [...new Set(rows.flatMap((row) => row.supported_parameters ?? []))].sort()
    const intersection = parameterSets.length
      ? [...parameterSets[0]].filter((value) =>
          parameterSets.every((set) => set.has(value)),
        ).sort()
      : []

    return {
      model_id: modelId,
      model_name: rows.find((row) => row.model_name)?.model_name ?? modelId.split('/').pop(),
      author: modelId.includes('/') ? modelId.split('/')[0] : null,
      zdr: true,
      zdr_endpoint_count: rows.length,
      zdr_providers: providers.sort(),
      context: {
        min_endpoint_context_length: minOrNull(endpointOptions.map((row) => row.context_length)),
        max_endpoint_context_length: maxOrNull(endpointOptions.map((row) => row.context_length)),
        max_tool_capable_context_length:
          maxOrNull(toolOptions.map((row) => row.context_length)),
        max_prompt_tokens: maxOrNull(endpointOptions.map((row) => row.max_prompt_tokens)),
        max_completion_tokens:
          maxOrNull(endpointOptions.map((row) => row.max_completion_tokens)),
      },
      capabilities: {
        supports_tools_on_any_zdr_endpoint: toolProviders.length > 0,
        tool_capable_zdr_providers: toolProviders.sort(),
        supported_parameters_union: union,
        supported_parameters_all_zdr_endpoints: intersection,
      },
      openrouter_zdr_pricing_usd_per_1m_tokens: {
        lowest_input:
          minOrNull(endpointOptions.map((row) => row.pricing_usd_per_1m_tokens.input)),
        median_input:
          medianOrNull(endpointOptions.map((row) => row.pricing_usd_per_1m_tokens.input)),
        lowest_output:
          minOrNull(endpointOptions.map((row) => row.pricing_usd_per_1m_tokens.output)),
        median_output:
          medianOrNull(endpointOptions.map((row) => row.pricing_usd_per_1m_tokens.output)),
      },
      openrouter_zdr_performance: {
        best_latency_p50_seconds:
          minOrNull(endpointOptions.map((row) => row.performance.latency_p50_seconds)),
        median_endpoint_latency_p50_seconds:
          medianOrNull(endpointOptions.map((row) => row.performance.latency_p50_seconds)),
        best_throughput_p50_tokens_per_second:
          maxOrNull(endpointOptions.map((row) => row.performance.throughput_p50_tokens_per_second)),
        median_endpoint_throughput_p50_tokens_per_second:
          medianOrNull(endpointOptions.map((row) => row.performance.throughput_p50_tokens_per_second)),
        best_uptime_last_1d_percent:
          maxOrNull(endpointOptions.map((row) => row.performance.uptime_last_1d_percent)),
        worst_uptime_last_1d_percent:
          minOrNull(endpointOptions.map((row) => row.performance.uptime_last_1d_percent)),
      },
      zdr_endpoint_options: endpointOptions,
    }
  })
}

function compactCatalogModel(row) {
  const parameters = (row.supported_parameters ?? []).map(String).sort()
  const contextLength = numberOrNull(row.top_provider?.context_length ?? row.context_length)
  const pricing = compactPricing(row.pricing)

  return {
    model_id: row.id,
    model_name: row.name ?? row.id?.split('/').pop() ?? row.id,
    author: row.id?.includes('/') ? row.id.split('/')[0] : null,
    openrouter_catalog: {
      context_length: contextLength,
      max_completion_tokens: numberOrNull(row.top_provider?.max_completion_tokens),
      supports_tools: supportsToolUse(parameters),
      supported_parameters: parameters,
      pricing_usd_per_1m_tokens: pricing.summary,
      pricing_tiers_usd_per_1m_tokens: pricing.tiers,
      created: numberOrNull(row.created),
      canonical_slug: row.canonical_slug ?? row.id ?? null,
    },
  }
}

export function buildOpenRouterCatalog(modelRows, zdrEndpointRows = []) {
  const zdrByModel = new Map(
    groupZdrEndpointsByModel(zdrEndpointRows).map((model) => [model.model_id, model]),
  )

  return modelRows
    .filter((row) => row?.id)
    .map((row) => {
      const model = compactCatalogModel(row)
      const zdr = zdrByModel.get(model.model_id)
      return {
        ...model,
        zdr: Boolean(zdr),
        zdr_endpoint_count: zdr?.zdr_endpoint_count ?? 0,
        zdr_providers: zdr?.zdr_providers ?? [],
        zdr_context: zdr?.context ?? null,
        zdr_capabilities: zdr?.capabilities ?? null,
        openrouter_zdr_pricing_usd_per_1m_tokens:
          zdr?.openrouter_zdr_pricing_usd_per_1m_tokens ?? null,
        openrouter_zdr_performance: zdr?.openrouter_zdr_performance ?? null,
        zdr_endpoint_options: zdr?.zdr_endpoint_options ?? [],
      }
    })
}

export function modelCatalogSatisfies(model, constraints = {}) {
  const catalog = model.openrouter_catalog ?? {}
  if (constraints.tools === true && !catalog.supports_tools) return false
  if (
    constraints.minContext != null &&
    (catalog.context_length == null || catalog.context_length < constraints.minContext)
  ) {
    return false
  }
  if (!priceSatisfiesCeiling(catalog, 'input', constraints.maxInputPrice)) return false
  if (!priceSatisfiesCeiling(catalog, 'output', constraints.maxOutputPrice)) return false
  return true
}

export function endpointSatisfies(endpoint, constraints = {}) {
  if (constraints.tools === true && !endpoint.supports_tools) return false
  if (
    constraints.minContext != null &&
    (endpoint.context_length == null || endpoint.context_length < constraints.minContext)
  ) {
    return false
  }
  if (!priceSatisfiesCeiling(endpoint, 'input', constraints.maxInputPrice)) return false
  if (!priceSatisfiesCeiling(endpoint, 'output', constraints.maxOutputPrice)) return false
  return true
}
