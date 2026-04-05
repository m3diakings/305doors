import { type Metadata } from 'next'
import { Inter, Lexend } from 'next/font/google'
import clsx from 'clsx'

import {
  BUSINESS_NAME,
  DEFAULT_DESCRIPTION,
  FACEBOOK_URL,
  INSTAGRAM_URL,
  PHONE_TEL,
  SERVICE_AREAS,
  SITE_URL,
} from '@/lib/site'

import '@/styles/tailwind.css'

const pageTitle = `Garage Door Installation & Repair Miami | ${BUSINESS_NAME}`

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: pageTitle,
    template: `%s | ${BUSINESS_NAME}`,
  },
  description: DEFAULT_DESCRIPTION,
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
        width: 1200,
        height: 630,
        alt: 'Garage door installation by 305 Doors Corp',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: pageTitle,
    description: DEFAULT_DESCRIPTION,
  },
  robots: { index: true, follow: true },
  icons: {
    icon: '/favicon-192.png',
    apple: '/favicon-192.png',
  },
  category: 'home services',
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'LocalBusiness',
      '@id': `${SITE_URL.replace(/\/$/, '')}/#business`,
      name: BUSINESS_NAME,
      image: `${SITE_URL.replace(/\/$/, '')}/images/305doors/logo.png`,
      url: SITE_URL.replace(/\/$/, ''),
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
      <body className="flex min-h-full flex-col">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {children}
      </body>
    </html>
  )
}
