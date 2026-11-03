'use client'

import { GoogleAnalytics } from '@next/third-parties/google'
import { usePathname, useSearchParams } from 'next/navigation'
import Script from 'next/script'
import { useEffect, useRef } from 'react'

import { trackPhoneClick } from '@/lib/leadTracking'
import { GOOGLE_ADS_ID } from '@/lib/site'

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void
  }
}

/**
 * GA4 + `page_path` updates on client-side navigations (App Router), the
 * Google Ads tag, and phone-tap tracking for every `tel:` link on the site.
 */
export function SiteGoogleAnalytics({ gaId }: { gaId: string }) {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const isFirstNavigation = useRef(true)

  useEffect(() => {
    const query = searchParams?.toString()
    const pagePath = query ? `${pathname}?${query}` : pathname

    if (isFirstNavigation.current) {
      isFirstNavigation.current = false
      return
    }

    window.gtag?.('config', gaId, { page_path: pagePath })
  }, [pathname, searchParams, gaId])

  useEffect(() => {
    function onClick(event: MouseEvent) {
      const link = (event.target as Element | null)?.closest?.('a[href^="tel:"]')
      if (link) trackPhoneClick()
    }

    document.addEventListener('click', onClick, true)
    return () => document.removeEventListener('click', onClick, true)
  }, [])

  return (
    <>
      <GoogleAnalytics gaId={gaId} />
      {/* Rendered after GA so gtag('js') is queued first; the stub keeps this safe if gtag is not defined yet. */}
      <Script id="google-ads-config" strategy="afterInteractive">
        {`window.dataLayer=window.dataLayer||[];window.gtag=window.gtag||function(){window.dataLayer.push(arguments)};window.gtag('config','${GOOGLE_ADS_ID}');`}
      </Script>
    </>
  )
}
