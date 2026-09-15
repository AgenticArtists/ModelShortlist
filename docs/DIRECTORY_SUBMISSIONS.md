# ModelShortlist distribution and directory status

Last verified: **2026-09-15**

This file is the source of truth for third-party discovery/distribution status. Do not infer that a historical submission is public until the listing is actually discoverable.

## Canonical identity

- Product: **ModelShortlist**
- Website: https://modelshortlist.com
- Install configurator: https://modelshortlist.com/install
- GitHub: https://github.com/AgenticArtists/ModelShortlist
- npm: `@agentic.artists/modelshortlist`
- Official MCP Registry: `io.github.AgenticArtists/modelshortlist`
- Current release: `0.2.3`
- License: MIT
- Transport: local stdio MCP
- Runtime: Node.js 20+
- Architecture: local/BYOK, read-only tools, no hosted ModelShortlist backend, no MCP telemetry

Required upstream credentials:

- `ARTIFICIAL_ANALYSIS_API_KEY`
- `OPENROUTER_API_KEY`

## Verified status

| Surface | Status | Evidence / next step |
| --- | --- | --- |
| Official MCP Registry | **Published / active** | `io.github.AgenticArtists/modelshortlist` v0.2.3 was re-fetched from the Registry API on 2026-09-15; `isLatest: true`. |
| npm | **Published** | `@agentic.artists/modelshortlist@0.2.3` was re-fetched from the npm registry on 2026-09-15; package includes provenance attestation and the `modelshortlist` executable. |
| GitHub Release | **Published** | `v0.2.3` release exists with the validated MCPB asset. |
| ModelShortlist website | **Live** | `modelshortlist.com`, `/install`, Guides, sitemap, robots, social metadata, and `llms.txt` are live on the production Vercel deployment. |
| MCP.Directory | **Submitted / review or auto-discovery pending** | Public intake accepted the repository on 2026-09-15. MCP.Directory also states that it auto-discovers from the Official MCP Registry. No duplicate resubmission. |
| AllMCPs | **Pending** | Submission API returned HTTP 409 on 2026-09-15 with `duplicate: true`, existing id `modelshortlist`, status `pending`. Do not resubmit. |
| AgentNDX | **Submitted / pending review** | Public JSON intake accepted the submission with HTTP 201; submission id `9`. |
| FindMCP | **Submitted / pending review** | Public intake accepted the submission with HTTP 200; submission id `78`, slug `modelshortlist`. |
| PulseMCP | **Submitted / propagation pending** | Direct indexing email sent 2026-09-15; PulseMCP also consumes Official MCP Registry data. No public ModelShortlist result found during Phase 3 re-check. |
| LaunchMCP | **Submitted by email** | Listing request emailed to `hello@launchmcp.co` on 2026-09-15; no reply as of the Phase 3 inbox re-check. |
| MCP Surge | **Submitted by email** | Listing request emailed to `hello@mcpsurge.com` on 2026-09-15; no reply as of the Phase 3 inbox re-check. |
| MCP Server Finder | **Submitted by email** | Listing request emailed to `info@mcpserverfinder.com` on 2026-09-15; no reply as of the Phase 3 inbox re-check. |
| TrackMCP | **Submitted by email** | Listing request emailed to `support@trackmcp.com` on 2026-09-15; no reply as of the Phase 3 inbox re-check. |
| Agent Switchboard | **Submitted by email** | Listing request emailed to maintainer `barnir@agentmail.to` on 2026-09-15. It is a curated, machine-readable agent/MCP directory with free inclusion. |
| Glama | **Owner action required** | Current Glama docs accept open-source servers from GitHub. Repository already has `glama.json`; Add/Claim requires signing in with GitHub and, for organization ownership, approving the Glama GitHub App. |
| Smithery | **Owner authentication required** | Current CLI supports `smithery mcp publish <bundle.mcpb> -n <namespace/server>`. The validated MCPB exists, but `smithery auth login` is required. |
| mcp.so | **Owner/GitHub action required** | Current site documents GitHub issue submission. Attempts through the connected GitHub App fail with HTTP 403 because the external repository restricts integration issue/comment creation. |
| MCP.Pub | **Browser-only submission remains** | Active directory with 6k+ servers and local stdio support. Its submit page needs only the GitHub URL and contact email, but GitHub Actions requests are blocked with HTTP 403. |
| mcp-get (legacy) | **Do not pursue** | The established `michaellatman/mcp-get` project is archived and explicitly recommends Smithery. Homebrew marks the formula disabled. |
| MCPHunt | **Do not pursue as a directory submission** | The current `MCPHunt` project is an MCP security/evaluation framework; the separate MCP Hunt site requires sign-in for community submission. |
| mcpub.dev | **Not applicable** | Its publication model expects a reachable remote MCP endpoint / well-known manifest. ModelShortlist is intentionally local stdio; do not misrepresent the website as an MCP endpoint. |

## Remaining manual actions

These are the only worthwhile Phase 3 directory actions that could not be completed autonomously:

1. **Glama** — sign in, choose Add MCP Server, submit `https://github.com/AgenticArtists/ModelShortlist`, then claim ownership with GitHub.
2. **Smithery** — authenticate, then run the current MCPB publish flow for namespace `agenticartists/modelshortlist`.
3. **mcp.so** — while signed into GitHub in a normal browser, use the site's Submit flow / `chatmcp/mcpso` submission issue route. The connected GitHub App cannot create the external issue.
4. **MCP.Pub** — open `https://mcp.pub/submit/`, paste the public repository URL and contact email, and submit for review. Automation from GitHub Actions is blocked by HTTP 403.

Do not add a hosted Streamable HTTP backend merely to satisfy a directory.

## Submission copy

### One-line description

Current workload-specific AI model selection using Artificial Analysis evidence plus live OpenRouter facts.

### Short description

ModelShortlist is a local BYOK MCP server that gives AI assistants current OpenRouter pricing, capability, context, provider, and optional ZDR information plus independent Artificial Analysis benchmark/performance evidence for workload-specific model selection.

### Extended description

ModelShortlist answers a moving-target question: **given what is true about the model market right now, which model is best for this workload?** It does not impose one permanent leaderboard. Artificial Analysis supplies independent quality/performance evidence when a model match is confident; OpenRouter supplies current operational facts such as model availability, context, tool support, pricing, providers, and optional ZDR endpoints; the host AI reasons over that evidence for the user's workload and hard constraints.

The MCP runs locally, is bring-your-own-key, MIT licensed, and read-only. There is no ModelShortlist account, hosted ModelShortlist backend, or MCP telemetry. ZDR is optional unless explicitly requested.

### Suggested categories

- AI / LLM tooling
- Developer tools
- Model selection
- Agent infrastructure
- Infrastructure / Ops

### Suggested tags

`model-selection`, `llm`, `openrouter`, `artificial-analysis`, `benchmarks`, `coding-agents`, `tool-calling`, `context-window`, `zdr`, `privacy`, `cost-optimization`, `mcp`, `byok`, `open-source`

## Installation

Preferred path: https://modelshortlist.com/install

Generic npm command:

```text
npx -y @agentic.artists/modelshortlist
```

Claude Desktop-style config:

```json
{
  "mcpServers": {
    "modelshortlist": {
      "command": "npx",
      "args": ["-y", "@agentic.artists/modelshortlist"],
      "env": {
        "ARTIFICIAL_ANALYSIS_API_KEY": "YOUR_ARTIFICIAL_ANALYSIS_KEY",
        "OPENROUTER_API_KEY": "YOUR_OPENROUTER_KEY"
      }
    }
  }
}
```

On Windows, use the install configurator's `npx.cmd` variant for GUI clients.

## Data attribution

- **Artificial Analysis:** independent benchmark/model-performance evidence when a confident model reconciliation exists.
- **OpenRouter:** current model catalog, capabilities, context, pricing, provider, and ZDR endpoint metadata.

ModelShortlist is not affiliated with or endorsed by Artificial Analysis or OpenRouter.

## Submission rule

Before submitting anywhere new:

1. search for ModelShortlist first;
2. confirm the directory is active and credible;
3. confirm it accepts local stdio MCPs;
4. use the GitHub/npm/Registry identity above;
5. never submit `modelshortlist.com` as though it were a remote MCP endpoint;
6. avoid low-quality directories whose only value is inflating listing count;
7. record the result here.