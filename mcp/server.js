#!/usr/bin/env node
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { McpServer } from '@modelcontextprotocol/server'
import { serveStdio } from '@modelcontextprotocol/server/stdio'
import * as z from 'zod/v4'
import { getMergedCatalog } from '../lib/catalog.js'
import { endpointSatisfies } from '../lib/openrouter.js'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
loadLocalEnv(path.join(ROOT, '.env.local'))

function loadLocalEnv(filePath) {
  if (!fs.existsSync(filePath)) return
  const text = fs.readFileSync(filePath, 'utf8')
  for (const rawLine of text.split(/\r?\n/)) {
    const line = rawLine.trim()
    if (!line || line.startsWith('#')) continue
    const equals = line.indexOf('=')
    if (equals <= 0) continue
    const key = line.slice(0, equals).trim()
    let value = line.slice(equals + 1).trim()
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1)
    }
    if (process.env[key] == null) process.env[key] = value
  }
}

function requireLocalSecrets() {
  const missing = [
    'ARTIFICIAL_ANALYSIS_API_KEY',
    'OPENROUTER_API_KEY',
  ].filter((key) => !process.env[key])

  if (missing.length) {
    throw new Error(
      `Missing ${missing.join(', ')}. Create ${path.join(ROOT, '.env.local')} from .env.local.example.`,
    )
  }
}

function num(value) {
  return typeof value === 'number' && Number.isFinite(value) ? value : null
}

function min(values) {
  const nums = values.map(num).filter((value) => value != null)
  return nums.length ? Math.min(...nums) : null
}

function max(values) {
  const nums = values.map(num).filter((value) => value != null)
  return nums.length ? Math.max(...nums) : null
}

function compactCandidate(model, eligibleEndpoints) {
  const endpoints = eligibleEndpoints.length
    ? eligibleEndpoints
    : model.zdr_endpoint_options ?? []

  return {
    model_id: model.model_id,
    model_name: model.model_name,
    creator: model.artificial_analysis?.creator ?? model.author ?? null,
    release_date: model.artificial_analysis?.release_date ?? null,
    artificial_analysis: {
      intelligence_index:
        model.artificial_analysis?.evaluations?.intelligence_index ?? null,
      coding_index:
        model.artificial_analysis?.evaluations?.coding_index ?? null,
      agentic_index:
        model.artificial_analysis?.evaluations?.agentic_index ?? null,
      price_usd_per_1m_tokens:
        model.artificial_analysis?.pricing_usd_per_1m_tokens ?? null,
      median_performance: model.artificial_analysis?.performance ?? null,
    },
    openrouter_zdr: {
      eligible_provider_count: endpoints.length,
      eligible_providers: [...new Set(endpoints.map((e) => e.provider).filter(Boolean))].sort(),
      max_context_length: max(endpoints.map((e) => e.context_length)),
      max_completion_tokens: max(endpoints.map((e) => e.max_completion_tokens)),
      lowest_input_price_usd_per_1m_tokens: min(
        endpoints.map((e) => e.pricing_usd_per_1m_tokens?.input),
      ),
      lowest_output_price_usd_per_1m_tokens: min(
        endpoints.map((e) => e.pricing_usd_per_1m_tokens?.output),
      ),
      best_latency_p50_seconds: min(
        endpoints.map((e) => e.performance?.latency_p50_seconds),
      ),
      best_throughput_p50_tokens_per_second: max(
        endpoints.map((e) => e.performance?.throughput_p50_tokens_per_second),
      ),
      worst_uptime_last_1d_percent: min(
        endpoints.map((e) => e.performance?.uptime_last_1d_percent),
      ),
      supports_tools: endpoints.some((e) => e.supports_tools),
    },
    reconciliation: model.reconciliation,
  }
}

function filterCandidates(models, args) {
  const query = args.query?.trim().toLowerCase() || null
  const creator = args.creator?.trim().toLowerCase() || null
  const hasEndpointConstraints =
    args.requires_tools === true ||
    args.min_context != null ||
    args.max_input_price != null ||
    args.max_output_price != null

  const results = []
  for (const model of models) {
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

    const eligibleEndpoints = (model.zdr_endpoint_options ?? []).filter((endpoint) => {
      if (!endpointSatisfies(endpoint, {
        tools: args.requires_tools === true,
        minContext: args.min_context ?? null,
        maxOutputPrice: args.max_output_price ?? null,
      })) return false

      if (
        args.max_input_price != null &&
        (endpoint.pricing_usd_per_1m_tokens?.input == null ||
          endpoint.pricing_usd_per_1m_tokens.input > args.max_input_price)
      ) return false

      return true
    })

    if (hasEndpointConstraints && eligibleEndpoints.length === 0) continue
    results.push(compactCandidate(model, eligibleEndpoints))
  }

  return results.sort((a, b) => a.model_id.localeCompare(b.model_id))
}

const recommendationSchema = z.object({
  use_case: z.string().min(3).describe(
    'What the user needs the model to do. Preserve their actual workload and priorities in detail.',
  ),
  requires_tools: z.boolean().default(false).describe(
    'True when the workload requires tool/function calling on the actual ZDR endpoint.',
  ),
  min_context: z.number().int().positive().optional().describe(
    'Minimum context window required on one actual ZDR endpoint.',
  ),
  max_input_price: z.number().nonnegative().optional().describe(
    'Maximum acceptable OpenRouter input price in USD per 1M tokens.',
  ),
  max_output_price: z.number().nonnegative().optional().describe(
    'Maximum acceptable OpenRouter output price in USD per 1M tokens.',
  ),
  creator: z.string().optional().describe('Optional model creator/provider family filter.'),
  query: z.string().optional().describe('Optional model-name substring filter.'),
  limit: z.number().int().min(1).max(100).default(50),
  force_refresh: z.boolean().default(false).describe(
    'Force fresh upstream API requests. Use sparingly because AA Free has a quota.',
  ),
})

function createServer() {
  const server = new McpServer({
    name: 'modelshortlist',
    version: '0.2.1',
  })

  server.registerTool(
    'recommend_models',
    {
      title: 'Recommend AI models',
      description:
        'Use this whenever the user asks which AI model to use for a workload. It fetches current OpenRouter ZDR-eligible endpoints and intersects them with Artificial Analysis Free benchmark data. After calling this tool, YOU must make the recommendation based on the user use case; do not simply pick the first model or a single benchmark winner. Clearly attribute benchmark metrics to Artificial Analysis and endpoint operational data to OpenRouter in the answer.',
      inputSchema: recommendationSchema,
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        openWorldHint: true,
      },
    },
    async (args) => {
      try {
        requireLocalSecrets()
        const catalog = await getMergedCatalog({ forceRefresh: args.force_refresh })
        const candidates = filterCandidates(catalog.models, args).slice(0, args.limit)

        const payload = {
          use_case: args.use_case,
          zdr_required: true,
          selection_instructions: [
            'Treat OpenRouter ZDR eligibility and hard endpoint constraints as mandatory.',
            'Choose weights based on the stated use case rather than using a universal scoring formula.',
            'For coding work, coding_index and agentic_index are usually more relevant than intelligence_index alone.',
            'For high-volume workloads, weigh OpenRouter price and throughput heavily.',
            'For interactive workloads, weigh latency more heavily.',
            'Distinguish Artificial Analysis benchmark/performance data from OpenRouter endpoint operational data.',
            'When referencing benchmark scores or benchmark-derived performance, visibly attribute them to Artificial Analysis.',
            'When referencing ZDR availability, provider details, context, pricing, latency, throughput, uptime, or supported parameters, visibly attribute them to OpenRouter.',
            'Recommend one primary model and normally two alternatives with explicit tradeoffs.',
            'When the chosen model is actually called through OpenRouter, enforce provider.zdr=true.',
          ],
          generated_at: catalog.generated_at,
          candidate_count: candidates.length,
          candidates,
          diagnostics: {
            matched_model_count: catalog.diagnostics.matched_model_count,
            unmatched_model_count: catalog.diagnostics.unmatched_model_count,
            ambiguous_model_count: catalog.diagnostics.ambiguous_model_count,
            aa_rate_limit: catalog.diagnostics.aa?.rateLimit ?? null,
          },
          attribution: {
            artificial_analysis: 'https://artificialanalysis.ai/',
            openrouter: 'https://openrouter.ai/',
          },
        }

        return {
          content: [{ type: 'text', text: JSON.stringify(payload) }],
        }
      } catch (error) {
        return {
          isError: true,
          content: [{ type: 'text', text: `ModelShortlist error: ${error.message}` }],
        }
      }
    },
  )

  server.registerTool(
    'compare_models',
    {
      title: 'Compare specific AI models',
      description:
        'Use this after model discovery when the user wants a focused comparison of specific OpenRouter model IDs using current ZDR endpoint data and Artificial Analysis metrics. Attribute benchmark metrics to Artificial Analysis and endpoint operational data to OpenRouter in the answer.',
      inputSchema: z.object({
        model_ids: z.array(z.string()).min(2).max(12),
        force_refresh: z.boolean().default(false),
      }),
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        openWorldHint: true,
      },
    },
    async ({ model_ids, force_refresh }) => {
      try {
        requireLocalSecrets()
        const catalog = await getMergedCatalog({ forceRefresh: force_refresh })
        const wanted = new Set(model_ids)
        const models = catalog.models
          .filter((model) => wanted.has(model.model_id))
          .map((model) => compactCandidate(model, model.zdr_endpoint_options ?? []))
        const found = new Set(models.map((model) => model.model_id))
        const missing = model_ids.filter((id) => !found.has(id))

        return {
          content: [{
            type: 'text',
            text: JSON.stringify({
              generated_at: catalog.generated_at,
              models,
              missing_model_ids: missing,
              response_instruction:
                'Attribute Artificial Analysis benchmark/performance metrics to Artificial Analysis and OpenRouter endpoint operational data to OpenRouter.',
              attribution: {
                artificial_analysis: 'https://artificialanalysis.ai/',
                openrouter: 'https://openrouter.ai/',
              },
            }),
          }],
        }
      } catch (error) {
        return {
          isError: true,
          content: [{ type: 'text', text: `ModelShortlist error: ${error.message}` }],
        }
      }
    },
  )

  server.registerTool(
    'modelshortlist_status',
    {
      title: 'Check ModelShortlist status',
      description:
        'Use this to diagnose model matching coverage or Artificial Analysis quota state.',
      inputSchema: z.object({
        include_unmatched: z.boolean().default(false),
        force_refresh: z.boolean().default(false),
      }),
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        openWorldHint: true,
      },
    },
    async ({ include_unmatched, force_refresh }) => {
      try {
        requireLocalSecrets()
        const catalog = await getMergedCatalog({ forceRefresh: force_refresh })
        const payload = {
          generated_at: catalog.generated_at,
          diagnostics: catalog.diagnostics,
          unmatched: include_unmatched ? catalog.unmatched : undefined,
          ambiguous: include_unmatched ? catalog.ambiguous : undefined,
          cache: catalog.cache,
        }
        return {
          content: [{ type: 'text', text: JSON.stringify(payload) }],
        }
      } catch (error) {
        return {
          isError: true,
          content: [{ type: 'text', text: `ModelShortlist error: ${error.message}` }],
        }
      }
    },
  )

  return server
}

void serveStdio(createServer)
console.error('ModelShortlist MCP server running on stdio')
