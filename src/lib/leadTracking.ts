import {
  GOOGLE_ADS_PHONE_CONVERSION,
  GOOGLE_ADS_QUOTE_CONVERSION,
} from '@/lib/site'

/**
 * Fire GA4 `generate_lead` and the Google Ads conversion. Call only after the
 * lead API returned `ok: true`. Sends no personal data.
 */
export function trackLeadConversion(): void {
  if (typeof window === 'undefined' || typeof window.gtag !== 'function') return
  window.gtag('event', 'generate_lead', { form_location: 'quote_form' })
  window.gtag('event', 'conversion', { send_to: GOOGLE_ADS_QUOTE_CONVERSION })
}

/**
 * Fire GA4 `phone_click` and the Google Ads "Phone link tapped" conversion
 * when a visitor taps a `tel:` link. Sends no personal data.
 */
export function trackPhoneClick(): void {
  if (typeof window === 'undefined' || typeof window.gtag !== 'function') return
  window.gtag('event', 'phone_click', { page_path: window.location.pathname })
  window.gtag('event', 'conversion', { send_to: GOOGLE_ADS_PHONE_CONVERSION })
}
