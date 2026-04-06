'use client'

import { GoogleAnalytics } from '@next/third-parties/google'
import { usePathname, useSearchParams } from 'next/navigation'
import { useEffect, useRef } from 'react'

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void
  }
}

/** GA4 + `page_path` updates on client-side navigations (App Router). */
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

  return <GoogleAnalytics gaId={gaId} />
}
