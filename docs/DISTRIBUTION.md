# Distribution roadmap

OpenAnalysis is public on GitHub and npm. The next milestone is publication to the Official MCP Registry.

## Final identities

- npm package: `@agentic.artists/openanalysis`
- Official MCP Registry name: `io.github.AgenticArtists/openanalysis`

## Completed

- public GitHub repository
- scoped npm package name
- npm publication of `@agentic.artists/openanalysis@0.2.0`
- stdio MCP executable exposed as the `openanalysis` package binary
- executable shebang on `mcp/server.js`
- stable Official MCP Registry identity
- matching `mcpName` metadata in `package.json`
- controlled npm package file list
- `publishConfig.access` set to `public`
- CI validates the npm package with `npm pack --dry-run`
- `server.json` declares the npm package, stdio transport, and required secrets

## Remaining publication work

1. Verify `npx -y @agentic.artists/openanalysis` resolves and launches the MCP process.
2. Authenticate to the Official MCP Registry using the AgenticArtists GitHub identity.
3. Validate and publish `server.json` with `mcp-publisher`.
4. Verify the public Registry listing.
5. Configure npm trusted publishing using GitHub Actions/OIDC for future releases.
6. Submit to downstream directories after the Official Registry listing exists.

## Required user-supplied secrets

- `ARTIFICIAL_ANALYSIS_API_KEY`
- `OPENROUTER_API_KEY`

OpenAnalysis remains local/BYOK. It does not operate a hosted proxy or bundle upstream data.

## Official documentation

- https://modelcontextprotocol.io/registry/quickstart
- https://registry.modelcontextprotocol.io/docs
- https://docs.npmjs.com/trusted-publishers/
