# OpenAnalysis

[![CI](https://github.com/AgenticArtists/OpenAnalysis/actions/workflows/ci.yml/badge.svg)](https://github.com/AgenticArtists/OpenAnalysis/actions/workflows/ci.yml)

**Stop guessing which AI model to use.**

OpenAnalysis is a local, bring-your-own-key MCP server that gives your AI assistant current model-selection context from **OpenRouter Zero Data Retention endpoints** and **Artificial Analysis benchmarks**.

No hosted service. No account. No deployment. Your API keys stay on your machine and are used only to call the upstream services directly.

## Why OpenAnalysis

Model choice is no longer just "which model has the highest benchmark score?" The right answer depends on the workload and the endpoint you can actually use.

OpenAnalysis helps your chat agent reason over:

- current OpenRouter ZDR endpoint availability
- tool/function-calling support
- context and completion limits
- endpoint-level input/output pricing
- latency, throughput, and uptime
- Artificial Analysis Intelligence Index
- Artificial Analysis Coding Index
- Artificial Analysis Agentic Index
- Artificial Analysis pricing and median performance

Hard constraints are checked against a **single real ZDR endpoint**. A model does not qualify for tool use plus 100k context unless at least one current ZDR endpoint satisfies both.

The chat model makes the final recommendation based on your use case. OpenAnalysis deliberately does not impose one universal ranking formula.

## Quick start

Requirements:

- Node.js 20+
- an Artificial Analysis API key
- an OpenRouter API key
- an MCP-capable chat client such as Hermes Desktop, Claude Code, Cursor, or VS Code/Copilot

### Windows

```powershell
git clone https://github.com/AgenticArtists/OpenAnalysis.git
cd OpenAnalysis
npm.cmd install
npm.cmd run setup
```

`npm.cmd run setup`:

- asks for your two API keys with masked input
- stores them only in the gitignored `.env.local`
- prints a ready-to-paste Hermes Desktop / Cursor MCP config using your actual local paths
- uses the exact Node executable that ran setup, avoiding GUI-client PATH issues
- also prints the VS Code / Copilot MCP format

If PowerShell blocks `npm.ps1`, use `npm.cmd` as shown above. You do not need to change your execution policy.

### macOS / Linux

```bash
git clone https://github.com/AgenticArtists/OpenAnalysis.git
cd OpenAnalysis
npm install
npm run setup
```

The same setup command generates absolute Node and server paths for the machine it runs on.

## Hermes Desktop

After running setup, copy the **Hermes Desktop / Cursor MCP config** it prints.

In Hermes Desktop, open **Skills & Tools → MCP**, import the JSON, and save it. Hermes should discover three tools:

- `recommend_models`
- `compare_models`
- `openanalysis_status`

Then start a normal chat and ask something like:

> I need a model for a long-running autonomous coding agent. ZDR is mandatory, tool calling is required, and I need at least 100k context. Quality matters more than cost, but I care about value. What should I use?

More client setup examples and manual configuration are in [LOCAL_MCP.md](./LOCAL_MCP.md).

## Example prompts

> What's the cheapest model I'd trust with repetitive coding subagents? ZDR and tool use are required.

> I need 200k context, tool use, and ZDR. What are my best current options?

> Is the premium frontier model actually worth the price for this coding workload?

> Best model for extracting structured data from thousands of documents while keeping output cost low?

> I need maximum autonomous coding performance under $10 per million output tokens. What should I use?

## MCP tools

### `recommend_models`

The primary tool. It accepts a workload plus hard constraints such as:

- tool calling required
- minimum context
- maximum input/output price
- creator/model filter

It returns current candidates that are both ZDR-eligible and confidently matched to Artificial Analysis data. The host model then makes the recommendation.

### `compare_models`

Returns current Artificial Analysis benchmark information and OpenRouter ZDR endpoint information for a specific shortlist of OpenRouter model IDs.

### `openanalysis_status`

Shows match coverage, ambiguous/unmatched records, cache state, and Artificial Analysis rate-limit metadata.

## How matching works

The Artificial Analysis Free API does not expose an OpenRouter model ID. OpenAnalysis therefore reconciles models conservatively:

1. manually verified aliases
2. exact normalized name matches
3. otherwise the model remains unmatched

OpenAnalysis does **not** fuzzy-match uncertain model variants. This is intentional: a missing candidate is better than attaching benchmark data to the wrong model.

Verified aliases live in [`config/aliases.json`](./config/aliases.json).

## ZDR is enforced at selection time, not inference time

OpenAnalysis identifies models with current ZDR-capable OpenRouter endpoints. If you later call a selected model through OpenRouter, enforce ZDR again in the actual inference request:

```json
{
  "provider": {
    "zdr": true,
    "require_parameters": true
  }
}
```

## Data sources and attribution

OpenAnalysis uses data accessed with **your own API credentials**.

- Benchmark and model-performance data: [Artificial Analysis](https://artificialanalysis.ai/)
- ZDR eligibility, providers, pricing, context, supported parameters, latency, throughput, and uptime: [OpenRouter](https://openrouter.ai/)

OpenAnalysis is not affiliated with or endorsed by Artificial Analysis or OpenRouter.

The OpenAnalysis source code is licensed under the MIT License. Upstream data and APIs remain subject to their respective terms. In particular, Artificial Analysis API access may have restrictions on external use and redistribution. OpenAnalysis does not bundle or host their dataset; each user accesses upstream data with their own credentials and is responsible for complying with the applicable terms.

See [ATTRIBUTION.md](./ATTRIBUTION.md) for more detail.

## Privacy and security

- `.env.local` is gitignored.
- API keys are loaded locally by the MCP process.
- The setup command masks API-key input.
- OpenAnalysis does not operate a hosted backend.
- MCP tools are read-only.
- The server writes protocol traffic to stdout and diagnostic messages to stderr.
- No telemetry is built into OpenAnalysis.

If you discover a security issue, see [SECURITY.md](./SECURITY.md).

## Manual setup

If you prefer not to use the setup script:

```powershell
Copy-Item .env.local.example .env.local
notepad .env.local
```

Add:

```text
ARTIFICIAL_ANALYSIS_API_KEY=your_key_here
OPENROUTER_API_KEY=your_key_here
```

Then use one of the MCP configurations in [LOCAL_MCP.md](./LOCAL_MCP.md).

## Development

Install dependencies and run validation:

```powershell
npm.cmd install
npm.cmd test
npm.cmd run check
```

Test the MCP process manually:

```powershell
npm.cmd run mcp
```

A healthy server prints:

```text
OpenAnalysis MCP server running on stdio
```

and waits for an MCP client. Press `Ctrl+C` to stop it.

Contributions are welcome. See [CONTRIBUTING.md](./CONTRIBUTING.md).

## License

MIT. See [LICENSE](./LICENSE).
