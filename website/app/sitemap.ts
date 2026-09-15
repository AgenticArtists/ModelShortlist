import type { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date()

  return [
    {
      url: 'https://modelshortlist.com',
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: 'https://modelshortlist.com/install',
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: 'https://modelshortlist.com/coding-agents',
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: 'https://modelshortlist.com/zdr-models',
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: 'https://modelshortlist.com/cheap-tool-calling-models',
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: 'https://modelshortlist.com/large-context-models',
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
  ]
}
