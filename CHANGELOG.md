# Changelog

All notable public changes to ModelShortlist will be documented here.

## Unreleased

### Changed

- Renamed the project from **OpenAnalysis** to **ModelShortlist** before Official MCP Registry publication.
- New npm package identity: `@agentic.artists/modelshortlist`.
- New Official MCP Registry identity: `io.github.AgenticArtists/modelshortlist`.
- CLI executable renamed to `modelshortlist`.
- MCP server identity renamed to `modelshortlist`.
- Status tool renamed from `openanalysis_status` to `modelshortlist_status`.
- Public website set to `https://modelshortlist.com`.
- Documentation, setup output, client configuration examples, and CI smoke tests updated for the new name.

### Migration

- The previously published `@agentic.artists/openanalysis` package remains a historical artifact and should be deprecated on npm after `@agentic.artists/modelshortlist` is published and verified.
- The Official MCP Registry never received the old `io.github.AgenticArtists/openanalysis` identity, so no Registry migration is required.

## 0.2.0 - 2026-09-12

First public MVP, originally released under the OpenAnalysis name.

### Added

- Local stdio MCP server for workload-specific AI model selection.
- `recommend_models`, `compare_models`, and status/diagnostics tools.
- OpenRouter Zero Data Retention endpoint filtering.
- Artificial Analysis benchmark and performance integration.
- Conservative model reconciliation with verified aliases and exact normalized matching.
- Interactive `npm run setup` flow with masked API-key input and generated MCP client configuration.
- Hermes Desktop, Claude Code, Cursor, and VS Code/Copilot setup documentation.
- MIT license, security policy, contribution guide, attribution documentation, and GitHub Actions CI.

### Security and privacy

- Local BYOK architecture with no hosted backend.
- `.env.local` is gitignored.
- MCP tools are read-only.
- No telemetry.
