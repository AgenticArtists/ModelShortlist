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

## GitHub Releases

Pushing a version tag matching `package.json` automatically creates a GitHub Release and attaches the validated `.mcpb` file.

Example for version `0.3.0`:

```bash
npm version 0.3.0
git push origin main
git push origin v0.3.0
```

The release workflow refuses to publish when the tag does not match the package version.

## Smithery

Smithery's current local/stdio publishing path accepts a pre-built MCPB bundle.

After authenticating with Smithery:

```bash
npm install -g smithery@latest
smithery auth login
smithery mcp publish ./dist/modelshortlist-0.2.2.mcpb -n agenticartists/modelshortlist
```

For future versions, substitute the current package version in the bundle filename.

ModelShortlist should remain a **local** MCP in Smithery. Do not publish `https://modelshortlist.com` as a URL-based MCP server: the website is the product/install site, not a Streamable HTTP MCP endpoint.

## Distribution identity

- Website: https://modelshortlist.com
- Install configurator: https://modelshortlist.com/install
- GitHub: https://github.com/AgenticArtists/ModelShortlist
- npm: `@agentic.artists/modelshortlist`
- Official MCP Registry: `io.github.AgenticArtists/modelshortlist`
- Transport: local stdio
- License: MIT
