import Image from 'next/image'

import { Container } from '@/components/Container'
import backgroundImage from '@/images/background-faqs.jpg'

const faqs = [
  [
    {
      question: 'Do you offer emergency garage door repair?',
      answer:
        'Yes. We prioritize urgent issues like doors off-track, broken springs, and opener failures. Call and we will advise the fastest path to get you secured.',
    },
    {
      question: 'What areas do you serve?',
      answer:
        'Miami-Dade, Broward, Palm Beach, Lee, Collier, and Monroe Counties — residential, commercial, and industrial properties.',
    },
    {
      question: 'Can you help with hurricane-rated doors?',
      answer:
        'Absolutely. We install impact-rated and wind-rated options and can guide you on code-appropriate choices for your location.',
    },
  ],
  [
    {
      question: 'Do you install and repair openers?',
      answer:
        'We work with major opener brands, remotes, and keypads — including smart features — and can service what you already have when repair makes sense.',
    },
    {
      question: 'How do I get an estimate?',
      answer:
        'Use the quote form on this page or call us directly. For many jobs we can narrow scope quickly with a few photos or a short site visit.',
    },
    {
      question: 'What types of commercial doors do you handle?',
      answer:
        'Roll-up doors, high-cycle operators, gates, and related hardware for warehouses, retail, and industrial facilities.',
    },
  ],
  [
    {
      question: 'How long does installation take?',
      answer:
        'Timing depends on door type and site conditions. We will give you a realistic window up front and communicate if anything changes.',
    },
    {
      question: 'Do you warranty your work?',
      answer:
        'We stand behind our workmanship and use quality parts. Specific warranty terms depend on the product line — we spell that out in your estimate.',
    },
    {
      question: 'Can you match my home’s style?',
      answer:
        'Yes. We carry a range of panel designs, windows, and colors so your new door complements your architecture.',
    },
  ],
]

export function GarageFaqs() {
  return (
    <section
      id="faq"
      aria-labelledby="faq-title"
      className="relative overflow-hidden bg-slate-50 py-20 sm:py-32"
    >
      <Image
        className="absolute top-0 left-1/2 max-w-none translate-x-[-30%] -translate-y-1/4"
        src={backgroundImage}
        alt=""
        width={1558}
        height={946}
        unoptimized
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
            Still unsure? Reach out — we would rather talk through your job than
            leave you guessing.
          </p>
        </div>
        <ul
          role="list"
          className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-8 lg:max-w-none lg:grid-cols-3"
        >
          {faqs.map((column, columnIndex) => (
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
