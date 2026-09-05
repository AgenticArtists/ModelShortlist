const DEFAULT_TIMEOUT_MS = 15000
const DEFAULT_ATTEMPTS = 3

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export async function fetchJson(url, options = {}) {
  const {
    timeoutMs = DEFAULT_TIMEOUT_MS,
    attempts = DEFAULT_ATTEMPTS,
    ...fetchOptions
  } = options

  let lastError
  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), timeoutMs)

    try {
      const response = await fetch(url, {
        ...fetchOptions,
        signal: controller.signal,
      })

      const text = await response.text()
      let body = null
      try {
        body = text ? JSON.parse(text) : null
      } catch {
        body = { raw: text.slice(0, 1000) }
      }

      if (response.ok) {
        return { body, headers: response.headers, status: response.status }
      }

      const retryable = response.status === 429 || response.status >= 500
      const message =
        body?.error ||
        body?.message ||
        `HTTP ${response.status} from ${new URL(url).hostname}`

      const error = new Error(message)
      error.status = response.status
      error.responseBody = body
      error.retryAfter = response.headers.get('retry-after')
      lastError = error

      if (!retryable || attempt === attempts) throw error

      const retryAfterMs = Number(error.retryAfter) * 1000
      const backoffMs = Number.isFinite(retryAfterMs) && retryAfterMs > 0
        ? Math.min(retryAfterMs, 10000)
        : 400 * (2 ** (attempt - 1))
      await sleep(backoffMs)
    } catch (error) {
      lastError = error
      if (attempt === attempts) throw error
      if (error?.status && error.status < 500 && error.status !== 429) throw error
      await sleep(400 * (2 ** (attempt - 1)))
    } finally {
      clearTimeout(timeout)
    }
  }

  throw lastError ?? new Error('Request failed')
}
