import Link from 'next/link'

import { Container } from '@/components/Container'
import { Footer } from '@/components/Footer'
import { Header } from '@/components/Header'
import { CallToActionBand } from '@/components/site/CallToActionBand'
import { GarageFaqs } from '@/components/site/GarageFaqs'
import { MarketingHero } from '@/components/site/MarketingHero'
import { PrimaryServices } from '@/components/site/PrimaryServices'
import { PromoSection } from '@/components/site/PromoSection'
import { SecondaryServices } from '@/components/site/SecondaryServices'
import { StickyCallBar } from '@/components/site/StickyCallBar'
import { WorkShowcase } from '@/components/site/WorkShowcase'
import {
  CITY_PAGE_SLUGS,
  COUNTY_PAGES,
  cityDisplayName,
  type LocationViewModel,
} from '@/lib/locationPages'
function locationPath(slug: string): string {
  return `/${slug}/`
}

export function LocationLanding({ model }: { model: LocationViewModel }) {
  const sections = model.sections

  const breadcrumb = (
    <nav className="text-slate-500" aria-label="Breadcrumb">
      <ol className="flex flex-wrap items-center justify-center gap-x-2 gap-y-1">
        <li>
          <Link href="/" className="font-medium text-blue-600 hover:underline">
            Home
          </Link>
        </li>
        <li aria-hidden="true">/</li>
        <li className="text-slate-700">{model.h1}</li>
      </ol>
    </nav>
  )

  const belowImage = (
    <>
      <h2 className="font-display text-lg font-medium text-slate-900 sm:text-xl">
        {sections.heroTrustHeading}
      </h2>
      <ul className="mt-4 max-w-3xl list-inside list-disc space-y-2 text-slate-700">
        {model.bullets.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
      {model.paragraphs.map((p) => (
        <p key={p} className="mt-6 max-w-3xl text-slate-700">
          {p}
        </p>
      ))}
      <p className="mt-10 font-display text-base text-slate-900">
        Proudly serving homeowners &amp; businesses across
      </p>
      <ul
        role="list"
        className="mt-4 flex flex-wrap justify-start gap-x-6 gap-y-2 text-sm font-medium sm:text-base"
      >
        {COUNTY_PAGES.map((c) => (
          <li key={c.slug}>
            <Link
              href={locationPath(c.slug)}
              className="text-slate-600 transition hover:text-blue-600 hover:underline"
            >
              {c.label}
            </Link>
          </li>
        ))}
      </ul>
      <p className="mt-6 text-sm text-slate-500">
        {model.kind === 'city' ? (
          <>
            <Link
              href={locationPath(model.countySlug)}
              className="font-medium text-blue-600 hover:underline"
            >
              Garage door services in {model.countyName}
            </Link>
            <span aria-hidden="true"> · </span>
          </>
        ) : null}
        <a href="#faq" className="font-medium text-blue-600 hover:underline">
          Common questions
        </a>
        <span aria-hidden="true"> · </span>
        <a href="#work" className="font-medium text-blue-600 hover:underline">
          Recent work
        </a>
      </p>
    </>
  )

  return (
    <>
      <Header />
      <main id="content" className="flex-1 pb-24 sm:pb-0">
        <MarketingHero
          breadcrumb={breadcrumb}
          headingBefore={model.heroHeadingBefore}
          headingAccent={model.heroHeadingAccent}
          subtitle={model.lead}
          imageSrc={model.heroImageSrc}
          imageAlt={model.heroImageAlt}
          imagePriority
          belowImage={belowImage}
        />

        <PrimaryServices locale={sections} />
        <SecondaryServices locale={sections} />
        <PromoSection locale={sections} />
        <CallToActionBand locale={sections} />
        <WorkShowcase locale={sections} />

        {model.kind === 'county' && model.linkedCitySlugs.length > 0 ? (
          <section
            className="border-y border-slate-200 bg-slate-50 py-20 sm:py-32"
            aria-labelledby="location-cities-heading"
          >
            <Container>
              <h2
                id="location-cities-heading"
                className="mx-auto max-w-2xl text-center font-display text-3xl tracking-tight text-slate-900 sm:text-4xl md:mx-auto lg:max-w-4xl"
              >
                {sections.countyCityListHeading}
              </h2>
              <p className="mx-auto mt-4 max-w-2xl text-center text-lg tracking-tight text-slate-700">
                {sections.countyCityListIntro}
              </p>
              <p className="mx-auto mt-10 max-w-3xl text-center text-base leading-relaxed text-slate-700">
                {model.linkedCitySlugs.map((slug, index) => (
                  <span key={slug}>
                    {index > 0 ? (
                      <span className="text-slate-300" aria-hidden="true">
                        {' · '}
                      </span>
                    ) : null}
                    <Link
                      href={locationPath(slug)}
                      className="font-medium text-blue-600 hover:underline"
                    >
                      {cityDisplayName(slug as (typeof CITY_PAGE_SLUGS)[number])}
                    </Link>
                  </span>
                ))}
              </p>
            </Container>
          </section>
        ) : null}

        {model.kind === 'city' ? (
          <section
            className="border-y border-slate-200 bg-slate-50 py-20 sm:py-32"
            aria-labelledby="location-siblings-heading"
          >
            <Container>
              <h2
                id="location-siblings-heading"
                className="mx-auto max-w-2xl text-center font-display text-3xl tracking-tight text-slate-900 sm:text-4xl"
              >
                More cities in {model.countyName}
              </h2>
              <p className="mx-auto mt-4 max-w-2xl text-center text-lg text-slate-700">
                <Link
                  href={locationPath(model.countySlug)}
                  className="font-semibold text-blue-600 hover:underline"
                >
                  View the full {model.countyName} service hub
                </Link>
              </p>
              <p className="mx-auto mt-10 max-w-3xl text-center text-base leading-relaxed text-slate-700">
                {model.siblingCitySlugs.map((slug, index) => (
                  <span key={slug}>
                    {index > 0 ? (
                      <span className="text-slate-300" aria-hidden="true">
                        {' · '}
                      </span>
                    ) : null}
                    <Link
                      href={locationPath(slug)}
                      className="font-medium text-blue-600 hover:underline"
                    >
                      {cityDisplayName(slug as (typeof CITY_PAGE_SLUGS)[number])}
                    </Link>
                  </span>
                ))}
              </p>
            </Container>
          </section>
        ) : null}

        <GarageFaqs locale={sections} />
      </main>
      <Footer />
      <StickyCallBar />
    </>
  )
}
