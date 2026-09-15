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

test('does not fuzzy-match mini to the base model', () => {
  const result = matchModels([
    { model_id: 'provider/model-4.1-mini', model_name: 'Model 4.1 Mini' },
  ], [
    { id: 'aa-1', slug: 'model-4-1', name: 'Model 4.1', creator: 'Provider' },
  ], {})

  assert.equal(result.matches.length, 0)
  assert.equal(result.unmatched.length, 1)
})

test('does not collapse pro, small, or thinking variants into a family match', () => {
  const orModels = [
    { model_id: 'provider/model-x-pro', model_name: 'Model X Pro' },
    { model_id: 'provider/model-x-small', model_name: 'Model X Small' },
    { model_id: 'provider/model-x-thinking', model_name: 'Model X Thinking' },
  ]
  const aaModels = [
    { id: 'aa-base', slug: 'model-x', name: 'Model X', creator: 'Provider' },
  ]

  const result = matchModels(orModels, aaModels, {})
  assert.equal(result.matches.length, 0)
  assert.equal(result.unmatched.length, 3)
})

test('does not attach stable benchmark data to a preview variant', () => {
  const result = matchModels([
    { model_id: 'provider/model-x-preview', model_name: 'Model X Preview' },
  ], [
    { id: 'aa-stable', slug: 'model-x', name: 'Model X', creator: 'Provider' },
  ], {})

  assert.equal(result.matches.length, 0)
  assert.equal(result.unmatched.length, 1)
})

test('does not attach an undated benchmark record to a dated release', () => {
  const result = matchModels([
    { model_id: 'provider/model-x-2026-09-01', model_name: 'Model X 2026-09-01' },
  ], [
    { id: 'aa-undated', slug: 'model-x', name: 'Model X', creator: 'Provider' },
  ], {})

  assert.equal(result.matches.length, 0)
  assert.equal(result.unmatched.length, 1)
})

test('treats duplicate normalized AA names as ambiguous rather than choosing a creator', () => {
  const result = matchModels([
    { model_id: 'provider/model-x', model_name: 'Model X' },
  ], [
    { id: 'aa-1', slug: 'vendor-one-model-x', name: 'Model X', creator: 'Vendor One' },
    { id: 'aa-2', slug: 'vendor-two-model-x', name: 'Model X', creator: 'Vendor Two' },
  ], {})

  assert.equal(result.matches.length, 0)
  assert.equal(result.ambiguous.length, 1)
  assert.deepEqual(
    result.ambiguous[0].candidates.map((candidate) => candidate.id).sort(),
    ['aa-1', 'aa-2'],
  )
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

test('a broken verified alias fails closed instead of falling back to a guessed match', () => {
  const result = matchModels([
    { model_id: 'vendor/model-x', model_name: 'Model X' },
  ], [
    { id: 'aa-1', slug: 'model-x', name: 'Model X', creator: 'Vendor' },
  ], {
    'vendor/model-x': 'missing-aa-slug',
  })

  assert.equal(result.matches.length, 0)
  assert.equal(result.unmatched.length, 1)
  assert.match(result.unmatched[0].reason, /Alias points to missing AA slug/)
})
