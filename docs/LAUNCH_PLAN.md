# Launch content pack

ModelShortlist is ready for public promotion. The product, package, Official MCP Registry listing, website, documentation, and hardened `0.2.3` release are live.

## Core message

**Problem:** model selection changes too quickly for static recommendations.

**Answer:** ModelShortlist gives an MCP-capable AI assistant current evidence for choosing a model for a specific workload.

Artificial Analysis supplies independent benchmark/performance evidence when a model match is confident. OpenRouter supplies current operational facts such as price, context, tool support, providers, and optional ZDR endpoints. The host AI reasons over that evidence for the user's actual workload.

Do not lead with “I made an MCP server.” Lead with the moving-target model-selection problem.

## Trust points

- open source / MIT
- local stdio MCP
- bring your own Artificial Analysis and OpenRouter keys
- no ModelShortlist account
- no hosted ModelShortlist backend
- no MCP telemetry
- read-only MCP tools
- Official MCP Registry: `io.github.AgenticArtists/modelshortlist`
- npm: `@agentic.artists/modelshortlist`
- current release: `0.2.3`
- ZDR is optional unless explicitly required

## Primary call to action

Website: https://modelshortlist.com

Install: https://modelshortlist.com/install

GitHub: https://github.com/AgenticArtists/ModelShortlist

## Demo

Use `docs/DEMO.md` for the 60–90 second recording flow. Use live output at capture time; do not hard-code model names, prices, or benchmark values into launch copy.

Recommended demo prompt:

> I need a model for a long-running coding agent. Tool use is required, I need at least 100k context, and I care about quality-per-dollar. Which model should I use right now?

## Show HN

### Title

**Show HN: ModelShortlist – ask your AI which model is best right now**

### Body

Model selection has become a moving target. New models launch constantly, prices change, tool support changes, context limits change, and benchmark rankings move. A blog post or static leaderboard can be useful for orientation, but it gets stale quickly and usually cannot account for the workload you actually have.

I built ModelShortlist to put current model-selection evidence inside an MCP-capable assistant.

It combines independent Artificial Analysis benchmark/performance evidence with current OpenRouter facts such as model availability, pricing, context, tool support, providers, and optional Zero Data Retention endpoints. The host AI then reasons over that evidence for the specific workload and hard constraints you describe.

It does not route inference or impose a universal score. It is a local stdio MCP, BYOK, MIT licensed, read-only, and has no hosted ModelShortlist backend or MCP telemetry.

Example question:

> I need a model for a long-running coding agent. Tool use is required, I need at least 100k context, and I care about quality-per-dollar. Which model should I use right now?

Website: https://modelshortlist.com
GitHub: https://github.com/AgenticArtists/ModelShortlist
Install: https://modelshortlist.com/install

I’d especially value feedback from people who regularly switch among OpenRouter models: what evidence do you actually want available when choosing a model, and where does this recommendation surface fall short?

## Reddit

### r/mcp / r/modelcontextprotocol title

**I built a local MCP for answering “which model should I use for this workload right now?”**

### Body

ModelShortlist is an open-source local MCP that gives your existing AI assistant current evidence for model selection.

The main idea is that “best model” depends on the job and changes over time. Artificial Analysis contributes independent benchmark/performance evidence; OpenRouter contributes current price, context, capabilities, providers, and optional ZDR information; the host model reasons about the actual workload instead of relying on a permanent top-10 list.

It is local/BYOK, read-only, MIT licensed, has no hosted backend, and includes no MCP telemetry. ZDR is not a default restriction—it only becomes a hard constraint if you ask for it.

Install: https://modelshortlist.com/install
GitHub: https://github.com/AgenticArtists/ModelShortlist

I’m looking for early users who actually choose among several models and can point out missing constraints, bad model reconciliation, or evidence that is not useful in practice.

### r/LocalLLaMA / model-selection communities angle

**Static “best LLM” lists age fast, so I built a current model-selection evidence layer**

Focus the post on changing pricing/capability/benchmark evidence, not MCP itself. Explain that ModelShortlist does not host models or route requests; it only supplies current evidence to the user's existing assistant.

### Coding-agent communities angle

**How I’m choosing models for coding agents without hard-coding one permanent winner**

Use the coding-agent demo prompt. Highlight tool support, context, output-price ceilings, coding/agentic evidence, and why the result can change when the market changes.

## LinkedIn

Model selection is becoming a systems problem, not a leaderboard problem.

The “best” AI model can change because a new model launches, pricing drops, tool support changes, context availability changes, or benchmark evidence moves. And the best model for a coding agent may be a poor choice for document extraction or repetitive low-cost subagents.

I built **ModelShortlist** to make that decision more current and workload-specific.

It gives an MCP-capable AI assistant:

- independent Artificial Analysis benchmark/performance evidence
- current OpenRouter pricing, context, capability and provider facts
- optional ZDR endpoint constraints
- enough structured evidence to reason about the workload you actually describe

It does not route inference, host models, or impose one permanent ranking. It runs locally, is BYOK and open source, and includes no MCP telemetry.

https://modelshortlist.com

## Short social post

“Which AI model is best?” is usually the wrong question.

Better: **given what is true about the market right now, which model is best for this workload?**

ModelShortlist combines Artificial Analysis performance evidence with current OpenRouter price/capability/context/provider data and lets your existing AI reason over it.

Local. BYOK. Open source. No MCP telemetry.

https://modelshortlist.com

## OpenRouter-focused community copy

ModelShortlist uses the full current OpenRouter catalog by default and helps the host AI reason about model choice using price, context, supported parameters/capabilities, provider information, and independent Artificial Analysis evidence.

It is not a router and does not send inference through a ModelShortlist backend. Users keep their existing OpenRouter setup and credentials. ZDR is optional unless explicitly requested.

Install: https://modelshortlist.com/install

## AI/MCP community copy

ModelShortlist is a read-only local MCP for model-selection evidence. It exposes `recommend_models`, `compare_models`, and `modelshortlist_status`, so a host assistant can reason about model fit without relying on a stale static ranking.

Official MCP Registry: `io.github.AgenticArtists/modelshortlist`

npm: `@agentic.artists/modelshortlist`

## GitHub announcement / release note

### ModelShortlist 0.2.3 — hardened public release

ModelShortlist is now fully published under its final identity across npm, the Official MCP Registry, GitHub Releases, and modelshortlist.com.

`0.2.3` adds stronger upstream resilience and freshness signaling, conservative model reconciliation, stricter tool/pricing semantics, safer degraded-source behavior, broader regression coverage, package validation on Linux and Windows, validated MCPB packaging, and automated npm + Official Registry release publication.

The website now also includes workload and comparison guides built around current evidence rather than static model rankings.

Install: `npx -y @agentic.artists/modelshortlist`

## Posting sequence

1. Record the demo using `docs/DEMO.md`.
2. Publish Show HN when someone can monitor/respond for the first few hours.
3. Post to one relevant MCP subreddit/community; do not shotgun identical text across many subreddits.
4. Publish LinkedIn with the demo or one clean screenshot.
5. Share the coding-agent angle in one relevant OpenRouter/coding-agent community.
6. Watch installs/issues/questions before expanding to broader launch sites.

## What not to do

- do not spam dozens of directories or communities
- do not imply affiliation or endorsement by Artificial Analysis or OpenRouter
- do not claim a permanent “best model”
- do not fabricate benchmark results in launch screenshots
- do not turn ZDR into the main product identity
- do not build a hosted backend simply to improve directory compatibility
- do not add new product features merely to make launch look bigger

The first validation question remains: **do people who regularly choose among multiple models keep ModelShortlist installed and use it before selecting a model?**
