import { z } from 'zod'

import { BUSINESS_NAME, PHONE_DISPLAY, PHONE_TEL, SITE_ORIGIN } from '@/lib/site'

/** Public lead payload (honeypot must stay empty — bots fill it). */
export const leadPayloadSchema = z.object({
  name: z.string().trim().min(1, 'Name is required').max(200),
  contact: z.string().trim().min(1, 'Contact is required').max(200),
  address: z.string().trim().min(1, 'Address is required').max(500),
  message: z.string().trim().min(1, 'Message is required').max(8000),
  /** Honeypot: leave blank; hidden in UI */
  website: z.string().optional(),
})

export type LeadPayload = z.infer<typeof leadPayloadSchema>

export function isLeadHoneypotTripped(data: LeadPayload): boolean {
  return Boolean(data.website?.trim())
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

export function extractReplyToEmail(contact: string): string | undefined {
  const m = contact.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/)
  return m?.[0]
}

export function formatLeadEmailText(payload: LeadPayload): string {
  return [
    `Name: ${payload.name}`,
    `Contact: ${payload.contact}`,
    `Address: ${payload.address}`,
    '',
    'Message:',
    payload.message,
  ].join('\n')
}

export function formatLeadEmailHtml(payload: LeadPayload): string {
  const rows = [
    ['Name', payload.name],
    ['Contact', payload.contact],
    ['Address', payload.address],
    ['Message', payload.message],
  ] as const
  const body = rows
    .map(
      ([k, v]) =>
        `<tr><td style="padding:8px 12px;border:1px solid #e5e7eb;font-weight:600;vertical-align:top">${escapeHtml(k)}</td><td style="padding:8px 12px;border:1px solid #e5e7eb;white-space:pre-wrap">${escapeHtml(v)}</td></tr>`,
    )
    .join('')
  return `<table style="border-collapse:collapse;max-width:560px;font-family:system-ui,sans-serif;font-size:14px">${body}</table>`
}

function clientGreetingName(fullName: string): string {
  const first = fullName.trim().split(/\s+/)[0]
  return first && first.length <= 80 ? first : 'there'
}

/** Plain-text auto-reply to the person who submitted the form (when email is known). */
export function formatClientConfirmationEmailText(submitterName: string): string {
  const who = clientGreetingName(submitterName)
  return [
    `Hi ${who},`,
    '',
    `Thank you for contacting ${BUSINESS_NAME}. We have received your quote request and a member of our team will review it shortly.`,
    '',
    `If your garage door issue is urgent or your door is stuck open, please call us at ${PHONE_DISPLAY} so we can help you right away.`,
    '',
    `Website: ${SITE_ORIGIN}/`,
    '',
    'You received this email because you submitted a quote request on our site.',
    '',
    '—',
    BUSINESS_NAME,
    PHONE_DISPLAY,
  ].join('\n')
}

/** HTML auto-reply — simple, readable in major clients. */
export function formatClientConfirmationEmailHtml(submitterName: string): string {
  const who = escapeHtml(clientGreetingName(submitterName))
  const site = escapeHtml(SITE_ORIGIN)
  const brand = escapeHtml(BUSINESS_NAME)
  const phone = escapeHtml(PHONE_DISPLAY)
  return `
<table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="background-color:#f8fafc;padding:24px 16px;font-family:system-ui,-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif">
  <tr>
    <td align="center">
      <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="max-width:520px;background-color:#ffffff;border-radius:12px;border:1px solid #e2e8f0;overflow:hidden">
        <tr>
          <td style="background-color:#0f172a;padding:20px 28px">
            <p style="margin:0;font-size:18px;font-weight:600;color:#ffffff;letter-spacing:-0.02em">${brand}</p>
            <p style="margin:6px 0 0;font-size:13px;color:#94a3b8">Garage doors · South Florida</p>
          </td>
        </tr>
        <tr>
          <td style="padding:28px 28px 8px">
            <p style="margin:0 0 16px;font-size:16px;line-height:1.5;color:#0f172a">Hi ${who},</p>
            <p style="margin:0 0 16px;font-size:15px;line-height:1.6;color:#334155">Thank you for reaching out. We have received your quote request and will follow up as soon as possible — usually within one business day.</p>
            <p style="margin:0 0 20px;font-size:15px;line-height:1.6;color:#334155">If your door won&apos;t close, is off track, or you need emergency help, call us and we&apos;ll prioritize your job.</p>
            <table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 0 24px">
              <tr>
                <td style="border-radius:8px;background-color:#2563eb">
                  <a href="tel:${PHONE_TEL}" style="display:inline-block;padding:12px 20px;font-size:14px;font-weight:600;color:#ffffff;text-decoration:none">Call ${phone}</a>
                </td>
              </tr>
            </table>
            <p style="margin:0 0 20px;font-size:14px;line-height:1.6;color:#64748b">
              <a href="${site}/" style="color:#2563eb;font-weight:500;text-decoration:none">${site}/</a>
            </p>
          </td>
        </tr>
        <tr>
          <td style="padding:0 28px 28px;border-top:1px solid #f1f5f9">
            <p style="margin:20px 0 0;font-size:12px;line-height:1.5;color:#94a3b8">You received this because you requested a quote on our website. For the fastest response, call ${phone}.</p>
          </td>
        </tr>
      </table>
    </td>
  </tr>
</table>`.trim()
}
