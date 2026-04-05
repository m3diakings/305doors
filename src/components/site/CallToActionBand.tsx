import Image from 'next/image'

import { Button } from '@/components/Button'
import { Container } from '@/components/Container'
import type { LocalizedSiteSections } from '@/lib/locationPages'
import backgroundImage from '@/images/background-call-to-action.jpg'
import { PHONE_DISPLAY, PHONE_TEL } from '@/lib/site'

type CallToActionBandProps = {
  locale?: LocalizedSiteSections
}

export function CallToActionBand({ locale }: CallToActionBandProps) {
  const line1 = locale?.ctaLine1 ?? 'Brand new doors.'
  const line2 = locale?.ctaLine2 ?? 'Straightforward pricing.'

  return (
    <section
      className="relative overflow-hidden bg-blue-600 py-24 sm:py-32"
      aria-labelledby="cta-pricing-heading"
    >
      <Image
        className="absolute top-1/2 left-1/2 max-w-none -translate-x-1/2 -translate-y-1/2"
        src={backgroundImage}
        alt=""
        width={2347}
        height={1244}
        unoptimized
        aria-hidden
      />
      <Container className="relative">
        <div className="mx-auto max-w-2xl text-center">
          <h2
            id="cta-pricing-heading"
            className="font-display text-3xl tracking-tight text-white sm:text-4xl"
          >
            {line1}
            <br /> {line2}
          </h2>
          <p className="mt-4 text-lg tracking-tight text-blue-100">
            {locale ? (
              <>
                {locale.ctaBody}{' '}
                <a
                  href={`tel:${PHONE_TEL}`}
                  className="font-semibold text-white underline-offset-2 hover:underline"
                >
                  {PHONE_DISPLAY}
                </a>{' '}
                — we respond fast.
              </>
            ) : (
              <>
                Get a free estimate for installation or repair. Call{' '}
                <a
                  href={`tel:${PHONE_TEL}`}
                  className="font-semibold text-white underline-offset-2 hover:underline"
                >
                  {PHONE_DISPLAY}
                </a>{' '}
                or send us your project details — we respond fast.
              </>
            )}
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Button href="/#contact" color="white">
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
