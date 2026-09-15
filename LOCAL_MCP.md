# Use ModelShortlist as a local MCP tool

ModelShortlist runs locally as an MCP server. Nothing needs to be deployed.

Your MCP client launches `mcp/server.js`; ModelShortlist fetches the current OpenRouter model catalog, current ZDR endpoint metadata, and Artificial Analysis data using your own API keys. The host chat model uses those facts to recommend a model for your workload. ZDR is only used as an eligibility filter when you explicitly require it.

For the fastest client-specific setup, use the browser-only configurator at https://modelshortlist.com/install.

## Recommended setup

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

Validate the install:

```powershell
npm.cmd test
npm.cmd run check
```

## Claude Desktop

The same `mcpServers` configuration used by Hermes Desktop and Cursor is compatible with Claude Desktop.

The easiest path is https://modelshortlist.com/install: choose **Claude Desktop**, paste your two upstream API keys, enable the Windows toggle if applicable, then copy the generated configuration.

In Claude Desktop, open **Settings → Developer → Edit Config** and add the `modelshortlist` entry to `claude_desktop_config.json`, then restart Claude Desktop.

For a clone-based setup, run `npm run setup` and copy the **Claude Desktop / Hermes Desktop / Cursor MCP config** that it prints. That version uses an absolute Node executable and server path, which avoids many GUI PATH problems.

Claude Desktop should discover:

- `recommend_models`
- `compare_models`
- `modelshortlist_status`

## Hermes Desktop

Run `npm.cmd run setup` and copy the **Claude Desktop / Hermes Desktop / Cursor MCP config** that it prints.

In Hermes Desktop, open **Skills & Tools → MCP**, import that JSON, and save it.

Hermes should discover:

- `recommend_models`
- `compare_models`
- `modelshortlist_status`

Then ask normally:

> I need a model for a long-running autonomous coding loop. It needs tool calling and at least 100k context. Quality matters more than cost, but I care about value. What should I use?

If you need Zero Data Retention, state it explicitly:

> Same workload, but ZDR is mandatory.

## Claude Code

The repository contains a project-scoped `.mcp.json`. After setup, launch Claude Code from the ModelShortlist directory:

```powershell
claude
```

Approve the MCP server if prompted and use `/mcp` to verify the connection.

To register it at user scope from the ModelShortlist directory:

```powershell
claude mcp add --transport stdio --scope user modelshortlist -- node "$PWD\mcp\server.js"
```

The install configurator can also generate an npm-based `claude mcp add` command that does not require cloning the repository.

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

The setup command also prints the VS Code format. Or create/update `.vscode/mcp.json` manually:

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

### `recommend_models`

Returns current candidates from the full OpenRouter catalog that satisfy the requested hard constraints. Artificial Analysis metrics are attached when the model can be confidently matched. If the user explicitly requires ZDR, ModelShortlist switches to current ZDR endpoint-level filtering and requires all hard constraints to be satisfied on the same eligible endpoint.

### `compare_models`

Returns current OpenRouter catalog data, ZDR availability, and Artificial Analysis benchmark data when available for a shortlist of specific OpenRouter model IDs.

### `modelshortlist_status`

Shows OpenRouter catalog coverage, ZDR coverage, model matching coverage, cache state, and Artificial Analysis rate-limit metadata.

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
