import type { MetadataRoute } from 'next'

import { allBlogSlugs } from '@/lib/blog'
import { ALL_LOCATION_SLUGS } from '@/lib/locationPages'
import { allServiceSlugs } from '@/lib/servicePages'
import { SITE_ORIGIN } from '@/lib/site'

export default function sitemap(): MetadataRoute.Sitemap {
  const home: MetadataRoute.Sitemap = [
    {
      url: `${SITE_ORIGIN}/`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
  ]

  const blogIndex: MetadataRoute.Sitemap = [
    {
      url: `${SITE_ORIGIN}/blog/`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.75,
    },
  ]

  const blogPosts: MetadataRoute.Sitemap = allBlogSlugs().map((slug) => ({
    url: `${SITE_ORIGIN}/blog/${slug}/`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.65,
  }))

  const services: MetadataRoute.Sitemap = allServiceSlugs().map((slug) => ({
    url: `${SITE_ORIGIN}/services/${slug}/`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.85,
  }))

  const locations: MetadataRoute.Sitemap = ALL_LOCATION_SLUGS.map((slug) => ({
    url: `${SITE_ORIGIN}/${slug}/`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.6,
  }))

  return [...home, ...blogIndex, ...blogPosts, ...services, ...locations]
}
