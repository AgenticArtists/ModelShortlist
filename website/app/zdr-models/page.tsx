import type { Metadata } from 'next'
import UseCaseLanding from '@/components/UseCaseLanding'

const URL = 'https://modelshortlist.com/zdr-models'

export const metadata: Metadata = {
  title: 'Find AI Models with Zero Data Retention (ZDR)',
  description: 'Shortlist AI models with current OpenRouter ZDR endpoint availability while preserving context, tool, provider, and price requirements.',
  alternates: { canonical: URL },
  openGraph: {
    url: URL,
    title: 'AI Models with Zero Data Retention (ZDR) | ModelShortlist',
    description: 'Make ZDR a hard requirement only when your workload actually needs it.',
  },
}

export default function ZdrModelsPage() {
  return (
    <UseCaseLanding
      eyebrow="Zero Data Retention model selection"
      title="Require ZDR without"
      gradientTitle="throwing away the rest of the decision."
      description="Privacy can be a hard constraint, but it is not the whole model-selection problem. ModelShortlist can filter to current OpenRouter ZDR-capable endpoints while still checking context, tools, pricing, and workload fit."
      intro="A privacy requirement should narrow the candidate set, not replace the rest of your reasoning. When you explicitly require ZDR, ModelShortlist checks the current endpoint-level data and keeps hard constraints tied to the same eligible endpoint. When you do not require ZDR, it does not silently exclude the broader OpenRouter catalog."
      decisionFactors={[
        'Current ZDR-capable OpenRouter endpoints rather than assuming privacy support from the model name alone.',
        'Tool and parameter support on the same endpoint that satisfies the ZDR requirement.',
        'Minimum context and pricing constraints after the privacy filter is applied.',
        'Latency, throughput, uptime, and provider options when endpoint-level operational data is relevant.',
      ]}
      prompts={[
        'I need 200k context, tool calling, and ZDR. What are my best current options?',
        'ZDR is mandatory for this workload. Keep output cost under $10 per million tokens and prioritize strong reasoning.',
        'Compare my best ZDR-capable options for an autonomous coding agent with at least 100k context.',
      ]}
      whyModelShortlist={[
        'ZDR is an explicit optional constraint, not a default filter that distorts every recommendation.',
        'When ZDR is required, endpoint-level eligibility and other hard constraints are checked together.',
        'OpenRouter capability and operational data can be combined with independent Artificial Analysis benchmarks where a confident match exists.',
        'The host AI can explain what quality, cost, context, or provider tradeoffs remain after the privacy requirement is satisfied.',
      ]}
      caveat="ModelShortlist identifies current ZDR-capable options for selection. When you later send inference requests through OpenRouter, enforce ZDR again in the actual provider request rather than treating model selection alone as the privacy control."
    />
  )
}
