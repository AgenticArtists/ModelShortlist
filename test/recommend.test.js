import test from 'node:test'
import assert from 'node:assert/strict'
import {
  evidenceCoverageWarning,
  selectCandidates,
} from '../lib/recommend.js'

function catalogModel({
  id,
  name,
  author,
  matched = false,
  tools = true,
  context = 1_000_000,
  inputPrice = 1,
  outputPrice = 5,
  isAlias = false,
  aliasTarget = null,
}) {
  return {
    model_id: id,
    model_name: name ?? id,
    author: author ?? (id.includes('/') ? id.split('/')[0] : null),
    is_alias: isAlias,
    alias_target: aliasTarget,
    artificial_analysis: matched
      ? {
          name: name ?? id,
          slug: id.split('/').pop(),
          creator: author ?? null,
          evaluations: { intelligence_index: 50, coding_index: 50, agentic_index: 50 },
        }
      : null,
    reconciliation: matched
      ? { method: 'exact-normalized', confidence: 'high' }
      : { method: 'unmatched', confidence: 'none' },
    openrouter_catalog: {
      context_length: context,
      max_completion_tokens: 100_000,
      supports_tools: tools,
      supported_parameters: tools ? ['tools'] : [],
      pricing_usd_per_1m_tokens: { input: inputPrice, output: outputPrice },
      pricing_tiers_usd_per_1m_tokens: null,
    },
    zdr: false,
    zdr_endpoint_count: 0,
    zdr_providers: [],
    zdr_endpoint_options: [],
  }
}

function aliasModel(id, targetId, targetName) {
  return catalogModel({
    id,
    name: `${id} Latest`,
    isAlias: true,
    aliasTarget: { model_id: targetId, name: targetName },
  })
}

// The exact failure from the 2026-11-17 live run: ten "~...-latest" aliases
// filled a limit-10 shortlist because they sort before every concrete ID.
test('tilde aliases never fill a recommend shortlist', () => {
  const models = [
    aliasModel('~anthropic/claude-fable-latest', 'anthropic/claude-fable-5.2', 'Claude Fable 5.2'),
    aliasModel('~anthropic/claude-haiku-latest', 'anthropic/claude-haiku-5.5', 'Claude Haiku 5.5'),
    aliasModel('~anthropic/claude-opus-latest', 'anthropic/claude-opus-5.5', 'Claude Opus 5.5'),
    aliasModel('~anthropic/claude-sonnet-latest', 'anthropic/claude-sonnet-5.5', 'Claude Sonnet 5.5'),
    aliasModel('~deepseek/deepseek-flash-latest', 'deepseek/deepseek-v4.1-flash-1017', 'DeepSeek V4.1 Flash'),
    aliasModel('~google/gemini-flash-latest', 'google/gemini-4-hydrogen', 'Gemini 4 Hydrogen'),
    aliasModel('~google/gemini-pro-latest', 'google/gemini-4-carbon', 'Gemini 4 Carbon'),
    aliasModel('~moonshotai/kimi-latest', 'moonshotai/kimi-k3', 'Kimi K3'),
    catalogModel({ id: 'google/gemini-4-hydrogen', name: 'Gemini 4 Hydrogen', matched: true }),
    catalogModel({ id: 'openai/gpt-6-luna', name: 'GPT-6 Luna', matched: true }),
    catalogModel({ id: 'anthropic/claude-sonnet-5.5', name: 'Claude Sonnet 5.5', matched: true }),
  ]

  const { candidates } = selectCandidates(models, {
    use_case: 'coding subagents',
    requires_tools: true,
    limit: 10,
  })

  assert.ok(candidates.length > 0)
  assert.ok(candidates.every(({ model }) => !model.model_id.startsWith('~')))
  assert.ok(candidates.some(({ model }) => model.model_id === 'openai/gpt-6-luna'))
})

test('candidates are ordered evidence-first before the limit is applied', () => {
  const models = [
    catalogModel({ id: 'aion-labs/aion-2.0', name: 'Aion 2.0', matched: false }),
    catalogModel({ id: 'amazon/nova-2-lite-v1', name: 'Nova 2 Lite', matched: false }),
    catalogModel({ id: 'openai/gpt-6-luna', name: 'GPT-6 Luna', matched: true }),
  ]

  const { candidates } = selectCandidates(models, {
    use_case: 'coding',
    requires_tools: true,
    limit: 1,
  })

  assert.equal(candidates.length, 1)
  assert.equal(candidates[0].model.model_id, 'openai/gpt-6-luna')
})

test('hard constraints still apply to discovered candidates', () => {
  const models = [
    catalogModel({ id: 'vendor/no-tools', name: 'No Tools', matched: true, tools: false }),
    catalogModel({ id: 'vendor/has-tools', name: 'Has Tools', matched: true, tools: true }),
  ]

  const { candidates } = selectCandidates(models, {
    use_case: 'tool use',
    requires_tools: true,
    limit: 10,
  })

  assert.deepEqual(
    candidates.map(({ model }) => model.model_id),
    ['vendor/has-tools'],
  )
})

test('an incumbent is guaranteed a slot even outside the limit slice', () => {
  const models = [
    catalogModel({ id: 'aion-labs/aion-2.0', name: 'Aion 2.0', matched: true }),
    catalogModel({ id: 'amazon/nova-2-lite-v1', name: 'Nova 2 Lite', matched: true }),
    catalogModel({ id: 'openai/gpt-6-luna', name: 'GPT-6 Luna', matched: true }),
  ]

  const { candidates, incumbent_status } = selectCandidates(models, {
    use_case: 'replace the incumbent',
    requires_tools: true,
    limit: 1,
    incumbent_model_ids: ['openai/gpt-6-luna'],
  })

  assert.deepEqual(incumbent_status, [{
    requested_id: 'openai/gpt-6-luna',
    resolved_model_id: 'openai/gpt-6-luna',
    status: 'included',
  }])
  const incumbent = candidates.find(({ model }) => model.model_id === 'openai/gpt-6-luna')
  assert.ok(incumbent)
  assert.equal(incumbent.is_incumbent, true)
})

test('an incumbent named by alias resolves to its concrete target', () => {
  const models = [
    aliasModel('~openai/gpt-luna-latest', 'openai/gpt-6-luna', 'GPT-6 Luna'),
    catalogModel({ id: 'openai/gpt-6-luna', name: 'GPT-6 Luna', matched: true }),
    catalogModel({ id: 'aion-labs/aion-2.0', name: 'Aion 2.0', matched: true }),
  ]

  const { candidates, incumbent_status } = selectCandidates(models, {
    use_case: 'replace the incumbent',
    requires_tools: true,
    limit: 1,
    incumbent_model_ids: ['~openai/gpt-luna-latest'],
  })

  assert.deepEqual(incumbent_status, [{
    requested_id: '~openai/gpt-luna-latest',
    resolved_model_id: 'openai/gpt-6-luna',
    status: 'included',
  }])
  assert.ok(candidates.some(({ model }) => model.model_id === 'openai/gpt-6-luna'))
  assert.ok(candidates.every(({ model }) => !model.model_id.startsWith('~')))
})

test('incumbent outcomes are reported for missing and constraint-excluded IDs', () => {
  const models = [
    catalogModel({ id: 'vendor/no-tools', name: 'No Tools', matched: true, tools: false }),
    catalogModel({ id: 'vendor/has-tools', name: 'Has Tools', matched: true, tools: true }),
  ]

  const { candidates, incumbent_status } = selectCandidates(models, {
    use_case: 'tool use',
    requires_tools: true,
    limit: 10,
    incumbent_model_ids: ['vendor/no-tools', 'vendor/does-not-exist'],
  })

  assert.deepEqual(incumbent_status, [
    {
      requested_id: 'vendor/no-tools',
      resolved_model_id: 'vendor/no-tools',
      status: 'excluded_by_constraints',
    },
    {
      requested_id: 'vendor/does-not-exist',
      resolved_model_id: null,
      status: 'not_found',
    },
  ])
  assert.ok(candidates.every(({ model }) => model.model_id !== 'vendor/no-tools'))
})

test('evidence coverage counts matched candidates and warns when none match', () => {
  const unmatched = [
    catalogModel({ id: 'vendor/a', name: 'A', matched: false }),
    catalogModel({ id: 'vendor/b', name: 'B', matched: false }),
  ]
  const noneMatched = selectCandidates(unmatched, { use_case: 'x', limit: 10 })
  assert.deepEqual(noneMatched.evidence_coverage, {
    candidate_count: 2,
    aa_matched_candidate_count: 0,
    aa_coverage_ratio: 0,
  })
  assert.match(evidenceCoverageWarning(noneMatched.evidence_coverage), /None of the 2 returned candidates/)

  const mixed = [
    catalogModel({ id: 'vendor/a', name: 'A', matched: true }),
    catalogModel({ id: 'vendor/b', name: 'B', matched: false }),
    catalogModel({ id: 'vendor/c', name: 'C', matched: true }),
    catalogModel({ id: 'vendor/d', name: 'D', matched: true }),
  ]
  const mostlyMatched = selectCandidates(mixed, { use_case: 'x', limit: 10 })
  assert.deepEqual(mostlyMatched.evidence_coverage, {
    candidate_count: 4,
    aa_matched_candidate_count: 3,
    aa_coverage_ratio: 0.75,
  })
  assert.equal(evidenceCoverageWarning(mostlyMatched.evidence_coverage), null)
})
