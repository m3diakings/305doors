'use client'

import { useId } from 'react'

import { Container } from '@/components/Container'
import type { LocalizedSiteSections } from '@/lib/locationPages'

interface Feature {
  name: string
  summary: string
  description: string
  icon: React.ComponentType
}

const defaultFeatures: Array<Feature> = [
  {
    name: 'Storm-ready',
    summary: 'Hurricane-rated doors and hardware that meet Florida demands.',
    description:
      'We help you choose impact-rated options, fast lead times on in-stock doors, and installation done right the first time.',
    icon: function StormIcon() {
      const id = useId()
      return (
        <>
          <defs>
            <linearGradient
              id={id}
              x1="11.5"
              y1={18}
              x2={36}
              y2="15.5"
              gradientUnits="userSpaceOnUse"
            >
              <stop offset=".194" stopColor="#fff" />
              <stop offset={1} stopColor="#6692F1" />
            </linearGradient>
          </defs>
          <path
            d="m30 15-4 5-4-11-4 18-4-11-4 7-4-5"
            stroke={`url(#${id})`}
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </>
      )
    },
  },
  {
    name: 'Stock & speed',
    summary: 'Doors in stock and crews ready when timing matters.',
    description:
      'From same-day emergencies to scheduled upgrades, we keep communication clear so you know exactly what to expect.',
    icon: function SpeedIcon() {
      return (
        <>
          <path
            opacity=".5"
            d="M8 17a1 1 0 0 1 1-1h18a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1H9a1 1 0 0 1-1-1v-2Z"
            fill="#fff"
          />
          <path
            opacity=".3"
            d="M8 24a1 1 0 0 1 1-1h18a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1H9a1 1 0 0 1-1-1v-2Z"
            fill="#fff"
          />
          <path
            d="M8 10a1 1 0 0 1 1-1h18a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1H9a1 1 0 0 1-1-1v-2Z"
            fill="#fff"
          />
        </>
      )
    },
  },
  {
    name: 'People you trust',
    summary: 'Certified technicians who treat your home like their own.',
    description:
      'Over a decade serving South Florida with transparent estimates, quality parts, and workmanship backed by experience.',
    icon: function PeopleIcon() {
      return (
        <>
          <path
            opacity=".5"
            d="M25.778 25.778c.39.39 1.027.393 1.384-.028A11.952 11.952 0 0 0 30 18c0-6.627-5.373-12-12-12S6 11.373 6 18c0 2.954 1.067 5.659 2.838 7.75.357.421.993.419 1.384.028.39-.39.386-1.02.036-1.448A9.959 9.959 0 0 1 8 18c0-5.523 4.477-10 10-10s10 4.477 10 10a9.959 9.959 0 0 1-2.258 6.33c-.35.427-.354 1.058.036 1.448Z"
            fill="#fff"
          />
          <path
            d="M12 28.395V28a6 6 0 0 1 12 0v.395A11.945 11.945 0 0 1 18 30c-2.186 0-4.235-.584-6-1.605ZM21 16.5c0-1.933-.5-3.5-3-3.5s-3 1.567-3 3.5 1.343 3.5 3 3.5 3-1.567 3-3.5Z"
            fill="#fff"
          />
        </>
      )
    },
  },
]

function Feature({
  feature,
  className,
  ...props
}: React.ComponentPropsWithoutRef<'div'> & {
  feature: Feature
}) {
  return (
    <div className={className} {...props}>
      <div className="w-9 rounded-lg bg-blue-600">
        <svg aria-hidden="true" className="h-9 w-9" fill="none">
          <feature.icon />
        </svg>
      </div>
      <h3 className="mt-6 text-sm font-medium text-blue-600">{feature.name}</h3>
      <p className="mt-2 font-display text-xl text-slate-900">{feature.summary}</p>
      <p className="mt-4 text-sm text-slate-600">{feature.description}</p>
    </div>
  )
}

type SecondaryServicesProps = {
  locale?: LocalizedSiteSections
}

export function SecondaryServices({ locale }: SecondaryServicesProps) {
  const features: Array<Feature> = locale
    ? locale.secondaryFeatures.map((sf, i) => ({
        ...sf,
        icon: defaultFeatures[i]!.icon,
      }))
    : defaultFeatures

  const heading =
    locale?.secondaryHeading ?? 'Built for Florida homes & businesses.'
  const subheading =
    locale?.secondarySubheading ??
    'From storm season prep to daily dependability, we focus on safety, speed, and workmanship you can feel confident recommending.'

  return (
    <section
      id="why-us"
      aria-label={locale ? `Why choose 305 Doors — ${locale.focusLabel}` : 'Why choose 305 Doors'}
      className="pt-20 pb-14 sm:pt-32 sm:pb-20 lg:pb-32"
    >
      <Container>
        <div className="mx-auto max-w-2xl md:text-center">
          <h2 className="font-display text-3xl tracking-tight text-slate-900 sm:text-4xl">
            {heading}
          </h2>
          <p className="mt-4 text-lg tracking-tight text-slate-700">{subheading}</p>
        </div>
        <div className="mt-16 grid grid-cols-1 gap-12 sm:mt-20 sm:gap-16 lg:mt-16 lg:grid-cols-3 lg:gap-x-8 lg:gap-y-0">
          {features.map((feature) => (
            <Feature key={feature.summary} feature={feature} className="mx-auto max-w-lg lg:mx-0" />
          ))}
        </div>
      </Container>
    </section>
  )
}
