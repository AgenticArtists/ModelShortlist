# Use ModelShortlist as a local MCP tool

ModelShortlist runs locally as an MCP server. Nothing needs to be deployed and there is no hosted ModelShortlist backend.

Your MCP client launches `mcp/server.js`; ModelShortlist uses your own API keys to fetch the OpenRouter model catalog, optional ZDR endpoint metadata, and Artificial Analysis benchmark/performance data. The host chat model uses that evidence to recommend a model for your workload. ZDR is only an eligibility filter when you explicitly require it.

For the fastest client-specific setup, use the browser-only configurator at https://modelshortlist.com/install.

Requirements:

- Node.js 20+
- `ARTIFICIAL_ANALYSIS_API_KEY`
- `OPENROUTER_API_KEY`
- an MCP-capable client

## Recommended clone-based setup

### Windows

```powershell
git clone https://github.com/AgenticArtists/ModelShortlist.git
cd ModelShortlist
npm.cmd install
npm.cmd run setup
```

### macOS / Linux

```bash
git clone https://github.com/AgenticArtists/ModelShortlist.git
cd ModelShortlist
npm install
npm run setup
```

The setup command masks API-key input, writes the keys only to the gitignored `.env.local`, and prints ready-to-paste MCP JSON for Claude Desktop / Hermes Desktop / Cursor and VS Code / Copilot.

If PowerShell blocks `npm.ps1`, use `npm.cmd`; you do not need to change your execution policy.

Validate a clone:

```powershell
npm.cmd test
npm.cmd run check
```

## Claude Desktop

The easiest path is https://modelshortlist.com/install: choose **Claude Desktop**, paste your two upstream API keys, enable the Windows toggle if applicable, then copy the generated configuration.

In Claude Desktop, open **Settings → Developer → Edit Config** and add the `modelshortlist` entry to `claude_desktop_config.json`, then restart Claude Desktop.

For a clone-based setup, run `npm run setup` and copy the **Claude Desktop / Hermes Desktop / Cursor MCP config** that it prints. That configuration uses the exact absolute Node executable and server path from setup, avoiding many GUI PATH problems.

## Hermes Desktop

Use the install configurator or run `npm.cmd run setup` and copy the **Claude Desktop / Hermes Desktop / Cursor MCP config**.

In Hermes Desktop, open **Skills & Tools → MCP**, import that JSON, and save it.

## Claude Code

The repository contains a project-scoped `.mcp.json`. After clone-based setup, launch Claude Code from the ModelShortlist directory and use `/mcp` to verify the connection.

To register the cloned server at user scope:

```powershell
claude mcp add --transport stdio --scope user modelshortlist -- node "$PWD\mcp\server.js"
```

The install configurator can also generate an npm-based `claude mcp add` command that does not require cloning.

## Cursor

The setup command prints a Cursor-compatible configuration. Or create/update `.cursor/mcp.json` manually:

```json
{
  "mcpServers": {
    "modelshortlist": {
      "command": "node",
      "args": ["C:/FULL/PATH/TO/ModelShortlist/mcp/server.js"]
    }
  }
}
```

## VS Code + GitHub Copilot Chat

The setup command prints the VS Code format. Or create/update `.vscode/mcp.json` manually:

```json
{
  "servers": {
    "modelshortlist": {
      "type": "stdio",
      "command": "node",
      "args": ["C:/FULL/PATH/TO/ModelShortlist/mcp/server.js"]
    }
  }
}
```

Use Copilot Chat in an MCP/tool-capable agent mode.

## Generic npm stdio configuration

Most local MCP hosts can launch the published package directly without cloning:

```json
{
  "mcpServers": {
    "modelshortlist": {
      "command": "npx",
      "args": ["-y", "@agentic.artists/modelshortlist"],
      "env": {
        "ARTIFICIAL_ANALYSIS_API_KEY": "YOUR_KEY",
        "OPENROUTER_API_KEY": "YOUR_KEY"
      }
    }
  }
}
```

On Windows GUI clients, use `npx.cmd` if plain `npx` is not found.

## Generic clone-based stdio configuration

If you cloned the repository, most local MCP hosts need only:

```json
{
  "command": "node",
  "args": ["/absolute/path/to/ModelShortlist/mcp/server.js"]
}
```

The server loads `.env.local` from the ModelShortlist repository root automatically.

## Manual credential setup

If you prefer not to run the interactive setup command:

```powershell
Copy-Item .env.local.example .env.local
notepad .env.local
```

Put these values in `.env.local`:

```text
ARTIFICIAL_ANALYSIS_API_KEY=your_key_here
OPENROUTER_API_KEY=your_key_here
```

`.env.local` is gitignored. Do not commit it.

## Tools

A healthy server exposes exactly:

- `recommend_models`
- `compare_models`
- `modelshortlist_status`

### `recommend_models`

Returns workload-eligible candidates from the OpenRouter catalog. Artificial Analysis metrics are attached only when the model can be confidently reconciled. If ZDR is explicitly required, ModelShortlist evaluates current or explicitly marked stale cached endpoint evidence and requires all hard constraints to be satisfied on the same eligible endpoint.

### `compare_models`

Returns OpenRouter catalog information, ZDR availability, and Artificial Analysis benchmark information when available for specified OpenRouter model IDs.

### `modelshortlist_status`

Shows source freshness, OpenRouter/ZDR coverage, model-matching coverage, cache state, and Artificial Analysis rate-limit metadata.

## Freshness and degraded operation

Every tool response includes freshness metadata for the upstream evidence it depends on.

- `fresh`: the latest attempted refresh succeeded.
- `stale`: the latest refresh failed, so an earlier in-process copy is being used and the limitation is surfaced.
- `unavailable`: the source failed and there is no cached copy in the current process.

Artificial Analysis can degrade independently: OpenRouter models remain eligible with benchmark fields missing. OpenRouter ZDR data can also degrade independently for ordinary non-ZDR requests. The OpenRouter model catalog itself is foundational; if it is unavailable with no cached copy, or returns an empty catalog, ModelShortlist refuses to produce a shortlist.

For ZDR-required requests, unavailable ZDR evidence fails closed rather than being interpreted as “no models qualify.” Stale cached ZDR evidence is labeled as stale and must still be enforced/revalidated on the actual OpenRouter inference request.

## Manual process test

You normally should let the MCP host launch the process. For troubleshooting only:

```powershell
npm.cmd run mcp
```

A healthy server prints to stderr:

```text
ModelShortlist MCP server running on stdio
```

and then waits for MCP traffic. Press `Ctrl+C` to stop it before reconnecting from your MCP client.

For 401/403/429/5xx, timeout, PATH, schema, or freshness issues, see [`docs/TROUBLESHOOTING.md`](./docs/TROUBLESHOOTING.md).
