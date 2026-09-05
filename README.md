# OpenAnalysis

Private, ZDR-aware AI model selection for chat agents.

> **Recommended use:** run OpenAnalysis locally as an MCP tool in Claude Code, Cursor, VS Code/Copilot, or another MCP host. **No deployment is required.** See [LOCAL_MCP.md](./LOCAL_MCP.md).

OpenAnalysis intersects **OpenRouter's current Zero Data Retention endpoints** with **Artificial Analysis Free** benchmark data. It does not hard-code a universal ranking formula. The service supplies current model facts; the chat model decides which tradeoffs matter for the workload you describe.

## What it does

OpenAnalysis combines:

- OpenRouter ZDR endpoint eligibility
- OpenRouter provider, context, tool support, price, latency, throughput, and uptime data
- Artificial Analysis Intelligence Index
- Artificial Analysis Coding Index
- Artificial Analysis Agentic Index
- Artificial Analysis pricing and median performance

The Free Artificial Analysis API does not include `openrouter_api_id`, so OpenAnalysis uses conservative reconciliation. It accepts manually verified aliases and exact normalized matches; it deliberately does **not** fuzzy-match uncertain model names.

Hard constraints are evaluated against a **single real ZDR provider endpoint**. A model does not qualify for `tools=true` plus `100k` context unless at least one actual ZDR endpoint satisfies both.

## Fastest path: chat with it locally

On Windows:

```powershell
git clone https://github.com/AgenticArtists/OpenAnalysis.git
cd OpenAnalysis
npm install
Copy-Item .env.local.example .env.local
notepad .env.local
```

Add your two keys:

```text
ARTIFICIAL_ANALYSIS_API_KEY=...
OPENROUTER_API_KEY=...
```

Then launch Claude Code from the repo:

```powershell
claude
```

The checked-in `.mcp.json` registers OpenAnalysis as a project MCP server. Approve it when Claude Code asks, then run `/mcp` to confirm that `openanalysis` is connected.

Now ask normally:

> I need a model for a long-running autonomous coding loop. ZDR is mandatory. It needs tool calling and at least 100k context. Quality matters more than cost, but I don't want frontier-premium pricing. What should I use?

The chat model can call OpenAnalysis automatically and answer from current Artificial Analysis + OpenRouter data.

Full setup and other MCP clients: [LOCAL_MCP.md](./LOCAL_MCP.md).

## MCP tools

### `recommend_models`

Primary tool for natural-language model selection. Accepts the use case plus hard constraints such as tool calling, minimum context, maximum price, creator, and model filters. The calling chat model receives current candidates and makes the final recommendation.

### `compare_models`

Returns current Artificial Analysis and OpenRouter ZDR data for a specific shortlist of OpenRouter model IDs.

### `openanalysis_status`

Returns match coverage, ambiguous/unmatched records, cache state, and Artificial Analysis rate-limit metadata.

## Data sources

- OpenRouter: `GET https://openrouter.ai/api/v1/endpoints/zdr`
- Artificial Analysis Free: `GET https://artificialanalysis.ai/api/v2/language/models/free`

Artificial Analysis requires attribution and describes Free API use as internal use. Keep this repository and its use private unless you obtain the rights needed for broader redistribution.

## Optional HTTP API

The original private HTTP endpoint remains available if you later want a remote client. It is not required for local MCP use.

Routes:

```text
/api/models
/api/health
```

A remote deployment should configure:

```text
ARTIFICIAL_ANALYSIS_API_KEY=<your AA key>
OPENROUTER_API_KEY=<your OpenRouter key>
MODEL_SELECTOR_ACCESS_TOKEN=<long random token>
MODEL_SELECTOR_CACHE_TTL_MS=43200000
```

`/api/models` requires the separate selector access token. Local MCP does not.

## Enforce ZDR during actual inference

Selection-time eligibility is not enough. When you actually call the chosen model through OpenRouter, enforce ZDR again:

```json
{
  "provider": {
    "zdr": true,
    "require_parameters": true
  }
}
```

`require_parameters` helps prevent routing to an endpoint that cannot support parameters used by your request, such as tools.

## Local validation

```powershell
npm test
npm run check
```

Test the MCP process itself:

```powershell
npm run mcp
```

A healthy server prints:

```text
OpenAnalysis MCP server running on stdio
```

and waits for an MCP client. Press `Ctrl+C` to stop it.

## Security

- `.env` and `.env.local` are gitignored.
- Upstream API keys stay on your machine for local MCP use.
- MCP tools are read-only.
- The server logs only to stderr because stdout is reserved for MCP protocol traffic.
- The optional HTTP endpoint uses a separate low-privilege access token.
