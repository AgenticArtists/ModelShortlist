import type { Metadata } from 'next'
import EducationLanding from '@/components/EducationLanding'

const URL = 'https://modelshortlist.com/how-model-recommendations-stay-current'

export const metadata: Metadata = {
  title: 'How AI Model Recommendations Stay Current',
  description: 'Why AI model recommendations change as new models, prices, benchmarks, capabilities, context limits, providers, and ZDR endpoints change.',
  alternates: { canonical: URL },
  openGraph: {
    url: URL,
    title: 'How ModelShortlist Recommendations Stay Current',
    description: 'A current recommendation depends on both fresh benchmark evidence and fresh operational model facts.',
  },
}

export default function FreshnessPage() {
  return (
    <EducationLanding
      eyebrow="Recommendation freshness"
      title="Yesterday's best model can be"
      gradientTitle="the wrong choice today."
      description="Model recommendations decay because the model market changes continuously. ModelShortlist is designed to expose current evidence and to tell the host AI when upstream freshness has degraded."
      keyPoints={[
        'New model launches can change the competitive set immediately.',
        'Price changes can turn an expensive model into the best-value option—or the reverse.',
        'Benchmark and performance evidence can move as independent evaluations change.',
        'Capabilities, context, providers, and ZDR availability can change without the model name changing.',
      ]}
      sections={[
        {
          heading: 'Freshness is part of the answer',
          body: 'A model recommendation should not quietly imply “current” when the evidence is stale. ModelShortlist tracks upstream source freshness independently so the host AI can distinguish fresh, stale, and unavailable evidence.',
        },
        {
          heading: 'Different upstream failures mean different things',
          body: 'Artificial Analysis, the OpenRouter model catalog, and OpenRouter ZDR endpoint evidence are treated as separate sources rather than one all-or-nothing dependency.',
          bullets: [
            'If Artificial Analysis is temporarily unavailable, OpenRouter models can remain eligible with missing benchmark evidence.',
            'If ZDR endpoint evidence is unavailable and ZDR was not requested, the general model catalog can still be used.',
            'If ZDR is required but current or cached ZDR evidence is unavailable, ModelShortlist fails closed rather than guessing.',
            'If the required OpenRouter model catalog is unavailable with no usable cache, ModelShortlist does not fabricate a recommendation.',
          ],
        },
        {
          heading: 'Stale evidence is labeled, not disguised',
          body: 'A last-known-good source can be useful during a temporary outage, but only if its age and degraded state are explicit. ModelShortlist surfaces that state in tool output so the host AI can qualify the recommendation appropriately.',
        },
      ]}
      prompts={[
        'Recommend models for this workload, but tell me whether each upstream evidence source is fresh, stale, or unavailable.',
        'If Artificial Analysis is temporarily unavailable, give me the best operational shortlist you can without pretending the benchmark evidence is current.',
        'I require ZDR. If current ZDR endpoint evidence is unavailable, do not infer or guess eligibility.',
      ]}
      relatedLinks={[
        { href: '/why-modelshortlist', title: 'Why ModelShortlist exists', description: 'See why freshness and workload fit matter more than a permanent ranking.' },
        { href: '/artificial-analysis', title: 'Artificial Analysis evidence', description: 'Understand how independent benchmark evidence enters the shortlist.' },
        { href: '/modelshortlist-vs-static-leaderboards', title: 'Static leaderboard comparison', description: 'See why a fixed ranking is especially vulnerable to market drift.' },
      ]}
    />
  )
}
