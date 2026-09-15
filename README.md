# ModelShortlist

[![CI](https://github.com/AgenticArtists/ModelShortlist/actions/workflows/ci.yml/badge.svg)](https://github.com/AgenticArtists/ModelShortlist/actions/workflows/ci.yml)
[![npm](https://img.shields.io/npm/v/@agentic.artists/modelshortlist.svg)](https://www.npmjs.com/package/@agentic.artists/modelshortlist)
[![MIT License](https://img.shields.io/badge/license-MIT-blue.svg)](./LICENSE)
[![Official MCP Registry](https://img.shields.io/badge/Official%20MCP%20Registry-published-5b5bd6.svg)](https://registry.modelcontextprotocol.io/?q=io.github.AgenticArtists%2Fmodelshortlist)

**Stop guessing which AI model to use.**

ModelShortlist is a local, bring-your-own-key MCP server that gives your AI assistant model-selection evidence from the **full OpenRouter model catalog** plus **Artificial Analysis benchmarks**. It refreshes upstream evidence on demand/cache expiry and explicitly reports when any source is stale or unavailable. Zero Data Retention (ZDR) is an optional hard constraint only when you explicitly require it.

No hosted ModelShortlist backend. No account. No telemetry in the MCP. Your API keys stay with the local MCP process and are used to call the upstream services directly.

- Website: [modelshortlist.com](https://modelshortlist.com)
- Fast install configurator: [modelshortlist.com/install](https://modelshortlist.com/install)
- Model-selection guides: [modelshortlist.com/guides](https://modelshortlist.com/guides)
- npm: [`@agentic.artists/modelshortlist`](https://www.npmjs.com/package/@agentic.artists/modelshortlist)
- Official MCP Registry: `io.github.AgenticArtists/modelshortlist`
- License: MIT

## Why ModelShortlist

Model choice is no longer just "which model has the highest benchmark score?" The right answer depends on the workload, capabilities, cost, context, availability, and privacy requirements you actually have.

ModelShortlist helps your chat agent reason over:

- the OpenRouter model catalog
- tool/function-calling support
- context and completion limits
- OpenRouter input/output pricing, including tiered pricing when OpenRouter publishes it
- ZDR endpoint availability when privacy requires it
- ZDR endpoint latency, throughput, uptime, and provider options when applicable
- Artificial Analysis Intelligence Index
- Artificial Analysis Coding Index
- Artificial Analysis Agentic Index
- Artificial Analysis pricing and median performance
- explicit source freshness and degraded-state warnings

By default, **ZDR is not an eligibility requirement**. ModelShortlist considers the full OpenRouter catalog. If you explicitly require ZDR, it switches to OpenRouter ZDR endpoint evidence and requires hard constraints to be satisfied by the same real endpoint.

The host AI makes the final recommendation based on your use case. ModelShortlist deliberately does **not** impose one universal ranking formula.

## Fastest install

Use the browser-only configurator:

**[Install ModelShortlist →](https://modelshortlist.com/install)**

It generates client-specific config or commands for:

- Claude Desktop
- Hermes Desktop
- Cursor
- Claude Code
- VS Code / Copilot

You paste your own Artificial Analysis and OpenRouter keys into the configurator. They are used in your browser to generate configuration text and are not sent to ModelShortlist or a ModelShortlist backend.

Requirements:

- Node.js 20+
- an Artificial Analysis API key
- an OpenRouter API key
- an MCP-capable client

## Generic npm config

Most local stdio MCP clients, including Claude Desktop, Hermes Desktop, and Cursor, can launch ModelShortlist directly with `npx`:

```json
{
  "mcpServers": {
    "modelshortlist": {
      "command": "npx",
      "args": ["-y", "@agentic.artists/modelshortlist"],
      "env": {
        "ARTIFICIAL_ANALYSIS_API_KEY": "YOUR_KEY",
        "OPENROUTER_API_KEY": "YOUR_KEY"
      }
    }
  }
}
```

On Windows GUI clients where `npx` is not available on the app's PATH, use `npx.cmd` or use the guided clone setup below.

## Guided local setup

This option stores API keys in a local gitignored `.env.local` file and prints ready-to-paste MCP config using absolute executable paths.

### Windows

```powershell
git clone https://github.com/AgenticArtists/ModelShortlist.git
cd ModelShortlist
npm.cmd install
npm.cmd run setup
```

### macOS / Linux

```bash
git clone https://github.com/AgenticArtists/ModelShortlist.git
cd ModelShortlist
npm install
npm run setup
```

The setup command:

- asks for both API keys with masked input
- stores them only in the gitignored `.env.local`
- prints ready-to-paste Claude Desktop / Hermes Desktop / Cursor and VS Code / Copilot MCP configs
- uses the exact Node executable that ran setup, avoiding many GUI-client PATH problems

If PowerShell blocks `npm.ps1`, use `npm.cmd`; you do not need to change your execution policy.

More setup details are in [LOCAL_MCP.md](./LOCAL_MCP.md).

## Example prompts

> What's the cheapest model I'd trust with repetitive coding subagents? Tool use is required.

> I need 200k context and tool use. What are my best current options?

> I need 200k context, tool use, and ZDR. What are my best current options?

> Is the premium frontier model actually worth the price for this coding workload?

> Best model for extracting structured data from thousands of documents while keeping output cost low?

> I need maximum autonomous coding performance under $10 per million output tokens. What should I use?

## MCP tools

### `recommend_models`

The primary workload-specific recommendation tool. It accepts hard constraints such as:

- ZDR required or not required
- tool calling required
- minimum context
- maximum input/output price
- creator/model filter

When ZDR is not required, it considers the full OpenRouter catalog. When ZDR is explicitly required, it filters against ZDR endpoint evidence and verifies hard constraints against the same endpoint.

Artificial Analysis benchmark data is attached only when the model can be confidently reconciled. Models without a confident benchmark match remain eligible with missing benchmark fields rather than being silently removed.

Strict price ceilings account conservatively for all pricing tiers that OpenRouter publishes for a model or endpoint rather than assuming the cheapest/base tier applies universally.

### `compare_models`

Returns OpenRouter catalog information, ZDR availability, Artificial Analysis benchmark information when available, and source freshness for a specified shortlist of OpenRouter model IDs.

### `modelshortlist_status`

Shows source freshness, OpenRouter catalog coverage, ZDR coverage, model matching coverage, ambiguous/unmatched records, cache state, and Artificial Analysis rate-limit metadata.

## Freshness and degraded operation

ModelShortlist does not silently call stale evidence “current.” Tool responses expose source-level status:

- `fresh`: the latest attempted refresh succeeded.
- `stale`: the latest refresh failed and an earlier in-process copy is being used with a warning.
- `unavailable`: the source failed and there is no cached copy in the current process.

Artificial Analysis can fail independently without removing OpenRouter models; benchmark fields remain missing rather than being treated as zero or poor performance. OpenRouter ZDR metadata can also be unavailable for ordinary requests because ZDR is optional.

The OpenRouter model catalog is foundational. If it is unavailable with no cached copy, or returns an empty catalog and no earlier good copy exists, ModelShortlist refuses to produce a shortlist.

For a ZDR-required request, unavailable ZDR endpoint evidence fails closed rather than being interpreted as “no models qualify.” If cached ZDR evidence is stale, that limitation is surfaced and ZDR must still be enforced/revalidated on the actual OpenRouter inference request.

See [docs/TROUBLESHOOTING.md](./docs/TROUBLESHOOTING.md) for failure modes and client diagnostics.

## How matching works

The Artificial Analysis Free API does not expose an OpenRouter model ID. ModelShortlist reconciles models conservatively:

1. manually verified aliases
2. exact normalized name/slug matches
3. ambiguous or unmatched records remain without Artificial Analysis metrics

ModelShortlist does **not** fuzzy-match uncertain model variants. A missing benchmark is better than attaching benchmark data to the wrong model. An unmatched OpenRouter model can still be considered; it simply carries no Artificial Analysis metrics.

Regression coverage explicitly protects mini/base, pro/small/thinking, preview/stable, dated-release, duplicate-name, and broken-alias cases.

Verified aliases live in [`config/aliases.json`](./config/aliases.json).

## ZDR is optional

ModelShortlist tracks which models have ZDR-capable OpenRouter endpoints, but it does **not** filter to them unless the user explicitly requires Zero Data Retention.

When ZDR is required, ModelShortlist checks endpoint-level eligibility and hard constraints. If you later call the selected model through OpenRouter, enforce ZDR again in the actual inference request:

```json
{
  "provider": {
    "zdr": true,
    "require_parameters": true
  }
}
```

When ZDR is not required, do not add `provider.zdr=true` merely because a model happens to support it.

## Data flow

```text
Your MCP client
      |
      | local stdio
      v
ModelShortlist MCP
   |          |
   |          +--> OpenRouter model + endpoint metadata
   |
   +-------------> Artificial Analysis benchmark/performance evidence
      |
      v
structured evidence + freshness metadata
      |
      v
Your host AI reasons about the workload and recommends a fit
```

ModelShortlist recommends; it does not route inference or host models.

## Data sources and attribution

ModelShortlist uses data accessed with **your own API credentials**.

- Model catalog, capabilities, pricing, context, and ZDR endpoint metadata: [OpenRouter](https://openrouter.ai/)
- Benchmark and model-performance data: [Artificial Analysis](https://artificialanalysis.ai/)

ModelShortlist is not affiliated with or endorsed by Artificial Analysis or OpenRouter.

The ModelShortlist source code is licensed under the MIT License. Upstream data and APIs remain subject to their respective terms. ModelShortlist does not bundle or host the Artificial Analysis dataset; each user accesses upstream data with their own credentials and is responsible for complying with applicable terms.

See [ATTRIBUTION.md](./ATTRIBUTION.md) for more detail.

## Privacy and security

- `.env.local` is gitignored for clone-based setup.
- API keys are loaded locally by the MCP process.
- the setup command masks API-key input.
- the browser install configurator does not send entered keys to a ModelShortlist backend.
- ModelShortlist does not operate a hosted backend.
- MCP tools are read-only.
- no telemetry is built into the MCP.
- CI audits production MCP and website dependencies for high-severity vulnerabilities.
- CI verifies that the npm tarball does not include `.env.local`, website source, tests, or GitHub workflow files.

If you discover a security issue, see [SECURITY.md](./SECURITY.md).

## MCPB and releases

ModelShortlist builds a validated `.mcpb` bundle for local-server distribution channels. CI validates and packs the bundle. Tagged releases are configured to validate the package, run security checks, publish an unpublished npm version through npm trusted publishing, and attach the validated MCPB bundle to a GitHub Release.

See [docs/MCPB_DISTRIBUTION.md](./docs/MCPB_DISTRIBUTION.md) and [docs/DISTRIBUTION.md](./docs/DISTRIBUTION.md).

## Discovery and directory maintainers

ModelShortlist is published to the Official MCP Registry. Reusable directory metadata and canonical listing copy live in [docs/DIRECTORY_SUBMISSIONS.md](./docs/DIRECTORY_SUBMISSIONS.md).

The repository also includes [`glama.json`](./glama.json) for Glama ownership verification of this organization-hosted repository.

## Development

Install dependencies and run validation:

```powershell
npm.cmd install
npm.cmd test
npm.cmd run check
npm.cmd run pack:check
```

Test the MCP process manually:

```powershell
npm.cmd run mcp
```

A healthy server prints:

```text
ModelShortlist MCP server running on stdio
```

and waits for an MCP client. Press `Ctrl+C` to stop it.

Contributions are welcome. See [CONTRIBUTING.md](./CONTRIBUTING.md).

## License

MIT. See [LICENSE](./LICENSE).
