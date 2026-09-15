# Changelog

All notable public changes to ModelShortlist will be documented here.

## 0.2.3 - 2026-09-15

### Reliability

- Isolate Artificial Analysis, OpenRouter model-catalog, and OpenRouter ZDR refresh failures instead of treating every refresh as all-or-nothing.
- Reuse previously fetched source data as an explicitly stale fallback when a later refresh fails.
- Preserve the last known-good OpenRouter model catalog when a later HTTP-200 response is empty instead of overwriting it with an unusable cache entry.
- Fail closed when the OpenRouter model catalog is unavailable with no cached copy, when it is empty with no safe fallback, or when ZDR is required but no current/cached ZDR endpoint evidence exists.
- Surface source-level freshness, warnings, and cache age to MCP hosts so degraded evidence is not silently presented as current.
- Improve HTTP handling for authentication failures, rate limits, upstream 5xx responses, network failures, timeouts, nested error payloads, and malformed JSON.

### Correctness

- Add reconciliation regression coverage for mini/base, pro/small/thinking, preview/stable, dated releases, duplicate normalized names, and broken aliases.
- Keep unmatched and ambiguous OpenRouter models eligible without fabricated Artificial Analysis benchmark fields.
- Require the OpenRouter `tools` supported parameter for tool-capability claims; `tool_choice` alone is no longer treated as proof of tool support.
- Preserve OpenRouter tiered pricing and evaluate hard price ceilings conservatively across applicable tiers.
- Derive the MCP server version from `package.json` to prevent runtime version drift.

### Security and packaging

- Add a production dependency audit to CI.
- Validate the actually published npm version, package contents, clean install, and executable startup on Linux and Windows in CI.
- Continue validating the prospective npm package, MCPB bundle, and website build before merge.
- Add a tagged release path that validates version alignment, publishes npm through trusted publishing/OIDC when needed, publishes Official MCP Registry metadata through GitHub OIDC, and attaches the validated MCPB bundle to the GitHub Release.
- Pin and checksum-verify the `mcp-publisher` binary used by the release workflow.

### Documentation

- Add troubleshooting guidance for client launch, authentication, rate limits, upstream failures, schema failures, and freshness states.
- Document `fresh`, `stale`, and `unavailable` evidence behavior and the source-level cache semantics.
- Correct stale distribution/migration documentation and align package, Registry, release, and MCPB metadata around the canonical ModelShortlist identities.

## 0.2.2 - 2026-09-12

### Changed

- Switched recommendation discovery to the full OpenRouter model catalog with ZDR as an optional overlay.
- Made `requires_zdr` opt-in instead of a default eligibility filter.
- Required ZDR hard constraints to be satisfiable on the same real endpoint when ZDR is requested.
- Kept models without a confident Artificial Analysis match eligible with benchmark fields unavailable rather than removing them.
- Updated Registry metadata, documentation, and launch positioning to match the optional-ZDR behavior.

## 0.2.1 - 2026-09-12

### Fixed

- Fixed the npm executable/package entry point and synchronized package/Registry version metadata.

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

## Rename history

The project was renamed from **OpenAnalysis** to **ModelShortlist** before Official MCP Registry publication. The canonical npm package is `@agentic.artists/modelshortlist`, the Registry identity is `io.github.AgenticArtists/modelshortlist`, and the executable/server identity is `modelshortlist`.
