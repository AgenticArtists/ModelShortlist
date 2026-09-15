import test from 'node:test'
import assert from 'node:assert/strict'
import { fetchJson } from '../lib/http.js'

const URL = 'https://example.test/data'
const noSleep = async () => {}

test('does not retry HTTP 401 and preserves a useful nested error message', async () => {
  let calls = 0
  const fetchImpl = async () => {
    calls += 1
    return new Response(JSON.stringify({ error: { message: 'Invalid API key' } }), {
      status: 401,
      headers: { 'content-type': 'application/json' },
    })
  }

  await assert.rejects(
    fetchJson(URL, { fetchImpl, sleepImpl: noSleep }),
    (error) => error.status === 401 && error.message === 'Invalid API key',
  )
  assert.equal(calls, 1)
})

test('does not retry HTTP 403', async () => {
  let calls = 0
  const fetchImpl = async () => {
    calls += 1
    return new Response(JSON.stringify({ message: 'Forbidden' }), { status: 403 })
  }

  await assert.rejects(fetchJson(URL, { fetchImpl, sleepImpl: noSleep }), /Forbidden/)
  assert.equal(calls, 1)
})

test('retries HTTP 429 and then succeeds', async () => {
  let calls = 0
  const fetchImpl = async () => {
    calls += 1
    if (calls === 1) {
      return new Response(JSON.stringify({ message: 'Slow down' }), {
        status: 429,
        headers: { 'retry-after': '0' },
      })
    }
    return new Response(JSON.stringify({ ok: true }), { status: 200 })
  }

  const result = await fetchJson(URL, { fetchImpl, sleepImpl: noSleep })
  assert.equal(calls, 2)
  assert.deepEqual(result.body, { ok: true })
})

test('retries HTTP 5xx and then succeeds', async () => {
  let calls = 0
  const fetchImpl = async () => {
    calls += 1
    if (calls < 3) return new Response('temporary', { status: 503 })
    return new Response(JSON.stringify({ ok: true }), { status: 200 })
  }

  const result = await fetchJson(URL, { fetchImpl, sleepImpl: noSleep })
  assert.equal(calls, 3)
  assert.deepEqual(result.body, { ok: true })
})

test('retries network errors', async () => {
  let calls = 0
  const fetchImpl = async () => {
    calls += 1
    if (calls === 1) throw new TypeError('fetch failed')
    return new Response(JSON.stringify({ ok: true }), { status: 200 })
  }

  const result = await fetchJson(URL, { fetchImpl, sleepImpl: noSleep })
  assert.equal(calls, 2)
  assert.deepEqual(result.body, { ok: true })
})

test('reports timeout failures without exposing request headers', async () => {
  const fetchImpl = async () => {
    const error = new Error('aborted')
    error.name = 'AbortError'
    throw error
  }

  await assert.rejects(
    fetchJson(URL, {
      fetchImpl,
      sleepImpl: noSleep,
      attempts: 1,
      timeoutMs: 25,
      headers: { authorization: 'Bearer super-secret' },
    }),
    (error) => error.name === 'TimeoutError' &&
      error.message === 'Request to example.test timed out after 25ms' &&
      !error.message.includes('super-secret'),
  )
})

test('returns malformed successful JSON as bounded raw data for schema validation upstream', async () => {
  const fetchImpl = async () => new Response('{not-json', { status: 200 })
  const result = await fetchJson(URL, { fetchImpl, sleepImpl: noSleep })

  assert.deepEqual(result.body, { raw: '{not-json' })
})
