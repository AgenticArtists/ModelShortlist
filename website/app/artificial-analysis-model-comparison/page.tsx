import type { Metadata } from 'next'
import EducationLanding from '@/components/EducationLanding'

const URL = 'https://modelshortlist.com/artificial-analysis-model-comparison'

export const metadata: Metadata = {
  title: 'Artificial Analysis Model Comparison for Real Workloads',
  description: 'Use Artificial Analysis benchmark and performance evidence alongside current OpenRouter pricing, context, capability, and provider facts to compare AI models for a workload.',
  alternates: { canonical: URL },
  openGraph: {
    url: URL,
    title: 'Artificial Analysis Model Comparison | ModelShortlist',
    description: 'Benchmark evidence becomes more useful when it is combined with current operational facts and the workload you actually need to run.',
  },
}

export default function ArtificialAnalysisComparisonPage() {
  return (
    <EducationLanding
      eyebrow="Artificial Analysis model comparison"
      title="Compare benchmark evidence,"
      gradientTitle="then put it in workload context."
      description="Artificial Analysis provides independent model-quality and performance evidence. ModelShortlist helps your AI assistant use that evidence without mistaking a benchmark ranking for a complete deployment decision."
      keyPoints={[
        'Artificial Analysis contributes independent intelligence, coding, agentic, pricing, and performance evidence exposed by its API.',
        'ModelShortlist only attaches benchmark data when the exact model identity can be matched confidently.',
        'Current OpenRouter facts determine whether a benchmark-strong model actually satisfies context, tools, price, provider, or privacy requirements.',
        'The host AI explains the tradeoff for the workload rather than converting every signal into one permanent score.',
      ]}
      sections={[
        {
          heading: 'Start with the benchmark question you actually care about',
          body: 'Different workloads care about different dimensions of model quality. Coding and agentic evidence can matter heavily for autonomous development work, while other tasks may place more weight on general reasoning, latency, or cost.',
        },
        {
          heading: 'Keep model identity exact',
          body: 'A comparison is only useful if benchmark evidence belongs to the exact model variant being evaluated. ModelShortlist uses conservative matching and leaves benchmark fields empty when the identity is ambiguous rather than guessing across model families or releases.',
        },
        {
          heading: 'Add the current operational layer',
          body: 'Once quality evidence is attached, the host AI still needs current deployment facts to decide whether a candidate fits the workload.',
          bullets: [
            'Current input and output pricing can change the best-value recommendation.',
            'Context and completion limits can make a high-scoring model ineligible.',
            'Tool or structured-output capability can be a hard requirement.',
            'Provider and ZDR endpoint evidence matters when the workload explicitly requires it.',
          ],
        },
      ]}
      prompts={[
        'Compare the strongest current models for autonomous coding using Artificial Analysis coding and agentic evidence, then apply my OpenRouter tool, context, and price constraints.',
        'Show me how the Artificial Analysis benchmark leaders change once I require at least 100k context and a $10 per million output-token ceiling.',
        'Compare these models and clearly label which facts come from Artificial Analysis and which come from OpenRouter.',
      ]}
      relatedLinks={[
        { href: '/artificial-analysis', title: 'How Artificial Analysis contributes', description: 'Understand attribution, matching, and what benchmark evidence enters ModelShortlist.' },
        { href: '/openrouter-model-comparison', title: 'OpenRouter model comparison', description: 'See the operational evidence layer that complements independent benchmarks.' },
        { href: '/modelshortlist-vs-static-leaderboards', title: 'ModelShortlist vs static leaderboards', description: 'Understand why a benchmark ranking is evidence, not the entire deployment decision.' },
      ]}
    />
  )
}
