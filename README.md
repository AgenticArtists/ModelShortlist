# ModelShortlist

[![CI](https://github.com/AgenticArtists/ModelShortlist/actions/workflows/ci.yml/badge.svg)](https://github.com/AgenticArtists/ModelShortlist/actions/workflows/ci.yml)

**Stop guessing which AI model to use.**

ModelShortlist is a local, bring-your-own-key MCP server that gives your AI assistant current model-selection context from the **full OpenRouter model catalog** plus **Artificial Analysis benchmarks**. Zero Data Retention (ZDR) is available as an optional hard constraint when you explicitly require it.

No hosted service. No account. No deployment. Your API keys are supplied locally and used only to call the upstream services directly.

Website: [modelshortlist.com](https://modelshortlist.com)

## Why ModelShortlist

Model choice is no longer just "which model has the highest benchmark score?" The right answer depends on the workload, capabilities, cost, context, and any privacy requirements you actually have.

ModelShortlist helps your chat agent reason over:

- the current OpenRouter model catalog
- tool/function-calling support
- context and completion limits
- OpenRouter input/output pricing
- current ZDR endpoint availability when privacy requires it
- ZDR endpoint latency, throughput, uptime, and provider options when applicable
- Artificial Analysis Intelligence Index
- Artificial Analysis Coding Index
- Artificial Analysis Agentic Index
- Artificial Analysis pricing and median performance

By default, **ZDR is not an eligibility requirement**. ModelShortlist considers the full OpenRouter catalog. If you explicitly require ZDR, the tool switches to current OpenRouter ZDR endpoint data and requires all hard constraints to be satisfied by the same real ZDR endpoint.

The chat model makes the final recommendation based on your use case. ModelShortlist deliberately does not impose one universal ranking formula.

## Quick start

Requirements:

- Node.js 20+
- an Artificial Analysis API key
- an OpenRouter API key
- an MCP-capable chat client such as Hermes Desktop, Claude Code, Cursor, or VS Code/Copilot

The npm package is:

```text
@agentic.artists/modelshortlist
```

### Fastest install: run from npm

Most stdio MCP hosts can launch ModelShortlist directly with `npx`.

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

On Windows GUI clients where `npx` is not available on the app's PATH, use the full path to `npx.cmd` or use the local-clone setup below.

### Local clone + gitignored `.env.local`

This option keeps the API keys in a local gitignored file and generates client config with absolute Node/server paths.

#### Windows

```powershell
git clone https://github.com/AgenticArtists/ModelShortlist.git
cd ModelShortlist
npm.cmd install
npm.cmd run setup
```

#### macOS / Linux

```bash
git clone https://github.com/AgenticArtists/ModelShortlist.git
cd ModelShortlist
npm install
npm run setup
```

The setup command:

- asks for your two API keys with masked input
- stores them only in the gitignored `.env.local`
- prints ready-to-paste Hermes Desktop / Cursor and VS Code / Copilot MCP configs
- uses the exact Node executable that ran setup, avoiding GUI-client PATH issues

If PowerShell blocks `npm.ps1`, use `npm.cmd`; you do not need to change your execution policy.

## Hermes Desktop

Either use the npm config above or run the local setup command and paste the generated **Hermes Desktop / Cursor MCP config**.

In Hermes Desktop, open **Skills & Tools → MCP**, import the JSON, and save it. Hermes should discover three tools:

- `recommend_models`
- `compare_models`
- `modelshortlist_status`

Then start a normal chat and ask something like:

> I need the best-value model for a long-running autonomous coding agent. Tool calling is required and I need at least 100k context. Quality matters more than cost, but I care about value. What should I use?

If privacy matters, say so explicitly:

> Same workload, but ZDR is mandatory.

More client setup examples and manual configuration are in [LOCAL_MCP.md](./LOCAL_MCP.md).

## Example prompts

> What's the cheapest model I'd trust with repetitive coding subagents? Tool use is required.

> I need 200k context and tool use. What are my best current options?

> I need 200k context, tool use, and ZDR. What are my best current options?

> Is the premium frontier model actually worth the price for this coding workload?

> Best model for extracting structured data from thousands of documents while keeping output cost low?

> I need maximum autonomous coding performance under $10 per million output tokens. What should I use?

## MCP tools

### `recommend_models`

The primary tool. It accepts a workload plus hard constraints such as:

- ZDR required or not required
- tool calling required
- minimum context
- maximum input/output price
- creator/model filter

When ZDR is not required, it considers the full OpenRouter catalog. When ZDR is explicitly required, it filters against current ZDR endpoints and verifies hard constraints against the same endpoint. Artificial Analysis benchmark data is attached only when the model can be confidently reconciled; models without a confident benchmark match remain eligible with missing benchmark fields rather than being silently removed.

### `compare_models`

Returns current OpenRouter catalog information, ZDR availability, and Artificial Analysis benchmark information when available for a specific shortlist of OpenRouter model IDs. ZDR is not assumed to be required.

### `modelshortlist_status`

Shows OpenRouter catalog coverage, ZDR coverage, model matching coverage, ambiguous/unmatched records, cache state, and Artificial Analysis rate-limit metadata.

## How matching works

The Artificial Analysis Free API does not expose an OpenRouter model ID. ModelShortlist therefore reconciles models conservatively:

1. manually verified aliases
2. exact normalized name matches
3. otherwise the Artificial Analysis benchmark match remains unavailable

ModelShortlist does **not** fuzzy-match uncertain model variants. A missing benchmark is better than attaching benchmark data to the wrong model. An unmatched OpenRouter model can still be considered; it simply carries no Artificial Analysis metrics.

Verified aliases live in [`config/aliases.json`](./config/aliases.json).

## ZDR is optional

ModelShortlist tracks which models have current ZDR-capable OpenRouter endpoints, but it does **not** filter to them unless the user explicitly requires Zero Data Retention.

When ZDR is required, ModelShortlist checks current endpoint-level eligibility and hard constraints. If you later call the selected model through OpenRouter, enforce ZDR again in the actual inference request:

```json
{
  "provider": {
    "zdr": true,
    "require_parameters": true
  }
}
```

When ZDR is not required, do not add `provider.zdr=true` merely because a model happens to support it.

## Data sources and attribution

ModelShortlist uses data accessed with **your own API credentials**.

- Model catalog, capabilities, pricing, context, and ZDR endpoint metadata: [OpenRouter](https://openrouter.ai/)
- Benchmark and model-performance data: [Artificial Analysis](https://artificialanalysis.ai/)

ModelShortlist is not affiliated with or endorsed by Artificial Analysis or OpenRouter.

The ModelShortlist source code is licensed under the MIT License. Upstream data and APIs remain subject to their respective terms. In particular, Artificial Analysis API access may have restrictions on external use and redistribution. ModelShortlist does not bundle or host their dataset; each user accesses upstream data with their own credentials and is responsible for complying with the applicable terms.

See [ATTRIBUTION.md](./ATTRIBUTION.md) for more detail.

## Privacy and security

- `.env.local` is gitignored for the clone-based setup.
- API keys are loaded locally by the MCP process.
- The setup command masks API-key input.
- ModelShortlist does not operate a hosted backend.
- MCP tools are read-only.
- The server writes protocol traffic to stdout and diagnostic messages to stderr.
- No telemetry is built into ModelShortlist.

If you discover a security issue, see [SECURITY.md](./SECURITY.md).

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
