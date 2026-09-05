# OpenAnalysis

Private ZDR-aware AI model selection data for ChatGPT and other reasoning tools.

OpenAnalysis intersects **OpenRouter's current Zero Data Retention endpoints** with **Artificial Analysis Free** benchmark data. It does not hard-code a ranking formula. The service supplies current model facts; the reasoning model decides which tradeoffs matter for the workload you describe.

## Data sources

- OpenRouter: `GET https://openrouter.ai/api/v1/endpoints/zdr`
- Artificial Analysis Free: `GET https://artificialanalysis.ai/api/v2/language/models/free`

Artificial Analysis requires attribution and describes Free API use as internal use. This project is therefore private, requires its own access token, and emits `noindex`, `nofollow`, and `noarchive` headers. Do not turn it into a public data product without appropriate Artificial Analysis rights.

## What `/api/models` returns

For each confidently reconciled model:

- exact OpenRouter `model_id`
- current ZDR endpoint providers
- context and completion limits
- tool-use support
- endpoint-level OpenRouter pricing
- recent endpoint latency, throughput, and uptime
- Artificial Analysis Intelligence, Coding, and Agentic indices
- Artificial Analysis input/output pricing and median performance
- the model reconciliation method and confidence

Hard constraints are evaluated against a **single real ZDR provider endpoint**. A model does not qualify for `tools=true&min_context=100000`, for example, unless at least one ZDR endpoint satisfies both requirements.

The matcher deliberately does not fuzzy-match. Free Artificial Analysis data does not include `openrouter_api_id`, so uncertain matches remain unmatched until a manually verified alias is added to `config/aliases.json`.

## Vercel deployment

Import the private GitHub repository:

`AgenticArtists/OpenAnalysis`

Use Vercel's **Other** framework preset. Files under `/api` deploy as Vercel Functions.

Add these environment variables to Production:

```text
ARTIFICIAL_ANALYSIS_API_KEY=<your AA key>
OPENROUTER_API_KEY=<your OpenRouter key>
MODEL_SELECTOR_ACCESS_TOKEN=<long random token>
MODEL_SELECTOR_CACHE_TTL_MS=43200000
```

Add the first three to Preview as well if you want preview deployments to work.

The selector access token is intentionally separate from both upstream API keys. It is read-only and revocable. Never commit any real secret to this repository.

Generate a selector token locally with:

```powershell
python -c "import secrets; print(secrets.token_urlsafe(32))"
```

## Health check

After deployment:

```text
https://YOUR-PROJECT.vercel.app/api/health
```

A correctly configured deployment returns HTTP 200 with all three required environment variables shown as `true`. It never returns their values.

## Read the catalog

```text
https://YOUR-PROJECT.vercel.app/api/models?access=YOUR_SELECTOR_ACCESS_TOKEN
```

Useful filters:

```text
?access=TOKEN&tools=true
?access=TOKEN&tools=true&min_context=100000
?access=TOKEN&max_output_price=10
?access=TOKEN&creator=anthropic
?access=TOKEN&q=claude
?access=TOKEN&limit=25
```

Combine filters as needed:

```text
/api/models?access=TOKEN&tools=true&min_context=100000&max_output_price=15
```

Matching diagnostics:

```text
/api/models?access=TOKEN&diagnostics=true
```

Force a fresh upstream fetch:

```text
/api/models?access=TOKEN&refresh=true
```

Use `refresh=true` sparingly because Artificial Analysis Free has a daily API quota. The default in-process catalog TTL is 12 hours. Vercel serverless instance reuse is not guaranteed, so the cache is best-effort rather than durable.

## Example ChatGPT request

> Read this private model catalog: `https://YOUR-PROJECT.vercel.app/api/models?access=TOKEN&tools=true&min_context=100000`. I need a model for a long-running autonomous coding loop. ZDR is mandatory. Quality matters more than cost, but avoid frontier-premium pricing. Recommend one model and two alternatives. Use the Artificial Analysis coding/agentic/intelligence indices and the OpenRouter ZDR endpoint price, context, speed, latency, and uptime data. Explain the tradeoffs.

## Enforce ZDR during inference too

Catalog eligibility is not sufficient by itself. When actually calling the chosen model through OpenRouter, enforce ZDR on the request:

```json
{
  "provider": {
    "zdr": true,
    "require_parameters": true
  }
}
```

`require_parameters` prevents routing to a provider endpoint that does not support parameters present in your actual request, such as tools.

## Local validation

The project intentionally has no npm dependencies.

```powershell
npm test
npm run check
```

## Security model

- Upstream API keys exist only as Vercel environment variables.
- `.env` and `.env.local` are gitignored.
- `/api/models` requires a separate constant-time-compared access token.
- The endpoint is read-only.
- The selector token may appear in a URL because browser-based ChatGPT retrieval cannot attach your custom bearer header. Treat it as a revocable low-privilege secret and rotate it if exposed.
- `/api/health` reveals only whether secrets are configured, never their values.
