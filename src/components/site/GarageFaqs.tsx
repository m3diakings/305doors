import Image from 'next/image'

import { Container } from '@/components/Container'
import {
  garageFaqColumns,
  garageFaqsFlat,
  type GarageFaqItem,
} from '@/lib/garageFaqs'
import type { LocalizedSiteSections } from '@/lib/locationPages'
import { SITE_ORIGIN } from '@/lib/site'
import backgroundImage from '@/images/background-faqs.jpg'

type GarageFaqsProps = {
  locale?: LocalizedSiteSections
}

function GarageFaqJsonLd({
  url,
  id,
  items,
}: {
  url: string
  id: string
  items: GarageFaqItem[]
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

export function GarageFaqs({ locale }: GarageFaqsProps) {
  const columns = locale?.faqColumns ?? garageFaqColumns
  const flatItems = locale ? locale.faqColumns.flat() : garageFaqsFlat()
  const title = locale?.faqSectionTitle ?? 'Questions, answered.'
  const intro =
    locale?.faqSectionIntro ??
    'Still unsure? Reach out — we would rather talk through your job than leave you guessing.'
  const jsonUrl = locale?.faqPageUrl ?? `${SITE_ORIGIN}/`
  const jsonId = locale?.faqPageId ?? `${SITE_ORIGIN}/#faq`

  return (
    <section
      id="faq"
      aria-labelledby="faq-title"
      className="relative overflow-hidden bg-slate-50 py-20 sm:py-32"
    >
      <GarageFaqJsonLd url={jsonUrl} id={jsonId} items={flatItems} />
      <Image
        className="absolute top-0 left-1/2 max-w-none translate-x-[-30%] -translate-y-1/4"
        src={backgroundImage}
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
            {title}
          </h2>
          <p className="mt-4 text-lg tracking-tight text-slate-700">{intro}</p>
        </div>
        <ul
          role="list"
          className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-8 lg:max-w-none lg:grid-cols-3"
        >
          {columns.map((column, columnIndex) => (
            <li key={columnIndex}>
              <ul role="list" className="flex flex-col gap-y-8">
                {column.map((faq, faqIndex) => (
                  <li key={faqIndex}>
                    <h3 className="font-display text-lg/7 text-slate-900">
                      {faq.question}
                    </h3>
                    <p className="mt-4 text-sm text-slate-700">{faq.answer}</p>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  )
}
