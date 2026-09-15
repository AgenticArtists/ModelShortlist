# Distribution architecture

ModelShortlist is the successor to the project originally released as OpenAnalysis. The rename and primary package/registry migration are complete.

## Canonical identities

- Website: `https://modelshortlist.com`
- GitHub repository: `AgenticArtists/ModelShortlist`
- npm package: `@agentic.artists/modelshortlist`
- npm executable: `modelshortlist`
- Official MCP Registry name: `io.github.AgenticArtists/modelshortlist`

## Current product distribution foundation

- local/BYOK stdio MCP implementation
- public GitHub repository and MIT license
- public npm package
- Official MCP Registry package metadata in `server.json`
- controlled npm package file list
- `publishConfig.access` set to `public`
- Linux and Windows smoke tests for both prospective and currently published npm packages
- MCPB build and validation in CI
- tagged-release workflow that validates the package and attaches the MCPB artifact to GitHub Releases
- canonical website and install configurator

The MCP itself has no hosted ModelShortlist backend and no telemetry. Users provide their own Artificial Analysis and OpenRouter credentials to the local MCP process.

## Release state

The repository currently has release automation for future `v*` tags. A tag must match the version in `package.json`; the workflow then runs tests, syntax/package validation, builds and validates the MCPB artifact, and creates a GitHub Release with that artifact.

The current public npm version is `0.2.2`. The Phase 1 CI gate validates that exact published package on Linux and Windows in addition to validating the prospective package from the repository.

GitHub Release history is tracked separately from npm publication. Do not infer that an npm version has a matching GitHub Release unless the release actually exists.

## Directory status

Directory/discovery status is intentionally maintained in `docs/DIRECTORY_SUBMISSIONS.md` and is re-verified during the distribution phase before any new submission. Historical statuses must not be treated as current without that verification.

## Required user-supplied secrets

- `ARTIFICIAL_ANALYSIS_API_KEY`
- `OPENROUTER_API_KEY`

Optional:

- `MODEL_SELECTOR_CACHE_TTL_MS`

## Official documentation

- https://modelcontextprotocol.io/registry/quickstart
- https://registry.modelcontextprotocol.io/docs
- https://docs.npmjs.com/trusted-publishers/
