import { ArrowRight, CheckCircle2, Database, KeyRound, Radar, RefreshCw, Scale, Sparkles } from 'lucide-react'

type Section = {
  heading: string
  body: string
  bullets?: string[]
}

type RelatedLink = {
  href: string
  title: string
  description: string
}

export type EducationLandingProps = {
  eyebrow: string
  title: string
  gradientTitle: string
  description: string
  keyPoints: string[]
  sections: Section[]
  prompts?: string[]
  relatedLinks?: RelatedLink[]
}

const pointIcons = [RefreshCw, Database, Radar, Scale]

export default function EducationLanding({
  eyebrow,
  title,
  gradientTitle,
  description,
  keyPoints,
  sections,
  prompts = [],
  relatedLinks = [],
}: EducationLandingProps) {
  return (
    <div id="top">
      <section className="relative overflow-hidden border-b border-border/50">
        <div className="hero-grid absolute inset-0" aria-hidden="true" />
        <div className="glow-orb glow-cyan -left-52 -top-52 h-[500px] w-[500px]" aria-hidden="true" />
        <div className="glow-orb glow-violet -right-44 top-8 h-[480px] w-[480px]" aria-hidden="true" />
        <div className="relative mx-auto max-w-6xl px-6 py-16 sm:py-24 lg:py-28">
          <nav aria-label="Breadcrumb" className="mb-6 text-sm text-muted-foreground">
            <a href="/guides" className="transition-colors hover:text-foreground">Guides</a>
            <span className="mx-2" aria-hidden="true">/</span>
            <span aria-current="page">{eyebrow}</span>
          </nav>
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
              <a href="/guides" className="inline-flex h-12 items-center justify-center rounded-xl border border-border/70 bg-card/55 px-6 font-semibold transition-colors hover:border-blue-500/35">
                Browse all guides
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-16 sm:py-24">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {keyPoints.map((point, index) => {
            const Icon = pointIcons[index % pointIcons.length]
            return (
              <article key={point} className="rounded-2xl border border-border/60 bg-card/55 p-5">
                <Icon className="h-5 w-5 text-blue-400" aria-hidden="true" />
                <p className="mt-4 text-sm leading-6">{point}</p>
              </article>
            )
          })}
        </div>
      </section>

      <section className="border-y border-border/50 bg-muted/10">
        <div className="mx-auto max-w-4xl px-6 py-16 sm:py-24">
          <div className="space-y-12">
            {sections.map((section, index) => (
              <article key={section.heading} className={index > 0 ? 'border-t border-border/60 pt-12' : ''}>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-500">{String(index + 1).padStart(2, '0')}</p>
                <h2 className="mt-3 text-2xl font-extrabold tracking-tight sm:text-3xl">{section.heading}</h2>
                <p className="mt-4 text-base leading-7 text-muted-foreground">{section.body}</p>
                {section.bullets?.length ? (
                  <div className="mt-6 grid gap-3">
                    {section.bullets.map((bullet) => (
                      <div key={bullet} className="flex gap-3 rounded-xl border border-border/60 bg-background/65 p-4">
                        <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-500" aria-hidden="true" />
                        <p className="text-sm leading-6 text-muted-foreground">{bullet}</p>
                      </div>
                    ))}
                  </div>
                ) : null}
              </article>
            ))}
          </div>
        </div>
      </section>

      {prompts.length ? (
        <section className="mx-auto max-w-6xl px-6 py-16 sm:py-24">
          <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-violet-500">Try it in your assistant</p>
              <h2 className="mt-3 text-3xl font-extrabold tracking-tight">Turn the concept into a current decision.</h2>
              <p className="mt-4 text-sm leading-6 text-muted-foreground">
                These prompts ask for workload-specific reasoning rather than a permanent ranking. The answer can change as benchmark and operational evidence changes.
              </p>
            </div>
            <div className="space-y-3">
              {prompts.map((prompt) => (
                <div key={prompt} className="rounded-xl border border-violet-500/20 bg-violet-500/[0.045] p-4 text-sm leading-6">
                  “{prompt}”
                </div>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {relatedLinks.length ? (
        <section className="border-y border-border/50 bg-muted/10">
          <div className="mx-auto max-w-6xl px-6 py-16 sm:py-20">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-500">Keep exploring</p>
            <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {relatedLinks.map((link) => (
                <a key={link.href} href={link.href} className="group rounded-2xl border border-border/60 bg-background/65 p-5 transition-colors hover:border-blue-500/35">
                  <h2 className="font-bold">{link.title}</h2>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">{link.description}</p>
                  <span className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-blue-500">
                    Read more <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
                  </span>
                </a>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      <section className="relative overflow-hidden">
        <div className="dot-grid absolute inset-0 opacity-30" aria-hidden="true" />
        <div className="relative mx-auto max-w-4xl px-6 py-20 text-center sm:py-28">
          <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-xl border border-blue-500/20 bg-blue-500/10">
            <KeyRound className="h-5 w-5 text-blue-400" aria-hidden="true" />
          </div>
          <h2 className="mt-5 text-3xl font-extrabold tracking-tight sm:text-4xl">Ask the current model market, not yesterday&apos;s blog post.</h2>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-muted-foreground">
            ModelShortlist runs locally, uses your Artificial Analysis and OpenRouter keys, and gives your host AI current evidence for the workload you actually care about.
          </p>
          <a href="/install" className="brand-gradient-bg mt-8 inline-flex h-12 items-center justify-center gap-2 rounded-xl px-6 font-semibold text-white">
            Open the install configurator <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </a>
        </div>
      </section>
    </div>
  )
}
