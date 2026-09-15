const body = `# ModelShortlist

> ModelShortlist is a local, open-source, bring-your-own-key MCP server for workload-specific AI model selection using current OpenRouter catalog data and Artificial Analysis benchmarks.

## Canonical links

- Website: https://modelshortlist.com
- Install: https://modelshortlist.com/install
- Guides: https://modelshortlist.com/guides
- GitHub: https://github.com/AgenticArtists/ModelShortlist
- npm: https://www.npmjs.com/package/@agentic.artists/modelshortlist
- Official MCP Registry: io.github.AgenticArtists/modelshortlist

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

## Guides

- Coding agents: https://modelshortlist.com/coding-agents
- ZDR model selection: https://modelshortlist.com/zdr-models
- Cost-efficient tool calling: https://modelshortlist.com/cheap-tool-calling-models
- Large-context models: https://modelshortlist.com/large-context-models

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
