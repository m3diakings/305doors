import { BUSINESS_NAME } from '@/lib/site'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const webhook = process.env.LEAD_WEBHOOK_URL
    if (webhook) {
      await fetch(webhook, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          source: '305doors-web',
          business: BUSINESS_NAME,
          receivedAt: new Date().toISOString(),
          ...body,
        }),
      })
    }
    return Response.json({ ok: true })
  } catch {
    return Response.json({ ok: false }, { status: 400 })
  }
}
