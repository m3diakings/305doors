import { type Metadata } from 'next'
import { Inter, Lexend } from 'next/font/google'
import clsx from 'clsx'
import { Suspense } from 'react'

import { SiteGoogleAnalytics } from '@/components/site/SiteGoogleAnalytics'
import {
  BUSINESS_NAME,
  DEFAULT_DESCRIPTION,
  FACEBOOK_URL,
  GA_MEASUREMENT_ID,
  GOOGLE_SITE_VERIFICATION,
  INSTAGRAM_URL,
  PHONE_TEL,
  SERVICE_AREAS,
  SITE_ORIGIN,
} from '@/lib/site'

import '@/styles/tailwind.css'

/**
 * Search Atlas dynamic optimization (vendor snippet).
 * Use a plain `<script>` — `next/script` can 404 on `data:` src by resolving it as a path.
 */
const SEARCH_ATLAS_SNIPPET = {
  src: 'data:text/javascript;base64,dmFyIHNjcmlwdCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoInNjcmlwdCIpO3NjcmlwdC5zZXRBdHRyaWJ1dGUoIm5vd3Byb2NrZXQiLCAiIik7c2NyaXB0LnNldEF0dHJpYnV0ZSgibml0cm8tZXhjbHVkZSIsICIiKTtzY3JpcHQuc3JjID0gImh0dHBzOi8vZGFzaGJvYXJkLnNlYXJjaGF0bGFzLmNvbS9zY3JpcHRzL2R5bmFtaWNfb3B0aW1pemF0aW9uLmpzIjtzY3JpcHQuZGF0YXNldC51dWlkID0gIjFiN2Q2M2RmLTQ3NjAtNDY4Ny04YmQ1LTIzZDk1ZGZiYWY1ZSI7c2NyaXB0LmlkID0gInNhLWR5bmFtaWMtb3B0aW1pemF0aW9uLWxvYWRlciI7ZG9jdW1lbnQuaGVhZC5hcHBlbmRDaGlsZChzY3JpcHQpOw==',
  uuid: '1b7d63df-4760-4687-8bd5-23d95dfbaf5e',
} as const

const pageTitle = `Garage Door Installation & Repair Miami | ${BUSINESS_NAME}`

export const metadata: Metadata = {
  metadataBase: new URL(SITE_ORIGIN),
  title: {
    default: pageTitle,
    template: `%s | ${BUSINESS_NAME}`,
  },
  description: DEFAULT_DESCRIPTION,
  ...(GOOGLE_SITE_VERIFICATION
    ? { verification: { google: GOOGLE_SITE_VERIFICATION } }
    : {}),
  keywords: [
    'garage door repair Miami',
    'garage door installation Miami',
    'hurricane rated garage doors Florida',
    'commercial garage doors South Florida',
    'garage door opener repair',
    '305 Doors',
    'Broward garage doors',
    'Palm Beach garage doors',
  ],
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: '/',
    siteName: BUSINESS_NAME,
    title: pageTitle,
    description: DEFAULT_DESCRIPTION,
    images: [
      {
        url: '/images/305doors/hero-1.jpg',
        width: 700,
        height: 500,
        alt: 'Garage door installation by 305 Doors Corp',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: pageTitle,
    description: DEFAULT_DESCRIPTION,
    images: [`${SITE_ORIGIN}/images/305doors/hero-1.jpg`],
  },
  robots: { index: true, follow: true },
  icons: {
    icon: [{ url: '/favicon-192.png', type: 'image/png', sizes: '192x192' }],
    apple: [{ url: '/favicon-192.png', sizes: '192x192' }],
  },
  category: 'home services',
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebSite',
      '@id': `${SITE_ORIGIN}/#website`,
      url: `${SITE_ORIGIN}/`,
      name: BUSINESS_NAME,
      description: DEFAULT_DESCRIPTION,
      inLanguage: 'en-US',
      publisher: { '@id': `${SITE_ORIGIN}/#business` },
    },
    {
      '@type': 'LocalBusiness',
      '@id': `${SITE_ORIGIN}/#business`,
      name: BUSINESS_NAME,
      url: `${SITE_ORIGIN}/`,
      image: `${SITE_ORIGIN}/images/305doors/logo.png`,
      logo: `${SITE_ORIGIN}/images/305doors/logo.png`,
      telephone: PHONE_TEL,
      priceRange: '$$',
      description: DEFAULT_DESCRIPTION,
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Miami',
        addressRegion: 'FL',
        addressCountry: 'US',
      },
      areaServed: SERVICE_AREAS.map((name) => ({
        '@type': 'AdministrativeArea',
        name,
      })),
      sameAs: [FACEBOOK_URL, INSTAGRAM_URL],
    },
  ],
}

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
})

const lexend = Lexend({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-lexend',
})

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="en"
      className={clsx(
        'h-full scroll-smooth bg-white antialiased',
        inter.variable,
        lexend.variable,
      )}
    >
      <head>
        {/* eslint-disable-next-line @next/next/no-sync-scripts -- vendor Search Atlas bootstrap; must stay a literal script with data: src */}
        <script
          suppressHydrationWarning
          type="text/javascript"
          id="sa-dynamic-optimization"
          data-uuid={SEARCH_ATLAS_SNIPPET.uuid}
          src={SEARCH_ATLAS_SNIPPET.src}
          {...({
            nowprocket: '',
            'nitro-exclude': '',
          } as Record<string, string>)}
        />
      </head>
      <body className="flex min-h-full flex-col">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {GA_MEASUREMENT_ID ? (
          <Suspense fallback={null}>
            <SiteGoogleAnalytics gaId={GA_MEASUREMENT_ID} />
          </Suspense>
        ) : null}
        {children}
      </body>
    </html>
  )
}
