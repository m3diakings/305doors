import Image from 'next/image'

import { Button } from '@/components/Button'
import { Container } from '@/components/Container'
import { PHONE_DISPLAY, PHONE_TEL, SERVICE_AREAS } from '@/lib/site'

import { QuoteForm } from './QuoteForm'

export function HeroSection() {
  return (
    <Container className="pt-20 pb-16 text-center lg:pt-32">
      <h1 className="mx-auto max-w-4xl font-display text-5xl font-medium tracking-tight text-slate-900 sm:text-7xl">
        Garage door installation &amp; repair{' '}
        <span className="relative whitespace-nowrap text-blue-600">
          <svg
            aria-hidden="true"
            viewBox="0 0 418 42"
            className="absolute top-2/3 left-0 h-[0.58em] w-full fill-blue-300/70"
            preserveAspectRatio="none"
          >
            <path d="M203.371.916c-26.013-2.078-76.686 1.963-124.73 9.946L67.3 12.749C35.421 18.062 18.2 21.766 6.004 25.934 1.244 27.561.828 27.778.874 28.61c.07 1.214.828 1.121 9.595-1.176 9.072-2.377 17.15-3.92 39.246-7.496C123.565 7.986 157.869 4.492 195.942 5.046c7.461.108 19.25 1.696 19.17 2.582-.107 1.183-7.874 4.31-25.75 10.366-21.992 7.45-35.43 12.534-36.701 13.884-2.173 2.308-.202 4.407 4.442 4.734 2.654.187 3.263.157 15.593-.78 35.401-2.686 57.944-3.488 88.365-3.143 46.327.526 75.721 2.23 130.788 7.584 19.787 1.924 20.814 1.98 24.557 1.332l.066-.011c1.201-.203 1.53-1.825.399-2.335-2.911-1.31-4.893-1.604-22.048-3.261-57.509-5.556-87.871-7.36-132.059-7.842-23.239-.254-33.617-.116-50.627.674-11.629.54-42.371 2.494-46.696 2.967-2.359.259 8.133-3.625 26.504-9.81 23.239-7.825 27.934-10.149 28.304-14.005.417-4.348-3.529-6-16.878-7.066Z" />
          </svg>
          <span className="relative">in South Florida</span>
        </span>
      </h1>
      <p className="mx-auto mt-6 max-w-2xl text-lg tracking-tight text-slate-700">
        Residential, commercial, and industrial doors — including hurricane-rated
        options, roll-ups, and openers. Fast response when you need us most.
      </p>
      <div className="mt-10 flex flex-wrap justify-center gap-x-6 gap-y-4">
        <Button href="#contact" color="blue">
          Get a free quote
        </Button>
        <Button href={`tel:${PHONE_TEL}`} variant="outline">
          Call {PHONE_DISPLAY}
        </Button>
      </div>
      <div className="mt-16 lg:mt-24">
        <div className="relative min-h-160 overflow-hidden rounded-4xl bg-slate-900 ring-1 ring-slate-900/10 sm:min-h-192 lg:aspect-21/9 lg:min-h-0">
          <Image
            src="/images/305doors/gallery/latest-work/latest-work-07.jpeg"
            alt="Professional garage door installation on a South Florida home — residential service by 305 Doors Corp"
            fill
            className="object-cover object-center"
            sizes="(min-width: 1024px) 80rem, 100vw"
            priority
          />
          <div
            className="pointer-events-none absolute inset-0 bg-linear-to-t from-slate-950/80 via-slate-950/25 to-slate-950/30 lg:bg-linear-to-r lg:from-slate-950/75 lg:via-slate-950/35 lg:to-slate-950/15"
            aria-hidden="true"
          />

          <div
            id="contact"
            className="absolute inset-x-5 top-8 bottom-5 z-10 flex scroll-mt-24 flex-col justify-between gap-6 text-left sm:inset-x-7 sm:top-7 sm:bottom-7 lg:inset-10 lg:flex-row lg:items-center lg:justify-between lg:gap-8 xl:inset-12"
          >
            <div className="max-w-lg shrink-0 text-white drop-shadow-[0_1px_2px_rgb(0_0_0/0.6)] lg:max-w-xl lg:pr-6">
              <h2 className="font-display text-2xl font-medium tracking-tight sm:text-3xl lg:text-4xl">
                Get a free quote
              </h2>
              <p className="mt-3 text-base text-white/95 sm:text-lg">
                Tell us about your project. For urgent help, call{' '}
                <a
                  href={`tel:${PHONE_TEL}`}
                  className="font-semibold text-blue-400 underline-offset-2 hover:text-white hover:underline"
                >
                  {PHONE_DISPLAY}
                </a>
                .
              </p>
            </div>
            <div className="flex w-full shrink-0 justify-end sm:max-w-md lg:max-w-[min(100%,22rem)] xl:max-w-md">
              <div className="w-full rounded-3xl border border-white/25 bg-white p-5 shadow-[inset_0_1px_0_0_rgb(255_255_255/0.9)] ring-1 ring-slate-900/10 sm:p-6">
                <QuoteForm />
              </div>
            </div>
          </div>
        </div>

        <div className="mt-10 text-left">
          <p className="font-display text-base text-slate-900">
            Proudly serving homeowners &amp; businesses across
          </p>
          <ul
            role="list"
            className="mt-4 flex flex-wrap justify-start gap-x-6 gap-y-2 text-sm font-medium text-slate-600 sm:text-base"
          >
            {SERVICE_AREAS.map((area) => (
              <li key={area}>{area}</li>
            ))}
          </ul>
          <p className="mt-6 text-sm text-slate-500">
            Need details?{' '}
            <a href="#faq" className="font-medium text-blue-600 hover:underline">
              Read common questions
            </a>{' '}
            or{' '}
            <a href="#work" className="font-medium text-blue-600 hover:underline">
              see recent work
            </a>
            .
          </p>
        </div>
      </div>
    </Container>
  )
}
