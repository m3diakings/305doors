import type { MetadataRoute } from 'next'

import { ALL_LOCATION_SLUGS } from '@/lib/locationPages'
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

  const locations: MetadataRoute.Sitemap = ALL_LOCATION_SLUGS.map((slug) => ({
    url: `${SITE_ORIGIN}/${slug}/`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.6,
  }))

  return [...home, ...locations]
}
