const body = `# ModelShortlist

> ModelShortlist is a local, open-source, bring-your-own-key MCP server that helps AI assistants answer: given this workload and what is true about the model market right now, which AI models are the best fit?

ModelShortlist combines independent Artificial Analysis benchmark/performance evidence with current OpenRouter operational facts such as model availability, pricing, context, supported parameters, providers, and optional ZDR endpoint information. The host AI reasons across that evidence for the user's actual workload. ModelShortlist does not create Artificial Analysis benchmarks, does not route inference, and does not impose one permanent universal model ranking.

Current release: 0.2.3

## Canonical links

- Website: https://modelshortlist.com
- Install: https://modelshortlist.com/install
- Guides: https://modelshortlist.com/guides
- GitHub: https://github.com/AgenticArtists/ModelShortlist
- npm: https://www.npmjs.com/package/@agentic.artists/modelshortlist
- Official MCP Registry: io.github.AgenticArtists/modelshortlist

## Evidence model

Artificial Analysis:
- independent benchmark and performance evidence
- intelligence, coding, agentic, pricing, and performance context exposed by the upstream API
- attached only when ModelShortlist can reconcile the exact model identity confidently
- unmatched models remain eligible rather than receiving guessed benchmark data

OpenRouter:
- current model catalog
- context and completion limits
- supported parameters and tool capability evidence
- input/output and tiered pricing
- provider information
- ZDR endpoint information when privacy is explicitly required

Freshness is part of the tool output. Sources can be fresh, stale, or unavailable; degraded evidence is surfaced rather than silently described as current.

## What it does

ModelShortlist exposes three read-only MCP tools:

- recommend_models: build a workload-specific shortlist using current model, capability, context, pricing, optional ZDR, and benchmark evidence
- compare_models: compare current evidence for a specified set of OpenRouter model IDs
- modelshortlist_status: report catalog, ZDR, matching, cache, and upstream coverage

The full OpenRouter catalog is considered by default. ZDR is only a hard constraint when explicitly requested. Models without a confident Artificial Analysis match remain eligible without fabricated benchmark data.

## Architecture and privacy

- Local stdio MCP
- Node.js 20+
- MIT licensed
- Bring your own Artificial Analysis and OpenRouter API keys
- No ModelShortlist account
- No hosted ModelShortlist backend
- No telemetry in the MCP
- Read-only MCP tools

## Start-here guides

- How to choose an AI model: https://modelshortlist.com/how-to-choose-an-ai-model
- Why ModelShortlist: https://modelshortlist.com/why-modelshortlist
- How recommendations stay current: https://modelshortlist.com/how-model-recommendations-stay-current
- Artificial Analysis in ModelShortlist: https://modelshortlist.com/artificial-analysis
- OpenRouter model comparison: https://modelshortlist.com/openrouter-model-comparison
- ModelShortlist vs static leaderboards: https://modelshortlist.com/modelshortlist-vs-static-leaderboards
- ModelShortlist vs model routers: https://modelshortlist.com/modelshortlist-vs-model-routers

## Workload guides

- Coding agents: https://modelshortlist.com/coding-agents
- Document extraction: https://modelshortlist.com/document-extraction-models
- Structured output: https://modelshortlist.com/structured-output-models
- Cost-efficient tool calling: https://modelshortlist.com/cheap-tool-calling-models
- Models under $10 per million output tokens: https://modelshortlist.com/models-under-10-per-million-output
- Large-context models: https://modelshortlist.com/large-context-models
- ZDR model selection: https://modelshortlist.com/zdr-models

## Installation

Preferred path: https://modelshortlist.com/install

Generic stdio command:

npx -y @agentic.artists/modelshortlist

Required environment variables:

ARTIFICIAL_ANALYSIS_API_KEY
OPENROUTER_API_KEY
`

export function GET() {
  return new Response(body, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=86400',
    },
  })
}
