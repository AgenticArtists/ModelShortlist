import type { Metadata } from 'next'
import EducationLanding from '@/components/EducationLanding'

const URL = 'https://modelshortlist.com/how-to-choose-an-ai-model'

export const metadata: Metadata = {
  title: 'How to Choose an AI Model for a Workload',
  description: 'A practical framework for choosing an AI model using workload requirements, independent benchmark evidence, current price, context, capabilities, and provider constraints.',
  alternates: { canonical: URL },
  openGraph: {
    url: URL,
    title: 'How to Choose an AI Model | ModelShortlist',
    description: 'Start with hard workload constraints, then weigh quality, economics, and operational fit using current evidence.',
  },
}

export default function HowToChoosePage() {
  return (
    <EducationLanding
      eyebrow="How to choose an AI model"
      title="Turn “what is the best model?” into"
      gradientTitle="a decision you can actually defend."
      description="Good model selection separates hard constraints from preferences, uses independent quality evidence, checks current operational facts, and makes the tradeoffs explicit."
      keyPoints={[
        'Start with the workload and the failure modes that would make a model unusable.',
        'Apply hard constraints such as tools, context, price, creator, or ZDR before ranking softer preferences.',
        'Use independent benchmark evidence to understand quality and performance where model identity is known.',
        'Re-check current catalog, pricing, capabilities, and provider facts because the answer changes over time.',
      ]}
      sections={[
        {
          heading: 'Define hard constraints before looking at rankings',
          body: 'A model that violates a non-negotiable requirement is not a candidate, regardless of benchmark quality.',
          bullets: [
            'Minimum context or completion capacity.',
            'Tool/function-calling or structured-output requirements.',
            'Maximum input or output price.',
            'Creator, provider, or privacy requirements such as ZDR.',
          ],
        },
        {
          heading: 'Use benchmark evidence for quality, not for every operational question',
          body: 'Artificial Analysis can provide independent evidence about intelligence, coding, agentic performance, and related metrics. That evidence is most useful when combined with the workload rather than treated as an automatic final ranking.',
        },
        {
          heading: 'Check the current operating facts',
          body: 'Context, supported parameters, pricing, provider availability, and ZDR endpoints can move faster than editorial comparison content. Those facts can change the shortlist even if model quality stays constant.',
        },
        {
          heading: 'Ask for an explainable shortlist, not one unexplained winner',
          body: 'A useful result often includes a best-fit option, a best-value option, and a constraint-driven alternative. The host AI should explain why each candidate is in the shortlist and which evidence matters for the recommendation.',
        },
      ]}
      prompts={[
        'Help me choose a model for this workload. First identify my hard constraints, then shortlist the strongest current options and explain the tradeoffs.',
        'Give me a best-fit and best-value recommendation, and separate benchmark evidence from current price, context, and capability facts.',
        'Which constraints actually change the answer for this workload, and which are just preferences?',
      ]}
      relatedLinks={[
        { href: '/why-modelshortlist', title: 'Why ModelShortlist', description: 'See why workload fit and freshness are the core model-selection problem.' },
        { href: '/artificial-analysis', title: 'Artificial Analysis evidence', description: 'Understand the independent benchmark layer used by ModelShortlist.' },
        { href: '/openrouter-model-comparison', title: 'OpenRouter model comparison', description: 'Apply the framework to current OpenRouter models and operational facts.' },
      ]}
    />
  )
}
