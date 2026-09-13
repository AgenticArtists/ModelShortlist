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
  Layers3,
  LockKeyhole,
  Network,
  PackageCheck,
  Radar,
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

const cloneInstall = `git clone https://github.com/AgenticArtists/ModelShortlist.git
cd ModelShortlist
npm install
npm run setup`

const examples = [
  'What’s the cheapest model I’d trust with repetitive coding subagents? Tool use is required.',
  'I need 200k context and tool use. What are my best current options?',
  'I need 200k context, tool use, and ZDR. What are my best current options?',
  'Is the premium frontier model actually worth the price for this coding workload?',
  'Best model for extracting structured data from thousands of documents while keeping output cost low?',
  'I need maximum autonomous coding performance under $10 per million output tokens. What should I use?',
]

const faqs = [
  {
    question: 'Does ModelShortlist choose one “best” model for everyone?',
    answer:
      'No. The host AI weighs the evidence against your workload and constraints. ModelShortlist deliberately avoids one universal scoring formula because coding, extraction, reasoning, latency-sensitive work, and privacy-sensitive work have different tradeoffs.',
  },
  {
    question: 'Does it only recommend ZDR models?',
    answer:
      'No. The full OpenRouter catalog is considered by default. Zero Data Retention becomes a hard filter only when you explicitly require ZDR in the request.',
  },
  {
    question: 'Where does the data come from?',
    answer:
      'OpenRouter supplies model catalog, capability, pricing, context, and ZDR endpoint information. Artificial Analysis supplies independent benchmark and performance data when ModelShortlist can confidently reconcile the model identity.',
  },
  {
    question: 'What happens when a model has no Artificial Analysis match?',
    answer:
      'It stays eligible. ModelShortlist would rather show a missing benchmark than attach benchmark data to the wrong model. Matching is intentionally conservative.',
  },
  {
    question: 'Do my API keys go through a ModelShortlist server?',
    answer:
      'No hosted ModelShortlist backend is involved. The MCP runs locally and uses the API credentials you provide to call the upstream services directly.',
  },
  {
    question: 'Which clients can use it?',
    answer:
      'Any compatible client that can launch a local stdio MCP server can potentially use ModelShortlist. The repository includes setup guidance for Hermes Desktop, Claude Code, Cursor, and VS Code/Copilot.',
  },
]

export default function HomePage() {
  return (
    <div id="top">
      <Hero />
      <WhySection />
      <HowItWorks />
      <EvidenceSection />
      <ZdrSection />
      <ExamplesSection />
      <InstallSection />
      <OpenSourceSection />
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

      <div className="relative mx-auto grid max-w-7xl gap-16 px-6 py-20 sm:py-28 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:py-36">
        <div className="max-w-3xl animate-fade-in-up">
          <div className="mb-6 inline-flex flex-wrap items-center gap-2 rounded-full border border-blue-500/25 bg-blue-500/10 px-3 py-1.5 text-xs font-semibold text-blue-700 dark:text-blue-300">
            <BadgeCheck className="h-3.5 w-3.5" aria-hidden="true" />
            Published in the Official MCP Registry
            <span className="text-blue-400/60">•</span>
            v0.2.2
          </div>

          <h1 className="max-w-4xl text-5xl font-extrabold tracking-tight sm:text-6xl lg:text-7xl">
            Describe the job. <span className="hero-gradient-text">Get the shortlist.</span>
          </h1>
          <p className="mt-7 max-w-2xl text-lg leading-8 text-muted-foreground sm:text-xl">
            ModelShortlist gives your AI assistant current model-selection context from the full OpenRouter catalog and Artificial Analysis benchmarks—then lets the assistant reason about what actually fits your workload.
          </p>

          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <a href="#install" className="brand-gradient-bg inline-flex h-12 items-center justify-center gap-2 rounded-xl px-6 text-base font-semibold text-white">
              Install ModelShortlist
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </a>
            <a
              href={GITHUB_URL}
              target="_blank"
              rel="noreferrer"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-blue-500/25 bg-card/50 px-6 text-base font-semibold transition-colors hover:border-blue-500/45 hover:bg-muted/60"
            >
              <Github className="h-4 w-4" aria-hidden="true" />
              View source
            </a>
          </div>

          <div className="mt-9 grid max-w-2xl grid-cols-2 gap-x-5 gap-y-3 text-sm text-muted-foreground sm:grid-cols-4">
            {[
              ['Local', 'Runs on your machine'],
              ['BYOK', 'Your API credentials'],
              ['MIT', 'Open source'],
              ['ZDR', 'Only when requested'],
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
              Your workload
            </div>
            <p className="text-sm leading-6">
              “Long-running coding agent. Tool use required. At least 100k context. Quality matters most, but I care about value.”
            </p>
          </div>

          <div className="grid gap-2.5 sm:grid-cols-3">
            {[
              ['Catalog', 'Full OpenRouter set', Radar],
              ['Benchmarks', 'Matched when verified', Database],
              ['Constraints', 'Applied to the job', Wrench],
            ].map(([title, detail, Icon]) => {
              const Component = Icon as typeof Radar
              return (
                <div key={String(title)} className="rounded-xl border border-border/60 bg-background/55 p-3.5">
                  <Component className="mb-2 h-4 w-4 text-blue-400" aria-hidden="true" />
                  <div className="text-xs font-semibold">{String(title)}</div>
                  <div className="mt-1 text-[11px] leading-4 text-muted-foreground">{String(detail)}</div>
                </div>
              )
            })}
          </div>

          <div>
            <div className="mb-3 flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-[0.15em] text-muted-foreground">Shortlist anatomy</span>
              <span className="text-[11px] text-muted-foreground">No universal score</span>
            </div>
            <div className="space-y-2.5">
              {[
                ['01', 'Best fit', 'Quality + workload fit + capabilities'],
                ['02', 'Best value', 'Competitive fit at a lower effective cost'],
                ['03', 'Constraint fit', 'Privacy, context, tools, or provider needs'],
              ].map(([rank, label, note], index) => (
                <div key={rank} className="flex items-start gap-3 rounded-xl border border-border/55 bg-background/55 p-3.5">
                  <span className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-md font-mono text-[10px] font-bold ${index === 0 ? 'bg-blue-500/15 text-blue-400' : 'bg-muted text-muted-foreground'}`}>{rank}</span>
                  <div className="min-w-0">
                    <div className="text-sm font-semibold">{label}</div>
                    <div className="mt-0.5 text-xs leading-5 text-muted-foreground">{note}</div>
                  </div>
                  {index === 0 ? <Sparkles className="ml-auto h-4 w-4 shrink-0 text-violet-400" aria-hidden="true" /> : null}
                </div>
              ))}
            </div>
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

function WhySection() {
  const cards = [
    {
      icon: BrainCircuit,
      title: 'The workload matters',
      body: 'The best model for autonomous coding is not automatically the best model for cheap extraction, giant-context synthesis, or latency-sensitive tools.',
    },
    {
      icon: Layers3,
      title: 'Constraints change the answer',
      body: 'Context, tool calling, input and output price, provider options, and privacy requirements can eliminate an otherwise impressive model.',
    },
    {
      icon: Radar,
      title: 'The market keeps moving',
      body: 'Model catalogs, prices, endpoints, and capabilities change quickly. ModelShortlist pulls current upstream context instead of relying on a stale mental leaderboard.',
    },
  ]

  return (
    <section className="mx-auto max-w-7xl px-6 py-20 sm:py-28">
      <SectionHeading
        eyebrow="Why it exists"
        title="A benchmark table cannot understand your job."
        body="Model selection is a multi-variable decision. ModelShortlist gives the AI already helping you enough current evidence to make that decision with context."
      />
      <div className="mt-12 grid gap-5 md:grid-cols-3">
        {cards.map(({ icon: Icon, title, body }) => (
          <article key={title} className="group rounded-2xl border border-border/65 bg-card/60 p-6 transition-all hover:-translate-y-1 hover:border-blue-500/30 hover:shadow-xl hover:shadow-blue-500/5">
            <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl border border-blue-500/20 bg-blue-500/10">
              <Icon className="h-5 w-5 text-blue-400" aria-hidden="true" />
            </div>
            <h3 className="text-xl font-bold">{title}</h3>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">{body}</p>
          </article>
        ))}
      </div>
    </section>
  )
}

function HowItWorks() {
  const steps = [
    ['01', 'Describe the workload', 'Ask naturally. State what you are building, what matters most, and any non-negotiable constraints.'],
    ['02', 'Build the candidate set', 'ModelShortlist starts with the full OpenRouter catalog instead of silently limiting the search to a hand-picked leaderboard.'],
    ['03', 'Attach evidence', 'Capabilities, context, price, and provider data are combined with Artificial Analysis metrics when the model identity can be reconciled confidently.'],
    ['04', 'Reason to a shortlist', 'Your host AI weighs those facts for the workload and explains tradeoffs rather than returning an unexplained universal score.'],
  ]

  return (
    <section id="how-it-works" className="scroll-mt-24 border-y border-border/50 bg-muted/10">
      <div className="mx-auto max-w-7xl px-6 py-20 sm:py-28">
        <SectionHeading
          eyebrow="How it works"
          title="Model context in. Workload-specific reasoning out."
          body="ModelShortlist is a read-only MCP context layer. It gathers the evidence; the AI in your client does the judgment."
        />
        <div className="mt-14 grid gap-4 lg:grid-cols-4">
          {steps.map(([number, title, body]) => (
            <article key={number} className="relative rounded-2xl border border-border/60 bg-background/65 p-6">
              <div className="mb-7 font-mono text-sm font-bold text-blue-400">{number}</div>
              <h3 className="text-lg font-bold">{title}</h3>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">{body}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

function EvidenceSection() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-20 sm:py-28">
      <div className="grid gap-14 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
        <div>
          <SectionHeading
            eyebrow="Evidence layer"
            title="Two sources. Different jobs."
            body="Operational catalog data and independent performance evidence are kept conceptually separate, so the assistant can reason about both without pretending they measure the same thing."
          />
          <div className="mt-7 rounded-xl border border-emerald-500/20 bg-emerald-500/[0.06] p-4 text-sm leading-6 text-muted-foreground">
            <span className="font-semibold text-emerald-500">Conservative by design.</span> If Artificial Analysis cannot be matched confidently to an OpenRouter model, the benchmark fields stay empty. The model remains eligible.
          </div>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <article className="rounded-2xl border border-border/65 bg-card/60 p-6 sm:p-7">
            <div className="mb-5 flex items-center justify-between gap-4">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-cyan-500/20 bg-cyan-500/10">
                <Network className="h-5 w-5 text-cyan-400" aria-hidden="true" />
              </div>
              <span className="rounded-full border border-border/70 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.15em] text-muted-foreground">Catalog + routing</span>
            </div>
            <h3 className="text-xl font-bold">OpenRouter</h3>
            <ul className="mt-5 space-y-3 text-sm text-muted-foreground">
              {['Full model catalog', 'Tool/function support', 'Context and completion limits', 'Input/output pricing', 'ZDR endpoint availability when requested', 'Endpoint/provider details for ZDR workloads'].map((item) => (
                <li key={item} className="flex gap-2.5"><Check className="mt-0.5 h-4 w-4 shrink-0 text-cyan-400" aria-hidden="true" />{item}</li>
              ))}
            </ul>
          </article>

          <article className="rounded-2xl border border-border/65 bg-card/60 p-6 sm:p-7">
            <div className="mb-5 flex items-center justify-between gap-4">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-violet-500/20 bg-violet-500/10">
                <Database className="h-5 w-5 text-violet-400" aria-hidden="true" />
              </div>
              <span className="rounded-full border border-border/70 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.15em] text-muted-foreground">Performance</span>
            </div>
            <h3 className="text-xl font-bold">Artificial Analysis</h3>
            <ul className="mt-5 space-y-3 text-sm text-muted-foreground">
              {['Intelligence Index', 'Coding Index', 'Agentic Index', 'Independent pricing context', 'Median performance data', 'Attached only on confident model matches'].map((item) => (
                <li key={item} className="flex gap-2.5"><Check className="mt-0.5 h-4 w-4 shrink-0 text-violet-400" aria-hidden="true" />{item}</li>
              ))}
            </ul>
          </article>
        </div>
      </div>
    </section>
  )
}

function ZdrSection() {
  return (
    <section className="border-y border-border/50 bg-muted/10">
      <div className="mx-auto max-w-7xl px-6 py-20 sm:py-24">
        <div className="overflow-hidden rounded-2xl border border-blue-500/20 bg-gradient-to-br from-blue-500/[0.08] via-violet-500/[0.05] to-transparent">
          <div className="grid gap-10 p-7 sm:p-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-center lg:p-12">
            <div>
              <div className="mb-5 inline-flex h-11 w-11 items-center justify-center rounded-xl border border-blue-500/20 bg-blue-500/10">
                <LockKeyhole className="h-5 w-5 text-blue-400" aria-hidden="true" />
              </div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-500">Privacy is a constraint, not a default filter</p>
              <h2 className="mt-3 text-3xl font-extrabold sm:text-4xl">ZDR when you ask for ZDR.</h2>
              <p className="mt-4 max-w-2xl text-base leading-7 text-muted-foreground">
                ModelShortlist considers the full OpenRouter catalog by default. If Zero Data Retention is mandatory, say so. Only then does ZDR become a hard eligibility requirement, with constraints checked against the same real endpoint.
              </p>
            </div>
            <div className="space-y-3">
              <div className="rounded-xl border border-border/65 bg-background/65 p-5">
                <div className="mb-2 text-xs font-semibold uppercase tracking-[0.15em] text-muted-foreground">Normal request</div>
                <p className="text-sm leading-6">“Best value coding model with tools and at least 100k context.”</p>
                <div className="mt-3 inline-flex items-center gap-2 text-xs font-semibold text-emerald-500"><Check className="h-3.5 w-3.5" />Full catalog considered</div>
              </div>
              <div className="rounded-xl border border-blue-500/25 bg-blue-500/[0.07] p-5">
                <div className="mb-2 text-xs font-semibold uppercase tracking-[0.15em] text-blue-400">Privacy-sensitive request</div>
                <p className="text-sm leading-6">“Same workload, but ZDR is mandatory.”</p>
                <div className="mt-3 inline-flex items-center gap-2 text-xs font-semibold text-blue-400"><ShieldCheck className="h-3.5 w-3.5" />ZDR becomes a hard constraint</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function ExamplesSection() {
  return (
    <section id="examples" className="scroll-mt-24 mx-auto max-w-7xl px-6 py-20 sm:py-28">
      <SectionHeading
        eyebrow="Ask it naturally"
        title="Start with the decision you actually need to make."
        body="No special prompt language is required. Be explicit about hard constraints; let the assistant reason about everything else."
        centered
      />
      <div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {examples.map((example, index) => (
          <article key={example} className="group flex min-h-44 flex-col rounded-2xl border border-border/60 bg-card/55 p-5 transition-all hover:border-blue-500/30 hover:bg-card/80">
            <div className="mb-5 flex items-center justify-between">
              <span className="font-mono text-[11px] text-muted-foreground">PROMPT {String(index + 1).padStart(2, '0')}</span>
              <Sparkles className="h-4 w-4 text-violet-400 opacity-60 transition-opacity group-hover:opacity-100" aria-hidden="true" />
            </div>
            <p className="mt-auto text-sm font-medium leading-6">“{example}”</p>
          </article>
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
          body="ModelShortlist is a local stdio MCP server. You supply your own Artificial Analysis and OpenRouter credentials; there is no ModelShortlist account or hosted key vault in the middle."
        />

        <div className="mt-12 grid gap-7 lg:grid-cols-[0.82fr_1.18fr]">
          <div className="space-y-4">
            {[
              [KeyRound, '1. Get upstream API keys', 'You need an Artificial Analysis API key and an OpenRouter API key. ModelShortlist does not issue or proxy either credential.'],
              [Terminal, '2. Add the MCP server', 'Use the npm package directly in your MCP client, or clone the repository and run the guided local setup.'],
              [BrainCircuit, '3. Ask your assistant', 'Once the tools are discovered, describe the workload in a normal chat. The assistant can call ModelShortlist when model selection is relevant.'],
            ].map(([Icon, title, body]) => {
              const Component = Icon as typeof KeyRound
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

            <div className="rounded-xl border border-amber-500/20 bg-amber-500/[0.05] p-4 text-xs leading-5 text-muted-foreground">
              <span className="font-semibold text-amber-500">Windows note:</span> some GUI clients do not expose <code className="font-mono">npx</code> on PATH. The repository’s guided setup prints absolute executable paths to avoid that problem.
            </div>
          </div>

          <div className="space-y-5">
            <CodeBlock code={mcpConfig} label="MCP config · npm" />
            <CodeBlock code={cloneInstall} label="Local clone · macOS / Linux" />
            <div className="flex flex-wrap gap-3 text-sm">
              <a href={NPM_URL} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-lg border border-border/70 bg-card/55 px-4 py-2.5 font-semibold transition-colors hover:border-blue-500/35">
                <PackageCheck className="h-4 w-4 text-blue-400" />npm package
              </a>
              <a href={`${GITHUB_URL}#quick-start`} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-lg border border-border/70 bg-card/55 px-4 py-2.5 font-semibold transition-colors hover:border-blue-500/35">
                <Code2 className="h-4 w-4 text-violet-400" />Full setup docs
              </a>
            </div>
          </div>
        </div>

        <div className="mt-12 rounded-2xl border border-border/60 bg-card/45 p-6 sm:p-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">Designed for MCP-capable clients</p>
              <h3 className="mt-2 text-xl font-bold">Hermes Desktop · Claude Code · Cursor · VS Code / Copilot</h3>
              <p className="mt-2 text-sm text-muted-foreground">Any compatible client that can launch a local stdio MCP server can potentially use ModelShortlist.</p>
            </div>
            <div className="inline-flex shrink-0 items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/[0.07] px-4 py-2 text-sm font-semibold text-emerald-500">
              <Zap className="h-4 w-4" />3 MCP tools
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function OpenSourceSection() {
  const principles = [
    [ShieldCheck, 'No hosted ModelShortlist backend', 'Your local process calls the upstream APIs with the credentials you provide.'],
    [KeyRound, 'No bundled data resale', 'ModelShortlist does not package or redistribute the Artificial Analysis dataset.'],
    [Code2, 'MIT licensed source', 'Inspect it, fork it, contribute to it, or audit exactly what the MCP process does.'],
    [CircleDollarSign, 'Free software', 'There is no ModelShortlist subscription. Upstream API access remains subject to each provider’s terms and pricing.'],
  ]

  return (
    <section className="mx-auto max-w-7xl px-6 py-20 sm:py-28">
      <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
        <SectionHeading
          eyebrow="Local + open source"
          title="The model selector should be inspectable too."
          body="ModelShortlist’s architecture is intentionally boring where trust matters: local process, read-only tools, explicit upstream sources, and no hidden ranking engine."
        />
        <div className="grid gap-4 sm:grid-cols-2">
          {principles.map(([Icon, title, body]) => {
            const Component = Icon as typeof ShieldCheck
            return (
              <article key={String(title)} className="rounded-2xl border border-border/60 bg-card/50 p-5">
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
      <div className="mx-auto max-w-4xl px-6 py-20 sm:py-28">
        <SectionHeading
          eyebrow="FAQ"
          title="The important implementation details."
          body="The short version: current evidence, conservative matching, local keys, and workload-specific reasoning."
          centered
        />
        <div className="mt-10 divide-y divide-border/60 rounded-2xl border border-border/60 bg-background/60 px-5 sm:px-7">
          {faqs.map(({ question, answer }) => (
            <details key={question} className="group py-1">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-5 py-5 font-semibold">
                <span>{question}</span>
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md border border-border/70 text-muted-foreground transition-transform group-open:rotate-45" aria-hidden="true">+</span>
              </summary>
              <p className="max-w-3xl pb-5 pr-9 text-sm leading-6 text-muted-foreground">{answer}</p>
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
      <div className="relative mx-auto max-w-5xl px-6 py-24 text-center sm:py-32">
        <div className="mx-auto mb-6 flex h-12 w-12 items-center justify-center rounded-2xl border border-violet-500/20 bg-violet-500/10">
          <Sparkles className="h-5 w-5 text-violet-400" aria-hidden="true" />
        </div>
        <h2 className="text-4xl font-extrabold tracking-tight sm:text-5xl">Stop picking models from memory.</h2>
        <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-muted-foreground">
          Put current catalog, pricing, capability, privacy, and benchmark evidence inside the AI assistant already helping you build.
        </p>
        <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
          <a href="#install" className="brand-gradient-bg inline-flex h-12 items-center justify-center gap-2 rounded-xl px-6 font-semibold text-white">
            Install ModelShortlist <ArrowRight className="h-4 w-4" />
          </a>
          <a href={GITHUB_URL} target="_blank" rel="noreferrer" className="inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-border/70 bg-card/55 px-6 font-semibold transition-colors hover:border-blue-500/35">
            <Github className="h-4 w-4" />Star / fork on GitHub
          </a>
        </div>
      </div>
    </section>
  )
}
