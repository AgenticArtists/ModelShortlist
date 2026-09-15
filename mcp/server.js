#!/usr/bin/env node
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { McpServer } from '@modelcontextprotocol/server'
import { serveStdio } from '@modelcontextprotocol/server/stdio'
import * as z from 'zod/v4'
import packageJson from '../package.json' with { type: 'json' }
import { getMergedCatalog } from '../lib/catalog.js'
import { endpointSatisfies, modelCatalogSatisfies } from '../lib/openrouter.js'

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
      `Missing ${missing.join(', ')}. Configure these environment variables in your MCP client. Clone-based installs may instead create ${path.join(ROOT, '.env.local')} from .env.local.example.`,
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

function compactCandidate(model, { requiresZdr = false, eligibleZdrEndpoints = [] } = {}) {
  const aa = model.artificial_analysis
  const zdrEndpoints = requiresZdr ? eligibleZdrEndpoints : model.zdr_endpoint_options ?? []

  return {
    model_id: model.model_id,
    model_name: model.model_name,
    creator: aa?.creator ?? model.author ?? null,
    release_date: aa?.release_date ?? null,
    artificial_analysis: aa
      ? {
          intelligence_index: aa.evaluations?.intelligence_index ?? null,
          coding_index: aa.evaluations?.coding_index ?? null,
          agentic_index: aa.evaluations?.agentic_index ?? null,
          price_usd_per_1m_tokens: aa.pricing_usd_per_1m_tokens ?? null,
          median_performance: aa.performance ?? null,
        }
      : null,
    openrouter: {
      catalog: model.openrouter_catalog,
      zdr: {
        available: model.zdr === true,
        requirement_applied: requiresZdr,
        requirement_met: requiresZdr ? zdrEndpoints.length > 0 : null,
        endpoint_count: model.zdr_endpoint_count ?? 0,
        providers: model.zdr_providers ?? [],
        eligible_endpoint_count: requiresZdr ? zdrEndpoints.length : null,
        eligible_providers: requiresZdr
          ? [...new Set(zdrEndpoints.map((e) => e.provider).filter(Boolean))].sort()
          : null,
        eligible_max_context_length: requiresZdr
          ? max(zdrEndpoints.map((e) => e.context_length))
          : null,
        eligible_max_completion_tokens: requiresZdr
          ? max(zdrEndpoints.map((e) => e.max_completion_tokens))
          : null,
        eligible_lowest_input_price_usd_per_1m_tokens: requiresZdr
          ? min(zdrEndpoints.map((e) => e.pricing_usd_per_1m_tokens?.input))
          : null,
        eligible_lowest_output_price_usd_per_1m_tokens: requiresZdr
          ? min(zdrEndpoints.map((e) => e.pricing_usd_per_1m_tokens?.output))
          : null,
        eligible_best_latency_p50_seconds: requiresZdr
          ? min(zdrEndpoints.map((e) => e.performance?.latency_p50_seconds))
          : null,
        eligible_best_throughput_p50_tokens_per_second: requiresZdr
          ? max(zdrEndpoints.map((e) => e.performance?.throughput_p50_tokens_per_second))
          : null,
        eligible_worst_uptime_last_1d_percent: requiresZdr
          ? min(zdrEndpoints.map((e) => e.performance?.uptime_last_1d_percent))
          : null,
      },
    },
    reconciliation: model.reconciliation,
  }
}

function filterCandidates(models, args) {
  const query = args.query?.trim().toLowerCase() || null
  const creator = args.creator?.trim().toLowerCase() || null
  const requiresZdr = args.requires_zdr === true
  const constraints = {
    tools: args.requires_tools === true,
    minContext: args.min_context ?? null,
    maxInputPrice: args.max_input_price ?? null,
    maxOutputPrice: args.max_output_price ?? null,
  }

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

    if (requiresZdr) {
      const eligibleZdrEndpoints = (model.zdr_endpoint_options ?? []).filter((endpoint) =>
        endpointSatisfies(endpoint, constraints),
      )
      if (eligibleZdrEndpoints.length === 0) continue
      results.push(compactCandidate(model, { requiresZdr: true, eligibleZdrEndpoints }))
      continue
    }

    if (!modelCatalogSatisfies(model, constraints)) continue
    results.push(compactCandidate(model, { requiresZdr: false }))
  }

  return results.sort((a, b) => a.model_id.localeCompare(b.model_id))
}

function assertZdrEvidenceAvailable(catalog) {
  const status = catalog.freshness?.sources?.openrouter_zdr?.status
  if (status === 'unavailable') {
    throw new Error(
      'Current OpenRouter ZDR endpoint data is unavailable and no cached copy exists; cannot safely evaluate a ZDR-required request.',
    )
  }
}

function freshnessInstructions(catalog, { requiresZdr = false } = {}) {
  const sources = catalog.freshness?.sources ?? {}
  const instructions = []

  if (sources.openrouter_models?.status === 'stale') {
    instructions.push(
      'OpenRouter model catalog metadata is stale because the latest refresh failed. Do not describe pricing, context, capabilities, or availability as current without this caveat.',
    )
  }

  if (sources.artificial_analysis?.status === 'stale') {
    instructions.push(
      'Artificial Analysis benchmark/performance evidence is stale because the latest refresh failed. State that limitation when relying on those metrics.',
    )
  } else if (sources.artificial_analysis?.status === 'unavailable') {
    instructions.push(
      'Artificial Analysis evidence is unavailable for this refresh. Missing benchmark fields are missing evidence, not evidence of poor model quality.',
    )
  }

  if (requiresZdr && sources.openrouter_zdr?.status === 'stale') {
    instructions.push(
      'ZDR endpoint eligibility is based on stale cached OpenRouter endpoint metadata because the latest refresh failed. Revalidate ZDR at inference time and disclose this freshness limitation.',
    )
  }

  return instructions
}

const recommendationSchema = z.object({
  use_case: z.string().min(3).describe(
    'What the user needs the model to do. Preserve their actual workload and priorities in detail.',
  ),
  requires_zdr: z.boolean().default(false).describe(
    'Set true only when the user explicitly requires Zero Data Retention (ZDR). Otherwise leave false so all OpenRouter models remain eligible.',
  ),
  requires_tools: z.boolean().default(false).describe(
    'True when the workload requires tool/function calling.',
  ),
  min_context: z.number().int().positive().optional().describe(
    'Minimum context window required.',
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
    version: packageJson.version,
  })

  server.registerTool(
    'recommend_models',
    {
      title: 'Recommend AI models',
      description:
        'Use this whenever the user asks which AI model to use for a workload. It considers the OpenRouter model catalog and adds Artificial Analysis benchmark data when confidently matched, while returning explicit source freshness metadata if a refresh is degraded. Zero Data Retention is optional and must only be enforced when the user explicitly requires ZDR. After calling this tool, YOU must make the recommendation based on the user use case; do not simply pick the first model or a single benchmark winner. Clearly attribute Artificial Analysis benchmark metrics and OpenRouter catalog/endpoint data.',
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
        const requiresZdr = args.requires_zdr === true
        if (requiresZdr) assertZdrEvidenceAvailable(catalog)

        const candidates = filterCandidates(catalog.models, args).slice(0, args.limit)
        const selectionInstructions = [
          ...freshnessInstructions(catalog, { requiresZdr }),
          requiresZdr
            ? 'ZDR is an explicit hard requirement. Only recommend candidates with a reported ZDR endpoint that satisfies all hard constraints on that same endpoint.'
            : 'ZDR is not a requirement for this request. Do not exclude a model because it lacks a ZDR endpoint; treat ZDR availability as optional metadata only.',
          requiresZdr
            ? 'If the selected model is called through OpenRouter, enforce provider.zdr=true in the actual inference request.'
            : 'Do not add provider.zdr=true merely because ModelShortlist reports ZDR availability; only enforce it when the user requests ZDR.',
          'Choose weights based on the stated use case rather than using a universal scoring formula.',
          'For coding work, Artificial Analysis coding_index and agentic_index are usually more relevant than intelligence_index alone when those metrics are available.',
          'For high-volume workloads, weigh OpenRouter pricing and relevant performance evidence heavily.',
          'For interactive workloads, weigh latency when endpoint-level latency data is available.',
          'Models without a confident Artificial Analysis match remain eligible; do not invent missing benchmark scores.',
          'Distinguish Artificial Analysis benchmark/performance data from OpenRouter model catalog and endpoint data.',
          'Recommend one primary model and normally two alternatives with explicit tradeoffs.',
        ]

        const payload = {
          use_case: args.use_case,
          zdr_required: requiresZdr,
          constraint_basis: requiresZdr
            ? 'OpenRouter ZDR endpoint evidence; hard constraints must be satisfied by the same endpoint. Check freshness before describing the evidence as current.'
            : 'OpenRouter model catalog evidence; ZDR is not used as an eligibility filter. Check freshness before describing the evidence as current.',
          selection_instructions: selectionInstructions,
          generated_at: catalog.generated_at,
          freshness: catalog.freshness,
          cache: catalog.cache,
          candidate_count: candidates.length,
          candidates,
          diagnostics: {
            openrouter_model_count: catalog.diagnostics.openrouter_model_count,
            openrouter_zdr_model_count: catalog.diagnostics.openrouter_zdr_model_count,
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
        'Use this after model discovery for a focused comparison of specific OpenRouter model IDs. It returns OpenRouter catalog data, ZDR availability, Artificial Analysis metrics when confidently matched, and explicit source freshness metadata. ZDR is not assumed to be required.',
      inputSchema: z.object({
        model_ids: z.array(z.string()).min(2).max(12),
        requires_zdr: z.boolean().default(false).describe(
          'Set true only when the user explicitly requires Zero Data Retention.',
        ),
        force_refresh: z.boolean().default(false),
      }),
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        openWorldHint: true,
      },
    },
    async ({ model_ids, requires_zdr, force_refresh }) => {
      try {
        requireLocalSecrets()
        const catalog = await getMergedCatalog({ forceRefresh: force_refresh })
        const requiresZdr = requires_zdr === true
        if (requiresZdr) assertZdrEvidenceAvailable(catalog)

        const wanted = new Set(model_ids)
        const models = catalog.models
          .filter((model) => wanted.has(model.model_id))
          .map((model) => compactCandidate(model, {
            requiresZdr,
            eligibleZdrEndpoints: model.zdr_endpoint_options ?? [],
          }))
        const found = new Set(models.map((model) => model.model_id))
        const missing = model_ids.filter((id) => !found.has(id))

        return {
          content: [{
            type: 'text',
            text: JSON.stringify({
              generated_at: catalog.generated_at,
              freshness: catalog.freshness,
              cache: catalog.cache,
              zdr_required: requiresZdr,
              models,
              missing_model_ids: missing,
              response_instructions: [
                ...freshnessInstructions(catalog, { requiresZdr }),
                'Attribute Artificial Analysis benchmark/performance metrics to Artificial Analysis and OpenRouter catalog/endpoint data to OpenRouter.',
                'Do not treat ZDR as required unless zdr_required is true.',
              ],
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
        'Use this to diagnose source freshness, OpenRouter catalog coverage, model matching coverage, ZDR availability, or Artificial Analysis quota state.',
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
          freshness: catalog.freshness,
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