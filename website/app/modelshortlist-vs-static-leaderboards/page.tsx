import type { Metadata } from 'next'
import EducationLanding from '@/components/EducationLanding'

const URL = 'https://modelshortlist.com/modelshortlist-vs-static-leaderboards'

export const metadata: Metadata = {
  title: 'ModelShortlist vs Static AI Model Leaderboards',
  description: 'Compare workload-specific AI model selection with fixed leaderboards and learn why current price, context, capabilities, and provider facts change the answer.',
  alternates: { canonical: URL },
  openGraph: {
    url: URL,
    title: 'ModelShortlist vs Static AI Model Leaderboards',
    description: 'Leaderboards measure useful things. ModelShortlist adds current operational facts and workload-specific reasoning.',
  },
}

export default function StaticLeaderboardsPage() {
  return (
    <EducationLanding
      eyebrow="ModelShortlist vs static leaderboards"
      title="A leaderboard answers “who scored highest?”"
      gradientTitle="Your workload asks a different question."
      description="Leaderboards are valuable evidence, but a fixed ranking cannot know your tool requirements, context floor, budget, provider constraints, or whether the market changed after the table was published."
      keyPoints={[
        'Leaderboards are useful quality evidence, not a complete deployment decision.',
        'A workload can eliminate the benchmark winner through hard operational constraints.',
        'Current price and provider availability can materially change value.',
        'ModelShortlist does not replace independent benchmarks; it puts them in workload context.',
      ]}
      sections={[
        {
          heading: 'What static leaderboards do well',
          body: 'A strong benchmark or evaluation table gives users a consistent way to compare model quality or performance on defined criteria. Artificial Analysis is especially valuable because it provides independent model assessments that can anchor the quality side of a decision.',
        },
        {
          heading: 'What a static ranking cannot know',
          body: 'The ranking does not know which constraints matter for your deployment unless someone explicitly adds them to the decision.',
          bullets: [
            'Whether tool/function calling is mandatory for the workload.',
            'Whether the context window is large enough for the actual task.',
            'Whether current input or output pricing fits the operating budget.',
            'Whether a required provider or ZDR endpoint is currently available.',
          ],
        },
        {
          heading: 'Why ModelShortlist uses benchmark evidence instead of competing with it',
          body: 'ModelShortlist treats benchmark quality as one evidence layer and current operational facts as another. The host AI then explains the tradeoff for the workload, which can produce different shortlists for coding agents, document extraction, giant-context synthesis, or privacy-sensitive work.',
        },
      ]}
      prompts={[
        'Which model is best for this workload right now, and how does the benchmark leader compare once price, tools, and context are applied?',
        'Give me the strongest-quality option and the strongest-value option, with the evidence for each.',
        'Do not use one global score. Explain which workload constraints actually change the shortlist.',
      ]}
      relatedLinks={[
        { href: '/artificial-analysis', title: 'Artificial Analysis in ModelShortlist', description: 'See how independent benchmark evidence is attributed and matched.' },
        { href: '/modelshortlist-vs-model-routers', title: 'ModelShortlist vs model routers', description: 'Recommendation and routing solve different problems.' },
        { href: '/how-model-recommendations-stay-current', title: 'Recommendation freshness', description: 'See why a ranking can become stale even when the workload stays constant.' },
      ]}
    />
  )
}
