import type { LeadPayload } from '@/lib/lead'
import { extractReplyToEmail } from '@/lib/lead'

type ZohoTokenResponse = {
  access_token?: string
  expires_in?: number
  error?: string
}

type ZohoUpsertResponse = {
  data?: Array<{
    code?: string
    status?: string
    message?: string
  }>
}

let cachedAccessToken: { value: string; expiresAtMs: number } | null = null

function isZohoSuccessCode(code: string | undefined): boolean {
  if (!code) return false
  return (
    code === 'SUCCESS' ||
    code === 'DUPLICATE_DATA' ||
    code === 'RECORD_IN_BLUEPRINT' // submitted while in workflow
  )
}

export function isZohoCrmConfigured(): boolean {
  return Boolean(
    process.env.ZOHO_CLIENT_ID &&
      process.env.ZOHO_CLIENT_SECRET &&
      process.env.ZOHO_REFRESH_TOKEN,
  )
}

async function getZohoAccessToken(): Promise<string | null> {
  const clientId = process.env.ZOHO_CLIENT_ID
  const clientSecret = process.env.ZOHO_CLIENT_SECRET
  const refreshToken = process.env.ZOHO_REFRESH_TOKEN
  if (!clientId || !clientSecret || !refreshToken) return null

  const now = Date.now()
  if (cachedAccessToken && now < cachedAccessToken.expiresAtMs - 120_000) {
    return cachedAccessToken.value
  }

  const accountsBase =
    process.env.ZOHO_ACCOUNTS_DOMAIN?.replace(/\/$/, '') ?? 'https://accounts.zoho.com'

  const res = await fetch(`${accountsBase}/oauth/v2/token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      refresh_token: refreshToken,
      client_id: clientId,
      client_secret: clientSecret,
      grant_type: 'refresh_token',
    }),
  })

  const json = (await res.json()) as ZohoTokenResponse
  if (!res.ok || !json.access_token) {
    console.error('[zoho] Token refresh failed:', json.error ?? res.status)
    return null
  }

  const ttlSec = json.expires_in ?? 3600
  cachedAccessToken = {
    value: json.access_token,
    expiresAtMs: now + ttlSec * 1000,
  }
  return cachedAccessToken.value
}

/**
 * Map website quote → Zoho CRM Lead (standard fields).
 * Adjust Lead_Source / picklists in Zoho if your org uses different allowed values.
 */
export function buildZohoLeadRow(data: LeadPayload): Record<string, string> {
  const trimmed = data.name.trim()
  const parts = trimmed.split(/\s+/).filter(Boolean)
  let firstName = ''
  let lastName = trimmed
  if (parts.length >= 2) {
    firstName = parts[0]
    lastName = parts.slice(1).join(' ')
  }

  const email = extractReplyToEmail(data.contact)
  const row: Record<string, string> = {
    Last_Name: lastName.slice(0, 255),
    Company: trimmed.slice(0, 255),
    Street: data.address.slice(0, 250),
    Description: [
      data.message,
      '',
      `Contact (as entered): ${data.contact}`,
      `Address: ${data.address}`,
    ].join('\n'),
    Lead_Source: process.env.ZOHO_LEAD_SOURCE ?? 'Website',
  }

  if (firstName) {
    row.First_Name = firstName.slice(0, 40)
  }
  if (email) {
    row.Email = email.slice(0, 100)
  }
  if (!email && data.contact.trim()) {
    row.Phone = data.contact.trim().slice(0, 30)
  }

  return row
}

export async function createZohoCrmLead(data: LeadPayload): Promise<boolean> {
  const token = await getZohoAccessToken()
  if (!token) return false

  const apiBase =
    process.env.ZOHO_CRM_API_DOMAIN?.replace(/\/$/, '') ?? 'https://www.zohoapis.com'
  const moduleName = process.env.ZOHO_CRM_MODULE?.trim() || 'Leads'

  const res = await fetch(`${apiBase}/crm/v3/${moduleName}`, {
    method: 'POST',
    headers: {
      Authorization: `Zoho-oauthtoken ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      data: [buildZohoLeadRow(data)],
    }),
  })

  let json: ZohoUpsertResponse | null = null
  try {
    json = (await res.json()) as ZohoUpsertResponse
  } catch {
    json = null
  }

  if (!res.ok) {
    console.error('[zoho] Create lead failed:', res.status, json)
    return false
  }

  const row = json?.data?.[0]
  const code = row?.code
  if (isZohoSuccessCode(code)) {
    return true
  }

  console.error('[zoho] Unexpected response:', row)
  return false
}
