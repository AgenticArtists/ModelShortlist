# Distribution roadmap

OpenAnalysis is currently distributed directly from GitHub as a local BYOK MCP server.

The next distribution milestone is to make installation and discovery native to the MCP ecosystem.

## Target

Publish OpenAnalysis as a public npm package and then list it in the Official MCP Registry.

This would enable installation without cloning the repository and make OpenAnalysis discoverable by MCP clients and downstream registries.

## Proposed package shape

- Public npm package, preferably under a stable AgenticArtists-owned namespace.
- stdio transport.
- Two required user-supplied secrets:
  - `ARTIFICIAL_ANALYSIS_API_KEY`
  - `OPENROUTER_API_KEY`
- No hosted OpenAnalysis backend.
- No bundled or redistributed Artificial Analysis dataset.

## Official MCP Registry requirements

The Official MCP Registry stores metadata, not package artifacts. A local stdio server therefore needs a publicly installable package such as npm before Registry publication.

Expected publication work:

1. Choose and claim the npm package name/namespace.
2. Add the package executable/bin entry and remove `private: true` only when ready to publish.
3. Add the Registry `mcpName` package metadata.
4. Publish the npm package publicly.
5. Add a `server.json` using the Official MCP Registry schema.
6. Authenticate to the Registry using the AgenticArtists GitHub identity.
7. Publish with `mcp-publisher`.
8. After the initial package exists, configure npm trusted publishing with GitHub Actions/OIDC so future releases do not require long-lived npm tokens.

Official documentation:

- https://modelcontextprotocol.io/registry/quickstart
- https://modelcontextprotocol.io/registry/github-actions
- https://docs.npmjs.com/trusted-publishers/

## Not required for the current MVP

Registry publication should not block user testing. The current GitHub clone + `npm run setup` flow is fully usable today.
