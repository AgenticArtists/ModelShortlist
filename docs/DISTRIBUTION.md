# Distribution roadmap

OpenAnalysis is currently distributed directly from GitHub as a local BYOK MCP server.

The next distribution milestone is npm + the Official MCP Registry.

## Final package identity

- npm package: `@agentic.artists/openanalysis`
- Official MCP Registry name: `io.github.AgenticArtists/openanalysis`

The npm organization is `agentic.artists`, so npm grants the matching `@agentic.artists` scope. The package name in `package.json` is now ready for first publication.

## Package preparation complete

The repository is prepared for npm/MCP Registry distribution:

- scoped npm package name: `@agentic.artists/openanalysis`
- stdio MCP executable exposed as the `openanalysis` package binary
- executable shebang on `mcp/server.js`
- stable Official MCP Registry identity: `io.github.AgenticArtists/openanalysis`
- matching `mcpName` metadata in `package.json`
- controlled npm package file list
- `publishConfig.access` set to `public`
- CI validates the prospective npm package with `npm pack --dry-run`
- `server.json` declares the npm package, stdio transport, and required secrets

## Remaining publication work

1. Confirm the logged-in npm user has permission to publish under the `agentic.artists` organization.
2. Publish version `0.2.0` publicly to npm.
3. Verify `npx @agentic.artists/openanalysis` resolves and launches the MCP process.
4. Authenticate to the Official MCP Registry using the AgenticArtists GitHub identity.
5. Validate and publish `server.json` with `mcp-publisher`.
6. Configure npm trusted publishing using GitHub Actions/OIDC for future releases.

## Required user-supplied secrets

- `ARTIFICIAL_ANALYSIS_API_KEY`
- `OPENROUTER_API_KEY`

OpenAnalysis remains local/BYOK. It does not operate a hosted proxy or bundle upstream data.

## Official documentation

- https://modelcontextprotocol.io/registry/quickstart
- https://registry.modelcontextprotocol.io/docs
- https://docs.npmjs.com/creating-and-publishing-an-organization-scoped-package/
- https://docs.npmjs.com/trusted-publishers/
