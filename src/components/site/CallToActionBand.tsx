import Image from 'next/image'

import { Button } from '@/components/Button'
import { Container } from '@/components/Container'
import backgroundImage from '@/images/background-call-to-action.jpg'
import { PHONE_DISPLAY, PHONE_TEL } from '@/lib/site'

export function CallToActionBand() {
  return (
    <section className="relative overflow-hidden bg-blue-600 py-24 sm:py-32">
      <Image
        className="absolute top-1/2 left-1/2 max-w-none -translate-x-1/2 -translate-y-1/2"
        src={backgroundImage}
        alt=""
        width={2347}
        height={1244}
        unoptimized
      />
      <Container className="relative">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-display text-3xl tracking-tight text-white sm:text-4xl">
            Brand new doors.<br/> Straightforward pricing.
          </h2>
          <p className="mt-4 text-lg tracking-tight text-blue-100">
            Get a free estimate for installation or repair. Call{' '}
            <a href={`tel:${PHONE_TEL}`} className="font-semibold text-white underline-offset-2 hover:underline">
              {PHONE_DISPLAY}
            </a>{' '}
            or send us your project details — we respond fast.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Button href="#contact" color="white">
              Get a free quote
            </Button>
            <Button
              href={`tel:${PHONE_TEL}`}
              variant="outline"
              color="white"
              className="ring-white/40 text-white hover:bg-white/10"
            >
              Call now
            </Button>
          </div>
        </div>
      </Container>
    </section>
  )
}
