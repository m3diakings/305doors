export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.305doors.com'

/** Canonical origin without trailing slash (sitemap, JSON-LD, robots). */
export const SITE_ORIGIN = SITE_URL.replace(/\/$/, '')

/** Optional: set in `.env.local` as `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION=...` */
export const GOOGLE_SITE_VERIFICATION =
  process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION ?? ''

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
