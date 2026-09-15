import type { LucideIcon } from 'lucide-react'
import {
  ArrowRight,
  BadgeCheck,
  BrainCircuit,
  Check,
  CircleDollarSign,
  Code2,
  Database,
  Github,
  KeyRound,
  Network,
  PackageCheck,
  Radar,
  RefreshCw,
  ShieldCheck,
  Sparkles,
  Terminal,
  Wrench,
  Zap,
} from 'lucide-react'
import CodeBlock from '@/components/CodeBlock'

const GITHUB_URL = 'https://github.com/AgenticArtists/ModelShortlist'
const NPM_URL = 'https://www.npmjs.com/package/@agentic.artists/modelshortlist'

const mcpConfig = `{
  "mcpServers": {
    "modelshortlist": {
      "command": "npx",
      "args": ["-y", "@agentic.artists/modelshortlist"],
      "env": {
        "ARTIFICIAL_ANALYSIS_API_KEY": "YOUR_KEY",
        "OPENROUTER_API_KEY": "YOUR_KEY"
      }
    }
  }
}`

const examples = [
  'I need a long-running coding agent. Tool use is required, I need at least 100k context, and I care about quality-per-dollar.',
  'What is the strongest current model under $10 per million output tokens for this workload?',
  'I need strict structured output from long documents. Which current models are the best fit?',
  'Compare these OpenRouter models and separate benchmark evidence from price, context, and provider facts.',
  'I need 200k context and reliable tool use. What are my best current options?',
  'Same workload, but ZDR is mandatory. Which real endpoints still satisfy every hard constraint?',
]

const faqs = [
  {
    question: 'Does ModelShortlist choose one “best” model for everyone?',
    answer:
      'No. The host AI weighs current evidence against your workload and constraints. Coding, extraction, long-context, latency-sensitive, budget-sensitive, and privacy-sensitive work can produce different shortlists.',
  },
  {
    question: 'What does Artificial Analysis contribute?',
    answer:
      'Artificial Analysis supplies independent benchmark and performance evidence. ModelShortlist uses that evidence when it can confidently reconcile the exact model identity; it does not create or claim ownership of those benchmarks.',
  },
  {
    question: 'What does OpenRouter contribute?',
    answer:
      'OpenRouter supplies the current model catalog plus operational facts such as context, supported parameters, pricing, providers, and ZDR endpoint information.',
  },
  {
    question: 'What happens if upstream data is stale or unavailable?',
    answer:
      'ModelShortlist tracks source freshness separately. It can use explicitly stale last-known-good evidence where appropriate, marks unavailable sources, and fails closed when a required source or hard privacy constraint cannot be verified.',
  },
  {
    question: 'Does it only recommend ZDR models?',
    answer:
      'No. The full OpenRouter catalog is considered by default. Zero Data Retention becomes a hard eligibility requirement only when you explicitly request ZDR.',
  },
  {
    question: 'Do my API keys go through a ModelShortlist server?',
    answer:
      'No. ModelShortlist is a local stdio MCP server. Your local process uses the API credentials you provide to call the upstream services directly; there is no hosted ModelShortlist backend or MCP telemetry.',
  },
]

type FreshnessCard = {
  icon: LucideIcon
  title: string
  body: string
}

export default function HomePage() {
  return (
    <div id="top">
      <Hero />
      <FreshnessSection />
      <EvidenceSection />
      <HowItWorks />
      <ExamplesSection />
      <LearnSection />
      <InstallSection />
      <TrustSection />
      <FaqSection />
      <FinalCta />
    </div>
  )
}

function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-border/50">
      <div className="hero-grid absolute inset-0" aria-hidden="true" />
      <div className="glow-orb glow-cyan -left-48 -top-48 h-[520px] w-[520px]" aria-hidden="true" />
      <div className="glow-orb glow-violet -right-40 top-12 h-[520px] w-[520px]" aria-hidden="true" />

      <div className="relative mx-auto grid max-w-7xl gap-14 px-6 py-20 sm:py-28 lg:grid-cols-[1.04fr_0.96fr] lg:items-center lg:py-32">
        <div className="max-w-3xl animate-fade-in-up">
          <div className="mb-6 inline-flex flex-wrap items-center gap-2 rounded-full border border-blue-500/25 bg-blue-500/10 px-3 py-1.5 text-xs font-semibold text-blue-700 dark:text-blue-300">
            <BadgeCheck className="h-3.5 w-3.5" aria-hidden="true" />
            Official MCP Registry
            <span className="text-blue-400/60">•</span>
            npm
            <span className="text-blue-400/60">•</span>
            v0.2.3
          </div>

          <h1 className="max-w-4xl text-5xl font-extrabold tracking-tight sm:text-6xl lg:text-7xl">
            Ask which model is best <span className="hero-gradient-text">right now.</span>
          </h1>
          <p className="mt-7 max-w-2xl text-lg leading-8 text-muted-foreground sm:text-xl">
            ModelShortlist gives your AI assistant independent Artificial Analysis benchmark evidence plus current OpenRouter facts—price, context, capabilities, providers, and optional ZDR—so it can recommend the best fit for the workload you actually have.
          </p>

          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <a href="/install" className="brand-gradient-bg inline-flex h-12 items-center justify-center gap-2 rounded-xl px-6 text-base font-semibold text-white">
              Install ModelShortlist
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </a>
            <a href="/how-to-choose-an-ai-model" className="inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-blue-500/25 bg-card/50 px-6 text-base font-semibold transition-colors hover:border-blue-500/45 hover:bg-muted/60">
              See the selection framework
            </a>
          </div>

          <div className="mt-9 grid max-w-2xl grid-cols-2 gap-x-5 gap-y-3 text-sm text-muted-foreground sm:grid-cols-4">
            {[
              ['Current', 'Upstream evidence'],
              ['Local', 'Runs on your machine'],
              ['BYOK', 'Your API credentials'],
              ['Open source', 'MIT licensed'],
            ].map(([title, detail]) => (
              <div key={title} className="border-l border-border/70 pl-3">
                <div className="font-semibold text-foreground">{title}</div>
                <div className="mt-0.5 text-xs leading-5">{detail}</div>
              </div>
            ))}
          </div>
        </div>

        <ProductPreview />
      </div>
    </section>
  )
}

function ProductPreview() {
  return (
    <div className="gradient-border relative mx-auto w-full max-w-xl animate-fade-in rounded-2xl p-[1px] shadow-2xl shadow-blue-950/10">
      <div className="overflow-hidden rounded-2xl bg-card/95 backdrop-blur">
        <div className="flex items-center justify-between border-b border-border/70 px-5 py-3.5">
          <div className="flex items-center gap-2">
            <div className="h-2.5 w-2.5 rounded-full bg-emerald-400 shadow-[0_0_12px_rgb(52_211_153/0.45)]" />
            <span className="font-mono text-xs text-muted-foreground">modelshortlist / recommend_models</span>
          </div>
          <span className="rounded-full bg-blue-500/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-blue-400">Example</span>
        </div>

        <div className="space-y-5 p-5 sm:p-6">
          <div className="rounded-xl border border-border/60 bg-muted/35 p-4">
            <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.15em] text-muted-foreground">
              <BrainCircuit className="h-3.5 w-3.5" aria-hidden="true" />
              Workload
            </div>
            <p className="text-sm leading-6">
              “Long-running coding agent. Tools required. At least 100k context. Quality matters most, but I care about value.”
            </p>
          </div>

          <div className="grid gap-2.5 sm:grid-cols-2">
            <div className="rounded-xl border border-violet-500/20 bg-violet-500/[0.05] p-4">
              <Database className="mb-2 h-4 w-4 text-violet-400" aria-hidden="true" />
              <div className="text-xs font-semibold">Artificial Analysis</div>
              <div className="mt-1 text-[11px] leading-4 text-muted-foreground">Independent benchmark + performance evidence</div>
            </div>
            <div className="rounded-xl border border-cyan-500/20 bg-cyan-500/[0.05] p-4">
              <Network className="mb-2 h-4 w-4 text-cyan-400" aria-hidden="true" />
              <div className="text-xs font-semibold">OpenRouter</div>
              <div className="mt-1 text-[11px] leading-4 text-muted-foreground">Current catalog + operational facts</div>
            </div>
          </div>

          <div className="rounded-xl border border-border/60 bg-background/55 p-4">
            <div className="mb-3 flex items-center justify-between gap-3">
              <span className="text-xs font-semibold uppercase tracking-[0.15em] text-muted-foreground">Decision structure</span>
              <span className="text-[11px] text-muted-foreground">No universal score</span>
            </div>
            <div className="space-y-3 text-sm">
              <div className="flex gap-3"><Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" /><span>Apply hard constraints first</span></div>
              <div className="flex gap-3"><Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" /><span>Compare quality and performance evidence</span></div>
              <div className="flex gap-3"><Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" /><span>Weigh current price and operational fit</span></div>
              <div className="flex gap-3"><Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" /><span>Explain best-fit and best-value tradeoffs</span></div>
            </div>
          </div>

          <div className="flex gap-3 rounded-xl border border-blue-500/20 bg-blue-500/[0.05] p-4 text-xs leading-5 text-muted-foreground">
            <RefreshCw className="mt-0.5 h-4 w-4 shrink-0 text-blue-400" aria-hidden="true" />
            Source freshness is part of the tool output, so degraded evidence can be qualified instead of silently presented as current.
          </div>
        </div>
      </div>
    </div>
  )
}

function SectionHeading({ eyebrow, title, body, centered = false }: { eyebrow: string; title: string; body: string; centered?: boolean }) {
  return (
    <div className={centered ? 'mx-auto max-w-3xl text-center' : 'max-w-3xl'}>
      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-500">{eyebrow}</p>
      <h2 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl">{title}</h2>
      <p className="mt-4 text-lg leading-8 text-muted-foreground">{body}</p>
    </div>
  )
}

function FreshnessSection() {
  const cards: FreshnessCard[] = [
    { icon: Sparkles, title: 'A new model launches', body: 'The competitive set can change immediately, even if your workload stays exactly the same.' },
    { icon: CircleDollarSign, title: 'Pricing moves', body: 'A price cut can turn a previously expensive model into the best-value option.' },
    { icon: Database, title: 'Benchmark evidence changes', body: 'Independent evaluations can change the quality picture as new results appear.' },
    { icon: Wrench, title: 'Capabilities change', body: 'Tool support and other parameters can appear, disappear, or differ across model variants.' },
    { icon: Network, title: 'Providers change', body: 'Endpoint availability and provider options move independently of a model’s benchmark quality.' },
    { icon: ShieldCheck, title: 'ZDR availability changes', body: 'Privacy-sensitive workloads need current endpoint evidence, not assumptions about a model family.' },
  ]

  return (
    <section className="mx-auto max-w-7xl px-6 py-20 sm:py-28">
      <SectionHeading
        eyebrow="Why freshness matters"
        title="Why yesterday’s model recommendation may be wrong today."
        body="Static comparison content gets stale because the model market is not static. ModelShortlist is built to put current evidence inside the assistant that already understands your workload."
      />
      <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map(({ icon: Icon, title, body }) => (
          <article key={title} className="rounded-2xl border border-border/60 bg-card/55 p-5">
            <Icon className="h-5 w-5 text-blue-400" aria-hidden="true" />
            <h3 className="mt-4 font-bold">{title}</h3>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">{body}</p>
          </article>
        ))}
      </div>
      <a href="/how-model-recommendations-stay-current" className="mt-7 inline-flex items-center gap-2 text-sm font-semibold text-blue-500">
        See how ModelShortlist handles freshness and degraded upstreams <ArrowRight className="h-4 w-4" aria-hidden="true" />
      </a>
    </section>
  )
}

function EvidenceSection() {
  return (
    <section className="border-y border-border/50 bg-muted/10">
      <div className="mx-auto max-w-7xl px-6 py-20 sm:py-28">
        <SectionHeading
          eyebrow="Evidence, with clear attribution"
          title="Benchmarks tell you how models perform. Current operational facts tell you what fits."
          body="ModelShortlist keeps those evidence types conceptually separate, then lets the host AI reason across them for the workload you described."
        />

        <div className="mt-12 grid gap-5 lg:grid-cols-2">
          <article className="rounded-2xl border border-violet-500/20 bg-violet-500/[0.045] p-6 sm:p-8">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-violet-500/20 bg-violet-500/10">
              <Database className="h-5 w-5 text-violet-400" aria-hidden="true" />
            </div>
            <p className="mt-5 text-xs font-semibold uppercase tracking-[0.16em] text-violet-500">Independent performance evidence</p>
            <h3 className="mt-2 text-2xl font-extrabold">Artificial Analysis</h3>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">
              Artificial Analysis supplies the independent benchmark and performance evidence. ModelShortlist does not create those benchmarks and only attaches them when it can confidently reconcile the exact model identity.
            </p>
            <ul className="mt-5 space-y-3 text-sm text-muted-foreground">
              {['Intelligence, coding, and agentic evaluation context', 'Performance and pricing fields exposed by the upstream API', 'Conservative matching: missing evidence is preferred over a wrong match'].map((item) => (
                <li key={item} className="flex gap-2.5"><Check className="mt-0.5 h-4 w-4 shrink-0 text-violet-400" />{item}</li>
              ))}
            </ul>
            <a href="/artificial-analysis" className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-violet-500">How Artificial Analysis contributes <ArrowRight className="h-4 w-4" /></a>
          </article>

          <article className="rounded-2xl border border-cyan-500/20 bg-cyan-500/[0.045] p-6 sm:p-8">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-cyan-500/20 bg-cyan-500/10">
              <Network className="h-5 w-5 text-cyan-400" aria-hidden="true" />
            </div>
            <p className="mt-5 text-xs font-semibold uppercase tracking-[0.16em] text-cyan-500">Current operational facts</p>
            <h3 className="mt-2 text-2xl font-extrabold">OpenRouter</h3>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">
              OpenRouter supplies the current catalog and deployment-relevant facts that can make a benchmark-strong model the wrong operational choice for a specific job.
            </p>
            <ul className="mt-5 space-y-3 text-sm text-muted-foreground">
              {['Model availability, context, and supported parameters', 'Current input/output and tiered pricing evidence', 'Provider and ZDR endpoint facts when privacy is explicitly required'].map((item) => (
                <li key={item} className="flex gap-2.5"><Check className="mt-0.5 h-4 w-4 shrink-0 text-cyan-400" />{item}</li>
              ))}
            </ul>
            <a href="/openrouter-model-comparison" className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-cyan-500">Compare OpenRouter models by workload <ArrowRight className="h-4 w-4" /></a>
          </article>
        </div>

        <div className="mt-5 rounded-2xl border border-emerald-500/20 bg-emerald-500/[0.05] p-5 text-sm leading-6 text-muted-foreground">
          <span className="font-semibold text-emerald-500">The judgment stays workload-specific.</span> ModelShortlist retrieves and normalizes evidence; the AI in your MCP client weighs that evidence against the task. There is no permanent global score pretending one model is best for every job.
        </div>
      </div>
    </section>
  )
}

function HowItWorks() {
  const steps = [
    ['01', 'Describe the workload', 'State what you are building, what matters, and any hard constraints such as tools, context, budget, creator, or ZDR.'],
    ['02', 'Build the eligible set', 'ModelShortlist starts from the current OpenRouter catalog and applies explicit hard constraints rather than a hand-picked leaderboard.'],
    ['03', 'Attach current evidence', 'Operational facts are combined with Artificial Analysis evidence when the exact model identity can be matched confidently.'],
    ['04', 'Reason to a shortlist', 'Your host AI explains best-fit, best-value, and constraint-driven tradeoffs using the evidence returned by the MCP.'],
  ]

  return (
    <section id="how-it-works" className="scroll-mt-24 mx-auto max-w-7xl px-6 py-20 sm:py-28">
      <SectionHeading
        eyebrow="How it works"
        title="Current evidence in. Workload-specific reasoning out."
        body="ModelShortlist is a read-only context layer, not a model router. It retrieves evidence; your AI assistant makes the recommendation."
      />
      <div className="mt-12 grid gap-4 lg:grid-cols-4">
        {steps.map(([number, title, body]) => (
          <article key={number} className="rounded-2xl border border-border/60 bg-card/55 p-6">
            <div className="font-mono text-sm font-bold text-blue-400">{number}</div>
            <h3 className="mt-6 text-lg font-bold">{title}</h3>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">{body}</p>
          </article>
        ))}
      </div>
    </section>
  )
}

function ExamplesSection() {
  return (
    <section id="examples" className="scroll-mt-24 border-y border-border/50 bg-muted/10">
      <div className="mx-auto max-w-7xl px-6 py-20 sm:py-28">
        <SectionHeading
          eyebrow="Ask naturally"
          title="Start with the decision you actually need to make."
          body="No special prompt syntax is required. Be explicit about hard constraints; let the assistant reason about everything else."
          centered
        />
        <div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {examples.map((example, index) => (
            <article key={example} className="group flex min-h-44 flex-col rounded-2xl border border-border/60 bg-background/65 p-5 transition-all hover:border-blue-500/30">
              <div className="mb-5 flex items-center justify-between">
                <span className="font-mono text-[11px] text-muted-foreground">PROMPT {String(index + 1).padStart(2, '0')}</span>
                <Sparkles className="h-4 w-4 text-violet-400 opacity-70" aria-hidden="true" />
              </div>
              <p className="mt-auto text-sm font-medium leading-6">“{example}”</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

function LearnSection() {
  const links = [
    ['/how-to-choose-an-ai-model', 'How to choose an AI model', 'A practical framework for hard constraints, quality evidence, economics, and current operational fit.'],
    ['/coding-agents', 'Best models for coding agents', 'Tool use, context, coding and agentic evidence, and long-running token economics.'],
    ['/document-extraction-models', 'Models for document extraction', 'Extraction reliability, structured output, context, and high-volume cost tradeoffs.'],
    ['/models-under-10-per-million-output', 'Models under $10 / 1M output', 'Apply a hard price ceiling, then compare the strongest capable models that remain.'],
    ['/modelshortlist-vs-static-leaderboards', 'ModelShortlist vs leaderboards', 'Why independent benchmarks are important evidence but not the whole deployment decision.'],
    ['/modelshortlist-vs-model-routers', 'ModelShortlist vs model routers', 'Recommendation and runtime inference routing solve different problems.'],
  ]

  return (
    <section className="mx-auto max-w-7xl px-6 py-20 sm:py-28">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <SectionHeading
          eyebrow="Guides"
          title="Learn the decision, not a temporary top-10 list."
          body="The guides explain what criteria matter and how to ask for a current answer without hard-coding today’s model ranking into tomorrow’s advice."
        />
        <a href="/guides" className="inline-flex shrink-0 items-center gap-2 text-sm font-semibold text-blue-500">Browse all guides <ArrowRight className="h-4 w-4" /></a>
      </div>
      <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {links.map(([href, title, body]) => (
          <a key={href} href={href} className="group rounded-2xl border border-border/60 bg-card/55 p-5 transition-all hover:-translate-y-1 hover:border-blue-500/30">
            <h3 className="font-bold">{title}</h3>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">{body}</p>
            <span className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-blue-500">Read guide <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" /></span>
          </a>
        ))}
      </div>
    </section>
  )
}

function InstallSection() {
  return (
    <section id="install" className="scroll-mt-24 border-y border-border/50 bg-muted/10">
      <div className="mx-auto max-w-7xl px-6 py-20 sm:py-28">
        <SectionHeading
          eyebrow="Install"
          title="Bring two keys. Keep them local."
          body="ModelShortlist is a local stdio MCP server. You supply Artificial Analysis and OpenRouter credentials; there is no ModelShortlist account or hosted key vault in the middle."
        />

        <div className="mt-12 grid gap-7 lg:grid-cols-[0.82fr_1.18fr]">
          <div className="space-y-4">
            {[
              [KeyRound, '1. Get upstream API keys', 'Use your own Artificial Analysis and OpenRouter API keys. ModelShortlist does not issue or proxy either credential.'],
              [Terminal, '2. Add the local MCP server', 'Use the npm package directly in your MCP client or follow the guided install page for client-specific config.'],
              [BrainCircuit, '3. Ask the real model-selection question', 'Describe the workload, hard constraints, and what you value. Your assistant can call ModelShortlist when it needs current evidence.'],
            ].map(([Icon, title, body]) => {
              const Component = Icon as LucideIcon
              return (
                <div key={String(title)} className="flex gap-4 rounded-xl border border-border/60 bg-background/60 p-5">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-500/10"><Component className="h-4 w-4 text-blue-400" /></div>
                  <div>
                    <h3 className="font-semibold">{String(title)}</h3>
                    <p className="mt-1.5 text-sm leading-6 text-muted-foreground">{String(body)}</p>
                  </div>
                </div>
              )
            })}
          </div>

          <div className="space-y-5">
            <CodeBlock code={mcpConfig} label="MCP config · npm" />
            <div className="flex flex-wrap gap-3 text-sm">
              <a href="/install" className="brand-gradient-bg inline-flex items-center gap-2 rounded-lg px-4 py-2.5 font-semibold text-white">
                <Wrench className="h-4 w-4" />Client-specific configurator
              </a>
              <a href={NPM_URL} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-lg border border-border/70 bg-card/55 px-4 py-2.5 font-semibold transition-colors hover:border-blue-500/35">
                <PackageCheck className="h-4 w-4 text-blue-400" />npm package
              </a>
            </div>
            <p className="text-xs leading-5 text-muted-foreground">
              Supported setup guidance includes Claude Desktop, Claude Code, Cursor, Hermes Desktop, and VS Code / Copilot. Windows configurations use <code className="font-mono">npx.cmd</code> where appropriate.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

function TrustSection() {
  const principles = [
    [ShieldCheck, 'No hosted ModelShortlist backend', 'Your local MCP process calls upstream APIs directly.'],
    [KeyRound, 'No MCP telemetry', 'ModelShortlist does not add product telemetry to the local MCP runtime.'],
    [Code2, 'MIT licensed source', 'Inspect the code, package contents, matching logic, and release workflow yourself.'],
    [Zap, 'Read-only MCP tools', 'The MCP retrieves and compares evidence; it does not place model calls or mutate external systems.'],
  ]

  return (
    <section className="mx-auto max-w-7xl px-6 py-20 sm:py-28">
      <div className="grid gap-12 lg:grid-cols-[0.75fr_1.25fr] lg:items-start">
        <div>
          <SectionHeading
            eyebrow="Local + open source"
            title="Model selection evidence without another hosted account."
            body="The project is intentionally a local BYOK context layer. It stays out of the inference path and keeps the architecture inspectable."
          />
          <a href={GITHUB_URL} target="_blank" rel="noreferrer" className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-blue-500"><Github className="h-4 w-4" />View the source on GitHub</a>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {principles.map(([Icon, title, body]) => {
            const Component = Icon as LucideIcon
            return (
              <article key={String(title)} className="rounded-2xl border border-border/60 bg-card/55 p-5">
                <Component className="h-5 w-5 text-blue-400" aria-hidden="true" />
                <h3 className="mt-4 font-bold">{String(title)}</h3>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">{String(body)}</p>
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}

function FaqSection() {
  return (
    <section className="border-y border-border/50 bg-muted/10">
      <div className="mx-auto max-w-5xl px-6 py-20 sm:py-28">
        <SectionHeading
          eyebrow="FAQ"
          title="What ModelShortlist is—and what it is not."
          body="A local evidence layer for model selection, with explicit attribution and current operational context."
        />
        <div className="mt-10 divide-y divide-border/60 rounded-2xl border border-border/60 bg-background/65 px-5 sm:px-7">
          {faqs.map((faq) => (
            <details key={faq.question} className="group py-5">
              <summary className="cursor-pointer list-none pr-8 font-semibold marker:hidden">{faq.question}</summary>
              <p className="mt-3 max-w-3xl text-sm leading-6 text-muted-foreground">{faq.answer}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  )
}

function FinalCta() {
  return (
    <section className="relative overflow-hidden">
      <div className="dot-grid absolute inset-0 opacity-30" aria-hidden="true" />
      <div className="relative mx-auto max-w-4xl px-6 py-20 text-center sm:py-28">
        <Radar className="mx-auto h-9 w-9 text-blue-400" aria-hidden="true" />
        <h2 className="mt-5 text-3xl font-extrabold tracking-tight sm:text-4xl">Ask the current model market, not yesterday’s recommendation.</h2>
        <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-muted-foreground">
          Install the local MCP, add your Artificial Analysis and OpenRouter keys, and let your assistant reason from current evidence for the workload in front of you.
        </p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <a href="/install" className="brand-gradient-bg inline-flex h-12 items-center justify-center gap-2 rounded-xl px-6 font-semibold text-white">Install ModelShortlist <ArrowRight className="h-4 w-4" /></a>
          <a href="/guides" className="inline-flex h-12 items-center justify-center rounded-xl border border-border/70 bg-card/55 px-6 font-semibold transition-colors hover:border-blue-500/35">Browse guides</a>
        </div>
      </div>
    </section>
  )
}
