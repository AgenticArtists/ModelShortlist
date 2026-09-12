# Changelog

All notable public changes to OpenAnalysis will be documented here.

## Unreleased

### Added

- npm package executable entry point (`openanalysis`).
- Official MCP Registry identity metadata (`io.github.AgenticArtists/openanalysis`).
- Controlled npm package file list and public publish configuration.
- CI validation of the prospective npm package with `npm pack --dry-run`.
- Dependabot configuration.
- GitHub issue templates and a public distribution roadmap.

### Changed

- Package metadata is prepared for future npm/MCP Registry distribution while remaining protected by `private: true`.

## 0.2.0 - 2026-09-12

First public MVP.

### Added

- Local stdio MCP server for workload-specific AI model selection.
- `recommend_models`, `compare_models`, and `openanalysis_status` tools.
- OpenRouter Zero Data Retention endpoint filtering.
- Artificial Analysis benchmark and performance integration.
- Conservative model reconciliation with verified aliases and exact normalized matching.
- Interactive `npm run setup` flow with masked API-key input and generated MCP client configuration.
- Hermes Desktop, Claude Code, Cursor, and VS Code/Copilot setup documentation.
- MIT license, security policy, contribution guide, attribution documentation, and GitHub Actions CI.

### Security and privacy

- Local BYOK architecture; no hosted OpenAnalysis backend.
- `.env.local` is gitignored.
- MCP tools are read-only.
- No telemetry.
