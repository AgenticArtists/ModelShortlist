# Launch plan

OpenAnalysis is public and usable today from GitHub. The goal of launch is adoption, not monetization.

## Positioning

**One-liner**

OpenAnalysis is a local BYOK MCP server that helps your AI assistant choose the right model for a workload using live OpenRouter ZDR endpoint data plus Artificial Analysis benchmarks.

**Short description**

Stop guessing which model to use. OpenAnalysis lets an MCP-capable assistant reason over current ZDR availability, tool support, context, price, latency, throughput, uptime, and Artificial Analysis benchmark data for the specific workload you describe.

**Core differentiators**

- workload-specific recommendations instead of a static leaderboard
- checks hard constraints against one real OpenRouter ZDR endpoint
- local/BYOK architecture with no hosted OpenAnalysis backend
- conservative model reconciliation instead of fuzzy benchmark matching
- works as a read-only MCP tool inside existing chat/agent clients

## Launch order

### 1. GitHub

Keep GitHub as the source of truth until npm/Registry distribution is ready.

Repository metadata should use:

**Description**

> Local MCP for workload-specific AI model recommendations using OpenRouter ZDR + Artificial Analysis.

**Topics**

`mcp`, `model-context-protocol`, `openrouter`, `artificial-analysis`, `llm`, `model-selection`, `zdr`, `ai-tools`

Before actively promoting, add one screenshot or short GIF showing a normal chat question and the resulting recommendation.

### 2. Official MCP Registry

This is the highest-priority structured listing once the npm package exists. The Registry is the vendor-neutral source of truth and downstream directories can ingest it.

OpenAnalysis already has the stable Registry identity:

`io.github.AgenticArtists/openanalysis`

Remaining dependency: publish the npm package first, then add `server.json` with the final npm package identifier and publish it using `mcp-publisher`.

References:

- https://modelcontextprotocol.io/registry/quickstart
- https://registry.modelcontextprotocol.io/

### 3. Glama

Glama accepts open-source MCP servers directly from a GitHub repository. Submission requires the repository URL, display name, and short description; Glama then runs automated quality/security/health checks.

Use:

- Repository: `https://github.com/AgenticArtists/OpenAnalysis`
- Display name: `OpenAnalysis`
- Short description: the short description above

Reference: https://glama.ai/mcp/faq

### 4. Smithery

Submit after the npm package/standard install command exists so the listing has a clean installation path. Do not convert OpenAnalysis into a hosted service merely for directory compatibility; preserve local/BYOK stdio behavior.

Reference: https://smithery.ai/

### 5. PulseMCP and downstream directories

Prioritize the Official MCP Registry first because ecosystem directories increasingly ingest official Registry metadata. Check for propagation before creating duplicate submissions.

### 6. Awesome lists / community directories

After the package/Registry listing is stable, submit to established MCP awesome lists and community directories. These are secondary to the Official Registry, Glama, and Smithery.

## Community launch copy

### Hacker News / technical communities

**Title**

> Show HN: OpenAnalysis – an MCP that helps your AI choose which model to use

**Body**

> I built OpenAnalysis because choosing an LLM has become a workload-specific decision rather than a leaderboard question. It runs locally as an MCP server and combines current OpenRouter ZDR endpoint constraints (tools, context, price, latency, throughput, uptime) with Artificial Analysis benchmark data. You describe the job and your host model uses the current evidence to recommend a model. It is local, BYOK, read-only, MIT licensed, and has no hosted backend. Feedback on the recommendation surface and matching approach would be useful.

### Reddit / MCP communities

**Title**

> I built a free MCP that answers “which AI model should I use for this job?”

**Body**

> OpenAnalysis is a local BYOK MCP server that combines live OpenRouter ZDR endpoint data with Artificial Analysis benchmarks. Instead of showing another leaderboard, it lets your existing AI assistant evaluate the actual workload and hard constraints: tool calling, context, price, latency, throughput, uptime, coding/agentic benchmarks, etc. It is MIT licensed and there is no hosted backend. I am looking for early users who regularly switch between models and can tell me where the recommendation logic falls short.

## What not to build before feedback

Do not add these merely to make launch feel larger:

- hosted accounts
- billing
- a web dashboard
- telemetry
- automatic model routing
- a proprietary universal ranking score
- dozens of client-specific integrations

The first validation question is simpler: **do people who regularly use multiple models keep OpenAnalysis installed and ask it which model to use?**

## Early feedback to capture

When users open issues, prioritize patterns around:

1. important models missing because reconciliation failed
2. constraints users repeatedly want but the tool cannot express
3. recommendation data that users find misleading or irrelevant
4. MCP clients where installation is unnecessarily difficult
5. repeated requests for routing/automation rather than recommendation only
