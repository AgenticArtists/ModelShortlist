# Distribution roadmap

OpenAnalysis is currently distributed directly from GitHub as a local BYOK MCP server.

The next distribution milestone is to make installation and discovery native to the MCP ecosystem.

## Target

Publish OpenAnalysis as a public npm package and then list it in the Official MCP Registry.

This would enable installation without cloning the repository and make OpenAnalysis discoverable by MCP clients and downstream registries.

## Package preparation already complete

The repository is already prepared for eventual npm/MCP Registry distribution:

- stdio MCP executable exposed as the `openanalysis` package binary
- shebang added so the MCP server can run as an installed executable
- stable Official MCP Registry identity: `io.github.AgenticArtists/openanalysis`
- `mcpName` metadata already present in `package.json`
- controlled npm package file list
- `publishConfig.access` set to `public`
- CI validates the prospective npm package with `npm pack --dry-run`
- the package remains `private: true` so it cannot be accidentally published before an npm name is claimed

## Remaining publication work

1. Choose and claim the npm package name/namespace owned by AgenticArtists.
2. Update `package.json` package name if the chosen npm identifier differs from `openanalysis`.
3. Remove `private: true` only when ready to publish.
4. Publish the package publicly to npm.
5. Add `server.json` using the Official MCP Registry schema and the final npm identifier.
6. Authenticate to the Registry using the AgenticArtists GitHub identity.
7. Publish with `mcp-publisher`.
8. Configure npm trusted publishing using GitHub Actions/OIDC for future releases.

For npm packages, the Official Registry checks that `package.json#mcpName` exactly matches the Registry server name. OpenAnalysis already uses `io.github.AgenticArtists/openanalysis` for this purpose.

## Secrets exposed to the installed MCP server

The eventual Registry package metadata should declare these as required secret environment variables:

- `ARTIFICIAL_ANALYSIS_API_KEY`
- `OPENROUTER_API_KEY`

OpenAnalysis should remain local/BYOK. It should not operate a hosted proxy or bundle upstream data.

## Official documentation

- https://modelcontextprotocol.io/registry/quickstart
- https://github.com/modelcontextprotocol/registry/blob/main/docs/modelcontextprotocol-io/package-types.mdx
- https://docs.npmjs.com/trusted-publishers/

## Not required for the current MVP

Registry publication should not block user testing. The current GitHub clone + `npm run setup` flow is fully usable today.
