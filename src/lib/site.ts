export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.305doors.com'

/** Canonical origin without trailing slash (sitemap, JSON-LD, robots). */
export const SITE_ORIGIN = SITE_URL.replace(/\/$/, '')

/** Optional: set in `.env.local` as `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION=...` */
export const GOOGLE_SITE_VERIFICATION =
  process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION ?? ''

/** GA4 measurement ID (e.g. `G-XXXXXXXXXX`). Optional; omit to disable analytics. */
export const GA_MEASUREMENT_ID =
  process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID ?? ''

/** Google Ads conversion tag (public). */
export const GOOGLE_ADS_ID = 'AW-957785966'
/** Google Ads conversion `send_to` for "Quote form submitted" (public). */
export const GOOGLE_ADS_QUOTE_CONVERSION = `${GOOGLE_ADS_ID}/KWAbCLLb8LAdEO7O2sgD`
/** Google Ads conversion `send_to` for "Phone link tapped (website)" (public). */
export const GOOGLE_ADS_PHONE_CONVERSION = `${GOOGLE_ADS_ID}/A-LZCNeV-7AdEO7O2sgD`

export const BUSINESS_NAME = '305 Doors Corp'
export const BUSINESS_SHORT = '305 Doors'

export const PHONE_DISPLAY = '(786) 395-4042'
export const PHONE_TEL = '+17863954042'

export const FACEBOOK_URL = 'https://www.facebook.com/305doors'
export const INSTAGRAM_URL = 'https://www.instagram.com/305doors_/'

export const DEFAULT_DESCRIPTION =
  'Professional garage door installation and repair in Miami-Dade, Broward, Palm Beach, Lee, Collier, and Monroe Counties. Residential, commercial, and industrial doors, roll-ups, openers, and hurricane-rated options. 24-hour response.'

export const SERVICE_AREAS = [
  'Miami-Dade County',
  'Broward County',
  'Palm Beach County',
  'Lee County',
  'Collier County',
  'Monroe County',
] as const
