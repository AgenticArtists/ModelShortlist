# Contributing to OpenAnalysis

Contributions are welcome, especially improvements to model reconciliation, MCP client compatibility, tests, and installation UX.

## Development setup

```powershell
git clone https://github.com/AgenticArtists/OpenAnalysis.git
cd OpenAnalysis
npm.cmd install
Copy-Item .env.local.example .env.local
```

Add your own API keys to `.env.local` only if you need live upstream testing. Never commit credentials.

Run the local checks before opening a pull request:

```powershell
npm.cmd test
npm.cmd run check
```

## Model aliases

Artificial Analysis Free data does not expose an OpenRouter model ID. `config/aliases.json` is therefore intentionally conservative.

Only add an alias when you can verify that the OpenRouter model and Artificial Analysis record refer to the same model/version. Do not add fuzzy or speculative aliases just to increase match coverage.

## Pull requests

Keep changes focused and explain:

- what problem the change solves
- how it was tested
- whether it changes upstream API usage or licensing/attribution behavior
- whether it changes the MCP tool contract

New behavior should include tests when practical.
