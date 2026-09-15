# Troubleshooting ModelShortlist

ModelShortlist is a local stdio MCP. There is no hosted ModelShortlist backend to log into or restart.

## First checks

1. Confirm Node.js 20 or newer: `node --version`.
2. Confirm both required environment variables are configured in the MCP host:
   - `ARTIFICIAL_ANALYSIS_API_KEY`
   - `OPENROUTER_API_KEY`
3. On Windows GUI clients, prefer `npx.cmd` rather than `npx` when using the published package.
4. Restart or refresh the MCP client after changing configuration.
5. Ask the client to call `modelshortlist_status`.

For clone-based installs, `npm run setup` (`npm.cmd run setup` on Windows) writes credentials only to the gitignored `.env.local` file and prints absolute-path client configuration.

## What freshness means

`recommend_models`, `compare_models`, and `modelshortlist_status` expose source-level freshness metadata.

- `fresh`: the latest attempted refresh for that source succeeded.
- `stale`: a refresh failed, but ModelShortlist has an earlier in-process copy and is using it with an explicit warning.
- `unavailable`: the source failed and there is no cached copy in the current process.

A degraded response includes warnings. The host model must not describe stale pricing, availability, context, capability, ZDR, or benchmark evidence as current without the caveat.

Artificial Analysis is supplementary evidence. If it is unavailable, OpenRouter models remain eligible and benchmark fields stay missing rather than being treated as zero or poor performance.

The OpenRouter model catalog is foundational. If it is unavailable with no cache, or returns an empty catalog, ModelShortlist refuses to produce a shortlist.

ZDR endpoint evidence is required only when the user explicitly requires ZDR. If ZDR is required and endpoint evidence is unavailable with no cached copy, ModelShortlist fails closed rather than claiming no models qualify. If cached ZDR evidence is stale, that limitation is surfaced and ZDR must still be enforced/revalidated on the actual OpenRouter inference request.

## Common upstream errors

### HTTP 401

Authentication failed. Verify the corresponding API key and make sure the MCP client actually passes it to the local process.

### HTTP 403

The credential was accepted but the requested upstream resource is forbidden for that account/tier. Check upstream account/API access rather than regenerating client configuration blindly.

### HTTP 429

The upstream service is rate limiting requests. ModelShortlist retries retryable requests with bounded backoff. Avoid unnecessary `force_refresh=true` calls, especially against quota-limited APIs.

### HTTP 5xx or network failure

ModelShortlist retries transient failures. If an earlier successful fetch exists in the same running process, that source may be used as explicitly stale fallback data. Otherwise required evidence fails closed and optional evidence is marked unavailable.

### Timeout

The upstream request exceeded ModelShortlist's request timeout after retries. Check local network/VPN/firewall conditions and the upstream service status.

### Unexpected or malformed response

ModelShortlist validates the response shapes it depends on. A successful HTTP response with malformed JSON or an unexpected schema is treated as an upstream/data-contract failure rather than silently converted into model facts.

## Client-specific issues

### Windows: `npx` or `npm.ps1` not found / blocked

Use `npx.cmd` for npm-based MCP configuration and `npm.cmd` for clone-based setup. You should not need to relax PowerShell execution policy.

### GUI client cannot find Node

Use the clone-based setup flow. It prints configuration containing the exact absolute Node executable path used to run setup, avoiding reliance on the GUI application's PATH.

### Tools do not appear

A healthy installation exposes exactly these MCP tools:

- `recommend_models`
- `compare_models`
- `modelshortlist_status`

Confirm the MCP configuration shape expected by your client, restart/refresh the client, then inspect its MCP/server logs for process-launch errors.

## Privacy checks

- API keys should exist only in the MCP host environment/secret configuration or clone-based `.env.local`.
- Do not put keys in prompts, issues, screenshots, shell history, or committed files.
- The website install configurator uses entered keys in-browser only to generate configuration text.
- The MCP has no ModelShortlist telemetry and sends requests only to the configured upstream data services needed for its read-only tools.
