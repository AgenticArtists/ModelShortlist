# Changelog

All notable public changes to OpenAnalysis will be documented here.

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
