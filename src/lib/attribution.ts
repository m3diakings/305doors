const STORAGE_KEY = 'doors305_attribution'
const TTL_MS = 90 * 24 * 60 * 60 * 1000

const CLICK_ID_KEYS = ['gclid', 'gbraid', 'wbraid'] as const
const UTM_KEYS = [
  'utm_source',
  'utm_medium',
  'utm_campaign',
  'utm_term',
  'utm_content',
] as const

export type Attribution = Partial<
  Record<
    (typeof CLICK_ID_KEYS)[number] | (typeof UTM_KEYS)[number] | 'landing_page',
    string
  >
>

type Stored = { expires: number; data: Attribution }

function readStored(): Attribution | null {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as Stored
    if (typeof parsed?.expires !== 'number' || parsed.expires < Date.now()) {
      window.localStorage.removeItem(STORAGE_KEY)
      return null
    }
    return parsed.data ?? null
  } catch {
    return null
  }
}

/** Store ad attribution from the current URL (first-party, 90 days). */
export function captureAttribution(): void {
  try {
    const params = new URLSearchParams(window.location.search)
    const fresh: Attribution = {}
    for (const key of [...CLICK_ID_KEYS, ...UTM_KEYS]) {
      const value = params.get(key)?.trim()
      if (value) fresh[key] = value.slice(0, 500)
    }
    const carriesAttribution = Object.keys(fresh).length > 0
    if (!carriesAttribution && readStored()) return

    const data: Attribution = {
      ...fresh,
      landing_page: window.location.pathname.slice(0, 500),
    }
    const stored: Stored = { expires: Date.now() + TTL_MS, data }
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(stored))
  } catch {
    /* storage unavailable (private mode, blocked) */
  }
}

/** Stored attribution fields to send with a lead; empty when none. */
export function getAttribution(): Attribution {
  return readStored() ?? {}
}
