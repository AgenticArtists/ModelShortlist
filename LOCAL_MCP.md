# Use OpenAnalysis as a local MCP tool

OpenAnalysis runs locally as an MCP server. Nothing needs to be deployed.

Your MCP client launches `mcp/server.js`; OpenAnalysis fetches current OpenRouter ZDR endpoint data and Artificial Analysis data using your own API keys. The host chat model uses those facts to recommend a model for your workload.

## Recommended setup

### Windows

```powershell
git clone https://github.com/AgenticArtists/OpenAnalysis.git
cd OpenAnalysis
npm.cmd install
npm.cmd run setup
```

### macOS / Linux

```bash
git clone https://github.com/AgenticArtists/OpenAnalysis.git
cd OpenAnalysis
npm install
npm run setup
```

The setup command masks API-key input, writes the keys only to the gitignored `.env.local`, and prints ready-to-paste MCP JSON for Hermes Desktop / Cursor and VS Code / Copilot.

If PowerShell blocks `npm.ps1`, use `npm.cmd`; you do not need to change your execution policy.

Validate the install:

```powershell
npm.cmd test
npm.cmd run check
```

## Hermes Desktop

Run `npm.cmd run setup` and copy the **Hermes Desktop / Cursor MCP config** that it prints.

In Hermes Desktop, open **Skills & Tools → MCP**, import that JSON, and save it.

Hermes should discover:

- `recommend_models`
- `compare_models`
- `openanalysis_status`

Then ask normally:

> I need a model for a long-running autonomous coding loop. ZDR is mandatory. It needs tool calling and at least 100k context. Quality matters more than cost, but I care about value. What should I use?

## Claude Code

The repository contains a project-scoped `.mcp.json`. After setup, launch Claude Code from the OpenAnalysis directory:

```powershell
claude
```

Approve the MCP server if prompted and use `/mcp` to verify the connection.

To register it at user scope from the OpenAnalysis directory:

```powershell
claude mcp add --transport stdio --scope user openanalysis -- node "$PWD\mcp\server.js"
```

## Cursor

The setup command prints a Cursor-compatible configuration. Or create/update `.cursor/mcp.json` manually:

```json
{
  "mcpServers": {
    "openanalysis": {
      "command": "node",
      "args": ["C:/FULL/PATH/TO/OpenAnalysis/mcp/server.js"]
    }
  }
}
```

## VS Code + GitHub Copilot Chat

The setup command also prints the VS Code format. Or create/update `.vscode/mcp.json` manually:

```json
{
  "servers": {
    "openanalysis": {
      "type": "stdio",
      "command": "node",
      "args": ["C:/FULL/PATH/TO/OpenAnalysis/mcp/server.js"]
    }
  }
}
```

Use Copilot Chat in an MCP/tool-capable agent mode.

## Generic stdio MCP configuration

Most local MCP hosts need only:

```json
{
  "command": "node",
  "args": ["/absolute/path/to/OpenAnalysis/mcp/server.js"]
}
```

The server loads `.env.local` from the OpenAnalysis repository root automatically.

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

Returns current candidate models that satisfy the requested hard constraints and are confidently reconciled between OpenRouter ZDR data and Artificial Analysis data. The host model makes the final recommendation.

### `compare_models`

Returns current data for a shortlist of specific OpenRouter model IDs.

### `openanalysis_status`

Shows match coverage, ambiguous/unmatched records, cache state, and Artificial Analysis rate-limit metadata.

## Manual process test

You normally should let the MCP host launch the process. For troubleshooting only:

```powershell
npm.cmd run mcp
```

A healthy server prints to stderr:

```text
OpenAnalysis MCP server running on stdio
```

and then waits for MCP traffic. Press `Ctrl+C` to stop it before reconnecting from your MCP client.
