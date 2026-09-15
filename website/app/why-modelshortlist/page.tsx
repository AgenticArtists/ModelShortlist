import type { Metadata } from 'next'
import EducationLanding from '@/components/EducationLanding'

const URL = 'https://modelshortlist.com/why-modelshortlist'

export const metadata: Metadata = {
  title: 'Why ModelShortlist — Current AI Model Selection for Real Workloads',
  description: 'Why model selection needs current benchmark, capability, context, pricing, and provider evidence instead of one permanent leaderboard.',
  alternates: { canonical: URL },
  openGraph: {
    url: URL,
    title: 'Why ModelShortlist | Current AI Model Selection',
    description: 'The best model depends on the workload and on what is true about the model market right now.',
  },
}

export default function WhyModelShortlistPage() {
  return (
    <EducationLanding
      eyebrow="Why ModelShortlist"
      title="Model selection is a moving target,"
      gradientTitle="not a permanent leaderboard."
      description="ModelShortlist exists because the useful question is not “which model ranks first?” It is “given this workload and what is true about the market right now, which models are the best fit?”"
      keyPoints={[
        'The best model changes with the workload, constraints, and acceptable tradeoffs.',
        'Artificial Analysis contributes independent quality and performance evidence.',
        'OpenRouter contributes current operational facts such as price, context, capabilities, and provider availability.',
        'The host AI reasons across that evidence instead of applying one universal score.',
      ]}
      sections={[
        {
          heading: 'Static recommendations decay quickly',
          body: 'AI model markets move faster than most comparison articles can be maintained. A recommendation can become wrong without the underlying task changing.',
          bullets: [
            'A new model can launch and immediately change the competitive set.',
            'Input or output pricing can drop enough to change the best-value choice.',
            'Benchmark results and independent evaluations can change as new evidence appears.',
            'Tool support, context availability, provider endpoints, and ZDR availability can change independently of benchmark quality.',
          ],
        },
        {
          heading: 'Benchmarks are necessary, but not sufficient',
          body: 'A strong benchmark result is important evidence, especially for coding, agentic work, and general intelligence. But the benchmark winner can still be unusable for a specific workload if it misses a hard operational requirement.',
          bullets: [
            'A coding agent may require reliable tool calling and a minimum context window.',
            'A document workload may care more about output economics and structured-output support.',
            'A privacy-sensitive workload may require a real ZDR endpoint, not merely a capable base model.',
          ],
        },
        {
          heading: 'ModelShortlist separates evidence from judgment',
          body: 'ModelShortlist retrieves and normalizes evidence. Your host AI then weighs that evidence against the job you described. This keeps the MCP useful across coding, extraction, long-context, privacy, and other workloads without pretending one ranking formula fits all of them.',
        },
      ]}
      prompts={[
        'I need a long-running coding agent with tools and at least 100k context. What are the strongest current options and which is the best value?',
        'I need structured extraction at high volume and care more about output cost than frontier reasoning. What should I shortlist?',
        'Compare the strongest current models for my workload, but explain which facts are benchmark evidence and which are OpenRouter operational facts.',
      ]}
      relatedLinks={[
        { href: '/artificial-analysis', title: 'How Artificial Analysis contributes', description: 'Understand the independent benchmark and performance evidence in the shortlist.' },
        { href: '/how-model-recommendations-stay-current', title: 'How recommendations stay current', description: 'See what can change and how ModelShortlist surfaces freshness and degraded upstream state.' },
        { href: '/modelshortlist-vs-static-leaderboards', title: 'ModelShortlist vs static leaderboards', description: 'Compare workload-specific reasoning with a fixed ranking table.' },
      ]}
    />
  )
}
