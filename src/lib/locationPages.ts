/**
 * Location landing pages — slugs and URLs match the legacy WordPress site
 * (see https://www.305doors.com/page-sitemap.xml).
 */

import type { GarageFaqItem } from '@/lib/garageFaqs'

import { PHONE_DISPLAY, SITE_ORIGIN } from '@/lib/site'

export const COUNTY_PAGE_SLUGS = [
  'garage-door-services-in-miami-dade-county',
  'garage-door-repair-installation-in-broward-county',
  'garage-door-repair-installation-in-palm-beach-county',
  'garage-door-repair-installation-in-lee-county',
  'garage-door-repair-installation-in-collier-county',
  'garage-door-repair-installation-in-monroe-county',
] as const

/** Palm Beach, Lee, Collier & Monroe city pages (`{city}-garage-doors`) — same pattern as Miami-Dade/Broward. */
const PALM_BEACH_CITY_SLUGS = [
  'boca-raton-garage-doors',
  'west-palm-beach-garage-doors',
  'delray-beach-garage-doors',
  'boynton-beach-garage-doors',
  'palm-beach-gardens-garage-doors',
  'jupiter-garage-doors',
] as const

const LEE_COUNTY_CITY_SLUGS = [
  'fort-myers-garage-doors',
  'cape-coral-garage-doors',
  'bonita-springs-garage-doors',
  'estero-garage-doors',
  'sanibel-garage-doors',
  'fort-myers-beach-garage-doors',
] as const

const COLLIER_COUNTY_CITY_SLUGS = [
  'naples-garage-doors',
  'marco-island-garage-doors',
  'immokalee-garage-doors',
  'golden-gate-garage-doors',
  'north-naples-garage-doors',
] as const

const MONROE_COUNTY_CITY_SLUGS = [
  'key-west-garage-doors',
  'marathon-garage-doors',
  'key-largo-garage-doors',
  'islamorada-garage-doors',
  'big-pine-key-garage-doors',
] as const

const PALM_BEACH_CITY_SET = new Set<string>(PALM_BEACH_CITY_SLUGS)
const LEE_COUNTY_CITY_SET = new Set<string>(LEE_COUNTY_CITY_SLUGS)
const COLLIER_COUNTY_CITY_SET = new Set<string>(COLLIER_COUNTY_CITY_SLUGS)
const MONROE_COUNTY_CITY_SET = new Set<string>(MONROE_COUNTY_CITY_SLUGS)

/** City URLs use the `{city}-garage-doors` pattern (legacy WordPress sitemap + expanded counties). */
export const CITY_PAGE_SLUGS = [
  'aventura-garage-doors',
  'bal-harbour-garage-doors',
  'bay-harbor-islands-garage-doors',
  'biscayne-park-garage-doors',
  'coconut-creek-garage-doors',
  'cooper-city-garage-doors',
  'coral-gables-garage-doors',
  'coral-springs-garage-doors',
  'cutler-bay-garage-doors',
  'dania-beach-garage-doors',
  'davie-garage-doors',
  'deerfield-beach-garage-doors',
  'doral-garage-doors',
  'el-portal-garage-doors',
  'florida-city-garage-doors',
  'fort-lauderdale-garage-doors',
  'golden-beach-garage-doors',
  'hallandale-beach-garage-doors',
  'hialeah-garage-doors',
  'hialeah-gardens-garage-doors',
  'hillsboro-beach-garage-doors',
  'hollywood-garage-doors',
  'homestead-garage-doors',
  'indian-creek-garage-doors',
  'kendall-garage-doors',
  'key-biscayne-garage-doors',
  'lauderdale-by-the-sea-garage-doors',
  'lauderdale-lakes-garage-doors',
  'lauderhill-garage-doors',
  'lazy-lake-garage-doors',
  'lighthouse-point-garage-doors',
  'margate-garage-doors',
  'medley-garage-doors',
  'miami-beach-garage-doors',
  'miami-garage-doors',
  'miami-gardens-garage-doors',
  'miami-lakes-garage-doors',
  'miami-shores-garage-doors',
  'miami-springs-garage-doors',
  'miramar-garage-doors',
  'north-bay-village-garage-doors',
  'north-lauderdale-garage-doors',
  'north-miami-beach-garage-doors',
  'north-miami-garage-doors',
  'oakland-park-garage-doors',
  'opa-locka-garage-doors',
  'palmetto-bay-garage-doors',
  'parkland-garage-doors',
  'pembroke-pines-garage-doors',
  'pinecrest-garage-doors',
  'plantation-garage-doors',
  'pompano-beach-garage-doors',
  'sea-ranch-lakes-garage-doors',
  'south-miami-garage-doors',
  'southwest-ranches-garage-doors',
  'sunny-isles-beach-garage-doors',
  'sunrise-garage-doors',
  'surfside-garage-doors',
  'sweetwater-garage-doors',
  'tamarac-garage-doors',
  'virginia-gardens-garage-doors',
  'west-miami-garage-doors',
  'west-park-garage-doors',
  'weston-garage-doors',
  'wilton-manors-garage-doors',
  ...PALM_BEACH_CITY_SLUGS,
  ...LEE_COUNTY_CITY_SLUGS,
  ...COLLIER_COUNTY_CITY_SLUGS,
  ...MONROE_COUNTY_CITY_SLUGS,
] as const

const BROWARD_SET = new Set<string>([
  'coconut-creek-garage-doors',
  'cooper-city-garage-doors',
  'coral-springs-garage-doors',
  'dania-beach-garage-doors',
  'davie-garage-doors',
  'deerfield-beach-garage-doors',
  'fort-lauderdale-garage-doors',
  'hallandale-beach-garage-doors',
  'hillsboro-beach-garage-doors',
  'hollywood-garage-doors',
  'lauderdale-by-the-sea-garage-doors',
  'lauderdale-lakes-garage-doors',
  'lauderhill-garage-doors',
  'lazy-lake-garage-doors',
  'lighthouse-point-garage-doors',
  'margate-garage-doors',
  'miramar-garage-doors',
  'north-lauderdale-garage-doors',
  'oakland-park-garage-doors',
  'parkland-garage-doors',
  'pembroke-pines-garage-doors',
  'plantation-garage-doors',
  'pompano-beach-garage-doors',
  'sea-ranch-lakes-garage-doors',
  'southwest-ranches-garage-doors',
  'sunrise-garage-doors',
  'tamarac-garage-doors',
  'west-park-garage-doors',
  'weston-garage-doors',
  'wilton-manors-garage-doors',
])

const CITY_DISPLAY_OVERRIDES: Record<string, string> = {
  'lauderdale-by-the-sea-garage-doors': 'Lauderdale-by-the-Sea',
  'bay-harbor-islands-garage-doors': 'Bay Harbor Islands',
  'north-miami-beach-garage-doors': 'North Miami Beach',
  'sunny-isles-beach-garage-doors': 'Sunny Isles Beach',
  'sea-ranch-lakes-garage-doors': 'Sea Ranch Lakes',
  'key-biscayne-garage-doors': 'Key Biscayne',
  'miami-gardens-garage-doors': 'Miami Gardens',
  'miami-lakes-garage-doors': 'Miami Lakes',
  'miami-shores-garage-doors': 'Miami Shores',
  'miami-springs-garage-doors': 'Miami Springs',
  'miami-beach-garage-doors': 'Miami Beach',
  'north-miami-garage-doors': 'North Miami',
  'south-miami-garage-doors': 'South Miami',
  'west-miami-garage-doors': 'West Miami',
  'hialeah-gardens-garage-doors': 'Hialeah Gardens',
  'pembroke-pines-garage-doors': 'Pembroke Pines',
  'pompano-beach-garage-doors': 'Pompano Beach',
  'deerfield-beach-garage-doors': 'Deerfield Beach',
  'dania-beach-garage-doors': 'Dania Beach',
  'hallandale-beach-garage-doors': 'Hallandale Beach',
  'hillsboro-beach-garage-doors': 'Hillsboro Beach',
  'fort-lauderdale-garage-doors': 'Fort Lauderdale',
  'coral-springs-garage-doors': 'Coral Springs',
  'coconut-creek-garage-doors': 'Coconut Creek',
  'cooper-city-garage-doors': 'Cooper City',
  'coral-gables-garage-doors': 'Coral Gables',
  'north-bay-village-garage-doors': 'North Bay Village',
  'north-lauderdale-garage-doors': 'North Lauderdale',
  'oakland-park-garage-doors': 'Oakland Park',
  'southwest-ranches-garage-doors': 'Southwest Ranches',
  'lighthouse-point-garage-doors': 'Lighthouse Point',
  'lauderdale-lakes-garage-doors': 'Lauderdale Lakes',
  'lazy-lake-garage-doors': 'Lazy Lake',
  'west-park-garage-doors': 'West Park',
  'wilton-manors-garage-doors': 'Wilton Manors',
  'biscayne-park-garage-doors': 'Biscayne Park',
  'cutler-bay-garage-doors': 'Cutler Bay',
  'el-portal-garage-doors': 'El Portal',
  'florida-city-garage-doors': 'Florida City',
  'golden-beach-garage-doors': 'Golden Beach',
  'indian-creek-garage-doors': 'Indian Creek',
  'miami-garage-doors': 'Miami',
  'opa-locka-garage-doors': 'Opa-locka',
  'palmetto-bay-garage-doors': 'Palmetto Bay',
  'pinecrest-garage-doors': 'Pinecrest',
  'virginia-gardens-garage-doors': 'Virginia Gardens',
  'sweetwater-garage-doors': 'Sweetwater',
  'fort-myers-beach-garage-doors': 'Fort Myers Beach',
  'big-pine-key-garage-doors': 'Big Pine Key',
  'palm-beach-gardens-garage-doors': 'Palm Beach Gardens',
  'bonita-springs-garage-doors': 'Bonita Springs',
  'cape-coral-garage-doors': 'Cape Coral',
  'north-naples-garage-doors': 'North Naples',
  'golden-gate-garage-doors': 'Golden Gate',
  'marco-island-garage-doors': 'Marco Island',
  'key-largo-garage-doors': 'Key Largo',
}

export function cityDisplayName(citySlug: (typeof CITY_PAGE_SLUGS)[number]): string {
  if (CITY_DISPLAY_OVERRIDES[citySlug]) {
    return CITY_DISPLAY_OVERRIDES[citySlug]
  }
  const core = citySlug.replace(/-garage-doors$/, '')
  return core
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(' ')
}

export function isBrowardCity(slug: string): boolean {
  return BROWARD_SET.has(slug)
}

export function countyPageSlugForCitySlug(
  slug: (typeof CITY_PAGE_SLUGS)[number],
): (typeof COUNTY_PAGE_SLUGS)[number] {
  if (isBrowardCity(slug)) {
    return 'garage-door-repair-installation-in-broward-county'
  }
  if (PALM_BEACH_CITY_SET.has(slug)) {
    return 'garage-door-repair-installation-in-palm-beach-county'
  }
  if (LEE_COUNTY_CITY_SET.has(slug)) {
    return 'garage-door-repair-installation-in-lee-county'
  }
  if (COLLIER_COUNTY_CITY_SET.has(slug)) {
    return 'garage-door-repair-installation-in-collier-county'
  }
  if (MONROE_COUNTY_CITY_SET.has(slug)) {
    return 'garage-door-repair-installation-in-monroe-county'
  }
  return 'garage-door-services-in-miami-dade-county'
}

export type CountyPageConfig = {
  slug: (typeof COUNTY_PAGE_SLUGS)[number]
  countyName: string
  /** Short label for links */
  label: string
}

export const COUNTY_PAGES: readonly CountyPageConfig[] = [
  {
    slug: 'garage-door-services-in-miami-dade-county',
    countyName: 'Miami-Dade County',
    label: 'Miami-Dade County',
  },
  {
    slug: 'garage-door-repair-installation-in-broward-county',
    countyName: 'Broward County',
    label: 'Broward County',
  },
  {
    slug: 'garage-door-repair-installation-in-palm-beach-county',
    countyName: 'Palm Beach County',
    label: 'Palm Beach County',
  },
  {
    slug: 'garage-door-repair-installation-in-lee-county',
    countyName: 'Lee County',
    label: 'Lee County',
  },
  {
    slug: 'garage-door-repair-installation-in-collier-county',
    countyName: 'Collier County',
    label: 'Collier County',
  },
  {
    slug: 'garage-door-repair-installation-in-monroe-county',
    countyName: 'Monroe County',
    label: 'Monroe County',
  },
] as const

const COUNTY_SLUG_TO_CONFIG = Object.fromEntries(
  COUNTY_PAGES.map((c) => [c.slug, c]),
) as Record<(typeof COUNTY_PAGE_SLUGS)[number], CountyPageConfig>

export function getCountyConfig(
  slug: string,
): CountyPageConfig | undefined {
  return COUNTY_SLUG_TO_CONFIG[slug as (typeof COUNTY_PAGE_SLUGS)[number]]
}

export const ALL_LOCATION_SLUGS: readonly string[] = [
  ...COUNTY_PAGE_SLUGS,
  ...CITY_PAGE_SLUGS,
]

export function isValidLocationSlug(slug: string): boolean {
  return (
    (COUNTY_PAGE_SLUGS as readonly string[]).includes(slug) ||
    (CITY_PAGE_SLUGS as readonly string[]).includes(slug)
  )
}

const SLUG_MIAMI_DADE = 'garage-door-services-in-miami-dade-county' as const
const SLUG_BROWARD = 'garage-door-repair-installation-in-broward-county' as const

export function miamiDadeCitySlugs(): readonly (typeof CITY_PAGE_SLUGS)[number][] {
  return CITY_PAGE_SLUGS.filter(
    (s): s is (typeof CITY_PAGE_SLUGS)[number] =>
      countyPageSlugForCitySlug(s) === SLUG_MIAMI_DADE,
  )
}

export function browardCitySlugs(): readonly (typeof CITY_PAGE_SLUGS)[number][] {
  return CITY_PAGE_SLUGS.filter(
    (s): s is (typeof CITY_PAGE_SLUGS)[number] =>
      countyPageSlugForCitySlug(s) === SLUG_BROWARD,
  )
}

/** City page slugs under each county hub. */
export function citySlugsForCountyPage(
  countySlug: (typeof COUNTY_PAGE_SLUGS)[number],
): readonly (typeof CITY_PAGE_SLUGS)[number][] {
  switch (countySlug) {
    case SLUG_MIAMI_DADE:
      return miamiDadeCitySlugs()
    case SLUG_BROWARD:
      return browardCitySlugs()
    case 'garage-door-repair-installation-in-palm-beach-county':
      return [...PALM_BEACH_CITY_SLUGS]
    case 'garage-door-repair-installation-in-lee-county':
      return [...LEE_COUNTY_CITY_SLUGS]
    case 'garage-door-repair-installation-in-collier-county':
      return [...COLLIER_COUNTY_CITY_SLUGS]
    case 'garage-door-repair-installation-in-monroe-county':
      return [...MONROE_COUNTY_CITY_SLUGS]
  }
}

/** Counties to show in the homepage “Garage door service areas” strip. */
export function countyHasServiceAreaList(
  countySlug: (typeof COUNTY_PAGE_SLUGS)[number],
): boolean {
  return citySlugsForCountyPage(countySlug).length > 0
}

const LOCATION_HERO_IMAGES = [
  '/images/305doors/gallery/latest-work/latest-work-07.jpeg',
  '/images/305doors/gallery/latest-work/latest-work-08.jpeg',
  '/images/305doors/gallery/latest-work/latest-work-10.jpeg',
  '/images/305doors/gallery/latest-work/latest-work-11.jpeg',
  '/images/305doors/gallery/latest-work/latest-work-16.jpeg',
] as const

export function locationHeroImageSrc(slug: string): string {
  let h = 0
  for (let i = 0; i < slug.length; i++) {
    h = (h * 31 + slug.charCodeAt(i)) >>> 0
  }
  return LOCATION_HERO_IMAGES[h % LOCATION_HERO_IMAGES.length]
}

/** Localized headings and body copy for marketing sections on county/city landing pages. */
export type LocalizedSiteSections = {
  /** Primary keyword focus: county or city name */
  focusLabel: string
  countyName: string
  kind: 'county' | 'city'
  primaryHeading: string
  primarySubheading: string
  primaryTabs: readonly {
    title: string
    description: string
    image: string
    imageAlt: string
  }[]
  secondaryHeading: string
  secondarySubheading: string
  secondaryFeatures: readonly {
    name: string
    summary: string
    description: string
  }[]
  promoBody: string
  promoBullet1: string
  promoBullet2: string
  promoImageAlt: string
  promoLocationLine: string
  ctaLine1: string
  ctaLine2: string
  ctaBody: string
  workTitle: string
  workSubtitle: string
  workSlides: readonly {
    src: string
    title: string
    caption: string
    imageAlt: string
  }[]
  faqSectionTitle: string
  faqSectionIntro: string
  faqColumns: GarageFaqItem[][]
  faqPageUrl: string
  faqPageId: string
  /** Hero “below the fold” trust line */
  heroTrustHeading: string
  /** County hub: grid of city links */
  countyCityListHeading: string
  countyCityListIntro: string
}

function buildLocalizedFaqColumns(
  focusLabel: string,
  countyName: string,
  kind: 'county' | 'city',
): GarageFaqItem[][] {
  const areaAnswer =
    kind === 'city'
      ? `Garage door service in ${focusLabel} is our priority, and we still run trucks throughout ${countyName} the same week. Larger commercial or multi-bay jobs can also pull crews from Miami-Dade, Broward, Palm Beach, Lee, Collier, and Monroe Counties.`
      : `This page highlights cities we market inside ${focusLabel}. Garage door repair and installation still dispatch countywide for estimates and emergencies — call ${PHONE_DISPLAY} if your address is outside the list.`

  return [
    [
      {
        question: `Do you offer emergency garage door repair in ${focusLabel}?`,
        answer:
          kind === 'city'
            ? `Yes. For ${focusLabel} homes and businesses we treat off-track doors, broken springs, snapped cables, and dead openers as urgent garage door repairs. Call ${PHONE_DISPLAY} for the fastest safe fix.`
            : `Yes. Countywide garage door repair in ${focusLabel} covers off-track doors, broken springs, snapped cables, and dead openers as urgent work. Call ${PHONE_DISPLAY} and we will outline the fastest safe fix.`,
      },
      {
        question:
          kind === 'city'
            ? `What areas do you serve around ${focusLabel}?`
            : `Which neighborhoods are covered in ${focusLabel}?`,
        answer: areaAnswer,
      },
      {
        question: `Can you help with hurricane-rated garage doors in ${focusLabel}?`,
        answer:
          kind === 'city'
            ? `Yes — hurricane-rated and wind-rated garage door assemblies for ${countyName}, with hardware matched to local wind maps and paperwork insurers often request.`
            : `Yes. ${countyName} wind maps and insurer checklists shape our hurricane garage door recommendations across ${focusLabel}: rated assemblies, reinforced hardware, and documented installs for code reviews.`,
      },
    ],
    [
      {
        question: `Do you install and repair garage door openers in ${focusLabel}?`,
        answer:
          kind === 'city'
            ? `Yes. Garage door opener installation and repair in ${focusLabel} covers belt, chain, and jackshaft operators, remotes, keypads, and smart home ties — we repair when it saves you money and replace when reliability demands it.`
            : `Yes — belt, chain, and jackshaft garage door openers, remotes, keypads, and smart integrations countywide in ${focusLabel}. We service existing operators when repair is the smarter spend.`,
      },
      {
        question: `How do I get a garage door estimate in ${focusLabel}?`,
        answer:
          kind === 'city'
            ? `Request a garage door installation or repair estimate through the quote form with photos and your ${focusLabel} address, or call ${PHONE_DISPLAY}. Most residential jobs in ${countyName} get a written range after a short call or site visit.`
            : `Use this page’s quote form for garage door replacement or repair anywhere in ${focusLabel}, or call ${PHONE_DISPLAY}. Most ${countyName} homeowners receive a written range after a brief call or visit.`,
      },
      {
        question: `What commercial garage doors do you handle in ${focusLabel}?`,
        answer:
          kind === 'city'
            ? `Commercial garage door service in ${focusLabel} includes roll-up doors, sectional bays, high-cycle operators, gates, and loading docks — plus preventive tune-ups for warehouses, retail, and mixed-use buildings in ${countyName}.`
            : `Across ${focusLabel} we install and service commercial roll-up doors, sectional bays, high-cycle operators, gates, and loading-dock systems — with preventive tune-ups that cut downtime countywide.`,
      },
    ],
    [
      {
        question: `How long does garage door installation take in ${focusLabel}?`,
        answer:
          kind === 'city'
            ? `New garage door installation timing depends on the door line and ${countyName} inspection volume. We quote realistic install windows for ${focusLabel} jobs up front and update you if freight or permits slip.`
            : `Garage door installation lead times in ${focusLabel} depend on product selection and ${countyName} inspection schedules. We set honest timelines at estimate time and notify you when anything shifts.`,
      },
      {
        question: `Do you warranty garage door work in ${focusLabel}?`,
        answer:
          kind === 'city'
            ? `Workmanship and parts coverage for garage door installation and repair are spelled out in every ${focusLabel} estimate. Manufacturer warranties vary by line — you approve everything after seeing the full terms.`
            : `Every garage door job we perform in ${focusLabel} lists workmanship coverage and parts terms in writing. Manufacturer warranties differ by product — we review that before you sign off.`,
      },
      {
        question: `Can you match my ${focusLabel} home’s architectural style?`,
        answer:
          kind === 'city'
            ? `Yes. Residential garage door styles for ${countyName} homes include carriage, contemporary, full-view, and traditional panels — colors and windows chosen to fit streetscapes and HOA rules around ${focusLabel}.`
            : `Yes. We stock carriage, contemporary, full-view, and traditional garage doors so ${focusLabel} homes can match local architecture and HOA guidelines without sacrificing wind ratings.`,
      },
    ],
  ]
}

const BASE_WORK_SLIDES = [
  {
    src: '/images/305doors/services/installation-louver.jpg',
    title: 'Residential upgrade',
    caption:
      'Full replacement with insulated panel door and new hardware — completed for neighbors across South Florida.',
  },
  {
    src: '/images/305doors/gallery/work-02.jpeg',
    title: 'Commercial bay',
    caption: 'Heavy-duty installation tuned for daily commercial cycles and high-traffic docks.',
  },
  {
    src: '/images/305doors/gallery/work-03.jpeg',
    title: 'Curb appeal',
    caption: 'Modern finish and clean lines chosen to match each home’s exterior palette.',
  },
  {
    src: '/images/305doors/gallery/work-04.jpg',
    title: 'Repair & tune-up',
    caption: 'Safety inspection, balance, and operator alignment after wear from heat and daily use.',
  },
  {
    src: '/images/305doors/gallery/work-05.jpeg',
    title: 'Opener upgrade',
    caption: 'Quiet drive systems and smart access options for busy households.',
  },
  {
    src: '/images/305doors/gallery/work-06.jpeg',
    title: 'Local install crew',
    caption: 'Same attention to detail on every job — from coastal condos to inland warehouses.',
  },
] as const

function buildLocalizedSiteSections(opts: {
  kind: 'county' | 'city'
  focusLabel: string
  countyName: string
  slug: string
}): LocalizedSiteSections {
  const { kind, focusLabel, countyName, slug } = opts
  const isCity = kind === 'city'
  const origin = SITE_ORIGIN.replace(/\/$/, '')
  const pagePath = `/${slug}/`
  const faqPageUrl = `${origin}${pagePath}`
  const faqPageId = `${faqPageUrl}#faq`

  const workSlides = BASE_WORK_SLIDES.map((slide, i) => {
    const captionSuffix =
      i === 5
        ? isCity
          ? ` Garage door installation project near ${focusLabel}, ${countyName}.`
          : ` Garage door service completed across ${focusLabel}.`
        : ''
    return {
      src: slide.src,
      title: slide.title,
      caption: `${slide.caption}${captionSuffix}`,
      imageAlt: `${slide.title} — garage door contractor serving ${focusLabel}, ${countyName} — 305 Doors Corp`,
    }
  })

  return {
    focusLabel,
    countyName,
    kind,
    primaryHeading: isCity
      ? `Garage door installation & repair in ${focusLabel}`
      : `Garage door repair & installation across ${focusLabel}`,
    primarySubheading: isCity
      ? `Full-service garage doors for ${focusLabel}: new installs, emergency repair, commercial roll-ups, and opener upgrades — one ${countyName} team for residential and commercial properties.`
      : `Countywide garage door installation, emergency repair, commercial roll-ups, and smart openers for every city in ${focusLabel} — same 305 Doors Corp standards as our South Florida homepage.`,

    primaryTabs: [
      {
        title: 'Installation & replacement',
        description: isCity
          ? `Garage door replacement in ${focusLabel} with insulated sectional, full-view, and wind-rated options built around ${countyName} weather, inspectors, and your home or facility.`
          : `New garage doors countywide in ${focusLabel}: insulated sectionals, full-view glass, and code-smart assemblies for ${countyName} wind loads and inspections.`,
        image: '/images/305doors/gallery/latest-work/latest-work-01.jpeg',
        imageAlt: `Garage door installation and replacement in ${focusLabel}, ${countyName} — 305 Doors Corp`,
      },
      {
        title: 'Repair & 24-hour response',
        description: isCity
          ? `24-hour garage door repair when capacity allows — springs, cables, rollers, sensors, and openers for ${focusLabel} addresses. We secure the opening first, then fix or replace only what failed.`
          : `Garage door repair throughout ${focusLabel}: springs, cables, rollers, sensors, and openers. Safety first on every ${countyName} call — no unnecessary parts.`,
        image: '/images/305doors/gallery/latest-work/latest-work-08.jpeg',
        imageAlt: `Emergency garage door repair in ${focusLabel} — springs, tracks, openers — 305 Doors Corp`,
      },
      {
        title: 'Roll-up doors & gates',
        description: isCity
          ? `Commercial garage doors for ${focusLabel}: high-cycle roll-ups, sectional bays, and gates for warehouses, flex space, and marinas — operators and safety devices matched to your traffic.`
          : `Commercial roll-up and sectional garage doors across ${focusLabel} for warehouses, marinas, and logistics — counterbalance, operators, and safety hardware tuned to daily use.`,
        image: '/images/305doors/gallery/work-04.jpg',
        imageAlt: `Commercial roll-up and sectional doors in ${focusLabel}, ${countyName}`,
      },
      {
        title: 'Openers & smart accessories',
        description: isCity
          ? `Garage door opener installation and service in ${focusLabel}: quiet belt drives, heavy-lift units, remotes, keypads, and smart access — specified for ${countyName} heat and voltage quirks.`
          : `Garage door openers countywide in ${focusLabel}: belt, chain, and jackshaft operators, remotes, keypads, and smart integrations for homes and businesses.`,
        image: '/images/305doors/services/openers-accessories.jpg',
        imageAlt: `Garage door openers and smart accessories installed in ${focusLabel} — 305 Doors Corp`,
      },
    ],

    secondaryHeading: isCity
      ? `Garage doors built for ${focusLabel} & ${countyName}`
      : `Garage door service for all of ${focusLabel}`,
    secondarySubheading: isCity
      ? `Hurricane prep, daily traffic, and ${countyName} heat stress hardware — we prioritize safe garage door repair, realistic scheduling, and installs your ${focusLabel} neighbors trust.`
      : `Storm season, humidity, and commercial traffic across ${focusLabel} punish garage doors daily. We deliver code-aware installs, fast repair dispatch, and workmanship municipalities rely on.`,

    secondaryFeatures: [
      {
        name: 'Hurricane-ready garage doors',
        summary: isCity
          ? `Wind-rated options for ${countyName}.`
          : `${countyName} wind-load expertise.`,
        description: isCity
          ? `Impact-rated and wind-rated garage door assemblies for ${focusLabel}, with paperwork that supports ${countyName} inspections and insurers — plus stocked doors when storm demand spikes.`
          : `Hurricane garage door options countywide in ${focusLabel}: assemblies, hardware, and documentation aligned with ${countyName} maps and insurer checklists.`,
      },
      {
        name: 'Fast garage door service',
        summary: isCity
          ? `Same-day repair in ${focusLabel} when open.`
          : `Rapid dispatch across ${focusLabel}.`,
        description: isCity
          ? `Garage door repair routes cover ${focusLabel} and surrounding ${countyName} corridors — honest arrival windows for homeowners and facility managers.`
          : `Same-day and next-day garage door service in ${focusLabel} when scheduling allows, with clear ETAs for every ${countyName} job.`,
      },
      {
        name: 'Local garage door contractors',
        summary: isCity
          ? `${focusLabel} & ${countyName} experience.`
          : `Countywide field experience.`,
        description: isCity
          ? `Written estimates for garage door installation and repair in ${focusLabel}, quality parts, and technicians who know ${countyName} job sites from gated neighborhoods to industrial parks.`
          : `Transparent garage door pricing for ${focusLabel}, proven parts, and crews experienced in ${countyName} communities and commercial parks.`,
      },
    ],

    promoBody: isCity
      ? `Hurricane-season garage door specials: rated assemblies and professional installation with inventory staged for ${countyName} — ${focusLabel} homeowners and businesses avoid last-minute shortages.`
      : `Storm-season garage door promotions for ${focusLabel}: impact-minded doors, certified installs, and ${countyName}-ready inventory when lead times tighten.`,
    promoBullet1: isCity
      ? `In-stock garage doors routed to ${focusLabel} & ${countyName}`
      : `Garage door inventory ready across ${focusLabel}`,
    promoBullet2: isCity
      ? `Installers who know ${countyName} code and inspection language`
      : `${countyName} code-smart garage door installs`,
    promoImageAlt: `Hurricane season garage door promotion for ${focusLabel}, ${countyName} — impact-rated options by 305 Doors Corp`,
    promoLocationLine: isCity
      ? `Hurricane prep — ${focusLabel}`
      : `Storm-ready — ${focusLabel}`,

    ctaLine1: isCity
      ? `Garage door quotes for ${focusLabel}.`
      : `Garage doors — all of ${focusLabel}.`,
    ctaLine2: 'Straightforward pricing.',
    ctaBody: isCity
      ? `Written garage door installation and repair estimates for ${focusLabel}. Send photos through the form, or call`
      : `Written garage door estimates anywhere in ${focusLabel}. Send photos through the form, or call`,

    workTitle: isCity
      ? `Garage door projects near ${focusLabel}`
      : `Garage door installs & repairs in ${focusLabel}`,
    workSubtitle: isCity
      ? `Residential and commercial garage door work from our ${countyName} crews — same warranties and craftsmanship we bring to ${focusLabel} properties.`
      : `Garage door installation and repair photos from jobs throughout ${focusLabel} — the same team and standards available for your address.`,
    workSlides,

    faqSectionTitle: isCity
      ? `Garage door repair & install FAQ — ${focusLabel}`
      : `Garage door service FAQ — ${focusLabel}`,
    faqSectionIntro: isCity
      ? `Answers about emergency garage door repair, hurricane-rated doors, openers, and written estimates for ${focusLabel} and ${countyName}. Call ${PHONE_DISPLAY} to talk through your job.`
      : `Garage door installation, commercial roll-ups, storm-rated options, and estimates for every city in ${focusLabel}. Questions? Call ${PHONE_DISPLAY}.`,
    faqColumns: buildLocalizedFaqColumns(focusLabel, countyName, kind),
    faqPageUrl,
    faqPageId,

    heroTrustHeading: isCity
      ? `Why ${focusLabel} chooses us for garage doors`
      : `Why ${focusLabel} trusts our garage door crews`,
    countyCityListHeading: `Garage door service by city — ${countyName}`,
    countyCityListIntro: isCity
      ? `Explore ${countyName} city pages for localized garage door repair, installation, and opener content tied to each community.`
      : `Pick a ${countyName} city for garage door repair, replacement, and opener service copy specific to that municipality.`,
  }
}

export type LocationViewModel =
  | {
      kind: 'county'
      slug: string
      countyName: string
      pageTitle: string
      metaDescription: string
      h1: string
      lead: string
      paragraphs: readonly string[]
      bullets: readonly string[]
      linkedCitySlugs: readonly string[]
      heroHeadingBefore: string
      heroHeadingAccent: string
      heroImageSrc: string
      heroImageAlt: string
      sections: LocalizedSiteSections
    }
  | {
      kind: 'city'
      slug: string
      pageTitle: string
      metaDescription: string
      h1: string
      lead: string
      paragraphs: readonly string[]
      bullets: readonly string[]
      countySlug: string
      countyName: string
      cityName: string
      siblingCitySlugs: readonly string[]
      heroHeadingBefore: string
      heroHeadingAccent: string
      heroImageSrc: string
      heroImageAlt: string
      sections: LocalizedSiteSections
    }

function countyHeadline(countyName: string, slug: string): string {
  if (slug === 'garage-door-services-in-miami-dade-county') {
    return `Garage door services in ${countyName}`
  }
  return `Garage door repair & installation in ${countyName}`
}

type CountyCopy = {
  lead: string
  paragraphs: readonly [string, string]
  bullets: readonly string[]
  metaDescription: string
  heroImageAlt: string
}

function getCountyLocationCopy(
  countySlug: (typeof COUNTY_PAGE_SLUGS)[number],
  countyName: string,
  h1: string,
): CountyCopy {
  switch (countySlug) {
    case 'garage-door-services-in-miami-dade-county':
      return {
        lead: `From Brickell high-rises to Homestead ranches, ${countyName} mixes dense urban garages, coastal homes, and industrial bays — 305 Doors Corp installs, repairs, and upgrades doors for that reality every day.`,
        paragraphs: [
          `We roll through Miami, Miami Beach, Kendall, Hialeah, Doral, and every other municipality in ${countyName}: sectional doors, parking gates, warehouse roll-ups, and openers tuned for heat, humidity, and hurricane season.`,
          `Use the city links below for neighborhood-specific context, or call ${PHONE_DISPLAY} for a free estimate anywhere in ${countyName} — including same-day help when scheduling allows.`,
        ],
        bullets: [
          `New garage doors & full replacements across ${countyName}, including impact-rated assemblies`,
          `Repair countywide: broken springs, snapped cables, dead openers, off-track doors, bent panels`,
          `Commercial service in ${countyName}: roll-ups, high-cycle operators, storefront and logistics doors`,
          `Code-smart wind-load and hurricane options for ${countyName} inspections and insurance peace of mind`,
          `Written estimates before we start — no mystery pricing for ${countyName} homes or businesses`,
        ],
        metaDescription: `${h1}. Miami to Cutler Bay: install, repair, openers, hurricane doors & roll-ups. Free estimates ${PHONE_DISPLAY}.`,
        heroImageAlt: `Garage door installation and repair crew serving homes and businesses in ${countyName} — 305 Doors Corp`,
      }
    case 'garage-door-repair-installation-in-broward-county':
      return {
        lead: `Fort Lauderdale skylines, Hollywood beachfront streets, and Weston family neighborhoods all sit inside ${countyName} — we match garage door installs and repairs to each setting, from quiet belt-drive openers to heavy-duty commercial operators.`,
        paragraphs: [
          `Our technicians cover Pembroke Pines, Coral Springs, Plantation, Pompano Beach, and the rest of ${countyName}: diagnosing balance issues, replacing torsion systems, and swapping operators without cutting corners.`,
          `Pick your city page for local notes, or reach us at ${PHONE_DISPLAY} for emergency off-track or spring work anywhere in ${countyName}.`,
        ],
        bullets: [
          `Residential garage door replacement & new construction installs throughout ${countyName}`,
          `Emergency repair in ${countyName} when capacity allows — springs, cables, sensors, remotes`,
          `Commercial roll-up and sectional doors for ${countyName} retail, warehouses, and marinas`,
          `Smart openers, keypads, and access upgrades for ${countyName} properties`,
          `Storm-season-ready hardware and wind-rated doors for ${countyName} code requirements`,
        ],
        metaDescription: `${h1}. Ft Lauderdale to Weston: repair, install, openers & commercial roll-ups. Free quote ${PHONE_DISPLAY}.`,
        heroImageAlt: `Garage door service van and completed install in ${countyName} — 305 Doors Corp`,
      }
    case 'garage-door-repair-installation-in-palm-beach-county':
      return {
        lead: `${countyName} stretches from Boca Raton and Delray to Jupiter and Palm Beach Island — 305 Doors Corp handles estate carriage doors, golf-community homes, and busy commercial bays with the same detail-oriented crew.`,
        paragraphs: [
          `We plan installs around HOA guidelines, coastal exposure, and daily traffic patterns: insulated doors for air-conditioned garages, quiet operators for attached homes, and rugged systems for workshop bays.`,
          `Call ${PHONE_DISPLAY} for a walkthrough anywhere in ${countyName}. We also route crews from our Miami-Dade and Broward bases for larger Palm Beach projects.`,
        ],
        bullets: [
          `Premium and standard door lines installed countywide in ${countyName}`,
          `Repair & tune-ups for ${countyName}: springs, cables, rollers, hinges, and openers`,
          `Wind-rated and designer options suited to ${countyName} architecture`,
          `Commercial sectional and rolling steel doors for ${countyName} businesses`,
          `Free estimates with clear timelines for ${countyName} homeowners and property managers`,
        ],
        metaDescription: `${h1}. Boca to Jupiter: garage door install, repair, openers & rated doors. ${PHONE_DISPLAY}.`,
        heroImageAlt: `Residential garage door project in ${countyName} — 305 Doors Corp South Florida`,
      }
    case 'garage-door-repair-installation-in-lee-county':
      return {
        lead: `Fort Myers, Cape Coral, Bonita Springs, and Sanibel-area traffic keep ${countyName} on the move — 305 Doors Corp keeps garage doors opening smoothly through humid summers, seasonal population spikes, and storm prep.`,
        paragraphs: [
          `We service single-family homes, villas, and light commercial bays across ${countyName}: corrosion-prone hardware near the Gulf, high-lift doors for RV garages, and operators that survive daily heat cycles.`,
          `Text photos to speed quoting, or call ${PHONE_DISPLAY} for urgent ${countyName} jobs when safety is on the line.`,
        ],
        bullets: [
          `Installations & replacements for ${countyName} homes, rentals, and seasonal residences`,
          `Repair: springs, cables, openers, weather seals, and noisy doors anywhere in ${countyName}`,
          `Hurricane-ready door options for ${countyName} wind zones and insurer checklists`,
          `Commercial doors for ${countyName} contractors, storage, and retail`,
          `Local scheduling honesty — we tell you real arrival windows for ${countyName}`,
        ],
        metaDescription: `${h1}. Ft Myers area: garage door repair, install & openers. Free estimate ${PHONE_DISPLAY}.`,
        heroImageAlt: `Garage door technician serving ${countyName} homes — 305 Doors Corp`,
      }
    case 'garage-door-repair-installation-in-collier-county':
      return {
        lead: `Naples, Marco Island, and Golden Gate estates define much of ${countyName} — 305 Doors Corp delivers discreet, high-finish installs and rapid repairs where curb appeal and reliability both matter.`,
        paragraphs: [
          `Expect help with carriage-style overlays, full-view aluminum doors, insulated assemblies for golf-cart bays, and commercial operators for ${countyName} service businesses.`,
          `Dial ${PHONE_DISPLAY} for ${countyName} emergencies or to book a measured estimate on your timeline.`,
        ],
        bullets: [
          `Luxury and standard door installs tailored to ${countyName} architecture`,
          `Precision repair for ${countyName}: balance, springs, cables, tracks, and smart openers`,
          `Storm-rated assemblies for ${countyName} coastal wind maps`,
          `Roll-up and sectional doors for ${countyName} workshops and retail`,
          `Transparent pricing for ${countyName} homeowners, HOAs, and property managers`,
        ],
        metaDescription: `${h1}. Naples & Marco: install, repair, hurricane doors & openers. ${PHONE_DISPLAY}.`,
        heroImageAlt: `Garage door installation in ${countyName} — 305 Doors Corp`,
      }
    case 'garage-door-repair-installation-in-monroe-county':
      return {
        lead: `The Florida Keys mean salt air, tight lots, and storm-driven building rules — 305 Doors Corp serves ${countyName} with hardware that resists corrosion and operators that keep island homes and small commercial bays functional year-round.`,
        paragraphs: [
          `We plan for Key West, Marathon, Islamorada, and Upper Keys properties: limited access, HOA constraints, and the need for rated assemblies when codes demand them.`,
          `Call ${PHONE_DISPLAY} to coordinate ${countyName} service windows — we factor drive time and weather realistically.`,
        ],
        bullets: [
          `Coastal-grade hardware and finishes for ${countyName} salt exposure`,
          `Repair & replacement anywhere in ${countyName} the team can reach by schedule`,
          `Wind-rated and impact-minded door options suited to ${countyName} conditions`,
          `Commercial light-duty doors for ${countyName} shops, docks, and storage`,
          `Straight talk on lead times and permits for ${countyName} island work`,
        ],
        metaDescription: `${h1}. Florida Keys garage doors: repair, install & storm-ready options. ${PHONE_DISPLAY}.`,
        heroImageAlt: `Garage door service in the Florida Keys — ${countyName} — 305 Doors Corp`,
      }
    default: {
      const _exhaustive: never = countySlug
      return _exhaustive
    }
  }
}

/** Cities where copy should mention salt air, coastal hardware, and wind exposure. */
const COASTAL_CITY_SLUGS = new Set<string>([
  'miami-beach-garage-doors',
  'surfside-garage-doors',
  'bal-harbour-garage-doors',
  'bay-harbor-islands-garage-doors',
  'sunny-isles-beach-garage-doors',
  'north-miami-beach-garage-doors',
  'golden-beach-garage-doors',
  'aventura-garage-doors',
  'key-biscayne-garage-doors',
  'hallandale-beach-garage-doors',
  'hollywood-garage-doors',
  'dania-beach-garage-doors',
  'fort-lauderdale-garage-doors',
  'lauderdale-by-the-sea-garage-doors',
  'pompano-beach-garage-doors',
  'deerfield-beach-garage-doors',
  'hillsboro-beach-garage-doors',
  'sea-ranch-lakes-garage-doors',
  'indian-creek-garage-doors',
  // Palm Beach County — Atlantic / Intracoastal exposure
  'boca-raton-garage-doors',
  'west-palm-beach-garage-doors',
  'delray-beach-garage-doors',
  'boynton-beach-garage-doors',
  'palm-beach-gardens-garage-doors',
  'jupiter-garage-doors',
  // Lee / Collier / Keys
  'sanibel-garage-doors',
  'fort-myers-beach-garage-doors',
  'marco-island-garage-doors',
  'naples-garage-doors',
  'key-west-garage-doors',
  'marathon-garage-doors',
  'key-largo-garage-doors',
  'islamorada-garage-doors',
  'big-pine-key-garage-doors',
])

const INDUSTRIAL_LEAN_CITY_SLUGS = new Set<string>([
  'medley-garage-doors',
  'doral-garage-doors',
  'opa-locka-garage-doors',
  'florida-city-garage-doors',
])

type CityCopy = {
  lead: string
  paragraphs: readonly [string, string]
  bullets: readonly string[]
  metaDescription: string
  pageTitle: string
  heroImageAlt: string
}

function getCityLocationCopy(
  citySlug: string,
  cityName: string,
  countyName: string,
  h1: string,
): CityCopy {
  const coastal = COASTAL_CITY_SLUGS.has(citySlug)
  const industrial = INDUSTRIAL_LEAN_CITY_SLUGS.has(citySlug)

  if (industrial) {
    return {
      lead: `${cityName}, ${countyName}: industrial corridors, business parks, and residential streets side by side. 305 Doors Corp keeps commercial roll-up doors, sectional bays, and residential garage doors online with repair schedules that respect production.`,
      paragraphs: [
        `Garage door repair in ${cityName} covers high-cycle springs, operator logic boards, and sectional doors on warehouses and fleet bays — plus home garages that share the same ${countyName} traffic patterns.`,
        `Email photos of your garage door and opener labels for faster quotes, or call ${PHONE_DISPLAY} for emergency garage door repair in ${cityName} when the bay is stuck open.`,
      ],
      bullets: [
        `Commercial garage door repair in ${cityName}: roll-ups, sectional doors, high-cycle operators`,
        `Residential garage door replacement in ${cityName} with ${countyName} wind ratings`,
        `Garage door openers, remotes, and keypads for industrial and residential sites`,
        `Preventive garage door tune-ups for high-cycle ${countyName} facilities`,
        `24-hour garage door repair in ${cityName} when crews are available`,
      ],
      metaDescription: `${cityName} ${countyName} garage doors: commercial & home repair, install, openers. ${PHONE_DISPLAY}.`,
      pageTitle: `${cityName} garage doors — ${countyName}`,
      heroImageAlt: `Commercial and residential garage door work in ${cityName}, ${countyName} — 305 Doors Corp`,
    }
  }

  if (coastal) {
    return {
      lead: `Coastal ${cityName} in ${countyName} means salt air, wind-driven rain, and garage door codes inland templates miss. 305 Doors Corp installs and repairs hurricane-rated and wind-rated garage doors sized for that exposure.`,
      paragraphs: [
        `Garage door replacement and repair in ${cityName} start with coatings, wind pressure, and cycle counts — then we recommend fixes or rated doors that satisfy ${countyName} inspectors and your HOA.`,
        `Request a free garage door estimate for your ${cityName} address, or call ${PHONE_DISPLAY} for urgent garage door repair when rust, noise, or a broken spring traps vehicles.`,
      ],
      bullets: [
        `Garage door repair in ${cityName}: springs, cables, tracks, openers, weather seals`,
        `Hurricane-rated garage door installation for ${countyName} coastal wind zones`,
        `Quiet garage door openers and smart access for ${cityName} condos & townhomes`,
        `Commercial sectional garage doors for ${cityName} retail and mixed-use`,
        `Photo-based garage door estimates for faster ${countyName} pricing`,
      ],
      metaDescription: `${h1}. Coastal ${countyName}: rated doors, repair & openers. Free estimate ${PHONE_DISPLAY}.`,
      pageTitle: `${cityName} garage doors — coastal ${countyName}`,
      heroImageAlt: `Coastal garage door installation in ${cityName}, ${countyName} — 305 Doors Corp`,
    }
  }

  return {
    lead: `Garage door repair and installation in ${cityName}, ${countyName}: homeowners and businesses call 305 Doors Corp for crooked doors, dead openers, and quieter insulated upgrades — upfront pricing from technicians who know the neighborhood.`,
    paragraphs: [
      `Typical ${cityName} garage door service includes torsion spring replacement, smart opener installs, and full door swaps when panels delaminate — every job gets cable, balance, and safety sensor checks.`,
      `Submit your ${cityName} ZIP with photos on the quote form, or call ${PHONE_DISPLAY} for same-day garage door repair when scheduling allows and access is blocked.`,
    ],
    bullets: [
      `Garage door repair in ${cityName}: springs, cables, rollers, sensors, openers`,
      `New garage door installation styled for ${cityName} homes & ${countyName} codes`,
      `Hurricane-rated garage door options where ${countyName} requires them`,
      `Commercial garage doors for ${cityName} offices, warehouses, flex space`,
      `Emergency garage door service in ${cityName} when crews are free`,
    ],
    metaDescription: `${h1}. Local install, repair & openers in ${countyName}. ${PHONE_DISPLAY}.`,
    pageTitle: `${cityName} garage doors — ${countyName}`,
    heroImageAlt: `Garage door service in ${cityName}, ${countyName} — 305 Doors Corp`,
  }
}

export function getLocationViewModel(slug: string): LocationViewModel | null {
  const county = getCountyConfig(slug)
  if (county) {
    const h1 = countyHeadline(county.countyName, slug)

    const linkedCitySlugs = citySlugsForCountyPage(
      slug as (typeof COUNTY_PAGE_SLUGS)[number],
    )

    const copy = getCountyLocationCopy(
      slug as (typeof COUNTY_PAGE_SLUGS)[number],
      county.countyName,
      h1,
    )

    const heroHeadingBefore =
      slug === 'garage-door-services-in-miami-dade-county'
        ? 'Garage door services in '
        : 'Garage door repair & installation in '
    const heroHeadingAccent = county.countyName
    const heroImageSrc = locationHeroImageSrc(slug)
    const sections = buildLocalizedSiteSections({
      kind: 'county',
      focusLabel: county.countyName,
      countyName: county.countyName,
      slug,
    })

    return {
      kind: 'county',
      slug,
      countyName: county.countyName,
      pageTitle: h1,
      metaDescription: copy.metaDescription.slice(0, 160),
      h1,
      lead: copy.lead,
      paragraphs: copy.paragraphs,
      bullets: copy.bullets,
      linkedCitySlugs,
      heroHeadingBefore,
      heroHeadingAccent,
      heroImageSrc,
      heroImageAlt: copy.heroImageAlt,
      sections,
    }
  }

  if (!(CITY_PAGE_SLUGS as readonly string[]).includes(slug)) {
    return null
  }

  const citySlug = slug as (typeof CITY_PAGE_SLUGS)[number]
  const cityName = cityDisplayName(citySlug)
  const countySlug = countyPageSlugForCitySlug(citySlug)
  const countyName = getCountyConfig(countySlug)!.countyName

  const h1 = `Garage door repair & installation in ${cityName}`

  const siblingCitySlugs = citySlugsForCountyPage(countySlug)
    .filter((s) => s !== slug)
    .sort((a, b) =>
      cityDisplayName(a).localeCompare(cityDisplayName(b), 'en', {
        sensitivity: 'base',
      }),
    )

  const copy = getCityLocationCopy(slug, cityName, countyName, h1)

  const heroHeadingBefore = 'Garage door repair & installation in '
  const heroHeadingAccent = cityName
  const heroImageSrc = locationHeroImageSrc(slug)
  const sections = buildLocalizedSiteSections({
    kind: 'city',
    focusLabel: cityName,
    countyName,
    slug,
  })

  return {
    kind: 'city',
    slug,
    pageTitle: copy.pageTitle,
    metaDescription: copy.metaDescription.slice(0, 160),
    h1,
    lead: copy.lead,
    paragraphs: copy.paragraphs,
    bullets: copy.bullets,
    countySlug,
    countyName,
    cityName,
    siblingCitySlugs,
    heroHeadingBefore,
    heroHeadingAccent,
    heroImageSrc,
    heroImageAlt: copy.heroImageAlt,
    sections,
  }
}
