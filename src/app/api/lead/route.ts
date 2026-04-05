import { Resend } from 'resend'

import {
  extractReplyToEmail,
  formatClientConfirmationEmailHtml,
  formatClientConfirmationEmailText,
  formatLeadEmailHtml,
  formatLeadEmailText,
  isLeadHoneypotTripped,
  leadPayloadSchema,
} from '@/lib/lead'
import { BUSINESS_NAME, SITE_URL } from '@/lib/site'
import { insertLeadInSupabase, isSupabaseLeadsConfigured } from '@/lib/supabaseLeads'
import { createZohoCrmLead, isZohoCrmConfigured } from '@/lib/zohoCrm'

export const runtime = 'nodejs'

function isAllowedOrigin(request: Request): boolean {
  const origin = request.headers.get('origin')
  if (!origin) {
    return process.env.LEAD_REQUIRE_ORIGIN !== '1'
  }
  try {
    const allowed = new URL(SITE_URL).origin
    if (origin === allowed) return true
    if (process.env.NODE_ENV === 'development') {
      const host = new URL(origin).hostname
      return host === 'localhost' || host === '127.0.0.1'
    }
    return false
  } catch {
    return false
  }
}

export async function POST(request: Request) {
  let json: unknown
  try {
    json = await request.json()
  } catch {
    return Response.json({ ok: false, error: 'Invalid JSON' }, { status: 400 })
  }

  const parsed = leadPayloadSchema.safeParse(json)
  if (!parsed.success) {
    return Response.json(
      { ok: false, error: 'Please check the form and try again.' },
      { status: 400 },
    )
  }

  const data = parsed.data

  if (isLeadHoneypotTripped(data)) {
    return Response.json({ ok: true })
  }

  if (!isAllowedOrigin(request)) {
    return Response.json({ ok: false, error: 'Forbidden' }, { status: 403 })
  }

  const webhook = process.env.LEAD_WEBHOOK_URL
  const resendKey = process.env.RESEND_API_KEY
  const emailTo = process.env.LEAD_EMAIL_TO
  const emailFrom = process.env.LEAD_EMAIL_FROM

  const payloadForWebhook = {
    source: '305doors-web',
    business: BUSINESS_NAME,
    receivedAt: new Date().toISOString(),
    name: data.name,
    contact: data.contact,
    address: data.address,
    message: data.message,
  }

  const channelResults: boolean[] = []

  if (webhook) {
    try {
      const wh = await fetch(webhook, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payloadForWebhook),
      })
      channelResults.push(wh.ok)
    } catch {
      channelResults.push(false)
    }
  }

  if (resendKey && emailTo && emailFrom) {
    try {
      const resend = new Resend(resendKey)
      const replyTo = extractReplyToEmail(data.contact)
      const { error } = await resend.emails.send({
        from: emailFrom,
        to: emailTo.split(',').map((s) => s.trim()).filter(Boolean),
        subject: `New quote request — ${data.name}`,
        text: formatLeadEmailText(data),
        html: formatLeadEmailHtml(data),
        ...(replyTo ? { replyTo: [replyTo] } : {}),
      })
      const teamOk = !error
      channelResults.push(teamOk)

      const clientEmail = replyTo
      if (teamOk && clientEmail) {
        const { error: clientErr } = await resend.emails.send({
          from: emailFrom,
          to: [clientEmail],
          subject: `We received your request — ${BUSINESS_NAME}`,
          text: formatClientConfirmationEmailText(data.name),
          html: formatClientConfirmationEmailHtml(data.name),
        })
        if (clientErr) {
          console.error('[api/lead] Client confirmation email failed:', clientErr)
        }
      }
    } catch {
      channelResults.push(false)
    }
  }

  if (isZohoCrmConfigured()) {
    try {
      const zohoOk = await createZohoCrmLead(data)
      channelResults.push(zohoOk)
    } catch (e) {
      console.error('[api/lead] Zoho CRM error:', e)
      channelResults.push(false)
    }
  }

  if (isSupabaseLeadsConfigured()) {
    try {
      const supabaseOk = await insertLeadInSupabase(data)
      channelResults.push(supabaseOk)
    } catch (e) {
      console.error('[api/lead] Supabase error:', e)
      channelResults.push(false)
    }
  }

  const configured = channelResults.length > 0

  if (!configured) {
    if (process.env.NODE_ENV === 'development') {
      console.warn(
        '[api/lead] No delivery channel configured (Resend, LEAD_WEBHOOK_URL, Zoho CRM, or Supabase). Lead not sent anywhere.',
      )
    }
    return Response.json({ ok: true })
  }

  const delivered = channelResults.some(Boolean)
  if (!delivered) {
    return Response.json(
      { ok: false, error: 'Could not deliver your request. Please call us instead.' },
      { status: 502 },
    )
  }

  return Response.json({ ok: true })
}
