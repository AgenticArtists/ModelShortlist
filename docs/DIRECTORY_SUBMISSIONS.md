# ModelShortlist directory submission kit

This file is the canonical source of truth for ModelShortlist directory and discovery submissions.

Last verified: **2026-09-16**.

## Canonical identity

- Product: **ModelShortlist**
- Website: https://modelshortlist.com
- Install configurator: https://modelshortlist.com/install
- GitHub: https://github.com/AgenticArtists/ModelShortlist
- npm: `@agentic.artists/modelshortlist`
- Official MCP Registry: `io.github.AgenticArtists/modelshortlist`
- Current public version: **0.2.4**
- License: MIT
- Transport: local stdio MCP
- Maintainer: AgenticArtists
- Contact: `agenticartists@gmail.com`

## Distribution status

| Surface | Status | Verified notes |
| --- | --- | --- |
| Official MCP Registry | **Published** | `io.github.AgenticArtists/modelshortlist` v0.2.4 is active/latest |
| npm | **Published** | `@agentic.artists/modelshortlist` v0.2.4; trusted-publisher provenance enabled |
| GitHub Release | **Published** | `v0.2.4` includes the validated MCPB bundle |
| Website | **Live** | `modelshortlist.com` and browser-only install configurator |
| MCP.Directory | **Submitted / discoverable upstream** | Public intake accepted the repo; service also consumes the Official Registry |
| AllMCPs | **Pending** | Existing `ModelShortlist` entry confirmed pending; duplicate submission correctly rejected |
| AgentNDX | **Submitted** | Accepted on 2026-09-15; submission id `9` |
| FindMCP | **Submitted** | Accepted on 2026-09-15; submission id `78`, slug `modelshortlist` |
| PulseMCP | **Outreach sent** | Official Registry is an upstream source; direct indexing request also sent |
| LaunchMCP | **Outreach sent** | Listing request sent; no reply at last verification |
| MCP Server Finder | **Outreach sent** | Listing request sent; no reply at last verification |
| TrackMCP | **Outreach sent** | Listing request sent; no reply at last verification |
| MCP Surge | **Outreach sent** | Listing request sent; no reply at last verification |
| Glama | **Existing listing / claim required** | New submission was rejected as a duplicate because an MCP server already exists for this repository; locate and claim the existing listing rather than resubmitting |
| Smithery | **Published** | Published under the `agenticartists` namespace using the validated v0.2.4 MCPB bundle |
| MCP.Pub | **Submitted / editorial review** | Browser submission completed; repository queued for editorial review |
| mcp.so | **Skipped** | Current practical submission route is account/paid gated; no spend recommended |
| mcp-get | **Skipped** | Original registry is archived/deprecated |
| MCPHunt | **Skipped** | Not a useful ModelShortlist discovery directory for this purpose |
| mcpub.dev | **Skipped** | Designed around a reachable remote MCP endpoint; ModelShortlist is local stdio |

## Directory-safe positioning

### One-line description

Workload-specific AI model selection using current OpenRouter facts and independent Artificial Analysis benchmark evidence.

### Short description

ModelShortlist is a local BYOK MCP server that helps AI assistants choose models for a specific workload using current OpenRouter catalog, capability, context, pricing, provider and optional ZDR endpoint facts plus Artificial Analysis benchmark/performance evidence when confidently matched.

### Differentiator

**Current model evidence + workload-specific reasoning, not a static leaderboard or universal score.**

ModelShortlist retrieves and reconciles evidence; the host AI reasons about the user's actual workload and constraints.

## Suggested categories

Use the closest available categories to:

- AI / LLM tooling
- Developer tools
- Model selection
- Agent infrastructure

Do not categorize ModelShortlist as a hosted inference provider or model gateway. It is a read-only local MCP context layer for model selection.

## Suggested tags

`model-selection`, `llm`, `openrouter`, `artificial-analysis`, `benchmarks`, `coding-agents`, `tool-calling`, `context-window`, `zdr`, `privacy`, `cost-optimization`, `mcp`, `byok`, `open-source`

## Trust points

- Official MCP Registry publication
- Public npm package with trusted-publisher provenance
- Validated MCPB release asset
- MIT licensed
- Local stdio process
- Bring-your-own upstream credentials
- No ModelShortlist account
- No hosted ModelShortlist inference backend
- No MCP-runtime telemetry
- Read-only MCP tools
- ZDR is optional unless explicitly required
- CI validates tests, syntax, prospective and public packages, Linux/Windows executable smoke tests, website audit/type-check/build, and MCPB packaging

## MCP tools

### `recommend_models`

Returns workload-specific recommendation context with hard constraints including tool calling, minimum context, price ceilings, creator/model filters and optional ZDR.

### `compare_models`

Returns current evidence for a specified shortlist of OpenRouter model IDs, including ZDR availability and Artificial Analysis evidence when confidently matched.

### `modelshortlist_status`

Reports source freshness, matching coverage, ambiguous/unmatched records and cache/upstream status.

## Example prompts

- "What's the cheapest model I'd trust with repetitive coding subagents? Tool use is required."
- "I need 200k context and tool use. What are my best current options?"
- "I need 200k context and tool use, and ZDR is mandatory. What are my best current options?"
- "Is the premium frontier model actually worth the price for this coding workload?"
- "Best model for extracting structured data from thousands of documents while keeping output cost low?"
- "I need maximum autonomous coding performance under $10 per million output tokens. What should I use?"

## Installation

Preferred user path: https://modelshortlist.com/install

Generic npm package:

```text
@agentic.artists/modelshortlist
```

Generic stdio command:

```text
npx -y @agentic.artists/modelshortlist
```

The website configurator generates client-specific instructions for Claude Desktop, Hermes Desktop, Cursor, Claude Code and VS Code/Copilot. User-entered upstream credentials are used only in the browser to generate the displayed configuration and are not sent to ModelShortlist.

## Data attribution

- **OpenRouter:** model catalog, capabilities, context, pricing, provider and optional ZDR endpoint metadata
- **Artificial Analysis:** independent benchmark and model-performance evidence when a confident model identity match exists

ModelShortlist is not affiliated with or endorsed by OpenRouter or Artificial Analysis.

## Directory follow-up notes

### Glama

Glama rejected a new submission because an MCP server already exists for this repository. Do not submit another duplicate. Search Glama for the existing ModelShortlist/AgenticArtists entry, authenticate with the GitHub account that controls `AgenticArtists`, and use the ownership-claim flow for that existing listing. The repository already includes `glama.json` for verification.

### Smithery

Published under the `agenticartists` namespace using the validated `modelshortlist-0.2.4.mcpb` release artifact. ModelShortlist remains a local stdio MCP; do not submit `https://modelshortlist.com` as though it were a remote Streamable HTTP MCP endpoint. See [`MCPB_DISTRIBUTION.md`](./MCPB_DISTRIBUTION.md) for packaging details.

### MCP.Pub

Browser submission is complete. The repository is queued for editorial review. No duplicate submission is needed while that review is pending.

Submission identity used:

- Name: `ModelShortlist`
- Repository: `https://github.com/AgenticArtists/ModelShortlist`
- Website: `https://modelshortlist.com`
- Install: `https://modelshortlist.com/install`
- npm: `@agentic.artists/modelshortlist`
- Official Registry: `io.github.AgenticArtists/modelshortlist`
- Transport: local stdio
- License: MIT
- Contact: `agenticartists@gmail.com`

## Submission rule

For any new directory, reuse the canonical identity, description, tags, trust points and install URL above. If the directory asks for a command, use the generic npm stdio command. If it asks for credentials/configuration requirements, list the required upstream services without including example secrets.

Do not advertise ModelShortlist as a remote/hosted MCP endpoint unless a separate hosted product is actually launched.
