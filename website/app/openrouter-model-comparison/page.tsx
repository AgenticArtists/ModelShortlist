import type { Metadata } from 'next'
import UseCaseLanding from '@/components/UseCaseLanding'

const URL = 'https://modelshortlist.com/openrouter-model-comparison'

export const metadata: Metadata = {
  title: 'OpenRouter Model Comparison for Real Workloads',
  description: 'Compare OpenRouter models using current context, capabilities, pricing, provider facts, optional ZDR evidence, and Artificial Analysis benchmarks.',
  alternates: { canonical: URL },
  openGraph: {
    url: URL,
    title: 'OpenRouter Model Comparison | ModelShortlist',
    description: 'Compare current OpenRouter model facts in the context of the workload you actually need to run.',
  },
}

export default function OpenRouterModelComparisonPage() {
  return (
    <UseCaseLanding
      eyebrow="OpenRouter model comparison"
      title="Compare OpenRouter models by"
      gradientTitle="the constraints that actually matter."
      description="OpenRouter exposes a broad and fast-moving model market. ModelShortlist helps your AI assistant narrow that market using current context, supported parameters, pricing, provider facts, optional ZDR evidence, and independent Artificial Analysis performance context."
      intro="A useful OpenRouter comparison starts with the workload, not with a fixed list of popular models. Decide which requirements are hard constraints, then compare the eligible set on quality, economics, and operational fit."
      decisionFactors={[
        'Current context and completion limits for the workload you plan to run.',
        'Supported parameters such as tool use when those capabilities are mandatory.',
        'Current input/output pricing, including tiered pricing where applicable.',
        'Provider and ZDR endpoint facts only when the workload actually requires them.',
      ]}
      prompts={[
        'Compare the best current OpenRouter models for a long-running coding agent with tools and at least 100k context.',
        'Which OpenRouter models under $10 per million output tokens are still strong enough for this workload?',
        'Compare these OpenRouter model IDs and separate benchmark quality evidence from price, context, and provider facts.',
      ]}
      whyModelShortlist={[
        'Starts from the current OpenRouter catalog instead of a hand-maintained model list.',
        'Can compare specific OpenRouter model IDs or build a broader shortlist from workload constraints.',
        'Adds Artificial Analysis evidence only when model identity reconciliation is confident.',
        'Treats ZDR as optional by default and checks endpoint-level hard constraints only when you explicitly require it.',
      ]}
    />
  )
}
