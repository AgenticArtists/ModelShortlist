import { ArrowRight, CheckCircle2, Gauge, KeyRound, Layers3, Radar, ShieldCheck, Sparkles } from 'lucide-react'

export type UseCaseLandingProps = {
  eyebrow: string
  title: string
  gradientTitle: string
  description: string
  intro: string
  decisionFactors: string[]
  prompts: string[]
  whyModelShortlist: string[]
  caveat?: string
}

const factorIcons = [Radar, Gauge, Layers3, ShieldCheck]

export default function UseCaseLanding({
  eyebrow,
  title,
  gradientTitle,
  description,
  intro,
  decisionFactors,
  prompts,
  whyModelShortlist,
  caveat,
}: UseCaseLandingProps) {
  return (
    <div id="top">
      <section className="relative overflow-hidden border-b border-border/50">
        <div className="hero-grid absolute inset-0" aria-hidden="true" />
        <div className="glow-orb glow-cyan -left-52 -top-52 h-[500px] w-[500px]" aria-hidden="true" />
        <div className="glow-orb glow-violet -right-44 top-8 h-[480px] w-[480px]" aria-hidden="true" />
        <div className="relative mx-auto max-w-6xl px-6 py-16 sm:py-24 lg:py-28">
          <div className="max-w-4xl">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-blue-500/20 bg-blue-500/10 px-3 py-1.5 text-xs font-semibold text-blue-400">
              <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
              {eyebrow}
            </div>
            <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
              {title} <span className="hero-gradient-text">{gradientTitle}</span>
            </h1>
            <p className="mt-6 max-w-3xl text-lg leading-8 text-muted-foreground sm:text-xl">{description}</p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <a href="/install" className="brand-gradient-bg inline-flex h-12 items-center justify-center gap-2 rounded-xl px-6 font-semibold text-white">
                Install ModelShortlist <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </a>
              <a href="https://github.com/AgenticArtists/ModelShortlist" target="_blank" rel="noreferrer" className="inline-flex h-12 items-center justify-center rounded-xl border border-border/70 bg-card/55 px-6 font-semibold transition-colors hover:border-blue-500/35">
                View the open-source MCP
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-16 sm:py-24">
        <div className="grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-500">The decision</p>
            <h2 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl">The answer changes with the workload.</h2>
            <p className="mt-4 text-base leading-7 text-muted-foreground">{intro}</p>
            {caveat ? (
              <div className="mt-6 rounded-xl border border-amber-500/20 bg-amber-500/[0.05] p-4 text-sm leading-6 text-muted-foreground">
                {caveat}
              </div>
            ) : null}
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {decisionFactors.map((factor, index) => {
              const Icon = factorIcons[index % factorIcons.length]
              return (
                <article key={factor} className="rounded-2xl border border-border/60 bg-card/55 p-5">
                  <Icon className="h-5 w-5 text-blue-400" aria-hidden="true" />
                  <p className="mt-4 text-sm leading-6">{factor}</p>
                </article>
              )
            })}
          </div>
        </div>
      </section>

      <section className="border-y border-border/50 bg-muted/10">
        <div className="mx-auto max-w-6xl px-6 py-16 sm:py-24">
          <div className="grid gap-12 lg:grid-cols-2">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-500">Ask naturally</p>
              <h2 className="mt-3 text-3xl font-extrabold tracking-tight">Prompts that work.</h2>
              <p className="mt-4 text-sm leading-6 text-muted-foreground">
                ModelShortlist is designed to sit behind the AI assistant you already use. Describe the job and constraints instead of translating them into a fixed ranking formula.
              </p>
              <div className="mt-7 space-y-3">
                {prompts.map((prompt) => (
                  <div key={prompt} className="rounded-xl border border-blue-500/20 bg-blue-500/[0.045] p-4 text-sm leading-6">
                    “{prompt}”
                  </div>
                ))}
              </div>
            </div>

            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-violet-500">Why ModelShortlist</p>
              <h2 className="mt-3 text-3xl font-extrabold tracking-tight">Current evidence, not a static leaderboard.</h2>
              <div className="mt-7 space-y-4">
                {whyModelShortlist.map((item) => (
                  <div key={item} className="flex gap-3 rounded-xl border border-border/60 bg-background/65 p-4">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-500" aria-hidden="true" />
                    <p className="text-sm leading-6 text-muted-foreground">{item}</p>
                  </div>
                ))}
              </div>
              <div className="mt-6 flex items-center gap-3 rounded-xl border border-border/60 bg-card/50 p-4 text-sm text-muted-foreground">
                <KeyRound className="h-5 w-5 shrink-0 text-blue-400" aria-hidden="true" />
                Local BYOK architecture. No ModelShortlist account, hosted key vault, or telemetry in the MCP.
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden">
        <div className="dot-grid absolute inset-0 opacity-30" aria-hidden="true" />
        <div className="relative mx-auto max-w-4xl px-6 py-20 text-center sm:py-28">
          <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">Put current model-selection evidence inside your assistant.</h2>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-muted-foreground">
            Install the local MCP, add your OpenRouter and Artificial Analysis keys, and ask the model-selection question in normal language.
          </p>
          <a href="/install" className="brand-gradient-bg mt-8 inline-flex h-12 items-center justify-center gap-2 rounded-xl px-6 font-semibold text-white">
            Open the install configurator <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </a>
        </div>
      </section>
    </div>
  )
}
