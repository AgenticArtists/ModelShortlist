# Distribution architecture

ModelShortlist is the successor to the project originally released as OpenAnalysis. The rename, package migration, release automation, and primary Registry publication are complete.

## Canonical identities

- Website: `https://modelshortlist.com`
- GitHub repository: `AgenticArtists/ModelShortlist`
- npm package: `@agentic.artists/modelshortlist`
- npm executable: `modelshortlist`
- Official MCP Registry name: `io.github.AgenticArtists/modelshortlist`
- Current public release: `0.2.3`

## Current distribution foundation

- local/BYOK stdio MCP implementation
- public GitHub repository and MIT license
- public npm package with provenance
- Official MCP Registry metadata in `server.json`
- controlled npm package file list
- `publishConfig.access` set to `public`
- Linux and Windows smoke tests for both prospective and currently published npm packages
- MCPB build and validation in CI
- tagged release workflow that validates, publishes npm through trusted publishing when needed, publishes Official MCP Registry metadata through GitHub OIDC, and attaches the MCPB artifact to GitHub Releases
- canonical website and browser-only install configurator
- downstream directory status tracked in `DIRECTORY_SUBMISSIONS.md`

The MCP itself has no hosted ModelShortlist backend and no telemetry. Users provide their own Artificial Analysis and OpenRouter credentials to the local MCP process.

## Release state

The repository uses `v*` tags for releases. A release tag must match `package.json`, `package-lock.json`, and both version fields in `server.json`.

The release workflow runs tests, syntax checks, production dependency audit, npm-package validation, MCPB validation, and package smoke tests. npm publication uses trusted publishing/OIDC; the Official MCP Registry publication path uses GitHub OIDC rather than a long-lived Registry token.

`v0.2.3` is the first fully hardened release under the final ModelShortlist identity. It is public on npm, active/latest in the Official MCP Registry, and has a matching GitHub Release with MCPB asset.

## Historical package

The old npm package `@agentic.artists/openanalysis` is deprecated with a migration message directing users to `@agentic.artists/modelshortlist` and the ModelShortlist GitHub repository. Do not publish new releases under the OpenAnalysis identity.

## Directory strategy

The Official MCP Registry is the canonical machine-readable source. Third-party directories are supplemental discovery surfaces, not sources of truth.

Before submitting to a directory:

1. search for ModelShortlist first;
2. verify the service is active;
3. verify it supports a local stdio MCP;
4. prefer a public API or email route when available;
5. never present `modelshortlist.com` as a remote MCP endpoint;
6. do not add a hosted backend solely for directory compatibility;
7. record the result in `DIRECTORY_SUBMISSIONS.md`.

Current verified/pending/manual-blocked statuses are maintained only in `docs/DIRECTORY_SUBMISSIONS.md`.

## Required user-supplied secrets

- `ARTIFICIAL_ANALYSIS_API_KEY`
- `OPENROUTER_API_KEY`

Optional:

- `MODEL_SELECTOR_CACHE_TTL_MS`

## Official documentation

- https://modelcontextprotocol.io/registry/quickstart
- https://registry.modelcontextprotocol.io/docs
- https://docs.npmjs.com/trusted-publishers/
