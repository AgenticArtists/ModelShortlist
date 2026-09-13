# Launch plan

ModelShortlist is public-source software being prepared for npm and Official MCP Registry distribution. The goal of launch is adoption, not monetization.

## Positioning

**One-liner**

ModelShortlist is a local BYOK MCP server that helps your AI assistant choose the right model for a workload using the live OpenRouter model catalog plus Artificial Analysis benchmarks, with optional ZDR filtering when privacy requires it.

**Short description**

Stop guessing which model to use. ModelShortlist lets an MCP-capable assistant reason over current model availability, tool support, context, price, benchmark data, and optional Zero Data Retention requirements for the specific workload you describe.

**Core differentiators**

- workload-specific recommendations instead of a static leaderboard
- full OpenRouter catalog by default instead of a ZDR-only subset
- optional ZDR hard filtering when the user explicitly requires it
- current ZDR endpoint-level validation when ZDR is required
- local/BYOK architecture with no hosted ModelShortlist backend
- conservative Artificial Analysis reconciliation instead of fuzzy benchmark matching
- unmatched OpenRouter models remain eligible without invented benchmark data
- works as a read-only MCP tool inside existing chat/agent clients

## Launch order

### 1. GitHub

Repository metadata should use:

**Repository**

`https://github.com/AgenticArtists/ModelShortlist`

**Website**

`https://modelshortlist.com`

**Description**

> Local MCP for workload-specific AI model recommendations using OpenRouter + Artificial Analysis.

**Topics**

`mcp`, `model-context-protocol`, `openrouter`, `artificial-analysis`, `llm`, `model-selection`, `zdr`, `ai-tools`

Before actively promoting, add one screenshot or short GIF showing a normal chat question and the resulting recommendation.

### 2. npm

Publish the final package as:

`@agentic.artists/modelshortlist`

The executable is:

`modelshortlist`

After verifying the new package, deprecate the historical `@agentic.artists/openanalysis` package with a migration message pointing to ModelShortlist.

### 3. Official MCP Registry

This is the highest-priority structured listing once the ModelShortlist npm package exists. The Registry is the vendor-neutral source of truth and downstream directories can ingest it.

Stable Registry identity:

`io.github.AgenticArtists/modelshortlist`

Validate and publish `server.json` using `mcp-publisher` after the npm package is live.

References:

- https://modelcontextprotocol.io/registry/quickstart
- https://registry.modelcontextprotocol.io/

### 4. Glama

Glama accepts open-source MCP servers directly from a GitHub repository. Submission requires the repository URL, display name, and short description; Glama then runs automated quality/security/health checks.

Use:

- Repository: `https://github.com/AgenticArtists/ModelShortlist`
- Display name: `ModelShortlist`
- Short description: the short description above

Reference: https://glama.ai/mcp/faq

### 5. Smithery

Submit after the npm package/standard install command exists so the listing has a clean installation path. Do not convert ModelShortlist into a hosted service merely for directory compatibility; preserve local/BYOK stdio behavior.

Reference: https://smithery.ai/

### 6. PulseMCP and downstream directories

Prioritize the Official MCP Registry first because ecosystem directories increasingly ingest official Registry metadata. Check for propagation before creating duplicate submissions.

### 7. Awesome lists / community directories

After the package/Registry listing is stable, submit to established MCP awesome lists and community directories. These are secondary to the Official Registry, Glama, and Smithery.

## Community launch copy

### Hacker News / technical communities

**Title**

> Show HN: ModelShortlist – an MCP that helps your AI choose which model to use

**Body**

> I built ModelShortlist because choosing an LLM has become a workload-specific decision rather than a leaderboard question. It runs locally as an MCP server and combines the current OpenRouter model catalog (tools, context, price, capabilities) with Artificial Analysis benchmark data. You describe the job and your host model uses the current evidence to recommend a model. If you explicitly require Zero Data Retention, it filters against current OpenRouter ZDR endpoints and verifies the hard constraints there. It is local, BYOK, read-only, MIT licensed, and has no hosted backend. Feedback on the recommendation surface and matching approach would be useful.

### Reddit / MCP communities

**Title**

> I built a free MCP that answers “which AI model should I use for this job?”

**Body**

> ModelShortlist is a local BYOK MCP server that combines the current OpenRouter model catalog with Artificial Analysis benchmarks. Instead of showing another leaderboard, it lets your existing AI assistant evaluate the actual workload and hard constraints: tool calling, context, price, coding/agentic benchmarks, etc. ZDR is optional: if you explicitly require it, ModelShortlist checks the current ZDR endpoint set rather than restricting everyone by default. It is MIT licensed and there is no hosted backend. I am looking for early users who regularly switch between models and can tell me where the recommendation logic falls short.

## What not to build before feedback

Do not add these merely to make launch feel larger:

- hosted accounts
- billing
- a web dashboard
- telemetry
- automatic model routing
- a proprietary universal ranking score
- dozens of client-specific integrations

The first validation question is simpler: **do people who regularly use multiple models keep ModelShortlist installed and ask it which model to use?**

## Early feedback to capture

When users open issues, prioritize patterns around:

1. important models missing benchmark matches or useful metadata
2. constraints users repeatedly want but the tool cannot express
3. recommendation data that users find misleading or irrelevant
4. MCP clients where installation is unnecessarily difficult
5. repeated requests for routing/automation rather than recommendation only
