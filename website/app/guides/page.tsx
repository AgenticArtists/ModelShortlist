import type { Metadata } from 'next'
import { ArrowRight } from 'lucide-react'

export const metadata: Metadata = {
  title: 'AI Model Selection Guides',
  description:
    'Practical guides for choosing AI models using current Artificial Analysis benchmark evidence plus OpenRouter pricing, context, capabilities, providers, and optional ZDR facts.',
  alternates: { canonical: 'https://modelshortlist.com/guides' },
  openGraph: {
    url: 'https://modelshortlist.com/guides',
    title: 'AI Model Selection Guides | ModelShortlist',
    description: 'Choose models by workload and current evidence instead of relying on a permanent leaderboard.',
  },
}

type Guide = {
  href: string
  title: string
  description: string
}

const groups: Array<{ label: string; intro: string; guides: Guide[] }> = [
  {
    label: 'Start here',
    intro: 'Understand the model-selection framework before narrowing to a specific workload.',
    guides: [
      {
        href: '/how-to-choose-an-ai-model',
        title: 'How to choose an AI model',
        description: 'Separate hard constraints from preferences, then weigh benchmark quality, economics, and current operational fit.',
      },
      {
        href: '/why-modelshortlist',
        title: 'Why ModelShortlist exists',
        description: 'Why the useful question is “best for this workload right now,” not “which model ranks first forever.”',
      },
      {
        href: '/how-model-recommendations-stay-current',
        title: 'How recommendations stay current',
        description: 'See how launches, pricing, benchmarks, capabilities, providers, and ZDR availability can change the answer.',
      },
    ],
  },
  {
    label: 'Workloads',
    intro: 'Start from the job being done and the failure modes that would make a model unusable.',
    guides: [
      {
        href: '/coding-agents',
        title: 'Models for coding agents',
        description: 'Choose models for autonomous and long-running coding workflows using tools, context, agentic evidence, and cost.',
      },
      {
        href: '/document-extraction-models',
        title: 'Models for document extraction',
        description: 'Balance extraction reliability, structured output, context, benchmark evidence, and high-volume token economics.',
      },
      {
        href: '/structured-output-models',
        title: 'Models for structured output',
        description: 'Compare models for strict JSON, schema-constrained generation, and tool-driven machine-readable workflows.',
      },
      {
        href: '/large-context-models',
        title: 'Large-context models',
        description: 'Compare models for repositories, long documents, transcripts, and workloads where context is a hard constraint.',
      },
    ],
  },
  {
    label: 'Cost, tools, and privacy constraints',
    intro: 'Apply non-negotiable operational constraints before reasoning about softer quality preferences.',
    guides: [
      {
        href: '/cheap-tool-calling-models',
        title: 'Cost-efficient tool-calling models',
        description: 'Find tool-capable models when repeated agent calls make reliability and token economics equally important.',
      },
      {
        href: '/models-under-10-per-million-output',
        title: 'Models under $10 / 1M output tokens',
        description: 'Apply a hard output-price ceiling, then compare the strongest eligible models using current evidence.',
      },
      {
        href: '/zdr-models',
        title: 'ZDR model selection',
        description: 'Treat Zero Data Retention as an explicit endpoint-level requirement without restricting ordinary requests.',
      },
    ],
  },
  {
    label: 'Evidence and comparisons',
    intro: 'Understand what each data source or comparison method can and cannot tell you.',
    guides: [
      {
        href: '/artificial-analysis',
        title: 'Artificial Analysis in ModelShortlist',
        description: 'How independent benchmark and performance evidence enters the shortlist with conservative identity matching.',
      },
      {
        href: '/artificial-analysis-model-comparison',
        title: 'Artificial Analysis model comparison',
        description: 'Use independent benchmark evidence with current operational facts instead of treating a ranking as the entire deployment decision.',
      },
      {
        href: '/openrouter-model-comparison',
        title: 'OpenRouter model comparison',
        description: 'Compare current OpenRouter context, capabilities, pricing, providers, and optional ZDR facts by workload.',
      },
      {
        href: '/modelshortlist-vs-static-leaderboards',
        title: 'ModelShortlist vs static leaderboards',
        description: 'Why benchmark tables are valuable evidence but not a complete workload-specific deployment decision.',
      },
      {
        href: '/modelshortlist-vs-model-routers',
        title: 'ModelShortlist vs model routers',
        description: 'Recommendation and runtime inference routing solve different problems; see where ModelShortlist fits.',
      },
    ],
  },
]

export default function GuidesPage() {
  return (
    <div id="top">
      <section className="relative overflow-hidden border-b border-border/50">
        <div className="hero-grid absolute inset-0" aria-hidden="true" />
        <div className="glow-orb glow-violet -right-44 -top-28 h-[500px] w-[500px]" aria-hidden="true" />
        <div className="relative mx-auto max-w-6xl px-6 py-16 sm:py-24 lg:py-28">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-500">Model-selection guides</p>
          <h1 className="mt-4 max-w-4xl text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
            Start with the workload, <span className="hero-gradient-text">then ask what is true right now.</span>
          </h1>
          <p className="mt-6 max-w-3xl text-lg leading-8 text-muted-foreground">
            These guides explain the criteria that actually change a model recommendation. ModelShortlist then lets your AI assistant apply them to current Artificial Analysis benchmark evidence and current OpenRouter operational facts.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <a href="/how-to-choose-an-ai-model" className="brand-gradient-bg inline-flex h-12 items-center justify-center gap-2 rounded-xl px-6 font-semibold text-white">
              Start with the selection framework <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </a>
            <a href="/install" className="inline-flex h-12 items-center justify-center rounded-xl border border-border/70 bg-card/55 px-6 font-semibold transition-colors hover:border-blue-500/35">
              Install ModelShortlist
            </a>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-16 sm:py-24">
        <div className="space-y-16">
          {groups.map((group) => (
            <section key={group.label} aria-labelledby={`group-${group.label.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`}>
              <div className="max-w-3xl">
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-500">{group.label}</p>
                <h2 id={`group-${group.label.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`} className="mt-3 text-2xl font-extrabold tracking-tight sm:text-3xl">
                  {group.intro}
                </h2>
              </div>
              <div className="mt-7 grid gap-4 md:grid-cols-2">
                {group.guides.map((guide) => (
                  <a
                    key={guide.href}
                    href={guide.href}
                    className="group rounded-2xl border border-border/60 bg-card/55 p-6 transition-all hover:-translate-y-1 hover:border-blue-500/30 hover:shadow-xl hover:shadow-blue-500/5"
                  >
                    <h3 className="text-xl font-bold">{guide.title}</h3>
                    <p className="mt-3 text-sm leading-6 text-muted-foreground">{guide.description}</p>
                    <span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-blue-500">
                      Read guide <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
                    </span>
                  </a>
                ))}
              </div>
            </section>
          ))}
        </div>

        <div className="mt-16 rounded-2xl border border-blue-500/20 bg-blue-500/[0.045] p-6 sm:flex sm:items-center sm:justify-between sm:gap-8">
          <div>
            <h2 className="text-xl font-bold">Want the current answer for your workload?</h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Install ModelShortlist and ask the model-selection question in normal language inside your MCP-capable assistant.
            </p>
          </div>
          <a href="/install" className="brand-gradient-bg mt-5 inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-xl px-5 text-sm font-semibold text-white sm:mt-0">
            Install ModelShortlist <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </a>
        </div>
      </section>
    </div>
  )
}
