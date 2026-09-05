# Use OpenAnalysis as a local chat tool

This is the recommended way to use OpenAnalysis. Nothing needs to be deployed.

OpenAnalysis runs as a local **MCP server**. An MCP-capable chat client launches it on your computer, OpenAnalysis fetches current OpenRouter ZDR endpoint data plus Artificial Analysis Free data, and the chat model uses those facts to recommend a model for your workload.

## One-time setup on Windows

Clone the repo and install the two MCP dependencies:

```powershell
git clone https://github.com/AgenticArtists/OpenAnalysis.git
cd OpenAnalysis
npm install
Copy-Item .env.local.example .env.local
notepad .env.local
```

Put only these two real values in `.env.local`:

```text
ARTIFICIAL_ANALYSIS_API_KEY=...
OPENROUTER_API_KEY=...
```

`.env.local` is gitignored. Do not commit it.

Test the server:

```powershell
npm run mcp
```

A working server prints this to stderr and then waits for an MCP client:

```text
OpenAnalysis MCP server running on stdio
```

Press `Ctrl+C` after the test.

## Claude Code: easiest option

The repository already contains a project-scoped `.mcp.json`. After the one-time setup above, launch Claude Code from the `OpenAnalysis` folder:

```powershell
claude
```

Approve the project MCP server when prompted. Then run `/mcp`; `openanalysis` should be connected and expose:

- `recommend_models`
- `compare_models`
- `openanalysis_status`

Then just chat normally:

> I need a model for a long-running autonomous coding loop. ZDR is mandatory. It needs tool calling and at least 100k context. Quality matters more than cost, but I don't want frontier-premium pricing. What should I use?

Claude should invoke `recommend_models` automatically and answer from current data.

### Make it available across Claude Code projects

From the `OpenAnalysis` directory, you can also register it at user scope:

```powershell
claude mcp add --transport stdio --scope user openanalysis -- node "$PWD\mcp\server.js"
```

Then verify:

```powershell
claude mcp list
```

If user-scope MCP registration behaves inconsistently in your installed Claude Code version, use the checked-in `.mcp.json` from the OpenAnalysis project or register the server in the individual project where you want it.

## VS Code + GitHub Copilot Chat

Create `.vscode/mcp.json` in the workspace where you want OpenAnalysis available:

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

Use Copilot Chat in Agent mode. It can call the OpenAnalysis tools automatically.

## Cursor

Create `.cursor/mcp.json`:

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

## ChatGPT

A local MCP server is not directly usable from normal ChatGPT web Chat. ChatGPT's custom MCP/developer-mode availability is plan/workspace dependent; on a personal Plus account, the practical local path is Codex/another MCP host rather than ordinary ChatGPT web.

If you later want OpenAnalysis in ChatGPT itself, keep this same MCP tool surface and add a supported remote/private transport or package it for the current plugin/app workflow. The core selection logic does not need to change.

## Tools

### `recommend_models`

The primary tool. It accepts the workload plus hard constraints such as:

- tool calling required
- minimum context
- maximum input/output price
- creator/model filter

It returns only models that are both:

1. currently available through a ZDR OpenRouter endpoint satisfying the hard constraints; and
2. confidently matched to Artificial Analysis Free data.

The chat model then makes the recommendation using the use case rather than a universal fixed score.

### `compare_models`

Retrieves current data for specific OpenRouter model IDs after a shortlist exists.

### `openanalysis_status`

Shows match coverage, ambiguous/unmatched records, cache state, and AA rate-limit metadata.
