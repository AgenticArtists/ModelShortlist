import type { Metadata } from 'next'
import UseCaseLanding from '@/components/UseCaseLanding'

const URL = 'https://modelshortlist.com/models-under-10-per-million-output'

export const metadata: Metadata = {
  title: 'Best AI Models Under $10 per Million Output Tokens',
  description: 'Shortlist capable AI models under a $10 per million output-token ceiling using current OpenRouter pricing plus benchmark and capability evidence.',
  alternates: { canonical: URL },
  openGraph: {
    url: URL,
    title: 'Best AI Models Under $10 / 1M Output Tokens | ModelShortlist',
    description: 'Apply a real output-price ceiling first, then compare the capable models that remain.',
  },
}

export default function ModelsUnderTenPage() {
  return (
    <UseCaseLanding
      eyebrow="AI models under $10 / 1M output tokens"
      title="Set the budget first."
      gradientTitle="Then find the strongest model that survives it."
      description="A hard output-price ceiling is more useful than a vague request for a “cheap model.” ModelShortlist can filter current OpenRouter pricing first, then let the host AI compare capability and benchmark evidence among eligible models."
      intro="Budget-constrained model selection should fail closed on the constraint rather than recommending an attractive model that only looks cheap at one pricing tier or provider. Once the ceiling is enforced, the remaining decision depends on workload quality, tools, context, and how much model performance you are willing to trade for lower cost."
      decisionFactors={[
        'Current output-token pricing across applicable pricing tiers rather than a stale published estimate.',
        'Minimum context and tool requirements so the cheapest model is still operationally usable.',
        'Artificial Analysis quality evidence where the model identity matches confidently.',
        'Whether the workload is high-volume enough that small token-price differences dominate the economics.',
      ]}
      prompts={[
        'I need the strongest current coding model under $10 per million output tokens, with tool calling and at least 100k context.',
        'What is the best-value model for this workload if $5 per million output tokens is a hard ceiling?',
        'Compare the eligible models under my output-price ceiling and tell me what quality I give up versus the unrestricted shortlist.',
      ]}
      whyModelShortlist={[
        'Uses current OpenRouter pricing instead of a static cost table.',
        'Applies price ceilings conservatively across tiered pricing rather than accepting a model whose higher tier exceeds the limit.',
        'Keeps capability and context constraints hard while letting the host AI reason about softer quality-versus-cost tradeoffs.',
        'Adds Artificial Analysis evidence when available so “cheap” does not become a synonym for “good enough” without evidence.',
      ]}
    />
  )
}
