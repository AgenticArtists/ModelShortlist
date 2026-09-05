import test from 'node:test'
import assert from 'node:assert/strict'
import { endpointSatisfies, groupZdrEndpointsByModel } from '../lib/openrouter.js'

test('groups ZDR endpoints and exposes operational constraints', () => {
  const result = groupZdrEndpointsByModel([
    {
      model_id: 'vendor/model-a',
      model_name: 'Model A',
      provider_name: 'Provider One',
      context_length: 100000,
      max_prompt_tokens: 90000,
      max_completion_tokens: 10000,
      supported_parameters: ['temperature', 'tools'],
      pricing: { prompt: '0.000001', completion: '0.000003' },
      latency_last_30m: { p50: 0.8 },
      throughput_last_30m: { p50: 80 },
      uptime_last_1d: 99.5,
    },
    {
      model_id: 'vendor/model-a',
      model_name: 'Model A',
      provider_name: 'Provider Two',
      context_length: 200000,
      max_prompt_tokens: 180000,
      max_completion_tokens: 20000,
      supported_parameters: ['temperature'],
      pricing: { prompt: '0.000002', completion: '0.000004' },
      latency_last_30m: { p50: 0.5 },
      throughput_last_30m: { p50: 120 },
      uptime_last_1d: 99.9,
    },
  ])

  assert.equal(result.length, 1)
  const model = result[0]
  assert.equal(model.zdr_endpoint_count, 2)
  assert.equal(model.context.max_endpoint_context_length, 200000)
  assert.equal(model.capabilities.supports_tools_on_any_zdr_endpoint, true)
  assert.deepEqual(model.capabilities.tool_capable_zdr_providers, ['Provider One'])
  assert.equal(model.openrouter_zdr_pricing_usd_per_1m_tokens.lowest_input, 1)
  assert.equal(model.openrouter_zdr_performance.best_latency_p50_seconds, 0.5)
  assert.equal(model.openrouter_zdr_performance.best_throughput_p50_tokens_per_second, 120)
})

test('hard constraints must be satisfied by the same endpoint', () => {
  const models = groupZdrEndpointsByModel([
    {
      model_id: 'vendor/model-b',
      model_name: 'Model B',
      provider_name: 'Tool Provider',
      context_length: 32000,
      supported_parameters: ['tools'],
      pricing: { prompt: '0.000001', completion: '0.000002' },
    },
    {
      model_id: 'vendor/model-b',
      model_name: 'Model B',
      provider_name: 'Long Context Provider',
      context_length: 200000,
      supported_parameters: ['temperature'],
      pricing: { prompt: '0.000001', completion: '0.000002' },
    },
  ])

  const endpoints = models[0].zdr_endpoint_options
  assert.equal(
    endpoints.some((endpoint) =>
      endpointSatisfies(endpoint, { tools: true, minContext: 100000 }),
    ),
    false,
  )
})

test('OpenRouter price constraint uses the actual ZDR endpoint price', () => {
  const endpoint = {
    supports_tools: true,
    context_length: 128000,
    pricing_usd_per_1m_tokens: { output: 12 },
  }
  assert.equal(
    endpointSatisfies(endpoint, {
      tools: true,
      minContext: 100000,
      maxOutputPrice: 10,
    }),
    false,
  )
})

test('missing OpenRouter numeric fields stay null instead of becoming zero', () => {
  const models = groupZdrEndpointsByModel([
    {
      model_id: 'vendor/model-c',
      model_name: 'Model C',
      provider_name: 'Provider',
      context_length: null,
      supported_parameters: [],
      pricing: { prompt: null, completion: null },
      latency_last_30m: { p50: null },
      throughput_last_30m: { p50: null },
      uptime_last_1d: null,
    },
  ])

  const model = models[0]
  assert.equal(model.context.max_endpoint_context_length, null)
  assert.equal(model.openrouter_zdr_pricing_usd_per_1m_tokens.lowest_output, null)
  assert.equal(model.openrouter_zdr_performance.best_latency_p50_seconds, null)
})
