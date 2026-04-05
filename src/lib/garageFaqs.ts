export type GarageFaqItem = {
  question: string
  answer: string
}

/** Column layout for the FAQ section UI (three columns on large screens). */
export const garageFaqColumns: GarageFaqItem[][] = [
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

export function garageFaqsFlat(): GarageFaqItem[] {
  return garageFaqColumns.flat()
}
