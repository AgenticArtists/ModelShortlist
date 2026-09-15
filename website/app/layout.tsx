import type { Metadata, Viewport } from 'next'
import { Geist_Mono, Inter, Sora } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { Github } from 'lucide-react'
import Logo from '@/components/Logo'
import ThemeProvider from '@/components/ThemeProvider'
import ThemeToggle from '@/components/ThemeToggle'
import './globals.css'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const sora = Sora({ subsets: ['latin'], variable: '--font-sora' })
const geistMono = Geist_Mono({ subsets: ['latin'], variable: '--font-geist-mono' })

const SITE_URL = 'https://modelshortlist.com'
const GITHUB_URL = 'https://github.com/AgenticArtists/ModelShortlist'
const NPM_URL = 'https://www.npmjs.com/package/@agentic.artists/modelshortlist'

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'ModelShortlist — Which AI Model Is Best Right Now?',
    template: '%s | ModelShortlist',
  },
  description:
    'Local open-source MCP for workload-specific AI model selection using independent Artificial Analysis benchmark evidence plus current OpenRouter pricing, context, capabilities, providers, and optional ZDR facts.',
  keywords: [
    'AI model selection',
    'LLM model selection',
    'OpenRouter model comparison',
    'Artificial Analysis',
    'AI model benchmarks',
    'AI coding models',
    'tool calling models',
    'long context models',
    'structured output models',
    'MCP server',
    'Model Context Protocol',
  ],
  authors: [{ name: 'AgenticArtists', url: 'https://www.agenticartists.com' }],
  creator: 'AgenticArtists',
  publisher: 'AgenticArtists',
  alternates: { canonical: SITE_URL },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: SITE_URL,
    siteName: 'ModelShortlist',
    title: 'Ask which AI model is best right now | ModelShortlist',
    description: 'Workload-specific model recommendations using Artificial Analysis benchmark evidence plus current OpenRouter operational facts.',
    images: [{ url: '/opengraph-image', width: 1200, height: 630, alt: 'ModelShortlist — ask which AI model is best right now' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Ask which AI model is best right now | ModelShortlist',
    description: 'Artificial Analysis benchmark evidence + current OpenRouter facts, reasoned against your actual workload.',
    images: ['/opengraph-image'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },
  category: 'technology',
}

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#F8FAFC' },
    { media: '(prefers-color-scheme: dark)', color: '#0B1220' },
  ],
  colorScheme: 'light dark',
}

const structuredData = [
  {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'ModelShortlist',
    applicationCategory: 'DeveloperApplication',
    operatingSystem: 'Cross-platform',
    url: SITE_URL,
    codeRepository: GITHUB_URL,
    downloadUrl: NPM_URL,
    softwareVersion: '0.2.3',
    license: 'https://opensource.org/license/mit',
    isAccessibleForFree: true,
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    description:
      'Local BYOK MCP server for workload-specific AI model selection using Artificial Analysis benchmark evidence and current OpenRouter operational data.',
    featureList: [
      'Workload-specific AI model shortlisting',
      'Artificial Analysis benchmark evidence',
      'OpenRouter model catalog and pricing evidence',
      'Context and tool capability filtering',
      'Optional Zero Data Retention endpoint filtering',
      'Local bring-your-own-key architecture',
    ],
    author: {
      '@type': 'Organization',
      name: 'AgenticArtists',
      url: 'https://www.agenticartists.com',
    },
  },
  {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'ModelShortlist',
    url: SITE_URL,
    description:
      'Guides and an open-source MCP for choosing AI models using current workload-specific benchmark, pricing, context, capability, and provider evidence.',
    publisher: {
      '@type': 'Organization',
      name: 'AgenticArtists',
      url: 'https://www.agenticartists.com',
    },
  },
]

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning className={`${inter.variable} ${sora.variable} ${geistMono.variable}`}>
      <head>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      </head>
      <body>
        <a href="#main-content" className="skip-to-content">Skip to content</a>
        <ThemeProvider>
          <div className="site-shell">
            <SiteHeader />
            <main id="main-content" tabIndex={-1}>{children}</main>
            <SiteFooter />
          </div>
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  )
}

function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-blue-500/15 bg-background/90 backdrop-blur-xl supports-[backdrop-filter]:bg-background/72">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        <a href="/" className="group rounded-md" aria-label="ModelShortlist home">
          <Logo className="transition-transform duration-300 group-hover:scale-[1.02]" />
        </a>
        <nav className="hidden items-center gap-1 md:flex" aria-label="Primary navigation">
          <a href="/#how-it-works" className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted/50 hover:text-foreground">How it works</a>
          <a href="/why-modelshortlist" className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted/50 hover:text-foreground">Why ModelShortlist</a>
          <a href="/guides" className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted/50 hover:text-foreground">Guides</a>
          <a href="/install" className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted/50 hover:text-foreground">Install</a>
        </nav>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <a
            href={GITHUB_URL}
            target="_blank"
            rel="noreferrer"
            className="inline-flex h-9 items-center gap-2 rounded-lg border border-border/70 bg-card/50 px-3 text-sm font-semibold transition-colors hover:border-blue-500/35 hover:bg-muted/60"
          >
            <Github className="h-4 w-4" aria-hidden="true" />
            <span className="hidden sm:inline">GitHub</span>
          </a>
          <a href="/install" className="brand-gradient-bg inline-flex h-9 items-center rounded-lg px-3.5 text-sm font-semibold text-white">Install</a>
        </div>
      </div>
    </header>
  )
}

function SiteFooter() {
  return (
    <footer className="border-t border-blue-500/15 bg-card/30">
      <div className="mx-auto max-w-7xl px-6 py-12">
        <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr_0.8fr]">
          <div className="max-w-md">
            <a href="/" className="inline-flex rounded-md" aria-label="ModelShortlist home"><Logo /></a>
            <p className="mt-4 text-sm leading-6 text-muted-foreground">
              Current model-selection evidence for AI assistants. Artificial Analysis benchmarks + OpenRouter operational facts, reasoned against the workload you actually have.
            </p>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-foreground">Guides</p>
            <div className="mt-4 grid gap-3 text-sm">
              <a href="/how-to-choose-an-ai-model" className="text-muted-foreground transition-colors hover:text-foreground">How to choose a model</a>
              <a href="/coding-agents" className="text-muted-foreground transition-colors hover:text-foreground">Coding agents</a>
              <a href="/document-extraction-models" className="text-muted-foreground transition-colors hover:text-foreground">Document extraction</a>
              <a href="/openrouter-model-comparison" className="text-muted-foreground transition-colors hover:text-foreground">OpenRouter comparison</a>
              <a href="/artificial-analysis" className="text-muted-foreground transition-colors hover:text-foreground">Artificial Analysis</a>
              <a href="/guides" className="text-muted-foreground transition-colors hover:text-foreground">All guides</a>
            </div>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-foreground">Project</p>
            <div className="mt-4 grid gap-3 text-sm">
              <a href="/install" className="text-muted-foreground transition-colors hover:text-foreground">Install</a>
              <a href="/why-modelshortlist" className="text-muted-foreground transition-colors hover:text-foreground">Why ModelShortlist</a>
              <a href="/how-model-recommendations-stay-current" className="text-muted-foreground transition-colors hover:text-foreground">Freshness</a>
              <a href={NPM_URL} target="_blank" rel="noreferrer" className="text-muted-foreground transition-colors hover:text-foreground">npm</a>
              <a href={GITHUB_URL} target="_blank" rel="noreferrer" className="text-muted-foreground transition-colors hover:text-foreground">GitHub</a>
              <a href="/llms.txt" className="text-muted-foreground transition-colors hover:text-foreground">llms.txt</a>
            </div>
          </div>
        </div>
        <div className="mt-10 flex flex-col gap-3 border-t border-border/60 pt-6 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} AgenticArtists. ModelShortlist is MIT licensed.</p>
          <p>OpenRouter and Artificial Analysis are independent upstream data providers; no affiliation or endorsement is implied.</p>
        </div>
      </div>
    </footer>
  )
}
