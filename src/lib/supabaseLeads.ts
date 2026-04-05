import { createClient, type SupabaseClient } from '@supabase/supabase-js'

import { type LeadPayload, splitLeadContactFields } from '@/lib/lead'
import { BUSINESS_NAME } from '@/lib/site'

function supabaseUrl(): string | undefined {
  return (
    process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() || process.env.SUPABASE_URL?.trim()
  )
}

export function isSupabaseLeadsConfigured(): boolean {
  return Boolean(supabaseUrl() && process.env.SUPABASE_SECRET_KEY?.trim())
}

function getServiceClient(): SupabaseClient | null {
  const url = supabaseUrl()
  const key = process.env.SUPABASE_SECRET_KEY?.trim()
  if (!url || !key) return null
  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  })
}

const DEFAULT_TABLE = 'leads'

export async function insertLeadInSupabase(data: LeadPayload): Promise<boolean> {
  const client = getServiceClient()
  if (!client) return false

  const table = process.env.SUPABASE_LEADS_TABLE?.trim() || DEFAULT_TABLE

  const { email, phone } = splitLeadContactFields(data.contact)

  const row = {
    name: data.name,
    email,
    phone,
    address: data.address,
    message: data.message,
    source: '305doors-web',
    business: BUSINESS_NAME,
  }

  const { error } = await client.from(table).insert(row)

  if (error) {
    console.error('[supabase] Insert lead failed:', error.message, error)
    return false
  }

  return true
}
