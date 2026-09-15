const DEFAULT_TIMEOUT_MS = 15000
const DEFAULT_ATTEMPTS = 3

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

function responseMessage(body, status, url) {
  const candidates = [
    body?.error?.message,
    typeof body?.error === 'string' ? body.error : null,
    body?.message,
  ]
  const message = candidates.find((value) => typeof value === 'string' && value.trim())
  return message?.trim() || `HTTP ${status} from ${new URL(url).hostname}`
}

function retryDelayMs(value, attempt) {
  if (value) {
    const seconds = Number(value)
    if (Number.isFinite(seconds) && seconds >= 0) {
      return Math.min(seconds * 1000, 10000)
    }

    const date = Date.parse(value)
    if (Number.isFinite(date)) {
      return Math.min(Math.max(0, date - Date.now()), 10000)
    }
  }

  return 400 * (2 ** (attempt - 1))
}

function normalizeTransportError(error, url, timeoutMs) {
  if (error?.name !== 'AbortError') return error
  const timeoutError = new Error(
    `Request to ${new URL(url).hostname} timed out after ${timeoutMs}ms`,
  )
  timeoutError.name = 'TimeoutError'
  timeoutError.code = 'ETIMEDOUT'
  return timeoutError
}

export async function fetchJson(url, options = {}) {
  const {
    timeoutMs = DEFAULT_TIMEOUT_MS,
    attempts = DEFAULT_ATTEMPTS,
    fetchImpl = fetch,
    sleepImpl = sleep,
    ...fetchOptions
  } = options

  if (!Number.isInteger(attempts) || attempts < 1) {
    throw new Error('fetchJson attempts must be a positive integer')
  }

  let lastError
  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), timeoutMs)

    try {
      const response = await fetchImpl(url, {
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
      const error = new Error(responseMessage(body, response.status, url))
      error.status = response.status
      error.responseBody = body
      error.retryAfter = response.headers.get('retry-after')
      lastError = error

      if (!retryable || attempt === attempts) throw error

      await sleepImpl(retryDelayMs(error.retryAfter, attempt))
      continue
    } catch (rawError) {
      const error = normalizeTransportError(rawError, url, timeoutMs)
      lastError = error
      if (attempt === attempts) throw error
      if (error?.status && error.status < 500 && error.status !== 429) throw error
      await sleepImpl(400 * (2 ** (attempt - 1)))
    } finally {
      clearTimeout(timeout)
    }
  }

  throw lastError ?? new Error('Request failed')
}
