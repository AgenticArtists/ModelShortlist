'use client'

import { Check, Clipboard } from 'lucide-react'
import { useState } from 'react'

export default function CodeBlock({ code, label }: { code: string; label: string }) {
  const [copied, setCopied] = useState(false)

  async function copy() {
    try {
      await navigator.clipboard.writeText(code)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1800)
    } catch {
      setCopied(false)
    }
  }

  return (
    <div className="overflow-hidden rounded-xl border border-border/70 bg-[#07101d] shadow-2xl shadow-black/10">
      <div className="flex items-center justify-between border-b border-white/10 px-4 py-2.5">
        <span className="font-mono text-[11px] font-medium uppercase tracking-[0.16em] text-slate-400">{label}</span>
        <button
          type="button"
          onClick={copy}
          className="inline-flex min-h-8 items-center gap-1.5 rounded-md px-2.5 text-xs font-medium text-slate-400 transition-colors hover:bg-white/5 hover:text-white"
          aria-label={`Copy ${label}`}
        >
          {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Clipboard className="h-3.5 w-3.5" />}
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>
      <pre className="overflow-x-auto p-4 text-[12px] leading-6 text-slate-200 sm:p-5 sm:text-[13px]">
        <code>{code}</code>
      </pre>
    </div>
  )
}
