'use client'

import { usePathname, useSearchParams } from 'next/navigation'
import { useEffect } from 'react'

declare global {
  interface Window {
    oaiq?: (...args: unknown[]) => void
  }
}

/** OpenAI pixel `page_viewed` event on first load and client-side navigations (App Router). */
export function SiteOpenAiPixel() {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    window.oaiq?.('measure', 'page_viewed', { type: 'contents' })
  }, [pathname, searchParams])

  return null
}
