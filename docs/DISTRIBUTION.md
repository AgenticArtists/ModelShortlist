# Distribution roadmap

ModelShortlist is the successor name for the project originally released as OpenAnalysis. The old npm package was published before the rename; the Official MCP Registry was not.

## Final identities

- Website: `https://modelshortlist.com`
- GitHub repository: `AgenticArtists/ModelShortlist`
- npm package: `@agentic.artists/modelshortlist`
- npm executable: `modelshortlist`
- Official MCP Registry name: `io.github.AgenticArtists/modelshortlist`

## Completed

- local/BYOK stdio MCP implementation
- public GitHub repository and MIT license
- scoped npm organization access
- Windows and Linux packaged-executable smoke tests
- ModelShortlist package metadata and executable entry point
- ModelShortlist MCP server identity and client config naming
- ModelShortlist Official MCP Registry manifest
- controlled npm package file list
- `publishConfig.access` set to `public`
- CI validates the prospective npm package with `npm pack --dry-run`
- `server.json` declares the npm package, stdio transport, required secrets, website, and repository
- `modelshortlist.com` acquired as the canonical domain

## Remaining migration/publication work

1. Rename the GitHub repository from `OpenAnalysis` to `ModelShortlist`.
2. Pull the renamed repository locally and verify `npm.cmd ci`, tests, syntax checks, and `npm.cmd run pack:check`.
3. Publish `@agentic.artists/modelshortlist@0.2.1` to npm.
4. Verify the installed Windows executable with a clean local install and `modelshortlist.cmd`.
5. Run `mcp-publisher validate` against the ModelShortlist `server.json`.
6. Authenticate to the Official MCP Registry using the AgenticArtists GitHub identity.
7. Publish `io.github.AgenticArtists/modelshortlist@0.2.1` to the Official MCP Registry.
8. Verify the public Registry listing.
9. Deprecate the historical `@agentic.artists/openanalysis` npm package with a message pointing users to `@agentic.artists/modelshortlist`.
10. Configure npm trusted publishing using GitHub Actions/OIDC for future releases.
11. Submit to downstream directories after the Official Registry listing exists.

## Required user-supplied secrets

- `ARTIFICIAL_ANALYSIS_API_KEY`
- `OPENROUTER_API_KEY`

ModelShortlist remains local/BYOK. It does not operate a hosted proxy or bundle upstream data.

## Official documentation

- https://modelcontextprotocol.io/registry/quickstart
- https://registry.modelcontextprotocol.io/docs
- https://docs.npmjs.com/trusted-publishers/
