import Image from 'next/image'
import Link from 'next/link'

import { Container } from '@/components/Container'
import { Footer } from '@/components/Footer'
import { Header } from '@/components/Header'
import { CallToActionBand } from '@/components/site/CallToActionBand'
import { GarageServiceAreasSection } from '@/components/site/GarageServiceAreasSection'
import { MarketingHero } from '@/components/site/MarketingHero'
import { StickyCallBar } from '@/components/site/StickyCallBar'
import { COUNTY_PAGES } from '@/lib/locationPages'
import type { ServicePageContent } from '@/lib/servicePages'
import { PHONE_DISPLAY, PHONE_TEL, SITE_ORIGIN } from '@/lib/site'
import backgroundFaqsImage from '@/images/background-faqs.jpg'

function ServiceFaqJsonLd({
  url,
  id,
  items,
}: {
  url: string
  id: string
  items: ServicePageContent['faqs']
}) {
  const faqPage = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    '@id': id,
    url,
    mainEntity: items.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(faqPage) }}
    />
  )
}

function splitFaqsIntoColumns<T>(items: readonly T[]): T[][] {
  const columns: T[][] = [[], [], []]
  items.forEach((item, i) => {
    columns[i % 3].push(item)
  })
  return columns
}

function BreadcrumbJsonLd({
  items,
}: {
  items: readonly { name: string; url: string }[]
}) {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: item.url,
    })),
  }
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  )
}

function locationPath(slug: string): string {
  return `/${slug}/`
}

export function ServiceLanding({ content }: { content: ServicePageContent }) {
  const pageUrl = `${SITE_ORIGIN}/services/${content.slug}/`
  const breadcrumbItems = [
    { name: 'Home', url: `${SITE_ORIGIN}/` },
    { name: 'Services', url: `${SITE_ORIGIN}/#services` },
    { name: content.navLabel, url: pageUrl },
  ] as const

  const breadcrumb = (
    <nav className="text-slate-500" aria-label="Breadcrumb">
      <ol className="flex flex-wrap items-center justify-center gap-x-2 gap-y-1">
        <li>
          <Link href="/" className="font-medium text-blue-600 hover:underline">
            Home
          </Link>
        </li>
        <li aria-hidden="true">/</li>
        <li>
          <Link href="/#services" className="font-medium text-blue-600 hover:underline">
            Services
          </Link>
        </li>
        <li aria-hidden="true">/</li>
        <li className="text-slate-700">{content.navLabel}</li>
      </ol>
    </nav>
  )

  const belowImage = (
    <>
      <h2 className="font-display text-lg font-medium text-slate-900 sm:text-xl">
        {content.trustHeading}
      </h2>
      <ul className="mt-4 max-w-3xl list-inside list-disc space-y-2 text-slate-700">
        {content.bullets.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
      {content.belowHeroParagraphs.map((p, i) => (
        <p key={i} className="mt-6 max-w-3xl text-slate-700">
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
        <a href="#faq" className="font-medium text-blue-600 hover:underline">
          Common questions
        </a>
        <span aria-hidden="true"> · </span>
        <Link href="/#work" className="font-medium text-blue-600 hover:underline">
          Recent work
        </Link>
      </p>
    </>
  )

  return (
    <>
      <Header />
      <main id="content" className="flex-1 pb-24 sm:pb-0">
        <MarketingHero
          breadcrumb={breadcrumb}
          headingBefore={content.heroHeadingBefore}
          headingAccent={content.heroHeadingAccent}
          subtitle={content.lead}
          imageSrc={content.imageSrc}
          imageAlt={content.imageAlt}
          imagePriority
          wideSubtitle
          belowImage={belowImage}
        />

        <section
          className="border-y border-slate-200 bg-slate-50 py-20 sm:py-32"
          aria-labelledby="service-detail-heading"
        >
          <Container>
            <div className="mx-auto max-w-2xl text-center lg:mx-auto lg:max-w-none">
              <h2
                id="service-detail-heading"
                className="font-display text-3xl tracking-tight text-slate-900 sm:text-4xl"
              >
                How we deliver this service
              </h2>
              <p className="mt-4 text-lg tracking-tight text-slate-700">
                Straight talk, code-smart installs, and repairs built to last in South Florida’s
                climate — from the first call through cleanup.
              </p>
            </div>
            <div className="mx-auto mt-16 max-w-3xl space-y-16 lg:mt-20">
              {content.sections.map((section) => (
                <section key={section.heading}>
                  <h3 className="font-display text-2xl tracking-tight text-slate-900 sm:text-3xl">
                    {section.heading}
                  </h3>
                  {section.paragraphs.map((p, i) => (
                    <p
                      key={`${section.heading}-${i}`}
                      className="mt-4 text-base leading-relaxed text-slate-700 sm:text-lg"
                    >
                      {p}
                    </p>
                  ))}
                </section>
              ))}
            </div>
          </Container>
        </section>

        <CallToActionBand />

        <GarageServiceAreasSection />

        <section
          id="faq"
          aria-labelledby="faq-title"
          className="relative overflow-hidden bg-slate-50 py-20 sm:py-32"
        >
          <ServiceFaqJsonLd
            url={pageUrl}
            id={`${pageUrl}#faq`}
            items={content.faqs}
          />
          <Image
            className="absolute top-0 left-1/2 max-w-none translate-x-[-30%] -translate-y-1/4"
            src={backgroundFaqsImage}
            alt=""
            width={1558}
            height={946}
            unoptimized
            aria-hidden
          />
          <Container className="relative">
            <div className="mx-auto max-w-2xl lg:mx-0">
              <h2
                id="faq-title"
                className="font-display text-3xl tracking-tight text-slate-900 sm:text-4xl"
              >
                Questions, answered.
              </h2>
              <p className="mt-4 text-lg tracking-tight text-slate-700">
                Still unsure? Reach out — we would rather talk through your job than leave you
                guessing. Call{' '}
                <a
                  href={`tel:${PHONE_TEL}`}
                  className="font-semibold text-blue-600 hover:underline"
                >
                  {PHONE_DISPLAY}
                </a>{' '}
                or{' '}
                <Link href="/#contact" className="font-semibold text-blue-600 hover:underline">
                  request a quote online
                </Link>
                .
              </p>
            </div>
            <ul
              role="list"
              className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-8 lg:max-w-none lg:grid-cols-3"
            >
              {splitFaqsIntoColumns(content.faqs).map((column, columnIndex) => (
                <li key={columnIndex}>
                  <ul role="list" className="flex flex-col gap-y-8">
                    {column.map((faq, faqIndex) => (
                      <li key={`${columnIndex}-${faqIndex}`}>
                        <h3 className="font-display text-lg/7 text-slate-900">{faq.question}</h3>
                        <p className="mt-4 text-sm text-slate-700">{faq.answer}</p>
                      </li>
                    ))}
                  </ul>
                </li>
              ))}
            </ul>
          </Container>
        </section>

        <BreadcrumbJsonLd items={breadcrumbItems} />
      </main>
      <Footer />
      <StickyCallBar />
    </>
  )
}
