import type { Metadata } from 'next'
import UseCaseLanding from '@/components/UseCaseLanding'

const URL = 'https://modelshortlist.com/large-context-models'

export const metadata: Metadata = {
  title: 'Best Large-Context AI Models',
  description: 'Shortlist AI models for 100k, 200k, and larger-context workloads using current context limits, pricing, capabilities, and benchmark evidence.',
  alternates: { canonical: URL },
  openGraph: {
    url: URL,
    title: 'Best Large-Context AI Models | ModelShortlist',
    description: 'Find models that meet your context requirement without ignoring cost, tools, or quality.',
  },
}

export default function LargeContextModelsPage() {
  return (
    <UseCaseLanding
      eyebrow="Large-context model selection"
      title="Need huge context?"
      gradientTitle="Make it a constraint, not the conclusion."
      description="A large context window gets a model into the candidate set. It does not tell you whether that model is the right choice for coding, document synthesis, extraction, agents, or your budget."
      intro="Long documents, repository-scale code, accumulated agent state, and multi-source synthesis can all require substantial context. ModelShortlist can enforce the minimum window you actually need, then let the host AI reason about cost, tools, benchmark evidence, and other workload requirements among the models that remain."
      decisionFactors={[
        'Minimum context capacity as a hard filter instead of manually scanning model cards.',
        'Input pricing, which becomes especially important when prompts routinely occupy large portions of the context window.',
        'Tool/function-calling requirements for large-context agent workflows.',
        'Quality and performance evidence so context size is not mistaken for task competence.',
      ]}
      prompts={[
        'I need at least 200k context and tool calling. What are my best current options?',
        'Which models can handle a very large document corpus while keeping input cost reasonable?',
        'I need 100k+ context for a coding agent. Prioritize agentic quality, but show me the cost tradeoffs.',
      ]}
      whyModelShortlist={[
        'Reads current context and capability metadata from the OpenRouter catalog rather than relying on a static comparison table.',
        'Can combine minimum-context filtering with output/input price ceilings and tool requirements.',
        'Keeps models without an Artificial Analysis match eligible instead of silently dropping newer or unmatched options.',
        'Lets the host AI decide whether a bigger window is actually worth a higher price for the specific workload.',
      ]}
    />
  )
}
