'use client'

import { useMemo, useState } from 'react'
import { Check, Copy, KeyRound, Laptop, ShieldCheck, Terminal } from 'lucide-react'

const clients = ['Hermes Desktop', 'Cursor', 'Claude Code', 'VS Code / Copilot'] as const
type Client = (typeof clients)[number]

function shellQuote(value: string) {
  return `"${value.replace(/(["\\$`])/g, '\\$1')}"`
}

export default function InstallConfigurator() {
  const [client, setClient] = useState<Client>('Hermes Desktop')
  const [aaKey, setAaKey] = useState('')
  const [orKey, setOrKey] = useState('')
  const [windows, setWindows] = useState(false)
  const [copied, setCopied] = useState(false)

  const output = useMemo(() => {
    const artificial = aaKey || 'YOUR_ARTIFICIAL_ANALYSIS_KEY'
    const openrouter = orKey || 'YOUR_OPENROUTER_KEY'
    const npxCommand = windows ? 'npx.cmd' : 'npx'

    if (client === 'Claude Code') {
      return `claude mcp add modelshortlist --scope user --env ARTIFICIAL_ANALYSIS_API_KEY=${shellQuote(artificial)} --env OPENROUTER_API_KEY=${shellQuote(openrouter)} -- ${npxCommand} -y @agentic.artists/modelshortlist`
    }

    if (client === 'VS Code / Copilot') {
      return JSON.stringify(
        {
          servers: {
            modelshortlist: {
              type: 'stdio',
              command: npxCommand,
              args: ['-y', '@agentic.artists/modelshortlist'],
              env: {
                ARTIFICIAL_ANALYSIS_API_KEY: artificial,
                OPENROUTER_API_KEY: openrouter,
              },
            },
          },
        },
        null,
        2,
      )
    }

    return JSON.stringify(
      {
        mcpServers: {
          modelshortlist: {
            command: npxCommand,
            args: ['-y', '@agentic.artists/modelshortlist'],
            env: {
              ARTIFICIAL_ANALYSIS_API_KEY: artificial,
              OPENROUTER_API_KEY: openrouter,
            },
          },
        },
      },
      null,
      2,
    )
  }, [aaKey, orKey, client, windows])

  async function copyOutput() {
    await navigator.clipboard.writeText(output)
    setCopied(true)
    window.setTimeout(() => setCopied(false), 1600)
  }

  const destination =
    client === 'Hermes Desktop'
      ? 'Hermes Desktop → Skills & Tools → MCP → Import JSON'
      : client === 'Cursor'
        ? 'Save as ~/.cursor/mcp.json, or open Customize → MCPs'
        : client === 'Claude Code'
          ? 'Paste this command into your terminal'
          : 'Command Palette → MCP: Open User Configuration, then paste the JSON'

  return (
    <div className="overflow-hidden rounded-2xl border border-blue-500/20 bg-card/65 shadow-xl shadow-blue-950/5">
      <div className="border-b border-border/60 bg-muted/20 p-5 sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2 text-sm font-semibold text-blue-400">
              <Terminal className="h-4 w-4" aria-hidden="true" />
              Install configurator
            </div>
            <h2 className="mt-2 text-2xl font-bold">Pick your client. Copy one thing.</h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Your keys are used only in this browser tab to generate the config below. They are never submitted to ModelShortlist.
            </p>
          </div>
          <div className="inline-flex items-center gap-2 self-start rounded-full border border-emerald-500/20 bg-emerald-500/[0.07] px-3 py-1.5 text-xs font-semibold text-emerald-500">
            <ShieldCheck className="h-3.5 w-3.5" /> Browser-only
          </div>
        </div>
      </div>

      <div className="grid gap-0 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="border-b border-border/60 p-5 sm:p-6 lg:border-b-0 lg:border-r">
          <div className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">1. Choose your client</div>
          <div className="mt-3 grid grid-cols-2 gap-2">
            {clients.map((name) => (
              <button
                key={name}
                type="button"
                onClick={() => setClient(name)}
                className={`rounded-xl border px-3 py-3 text-left text-sm font-semibold transition-colors ${
                  client === name
                    ? 'border-blue-500/45 bg-blue-500/10 text-foreground'
                    : 'border-border/60 bg-background/45 text-muted-foreground hover:border-blue-500/25 hover:text-foreground'
                }`}
              >
                {name}
              </button>
            ))}
          </div>

          <div className="mt-6 text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">2. Paste your upstream keys</div>
          <div className="mt-3 space-y-3">
            <label className="block">
              <span className="mb-1.5 flex items-center gap-1.5 text-xs font-medium text-muted-foreground"><KeyRound className="h-3.5 w-3.5" /> Artificial Analysis API key</span>
              <input
                type="password"
                value={aaKey}
                onChange={(event) => setAaKey(event.target.value)}
                placeholder="Paste key"
                autoComplete="off"
                spellCheck={false}
                className="h-11 w-full rounded-lg border border-border/70 bg-background/70 px-3 font-mono text-sm outline-none transition-colors placeholder:text-muted-foreground/55 focus:border-blue-500/55"
              />
            </label>
            <label className="block">
              <span className="mb-1.5 flex items-center gap-1.5 text-xs font-medium text-muted-foreground"><KeyRound className="h-3.5 w-3.5" /> OpenRouter API key</span>
              <input
                type="password"
                value={orKey}
                onChange={(event) => setOrKey(event.target.value)}
                placeholder="Paste key"
                autoComplete="off"
                spellCheck={false}
                className="h-11 w-full rounded-lg border border-border/70 bg-background/70 px-3 font-mono text-sm outline-none transition-colors placeholder:text-muted-foreground/55 focus:border-blue-500/55"
              />
            </label>
          </div>

          <label className="mt-5 flex cursor-pointer items-center gap-3 rounded-xl border border-border/60 bg-background/45 p-3.5">
            <input type="checkbox" checked={windows} onChange={(event) => setWindows(event.target.checked)} className="h-4 w-4 accent-blue-500" />
            <span>
              <span className="flex items-center gap-1.5 text-sm font-semibold"><Laptop className="h-4 w-4 text-blue-400" /> I’m on Windows</span>
              <span className="mt-0.5 block text-xs leading-5 text-muted-foreground">Uses <code className="font-mono">npx.cmd</code> to avoid common GUI PATH issues.</span>
            </span>
          </label>
        </div>

        <div className="min-w-0 p-5 sm:p-6">
          <div className="flex items-center justify-between gap-3">
            <div>
              <div className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">3. Copy and install</div>
              <p className="mt-1.5 text-xs leading-5 text-muted-foreground">{destination}</p>
            </div>
            <button
              type="button"
              onClick={copyOutput}
              className="inline-flex h-9 shrink-0 items-center gap-2 rounded-lg border border-border/70 bg-background/60 px-3 text-xs font-semibold transition-colors hover:border-blue-500/35"
            >
              {copied ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
              {copied ? 'Copied' : 'Copy'}
            </button>
          </div>

          <pre className="mt-4 max-h-[420px] overflow-auto rounded-xl border border-border/60 bg-[#080d18] p-4 text-[12px] leading-6 text-slate-200">
            <code>{output}</code>
          </pre>

          <div className="mt-4 rounded-xl border border-border/60 bg-muted/20 p-4 text-xs leading-5 text-muted-foreground">
            After installation, restart or refresh your client if needed. You should see three tools: <code className="font-mono text-foreground">recommend_models</code>, <code className="font-mono text-foreground">compare_models</code>, and <code className="font-mono text-foreground">modelshortlist_status</code>.
          </div>
        </div>
      </div>
    </div>
  )
}
