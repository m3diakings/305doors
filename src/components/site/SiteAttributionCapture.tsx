'use client'

import { useEffect } from 'react'

import { captureAttribution } from '@/lib/attribution'

/** Stores gclid / utm_* / landing page for the lead form. Renders nothing. */
export function SiteAttributionCapture() {
  useEffect(() => {
    captureAttribution()
  }, [])
  return null
}
