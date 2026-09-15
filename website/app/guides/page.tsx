import type { Metadata } from 'next'
import { ArrowRight, Bot, Braces, Database, ShieldCheck } from 'lucide-react'

export const metadata: Metadata = {
  title: 'AI Model Selection Guides',
  description:
    'Practical guides for choosing AI models for coding agents, ZDR workloads, tool calling, and large-context work using ModelShortlist.',
  alternates: { canonical: 'https://modelshortlist.com/guides' },
}

const guides = [
  {
    href: '/coding-agents',
    title: 'Models for coding agents',
    description:
      'Choose models for autonomous and long-running coding workflows using tool support, context, benchmark evidence, and cost constraints.',
    icon: Bot,
  },
  {
    href: '/cheap-tool-calling-models',
    title: 'Cost-efficient tool-calling models',
    description:
      'Evaluate tool-capable models when reliability matters but repeated agent calls make token economics important.',
    icon: Braces,
  },
  {
    href: '/large-context-models',
    title: 'Large-context models',
    description:
      'Compare models for document synthesis, repositories, long transcripts, and other workloads where context size is a hard constraint.',
    icon: Database,
  },
  {
    href: '/zdr-models',
    title: 'ZDR model selection',
    description:
      'Treat Zero Data Retention as an explicit endpoint-level requirement without unnecessarily restricting ordinary model selection.',
    icon: ShieldCheck,
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
            Start with the workload, <span className="hero-gradient-text">not a leaderboard.</span>
          </h1>
          <p className="mt-6 max-w-3xl text-lg leading-8 text-muted-foreground">
            These guides explain the constraints that actually change a model recommendation. ModelShortlist then lets your AI assistant apply those constraints to current OpenRouter and Artificial Analysis evidence.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-16 sm:py-24">
        <div className="grid gap-5 md:grid-cols-2">
          {guides.map(({ href, title, description, icon: Icon }) => (
            <a
              key={href}
              href={href}
              className="group rounded-2xl border border-border/60 bg-card/55 p-6 transition-all hover:-translate-y-1 hover:border-blue-500/30 hover:shadow-xl hover:shadow-blue-500/5"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-blue-500/20 bg-blue-500/10">
                <Icon className="h-5 w-5 text-blue-400" aria-hidden="true" />
              </div>
              <h2 className="mt-5 text-xl font-bold">{title}</h2>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">{description}</p>
              <span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-blue-500">
                Read guide <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
              </span>
            </a>
          ))}
        </div>

        <div className="mt-12 rounded-2xl border border-blue-500/20 bg-blue-500/[0.045] p-6 sm:flex sm:items-center sm:justify-between sm:gap-8">
          <div>
            <h2 className="text-xl font-bold">Want the current answer for your workload?</h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Install ModelShortlist and ask the question in normal language inside your MCP-capable assistant.
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
