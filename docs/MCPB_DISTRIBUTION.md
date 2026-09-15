# MCPB distribution

ModelShortlist can be packaged as an MCP Bundle (`.mcpb`) for local distribution through clients and registries that support MCPB, including Smithery's local-server publishing flow.

## Build locally

From the repository root:

```bash
npm ci
npm run mcpb:build
```

The build script:

1. stages only the runtime files required by the MCP
2. installs production dependencies into the staged bundle
3. generates a MCPB v0.3 `manifest.json`
4. marks the Artificial Analysis and OpenRouter keys as sensitive user configuration
5. validates the bundle with `@anthropic-ai/mcpb`
6. packs the result to `dist/modelshortlist-<version>.mcpb`

On Windows, use `npm.cmd` if PowerShell blocks `npm.ps1`:

```powershell
npm.cmd ci
npm.cmd run mcpb:build
```

## Configuration presented by MCPB clients

The manifest asks the user for:

- `Artificial Analysis API Key` — required and sensitive
- `OpenRouter API Key` — required and sensitive
- `Cache TTL (milliseconds)` — optional, default `43200000`

The client maps those values into:

```text
ARTIFICIAL_ANALYSIS_API_KEY
OPENROUTER_API_KEY
MODEL_SELECTOR_CACHE_TTL_MS
```

The server launches locally with Node.js and `mcp/server.js`.

## CI artifact

The main CI workflow builds and validates the MCPB on every push to `main` and uploads it as the `modelshortlist-mcpb` workflow artifact.

This catches bundle-schema, packaging, and dependency errors before a release.

## Tagged releases

A `v*` tag matching `package.json` triggers the release workflow. Before publication it runs tests, syntax checks, a production dependency audit, npm-package validation, and MCPB validation.

If that package version does not already exist on npm, the workflow publishes it through npm trusted publishing. It then creates the matching GitHub Release and attaches the validated `.mcpb` file. If the npm version already exists, npm publication is skipped rather than attempting to overwrite an immutable release.

The npm package must have this repository/workflow configured as a trusted publisher before the first automated publish.

Example release sequence after the version files are committed to `main`:

```bash
git pull --ff-only
git tag vX.Y.Z
git push origin vX.Y.Z
```

The workflow refuses to release when the tag does not match the package version.

## Smithery

Smithery's local/stdio publishing path accepts a pre-built MCPB bundle. After authenticating with Smithery, publish the bundle generated for the current version, for example:

```bash
smithery mcp publish ./dist/modelshortlist-X.Y.Z.mcpb -n agenticartists/modelshortlist
```

ModelShortlist should remain a **local** MCP in Smithery. Do not publish `https://modelshortlist.com` as a URL-based MCP server: the website is the product/install site, not a Streamable HTTP MCP endpoint.

## Distribution identity

- Website: https://modelshortlist.com
- Install configurator: https://modelshortlist.com/install
- GitHub: https://github.com/AgenticArtists/ModelShortlist
- npm: `@agentic.artists/modelshortlist`
- Official MCP Registry: `io.github.AgenticArtists/modelshortlist`
- Transport: local stdio
- License: MIT
