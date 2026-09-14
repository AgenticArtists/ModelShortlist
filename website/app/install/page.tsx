import type { Metadata } from 'next'
import { ArrowRight, ExternalLink, KeyRound, PackageCheck, ShieldCheck, TerminalSquare } from 'lucide-react'
import InstallConfigurator from '@/components/InstallConfigurator'

const GITHUB_URL = 'https://github.com/AgenticArtists/ModelShortlist'
const NPM_URL = 'https://www.npmjs.com/package/@agentic.artists/modelshortlist'

export const metadata: Metadata = {
  title: 'Install ModelShortlist',
  description: 'Install ModelShortlist in Hermes Desktop, Cursor, Claude Code, or VS Code/Copilot with client-specific copy-paste configuration.',
  alternates: { canonical: 'https://modelshortlist.com/install' },
}

export default function InstallPage() {
  return (
    <div id="top">
      <section className="relative overflow-hidden border-b border-border/50">
        <div className="hero-grid absolute inset-0" aria-hidden="true" />
        <div className="glow-orb glow-cyan -left-52 -top-52 h-[500px] w-[500px]" aria-hidden="true" />
        <div className="relative mx-auto max-w-5xl px-6 py-16 sm:py-20 lg:py-24">
          <div className="max-w-3xl">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-blue-500/20 bg-blue-500/10 px-3 py-1.5 text-xs font-semibold text-blue-400">
              <TerminalSquare className="h-3.5 w-3.5" />
              Fast install
            </div>
            <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
              Install ModelShortlist in <span className="hero-gradient-text">a few minutes.</span>
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-muted-foreground">
              You need Node.js 20+, an Artificial Analysis API key, and an OpenRouter API key. Pick your client below and ModelShortlist will generate the exact config or command for you.
            </p>
          </div>

          <div className="mt-8 grid gap-3 sm:grid-cols-3">
            {[
              [KeyRound, '2 API keys', 'Artificial Analysis + OpenRouter'],
              [PackageCheck, '1 npm package', '@agentic.artists/modelshortlist'],
              [ShieldCheck, 'No ModelShortlist account', 'Keys stay local to your MCP process'],
            ].map(([Icon, title, body]) => {
              const Component = Icon as typeof KeyRound
              return (
                <div key={String(title)} className="rounded-xl border border-border/60 bg-card/55 p-4">
                  <Component className="h-4 w-4 text-blue-400" />
                  <div className="mt-3 text-sm font-semibold">{String(title)}</div>
                  <div className="mt-1 text-xs leading-5 text-muted-foreground">{String(body)}</div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-14 sm:py-20">
        <InstallConfigurator />
      </section>

      <section className="border-y border-border/50 bg-muted/10">
        <div className="mx-auto max-w-6xl px-6 py-16 sm:py-20">
          <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr]">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-500">Before you install</p>
              <h2 className="mt-3 text-3xl font-extrabold tracking-tight">Get the two upstream keys.</h2>
              <p className="mt-4 text-sm leading-6 text-muted-foreground">
                ModelShortlist is BYOK. It does not create, store, or proxy these credentials. Each local MCP process calls the upstream services directly.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <a href="https://artificialanalysis.ai/" target="_blank" rel="noreferrer" className="group rounded-2xl border border-border/60 bg-background/65 p-5 transition-colors hover:border-blue-500/30">
                <div className="flex items-center justify-between gap-3">
                  <div className="font-semibold">Artificial Analysis</div>
                  <ExternalLink className="h-4 w-4 text-muted-foreground transition-colors group-hover:text-blue-400" />
                </div>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">Create or retrieve the API key used for benchmark and performance context.</p>
              </a>
              <a href="https://openrouter.ai/settings/keys" target="_blank" rel="noreferrer" className="group rounded-2xl border border-border/60 bg-background/65 p-5 transition-colors hover:border-blue-500/30">
                <div className="flex items-center justify-between gap-3">
                  <div className="font-semibold">OpenRouter</div>
                  <ExternalLink className="h-4 w-4 text-muted-foreground transition-colors group-hover:text-blue-400" />
                </div>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">Create the API key used to read current model, pricing, capability, and endpoint metadata.</p>
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-16 sm:py-20">
        <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-500">Verify it worked</p>
            <h2 className="mt-3 text-3xl font-extrabold tracking-tight">Ask one normal question.</h2>
            <p className="mt-4 text-sm leading-6 text-muted-foreground">
              Once your client discovers the three ModelShortlist tools, you do not need special syntax. Just describe the workload and constraints in chat.
            </p>
            <div className="mt-6 rounded-2xl border border-blue-500/20 bg-blue-500/[0.05] p-5 text-sm leading-7">
              “I need the best-value model for a long-running autonomous coding agent. Tool calling is required and I need at least 100k context. Quality matters more than cost, but I care about value.”
            </div>
          </div>

          <div className="rounded-2xl border border-border/60 bg-card/55 p-6">
            <h3 className="font-bold">Troubleshooting</h3>
            <div className="mt-4 space-y-4 text-sm leading-6 text-muted-foreground">
              <p><span className="font-semibold text-foreground">Windows GUI client cannot find npx:</span> enable the Windows toggle above so the generated config uses <code className="font-mono text-foreground">npx.cmd</code>. If the app still cannot see Node, use the repository’s guided local setup, which prints absolute executable paths.</p>
              <p><span className="font-semibold text-foreground">Tools do not appear:</span> restart or refresh the MCP client after saving the config, then check that both API keys are present and Node.js 20+ is installed.</p>
              <p><span className="font-semibold text-foreground">Prefer a local clone:</span> run <code className="font-mono text-foreground">npm run setup</code> after cloning the repo. The setup wizard stores keys in a gitignored local file and prints ready-to-paste configs.</p>
            </div>
            <div className="mt-6 flex flex-wrap gap-3">
              <a href={GITHUB_URL} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-lg border border-border/70 px-4 py-2.5 text-sm font-semibold transition-colors hover:border-blue-500/35">
                Full docs <ArrowRight className="h-4 w-4" />
              </a>
              <a href={NPM_URL} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-lg border border-border/70 px-4 py-2.5 text-sm font-semibold transition-colors hover:border-blue-500/35">
                npm package <ExternalLink className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
