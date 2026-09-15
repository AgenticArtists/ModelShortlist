# Public launch checklist

Last refreshed: **2026-09-15**

## Product and release foundation

- [x] Product renamed to ModelShortlist
- [x] `modelshortlist.com` live
- [x] MIT license
- [x] Local/BYOK architecture
- [x] No hosted ModelShortlist backend
- [x] No MCP telemetry
- [x] Read-only MCP tools
- [x] Artificial Analysis and OpenRouter attribution
- [x] Claude Desktop setup
- [x] Claude Code setup
- [x] Hermes Desktop setup
- [x] Cursor setup
- [x] VS Code/Copilot setup
- [x] Windows `npx.cmd` handling
- [x] Interactive masked-key setup command
- [x] Reproducible npm lockfile
- [x] GitHub Actions CI
- [x] Linux public-package smoke test
- [x] Windows public-package smoke test
- [x] Production dependency audit
- [x] Security policy
- [x] Contribution guide
- [x] Changelog
- [x] MCPB validation/package build
- [x] Public npm package `@agentic.artists/modelshortlist@0.2.3`
- [x] Official MCP Registry `io.github.AgenticArtists/modelshortlist@0.2.3`
- [x] GitHub Release `v0.2.3` with MCPB asset
- [x] npm trusted publishing / OIDC release path
- [x] Official MCP Registry GitHub-OIDC release path
- [x] Historical `@agentic.artists/openanalysis` package deprecated with migration message

## Positioning and content

- [x] Homepage leads with current/workload-specific model selection
- [x] Artificial Analysis attribution is prominent and accurate
- [x] Freshness is a core product message
- [x] Guides hub exists
- [x] Major workload/search-intent pages exist
- [x] Sitemap / robots / `llms.txt` are current
- [x] Open Graph/social card updated
- [x] 60–90 second demo script and screenshot plan prepared
- [x] Show HN copy prepared
- [x] Reddit/community copy prepared
- [x] LinkedIn copy prepared
- [x] OpenRouter/coding-agent community copy prepared
- [x] GitHub announcement copy prepared

## Distribution completed or in review

- [x] Official MCP Registry published
- [x] npm published
- [x] MCP.Directory submitted / official-registry auto-discovery available
- [x] AllMCPs submission exists and is pending
- [x] AgentNDX submission accepted
- [x] FindMCP submission accepted
- [x] PulseMCP indexing request sent
- [x] LaunchMCP request sent
- [x] MCP Surge request sent
- [x] MCP Server Finder request sent
- [x] TrackMCP request sent
- [x] Agent Switchboard request sent
- [x] Legacy `mcp-get` evaluated and rejected as archived/obsolete
- [x] MCPHunt evaluated and rejected as not a useful no-login server-directory target
- [x] Remote-only publication surfaces excluded rather than misrepresenting `modelshortlist.com` as an MCP endpoint

## Small manual directory checklist

These require owner/browser authentication or are blocked against automation. They are optional supplemental discovery surfaces, not release blockers.

- [ ] Glama — sign in, Add MCP Server using the public GitHub repo, then claim ownership
- [ ] Smithery — `smithery auth login`, build MCPB, publish to `agenticartists/modelshortlist`
- [ ] mcp.so — use the browser/GitHub submission route; the connected GitHub App receives HTTP 403 on external issue/comment creation
- [ ] MCP.Pub — submit the GitHub repo + contact email in its browser form; GitHub Actions requests receive HTTP 403
- [ ] GitHub repository topics — add `mcp`, `model-context-protocol`, `openrouter`, `artificial-analysis`, `llm`, `model-selection`, `coding-agents`, `ai-tools` (current API connection does not expose repository-topic mutation)

## Launch amplification

- [ ] Record one real demo from the live `0.2.3` product using `docs/DEMO.md`
- [ ] Publish Show HN while someone can monitor replies
- [ ] Post to one relevant MCP community
- [ ] Publish LinkedIn with the demo or a clean screenshot
- [ ] Share one workload-specific post in an OpenRouter or coding-agent community

## Feedback after launch

- [ ] Establish Phase 4 baseline metrics before amplification
- [ ] Track npm downloads
- [ ] Track GitHub stars/forks/issues
- [ ] Track release/MCPB downloads where available
- [ ] Track website and `/install` traffic if privacy-conscious analytics is available
- [ ] Track directory review/listing status
- [ ] Record repeated install friction
- [ ] Record unmatched/ambiguous model names and add only verified aliases
- [ ] Avoid major features until user behavior or repeated support friction justifies them
