'use client'

import { usePathname, useSearchParams } from 'next/navigation'
import { useEffect } from 'react'

declare global {
  interface Window {
    oaiq?: (...args: unknown[]) => void
  }
}

/**
 * OpenAI pixel events: `page_viewed` on first load and client-side navigations
 * (App Router), and a `call` custom event whenever any `tel:` link is clicked.
 */
export function SiteOpenAiPixel() {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    window.oaiq?.('measure', 'page_viewed', { type: 'contents' })
  }, [pathname, searchParams])

  useEffect(() => {
    function onClick(event: MouseEvent) {
      const link = (event.target as Element | null)?.closest?.(
        'a[href^="tel:"]',
      )
      if (!link) return
      window.oaiq?.(
        'measure',
        'custom',
        { type: 'custom' },
        { custom_event_name: 'call' },
      )
    }

    document.addEventListener('click', onClick, true)
    return () => document.removeEventListener('click', onClick, true)
  }, [])

  return null
}
