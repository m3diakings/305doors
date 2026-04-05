'use client'

import { Button } from '@/components/Button'
import { PHONE_DISPLAY, PHONE_TEL } from '@/lib/site'

export function StickyCallBar() {
  return (
    <div
      className="fixed inset-x-0 bottom-0 z-40 border-t border-slate-200 bg-white/95 p-3 shadow-[0_-4px_24px_rgba(15,23,42,0.06)] backdrop-blur-sm sm:hidden"
      role="navigation"
      aria-label="Quick call and quote"
    >
      <div className="mx-auto flex max-w-lg items-center justify-center gap-3">
        <Button href={`tel:${PHONE_TEL}`} color="blue" className="flex-1 justify-center">
          Call
        </Button>
        <Button href="/#contact" color="slate" className="flex-1 justify-center">
          Quote
        </Button>
      </div>
      {/* <p className="mt-1.5 text-center text-xs text-slate-500">{PHONE_DISPLAY}</p> */}
    </div>
  )
}
