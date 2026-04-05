'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import clsx from 'clsx'

import { Container } from '@/components/Container'
import {
  CITY_PAGE_SLUGS,
  COUNTY_PAGE_SLUGS,
  COUNTY_PAGES,
  cityDisplayName,
  citySlugsForCountyPage,
  countyHasServiceAreaList,
} from '@/lib/locationPages'

const DEFAULT_COUNTY_SLUG: (typeof COUNTY_PAGE_SLUGS)[number] =
  'garage-door-services-in-miami-dade-county'

function countyPath(slug: string): string {
  return `/${slug}/`
}

export function GarageServiceAreasSection() {
  const countiesInSection = useMemo(
    () => COUNTY_PAGES.filter((c) => countyHasServiceAreaList(c.slug)),
    [],
  )

  const [selectedSlug, setSelectedSlug] =
    useState<(typeof COUNTY_PAGE_SLUGS)[number]>(DEFAULT_COUNTY_SLUG)

  const selectedCounty =
    countiesInSection.find((c) => c.slug === selectedSlug) ??
    countiesInSection[0]

  const panelLinks = useMemo(() => {
    if (!selectedCounty) return []
    const slugs = [...citySlugsForCountyPage(selectedCounty.slug)].sort(
      (a, b) =>
        cityDisplayName(a).localeCompare(cityDisplayName(b), 'en', {
          sensitivity: 'base',
        }),
    )
    return slugs.map((slug) => ({
      key: slug,
      href: countyPath(slug),
      label: cityDisplayName(slug),
    }))
  }, [selectedCounty])

  if (countiesInSection.length === 0) {
    return null
  }

  return (
    <section
      id="service-areas"
      aria-labelledby="service-areas-heading"
      className="border-t border-slate-200 bg-white py-20 sm:py-28"
    >
      <Container>
        <div className="mx-auto max-w-2xl text-center lg:mx-auto lg:max-w-none">
          <h2
            id="service-areas-heading"
            className="font-display text-3xl tracking-tight text-slate-900 sm:text-4xl"
          >
            Garage door service areas
          </h2>
          <p className="mt-4 text-lg tracking-tight text-slate-600">
            Pick a county to browse local garage door repair and installation
            pages, or follow the link to the full county hub at the bottom.
          </p>
        </div>

        <div
          className="mx-auto mt-10 flex max-w-3xl flex-wrap justify-center gap-3 sm:gap-4"
          role="tablist"
          aria-label="County"
        >
          {countiesInSection.map((county) => {
            const selected = county.slug === selectedSlug
            return (
              <button
                key={county.slug}
                type="button"
                role="tab"
                aria-selected={selected}
                id={`service-area-tab-${county.slug}`}
                aria-controls={`service-area-panel-${county.slug}`}
                onClick={() => setSelectedSlug(county.slug)}
                className={clsx(
                  'inline-flex rounded-full border px-5 py-2.5 text-sm font-semibold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2',
                  selected
                    ? 'border-blue-600 bg-blue-600 text-white shadow-sm'
                    : 'border-slate-200 bg-slate-50 text-slate-800 hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700',
                )}
              >
                {county.label}
              </button>
            )
          })}
        </div>

        {selectedCounty ? (
          <div
            id={`service-area-panel-${selectedCounty.slug}`}
            role="tabpanel"
            aria-labelledby={`service-area-tab-${selectedCounty.slug}`}
            className="mx-auto mt-2 max-w-3xl rounded-xl  py-5 sm:px-6"
          >
            {/* <p className="text-center text-sm font-medium text-slate-700">
              Cities we serve in {selectedCounty.label}
            </p> */}
            <p className="mt-4 text-center text-base leading-relaxed text-slate-600">
              {panelLinks.map((item, index) => (
                <span key={item.key}>
                  {index > 0 ? (
                    <span className="text-slate-300" aria-hidden="true">
                      {' · '}
                    </span>
                  ) : null}
                  <Link
                    href={item.href}
                    className="font-medium text-blue-600 hover:underline"
                  >
                    {item.label}
                  </Link>
                </span>
              ))}
            </p>
            <p className="mt-5 text-center text-sm text-slate-500">
              <Link
                href={countyPath(selectedCounty.slug)}
                className="font-semibold text-blue-600 hover:underline"
              >
                View full {selectedCounty.label} garage door hub
              </Link>
            </p>
          </div>
        ) : null}
      </Container>
    </section>
  )
}
