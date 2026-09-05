import test from 'node:test'
import assert from 'node:assert/strict'
import { matchModels, normalizeModelLabel } from '../lib/match.js'

test('normalization ignores punctuation and spacing', () => {
  assert.equal(
    normalizeModelLabel('Claude Sonnet 4.6'),
    normalizeModelLabel('claude-sonnet-4-6'),
  )
})

test('matches OpenRouter model_name to AA name exactly after normalization', () => {
  const orModels = [{
    model_id: 'anthropic/claude-sonnet-4.6',
    model_name: 'Claude Sonnet 4.6',
  }]
  const aaModels = [{
    id: 'aa-1',
    slug: 'claude-sonnet-4-6',
    name: 'Claude Sonnet 4.6',
    creator: 'Anthropic',
  }]

  const result = matchModels(orModels, aaModels, {})
  assert.equal(result.matches.length, 1)
  assert.equal(result.matches[0].aa.id, 'aa-1')
  assert.equal(result.matches[0].match.method, 'exact-normalized')
})

test('does not fuzzy-match a different model variant', () => {
  const orModels = [{
    model_id: 'provider/model-4.1-mini',
    model_name: 'Model 4.1 Mini',
  }]
  const aaModels = [{
    id: 'aa-1',
    slug: 'model-4-1',
    name: 'Model 4.1',
    creator: 'Provider',
  }]

  const result = matchModels(orModels, aaModels, {})
  assert.equal(result.matches.length, 0)
  assert.equal(result.unmatched.length, 1)
})

test('verified alias overrides normal matching', () => {
  const orModels = [{
    model_id: 'vendor/odd-name',
    model_name: 'Odd Name',
  }]
  const aaModels = [{
    id: 'aa-1',
    slug: 'canonical-aa-slug',
    name: 'Canonical Model',
    creator: 'Vendor',
  }]

  const result = matchModels(orModels, aaModels, {
    'vendor/odd-name': 'canonical-aa-slug',
  })
  assert.equal(result.matches.length, 1)
  assert.equal(result.matches[0].match.method, 'alias')
})
