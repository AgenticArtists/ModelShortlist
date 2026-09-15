import type { Metadata } from 'next'
import UseCaseLanding from '@/components/UseCaseLanding'

const URL = 'https://modelshortlist.com/cheap-tool-calling-models'

export const metadata: Metadata = {
  title: 'Cheap AI Models with Tool Calling',
  description: 'Find lower-cost AI models that still satisfy tool-calling, context, and workload requirements using current OpenRouter data and benchmark evidence.',
  alternates: { canonical: URL },
  openGraph: {
    url: URL,
    title: 'Cheap AI Models with Tool Calling | ModelShortlist',
    description: 'Shortlist lower-cost models without treating price as the only requirement.',
  },
}

export default function CheapToolCallingModelsPage() {
  return (
    <UseCaseLanding
      eyebrow="Cost-efficient tool-calling models"
      title="Lower model cost without"
      gradientTitle="breaking the agent loop."
      description="The cheapest token price is not useful if the model cannot reliably use the tools your workflow depends on. ModelShortlist lets cost become a constraint while preserving capabilities and workload fit."
      intro="High-volume agents, extraction pipelines, and repetitive subagents can turn small per-token differences into large bills. But a low price only creates value when the candidate still has the context, tool support, and quality level needed to finish the work without retries or escalation."
      decisionFactors={[
        'Current OpenRouter input and output pricing, not remembered launch pricing.',
        'Tool/function-calling support as a hard eligibility requirement when the workflow depends on it.',
        'Context limits large enough for the task so cheap models are not selected into an impossible workload.',
        'Quality and performance evidence that helps distinguish inexpensive from merely underpowered.',
      ]}
      prompts={[
        'What is the cheapest model I would trust for repetitive tool-using coding subagents?',
        'Find my best tool-calling options under $5 per million output tokens with at least 64k context.',
        'I have a high-volume extraction workflow that uses tools. Minimize cost without dropping below a reasonable quality bar.',
      ]}
      whyModelShortlist={[
        'Price ceilings can be applied before the host AI reasons about the remaining candidates.',
        'Tool use and context can remain hard requirements instead of becoming secondary notes on a cheap-model list.',
        'Artificial Analysis metrics are attached when confidently matched, giving the host AI additional evidence about the cost/quality tradeoff.',
        'The result can distinguish a lowest-cost candidate from a best-value candidate when paying slightly more materially improves fit.',
      ]}
    />
  )
}
