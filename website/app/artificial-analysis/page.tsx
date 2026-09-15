import type { Metadata } from 'next'
import EducationLanding from '@/components/EducationLanding'

const URL = 'https://modelshortlist.com/artificial-analysis'

export const metadata: Metadata = {
  title: 'Artificial Analysis in ModelShortlist',
  description: 'How ModelShortlist uses Artificial Analysis benchmark and performance evidence alongside current OpenRouter operational data.',
  alternates: { canonical: URL },
  openGraph: {
    url: URL,
    title: 'Artificial Analysis in ModelShortlist',
    description: 'Independent model-quality evidence from Artificial Analysis, combined with current OpenRouter operational facts.',
  },
}

export default function ArtificialAnalysisPage() {
  return (
    <EducationLanding
      eyebrow="Artificial Analysis"
      title="Independent benchmark evidence,"
      gradientTitle="used with explicit attribution."
      description="Artificial Analysis is a major part of ModelShortlist's value proposition: it contributes independent quality and performance evidence that the host AI can weigh against the workload. ModelShortlist does not create or own those benchmarks."
      keyPoints={[
        'Artificial Analysis supplies independent benchmark and performance evidence.',
        'ModelShortlist attaches that evidence only when the model identity can be reconciled confidently.',
        'Unmatched models remain eligible rather than receiving guessed benchmark data.',
        'OpenRouter facts remain a separate evidence layer for price, context, capabilities, providers, and ZDR.',
      ]}
      sections={[
        {
          heading: 'What Artificial Analysis contributes',
          body: 'ModelShortlist can surface Artificial Analysis intelligence, coding, and agentic evaluation context, along with pricing and performance fields exposed by the upstream API. Those fields give the host AI stronger evidence than a model name or marketing description alone.',
        },
        {
          heading: 'Why matching is intentionally conservative',
          body: 'Benchmark evidence is useful only if it belongs to the exact model being evaluated. ModelShortlist prefers a missing benchmark over a confident-looking mismatch.',
          bullets: [
            'Preview and stable variants are not silently collapsed together.',
            'Dated and undated releases are not assumed to be the same model.',
            'Pro, mini, small, and thinking variants are not reduced to one model family.',
            'Ambiguous normalized names remain unmatched unless a manually verified alias resolves them.',
          ],
        },
        {
          heading: 'Why Artificial Analysis is not the whole recommendation',
          body: 'Benchmark quality can identify strong models, but real deployment choices also depend on current context limits, tool support, price, provider availability, privacy constraints, and the shape of the workload. ModelShortlist keeps those operational facts separate and lets the host AI reason across both evidence types.',
        },
      ]}
      prompts={[
        'Which current models look strongest for autonomous coding when you weigh Artificial Analysis coding and agentic evidence against OpenRouter price and context?',
        'Compare these models and clearly distinguish Artificial Analysis benchmark evidence from OpenRouter operational facts.',
        'If a model lacks a confident Artificial Analysis match, keep it eligible but tell me which benchmark fields are unavailable.',
      ]}
      relatedLinks={[
        { href: '/openrouter-model-comparison', title: 'OpenRouter model comparison', description: 'See how current operational facts complement benchmark evidence.' },
        { href: '/modelshortlist-vs-static-leaderboards', title: 'Why not just use a leaderboard?', description: 'Understand why model quality evidence still needs workload and operational context.' },
        { href: '/why-modelshortlist', title: 'Why ModelShortlist exists', description: 'See the full workload-specific model-selection philosophy.' },
      ]}
    />
  )
}
