import Link from 'next/link'

import { MarketingHero } from '@/components/site/MarketingHero'
import { COUNTY_PAGES } from '@/lib/locationPages'

export function HeroSection() {
  return (
    <MarketingHero
      headingBefore="Garage door installation & repair "
      headingAccent="in South Florida"
      subtitle="Residential, commercial, and industrial doors — including hurricane-rated options, roll-ups, and openers. Fast response when you need us most."
      imageSrc="/images/305doors/gallery/latest-work/latest-work-07.jpeg"
      imageAlt="Professional garage door installation on a South Florida home — residential service by 305 Doors Corp"
      imagePriority
      belowImage={
        <>
          <p className="font-display text-base text-slate-900">
            Proudly serving homeowners &amp; businesses across
          </p>
          <ul
            role="list"
            className="mt-4 flex flex-wrap justify-start gap-x-6 gap-y-2 text-sm font-medium text-slate-600 sm:text-base"
          >
            {COUNTY_PAGES.map((c) => (
              <li key={c.slug}>
                <Link
                  href={`/${c.slug}/`}
                  className="text-slate-600 transition hover:text-blue-600 hover:underline"
                >
                  {c.label}
                </Link>
              </li>
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
        </>
      }
    />
  )
}
