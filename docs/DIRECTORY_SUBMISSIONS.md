# ModelShortlist directory submission kit

This file is the reusable source of truth for submitting ModelShortlist to MCP directories and discovery services.

## Canonical identity

- Product: **ModelShortlist**
- Website: https://modelshortlist.com
- Install configurator: https://modelshortlist.com/install
- GitHub: https://github.com/AgenticArtists/ModelShortlist
- npm: `@agentic.artists/modelshortlist`
- Official MCP Registry name: `io.github.AgenticArtists/modelshortlist`
- License: MIT
- Transport: local stdio MCP
- Maintainer: AgenticArtists

## Distribution status

| Surface | Status | Notes |
| --- | --- | --- |
| Official MCP Registry | Published | `io.github.AgenticArtists/modelshortlist` v0.2.2 |
| npm | Published | `@agentic.artists/modelshortlist` v0.2.2 |
| Website | Live | `modelshortlist.com` + browser-only install configurator |
| Glama | Repo ready | Root `glama.json` added; GitHub-authenticated Add/Claim step remains |
| PulseMCP | Submitted for indexing | Official Registry is an upstream source; direct indexing request also sent |
| Smithery | Bundle ready | Validated MCPB is built in CI; Smithery authentication/publish remains |
| mcp.so | Submission prepared | Their submission is a GitHub issue; current GitHub integration cannot create issues in `chatmcp/mcpso` |
| MCP.Directory | Registry/form discovery pending | Public submission form can ingest the GitHub repo/npm metadata |

## One-line description

Workload-specific AI model shortlisting using current OpenRouter catalog data and Artificial Analysis benchmarks.

## Short description

ModelShortlist is a local BYOK MCP server that helps AI assistants choose models for a specific workload using current OpenRouter catalog, capability, context, pricing, and optional ZDR endpoint data plus Artificial Analysis benchmarks when confidently matched.

## Extended description

ModelShortlist puts current model-selection evidence inside an MCP-capable AI assistant. Instead of imposing one universal model ranking, it gives the host AI a current candidate set and the evidence needed to reason about the user's actual workload: model capabilities, tool calling, context limits, OpenRouter pricing, provider information, optional Zero Data Retention requirements, and independent Artificial Analysis benchmark/performance data when the model identity can be reconciled confidently.

The MCP runs locally and is bring-your-own-key. There is no ModelShortlist account, hosted backend, telemetry, or bundled upstream dataset. ZDR is not a default filter; it becomes a hard constraint only when the user explicitly requires it.

## Differentiator

**Current model evidence + workload-specific reasoning, not a static leaderboard or universal score.**

## Suggested categories

Use the closest categories a directory offers to:

- AI / LLM tooling
- Developer tools
- Model selection / model routing
- Productivity / agent infrastructure

Do not categorize ModelShortlist as a hosted inference provider or model gateway. It is a read-only local MCP context layer for model selection.

## Suggested tags

`model-selection`, `llm`, `openrouter`, `artificial-analysis`, `benchmarks`, `coding-agents`, `tool-calling`, `context-window`, `zdr`, `privacy`, `cost-optimization`, `mcp`, `byok`, `open-source`

## User-facing trust points

- Published in the Official MCP Registry
- Public npm package
- MIT licensed
- Local stdio process
- Bring your own OpenRouter and Artificial Analysis API keys
- No ModelShortlist account
- No hosted ModelShortlist backend
- No telemetry in the MCP
- Read-only MCP tools
- ZDR is optional unless explicitly required
- CI includes tests, syntax/package validation, Linux package smoke testing, Windows package smoke testing, website type-check/build validation, and MCPB validation/packaging

## MCP tools

### `recommend_models`

Primary workload-specific recommendation context. Supports hard constraints including tool calling, minimum context, pricing limits, creator/model filters, and optional ZDR.

### `compare_models`

Returns current evidence for a specified shortlist of OpenRouter model IDs, including ZDR availability and Artificial Analysis data when confidently matched.

### `modelshortlist_status`

Reports catalog/ZDR/matching coverage, ambiguous or unmatched records, cache state, and Artificial Analysis rate-limit metadata.

## Example prompts

- "What's the cheapest model I'd trust with repetitive coding subagents? Tool use is required."
- "I need 200k context and tool use. What are my best current options?"
- "I need 200k context, tool use, and ZDR. What are my best current options?"
- "Is the premium frontier model actually worth the price for this coding workload?"
- "Best model for extracting structured data from thousands of documents while keeping output cost low?"
- "I need maximum autonomous coding performance under $10 per million output tokens. What should I use?"

## Installation

Preferred user path: https://modelshortlist.com/install

The configurator generates client-specific config/commands for Hermes Desktop, Cursor, Claude Code, and VS Code/Copilot. It runs in the browser; entered API keys are used only to generate the text displayed to the user and are not sent to ModelShortlist.

Generic npm package:

```text
@agentic.artists/modelshortlist
```

Generic stdio command:

```text
npx -y @agentic.artists/modelshortlist
```

Required environment variables:

```text
ARTIFICIAL_ANALYSIS_API_KEY
OPENROUTER_API_KEY
```

Optional environment variable:

```text
MODEL_SELECTOR_CACHE_TTL_MS
```

## Data attribution

- OpenRouter: model catalog, capabilities, context, pricing, provider and ZDR endpoint metadata
- Artificial Analysis: benchmark and model-performance data when a confident model match exists

ModelShortlist is not affiliated with or endorsed by OpenRouter or Artificial Analysis. Users access upstream APIs with their own credentials and remain responsible for the applicable upstream terms.

## Glama

The repository root contains `glama.json` using Glama's server schema and the `AgenticArtists` GitHub maintainer. Because the repository is under a GitHub organization, this file is the ownership/claim mechanism Glama documents for organization-hosted MCP servers.

Remaining authenticated steps:

1. Choose **Add MCP Server** on Glama.
2. Supply `https://github.com/AgenticArtists/ModelShortlist`.
3. Use **ModelShortlist** as the display name.
4. Use the short description above.
5. After indexing, authenticate with GitHub and use the Claim ownership flow so Glama re-reads `glama.json`.
6. Review Glama's generated install instructions and tool scan against the canonical information in this file.

## PulseMCP

PulseMCP consumes the Official MCP Registry as one of its upstream sources. ModelShortlist is already published there. A direct indexing request has also been sent with the Registry name, version, GitHub URL, website, install URL, npm package, and short description.

No code changes are required for PulseMCP indexing.

## Smithery

Smithery's current local/stdio publishing path accepts a pre-built MCPB bundle rather than a URL unless the MCP is actually hosted over Streamable HTTP.

ModelShortlist now builds a validated MCPB in CI. See [`MCPB_DISTRIBUTION.md`](./MCPB_DISTRIBUTION.md).

After Smithery authentication:

```bash
npm install -g smithery@latest
smithery auth login
npm run mcpb:build
smithery mcp publish ./dist/modelshortlist-0.2.2.mcpb -n agenticartists/modelshortlist
```

Do **not** submit `https://modelshortlist.com` as a URL-based MCP server. It is the website/install surface, not a Streamable HTTP MCP endpoint.

## mcp.so

mcp.so accepts server submissions as GitHub issues in `chatmcp/mcpso`.

Suggested issue title:

```text
[Submit] ModelShortlist — workload-specific AI model selection MCP
```

Suggested submission body:

```markdown
## MCP Server Submission: ModelShortlist

Description: Local BYOK MCP for workload-specific AI model shortlisting using current OpenRouter catalog data and Artificial Analysis benchmarks.

Website: https://modelshortlist.com
Install: https://modelshortlist.com/install
Repository: https://github.com/AgenticArtists/ModelShortlist
npm: https://www.npmjs.com/package/@agentic.artists/modelshortlist
Official MCP Registry: `io.github.AgenticArtists/modelshortlist`
Transport: local stdio
Runtime: Node.js 20+
License: MIT

Tools:
- `recommend_models`
- `compare_models`
- `modelshortlist_status`

Generic install:
`npx -y @agentic.artists/modelshortlist`

Required local configuration:
- `ARTIFICIAL_ANALYSIS_API_KEY`
- `OPENROUTER_API_KEY`

ZDR is optional unless explicitly requested. No hosted ModelShortlist backend or telemetry is involved.
```

## MCP.Directory

MCP.Directory's public submission flow accepts the GitHub repository URL, optional npm package, and short description, then auto-detects repository metadata and tools.

Use:

- GitHub: `https://github.com/AgenticArtists/ModelShortlist`
- npm: `@agentic.artists/modelshortlist`
- Short description: `Workload-specific AI model shortlisting using current OpenRouter catalog data and Artificial Analysis benchmarks.`

It may also discover ModelShortlist from the Official MCP Registry without a manual submission.

## Submission rule

For any other directory, reuse the canonical identity, short description, extended description, tags, trust points, and install URL above. If a directory asks for a server command, use the generic npm stdio command. If it asks for environment variables, list the two required keys without example secrets.

Do not advertise ModelShortlist as a remote/hosted MCP endpoint unless a separate hosted product is actually launched.
