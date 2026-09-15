# ModelShortlist demo package

This is the canonical 60–90 second demo flow for ModelShortlist.

The recording should use **live ModelShortlist output at capture time**. Do not hard-code model names, prices, benchmark scores, or provider availability into the script because those facts can change.

## Core scenario

Use this exact prompt:

> I need a model for a long-running coding agent. Tool use is required, I need at least 100k context, and I care about quality-per-dollar. What are the best current options, and what would you choose?

This scenario is intentionally useful because it combines:

- a real workload rather than a generic ranking request
- a hard tool requirement
- a hard context requirement
- a soft quality preference
- a soft cost/value preference
- no unnecessary ZDR restriction

## 60–90 second script

### 0–10 seconds — the problem

**On screen:** ModelShortlist homepage hero, then the prompt being typed into an MCP-capable assistant.

**Narration:**

> The best AI model changes too quickly for a static recommendation. New models launch, prices move, benchmarks change, and capabilities change. So instead of asking for a permanent leaderboard, I ask for the best model for the job right now.

### 10–25 seconds — the workload becomes constraints

**On screen:** The assistant calls `recommend_models`. Show the request constraints if the client exposes the tool call.

**Narration:**

> For this coding agent, tool use and at least 100k context are hard requirements. Quality and value are preferences. ModelShortlist starts with the current OpenRouter catalog and removes models that cannot satisfy the hard constraints.

### 25–45 seconds — two evidence layers

**On screen:** Show a compact portion of the returned evidence. Highlight source freshness, Artificial Analysis fields on a confidently matched candidate, and OpenRouter price/context/tool fields.

**Narration:**

> Then it combines two different kinds of evidence. Artificial Analysis contributes independent benchmark and performance assessments. OpenRouter contributes current operational facts like price, context, supported parameters, and provider availability. ModelShortlist does not invent the benchmark scores, and it does not force everything into one universal ranking formula.

### 45–65 seconds — freshness and reasoning

**On screen:** Highlight the freshness block and then the assistant's shortlist/explanation.

**Narration:**

> Freshness is part of the result. If an upstream source is stale or unavailable, the assistant can see that instead of silently treating old evidence as current. The host AI then weighs the evidence against the workload and explains the tradeoffs.

### 65–80 seconds — conclusion

**On screen:** Show the final best-fit and best-value recommendations, then cut to the install page.

**Narration:**

> The result is not “model X is always number one.” It is a current, explainable shortlist for this workload. ModelShortlist runs locally, uses your own Artificial Analysis and OpenRouter keys, and adds no MCP telemetry.

### Optional 80–90 second close

**On screen:** Install configurator and GitHub/npm links.

**Narration:**

> It is open source, MIT licensed, on npm and the Official MCP Registry, and works as a local stdio MCP in supported clients.

## Exact demo prompts

### Primary

> I need a model for a long-running coding agent. Tool use is required, I need at least 100k context, and I care about quality-per-dollar. What are the best current options, and what would you choose?

### Budget variant

> Same coding workload, but $10 per million output tokens is a hard ceiling. Which current models still qualify, and what quality or capability tradeoffs do I make?

### Privacy variant

> Same coding workload, but Zero Data Retention is mandatory. Only recommend models where the same real ZDR endpoint satisfies every hard constraint.

### Evidence-transparency variant

> Compare the top candidates and clearly separate Artificial Analysis benchmark evidence from OpenRouter price, context, capability, and provider facts. Also tell me whether each evidence source is fresh, stale, or unavailable.

## Screenshot / screen-recording plan

Capture these frames in order:

1. **Homepage hero** — “Ask which model is best right now.”
2. **Prompt entry** — primary coding-agent prompt in the host assistant.
3. **Tool call** — `recommend_models` invoked with tool/context constraints visible if the client supports this view.
4. **Freshness block** — source states and any cache-age information.
5. **Artificial Analysis evidence** — one confidently matched candidate showing benchmark/performance fields.
6. **OpenRouter evidence** — price, context, tool support, and relevant provider facts on the same or another candidate.
7. **Reasoned shortlist** — host assistant explaining best fit, best value, and key tradeoffs.
8. **Install page** — client configurator plus local/BYOK explanation.
9. **Optional trust close** — GitHub repository, npm package, or Official MCP Registry listing.

Do not capture API keys, `.env.local`, browser autofill values, tokens, private repository data, or terminal output containing credentials.

## Recording checklist

Immediately before recording:

- confirm the public npm package is the current release
- confirm the Official MCP Registry entry resolves
- run `modelshortlist_status`
- ensure Artificial Analysis, OpenRouter catalog, and ZDR source states are understood
- use a fresh assistant conversation so the recommendation is visibly based on the tool call
- hide or redact all credentials
- keep the primary demo non-ZDR; use the privacy variant only as a secondary example

If any upstream is degraded during recording, either wait for normal service or make the degraded-state behavior the explicit point of that take. Do not present stale evidence as fresh.

## Web demo copy

**Headline**

Ask which model is best right now.

**Supporting copy**

Give your AI assistant current model-selection evidence: independent Artificial Analysis benchmarks plus OpenRouter pricing, context, capabilities, providers, and optional ZDR facts. ModelShortlist applies your hard constraints, surfaces freshness, and lets the host AI explain the best fit for the workload.

**CTA**

Install ModelShortlist

## Social-ready description

Model selection changes too quickly for static “best LLM” lists. ModelShortlist is a local, open-source MCP that gives your AI assistant independent Artificial Analysis benchmark evidence plus current OpenRouter price, context, capability, provider, and optional ZDR facts—then lets the assistant reason about the model that best fits the actual workload. BYOK, read-only, and no MCP telemetry.

## What the demo must not claim

- Do not claim Artificial Analysis endorses or is affiliated with ModelShortlist.
- Do not describe ModelShortlist as the creator of Artificial Analysis benchmarks.
- Do not describe ModelShortlist as a model router or inference proxy.
- Do not claim one model is permanently best.
- Do not imply ZDR is required for ordinary model selection.
- Do not publish a model price, provider, context limit, or benchmark score without checking it at recording time.
