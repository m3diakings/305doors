import { pingSupabaseLeads } from '@/lib/supabaseLeads'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

/**
 * Daily Vercel cron (vercel.json). Runs one tiny query so the Supabase free-plan
 * project never sits idle long enough to pause. Returns no data.
 * When CRON_SECRET is set in Vercel, only Vercel's cron (which sends it) may call this.
 */
export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET
  if (secret && request.headers.get('authorization') !== `Bearer ${secret}`) {
    return Response.json({ ok: false }, { status: 401 })
  }
  const ok = await pingSupabaseLeads()
  return Response.json({ ok }, { status: ok ? 200 : 503 })
}
