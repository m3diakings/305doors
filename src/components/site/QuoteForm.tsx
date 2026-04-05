'use client'

import { useId, useState } from 'react'
import clsx from 'clsx'

import { Button } from '@/components/Button'
import { TextField } from '@/components/Fields'
import { PHONE_DISPLAY } from '@/lib/site'

const textareaClasses =
  'block w-full appearance-none rounded-md border border-gray-200 bg-gray-50 px-3 py-2 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:bg-white focus:outline-hidden focus:ring-blue-500 sm:text-sm'

type QuoteFormProps = {
  className?: string
}

export function QuoteForm({ className }: QuoteFormProps) {
  const [status, setStatus] = useState<'idle' | 'sending' | 'ok' | 'error'>('idle')
  const messageId = useId()

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setStatus('sending')
    const form = e.currentTarget
    const data = {
      name: (form.elements.namedItem('name') as HTMLInputElement).value,
      contact: (form.elements.namedItem('contact') as HTMLInputElement).value,
      address: (form.elements.namedItem('address') as HTMLInputElement).value,
      message: (form.elements.namedItem('message') as HTMLTextAreaElement).value,
    }
    try {
      const res = await fetch('/api/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      setStatus(res.ok ? 'ok' : 'error')
      if (res.ok) form.reset()
    } catch {
      setStatus('error')
    }
  }

  return (
    <form
      onSubmit={onSubmit}
      className={clsx('space-y-6 text-left', className)}
      noValidate
    >
      <p className="sr-only">
        Free quote form for garage door installation, repair, or commercial doors
        in Miami-Dade, Broward, Palm Beach, and surrounding South Florida counties.
      </p>
      <TextField
        name="name"
        type="text"
        required
        autoComplete="name"
        placeholder="Name or company *"
        aria-label="Name or company (required)"
      />
      <TextField
        name="contact"
        type="text"
        required
        autoComplete="email"
        placeholder="Email or phone *"
        aria-label="Email or phone (required)"
      />
      <TextField
        name="address"
        type="text"
        required
        autoComplete="street-address"
        placeholder="Address or ZIP *"
        aria-label="Address or ZIP code (required)"
      />
      <textarea
        id={messageId}
        name="message"
        required
        rows={3}
        placeholder="Your message *"
        aria-label="Your message (required)"
        className={clsx(textareaClasses)}
      />
      <div className="flex justify-start">
        <Button
          type="submit"
          color="blue"
          className="min-w-48"
          disabled={status === 'sending'}
        >
          {status === 'sending' ? 'Sending…' : 'Submit'}
        </Button>
      </div>
      {status === 'ok' && (
        <p
          className="text-sm font-medium text-green-700"
          role="status"
        >
          Thanks — we received your request. We will follow up shortly. For
          emergencies, call {PHONE_DISPLAY}.
        </p>
      )}
      {status === 'error' && (
        <p className="text-sm text-red-700" role="alert">
          Something went wrong. Please call {PHONE_DISPLAY} and we will help
          you directly.
        </p>
      )}
    </form>
  )
}
