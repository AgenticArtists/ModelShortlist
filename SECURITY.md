# Security policy

## Reporting a vulnerability

Please do not open a public issue for a vulnerability that could expose API keys, execute unintended commands, or otherwise compromise a user's machine or data.

Instead, use GitHub's private vulnerability reporting for this repository if it is enabled. If private reporting is unavailable, contact the repository owner through the GitHub profile associated with AgenticArtists and include only the minimum information needed to reproduce the issue.

## Secrets

OpenAnalysis is designed for bring-your-own-key local use.

- Store real credentials only in `.env.local` or your MCP host's secret environment configuration.
- Never commit real API keys.
- `.env.local` and other `.env.*` files are gitignored, except the blank example template.
- If a key is accidentally committed or shared, rotate it immediately; deleting the file from the latest commit does not remove it from Git history.

## Scope

Security reports are especially useful for:

- credential leakage
- command or argument injection
- unsafe file access
- unintended network requests
- dependency or MCP protocol issues that materially affect users
