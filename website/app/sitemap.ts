import type { MetadataRoute } from 'next'

const SITE_URL = 'https://modelshortlist.com'

const routes = [
  ['', 'weekly', 1],
  ['/install', 'monthly', 0.95],
  ['/guides', 'monthly', 0.9],
  ['/how-to-choose-an-ai-model', 'monthly', 0.85],
  ['/why-modelshortlist', 'monthly', 0.85],
  ['/how-model-recommendations-stay-current', 'monthly', 0.85],
  ['/artificial-analysis', 'monthly', 0.85],
  ['/openrouter-model-comparison', 'monthly', 0.85],
  ['/modelshortlist-vs-static-leaderboards', 'monthly', 0.8],
  ['/modelshortlist-vs-model-routers', 'monthly', 0.8],
  ['/coding-agents', 'monthly', 0.8],
  ['/document-extraction-models', 'monthly', 0.8],
  ['/structured-output-models', 'monthly', 0.8],
  ['/cheap-tool-calling-models', 'monthly', 0.8],
  ['/models-under-10-per-million-output', 'monthly', 0.8],
  ['/large-context-models', 'monthly', 0.8],
  ['/zdr-models', 'monthly', 0.75],
] as const

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date()

  return routes.map(([path, changeFrequency, priority]) => ({
    url: `${SITE_URL}${path}`,
    lastModified: now,
    changeFrequency,
    priority,
  }))
}
