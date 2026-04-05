'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from '@headlessui/react'
import clsx from 'clsx'

import { Container } from '@/components/Container'
import type { LocalizedSiteSections } from '@/lib/locationPages'
import backgroundImage from '@/images/background-features.jpg'

const defaultFeatures = [
  {
    title: 'Installation & replacement',
    description:
      'Upgrade with durable, stylish doors — including hurricane-rated models built for Florida weather and code.',
    image: '/images/305doors/gallery/latest-work/latest-work-01.jpeg',
    imageAlt:
      'Garage door installation and replacement including hurricane-rated models for Florida, 305 Doors Corp.',
  },
  {
    title: 'Repair & 24-hour response',
    description:
      'Broken spring, off-track door, or opener failure? We prioritize safety and fast turnaround across South Florida.',
    image: '/images/305doors/gallery/latest-work/latest-work-08.jpeg',
    imageAlt:
      'Emergency garage door repair and 24-hour response for springs, tracks, and openers in South Florida.',
  },
  {
    title: 'Roll-up doors & gates',
    description:
      'Commercial roll-ups, gates, and industrial solutions that keep your property secure and operations moving.',
    image: '/images/305doors/gallery/work-04.jpg',
    imageAlt:
      'Commercial roll-up garage doors and industrial door solutions installed by 305 Doors.',
  },
  {
    title: 'Openers & smart accessories',
    description:
      'Install and service leading opener brands, remotes, keypads, and smart features for convenience and security.',
    image: '/images/305doors/services/openers-accessories.jpg',
    imageAlt:
      'Garage door openers, remotes, keypads, and smart accessories installed and serviced by 305 Doors.',
  },
] as const

type PrimaryServicesProps = {
  locale?: LocalizedSiteSections
}

export function PrimaryServices({ locale }: PrimaryServicesProps) {
  const features = locale?.primaryTabs ?? defaultFeatures
  const heading = locale?.primaryHeading ?? 'Everything your property needs.'
  const subheading =
    locale?.primarySubheading ??
    'One team for install, repair, commercial roll-ups, and openers — with honest recommendations and workmanship you can trust.'

  const [tabOrientation, setTabOrientation] = useState<'horizontal' | 'vertical'>(
    'horizontal',
  )

  useEffect(() => {
    const lgMediaQuery = window.matchMedia('(min-width: 1024px)')

    function onMediaQueryChange({ matches }: { matches: boolean }) {
      setTabOrientation(matches ? 'vertical' : 'horizontal')
    }

    onMediaQueryChange(lgMediaQuery)
    lgMediaQuery.addEventListener('change', onMediaQueryChange)

    return () => {
      lgMediaQuery.removeEventListener('change', onMediaQueryChange)
    }
  }, [])

  return (
    <section
      id="services"
      aria-label={
        locale ? `Garage door services — ${locale.focusLabel}` : 'Garage door services'
      }
      className="relative overflow-hidden bg-blue-600 pt-20 pb-28 sm:py-32"
    >
      <Image
        className="absolute top-1/2 left-1/2 max-w-none translate-x-[-44%] translate-y-[-42%]"
        src={backgroundImage}
        alt=""
        width={2245}
        height={1636}
        unoptimized
        aria-hidden
      />
      <Container className="relative">
        <div className="max-w-2xl md:mx-auto md:text-center xl:max-w-none">
          <h2 className="font-display text-3xl tracking-tight text-white sm:text-4xl md:text-5xl">
            {heading}
          </h2>
          <p className="mt-6 text-lg tracking-tight text-blue-100">{subheading}</p>
        </div>
        <TabGroup
          className="mt-16 grid grid-cols-1 items-center gap-y-2 pt-10 sm:gap-y-6 md:mt-20 lg:grid-cols-12 lg:pt-0"
          vertical={tabOrientation === 'vertical'}
        >
          {({ selectedIndex }) => (
            <>
              <div className="-mx-4 flex overflow-x-auto pb-4 [scrollbar-width:none] [-ms-overflow-style:none] sm:mx-0 sm:overflow-visible sm:pb-0 lg:col-span-5 [&::-webkit-scrollbar]:hidden">
                <TabList className="relative z-10 flex gap-x-4 px-4 whitespace-nowrap sm:mx-auto sm:px-0 lg:mx-0 lg:block lg:gap-x-0 lg:gap-y-1 lg:whitespace-normal">
                  {features.map((feature, featureIndex) => (
                    <div
                      key={feature.title}
                      className={clsx(
                        'group relative rounded-full px-4 py-1 lg:rounded-l-xl lg:rounded-r-none lg:p-6',
                        selectedIndex === featureIndex
                          ? 'bg-white lg:bg-white/10 lg:ring-1 lg:ring-white/10 lg:ring-inset'
                          : 'hover:bg-white/10 lg:hover:bg-white/5',
                      )}
                    >
                      <h3>
                        <Tab
                          className={clsx(
                            'font-display text-lg data-selected:not-data-focus:outline-hidden',
                            selectedIndex === featureIndex
                              ? 'text-blue-600 lg:text-white'
                              : 'text-blue-100 hover:text-white lg:text-white',
                          )}
                        >
                          <span className="absolute inset-0 rounded-full lg:rounded-l-xl lg:rounded-r-none" />
                          {feature.title}
                        </Tab>
                      </h3>
                      <p
                        className={clsx(
                          'mt-2 hidden text-sm lg:block',
                          selectedIndex === featureIndex
                            ? 'text-white'
                            : 'text-blue-100 group-hover:text-white',
                        )}
                      >
                        {feature.description}
                      </p>
                    </div>
                  ))}
                </TabList>
              </div>
              <TabPanels className="lg:col-span-7">
                {features.map((feature) => (
                  <TabPanel key={feature.title} unmount={false}>
                    <div className="relative sm:px-6 lg:hidden">
                      <div className="absolute -inset-x-4 -top-26 -bottom-17 bg-white/10 ring-1 ring-white/10 ring-inset sm:inset-x-0 sm:rounded-t-xl" />
                      <p className="relative mx-auto max-w-2xl text-base text-white sm:text-center">
                        {feature.description}
                      </p>
                    </div>
                    <div className="relative mt-10 w-full overflow-hidden rounded-xl bg-slate-50 lg:hidden">
                      <Image
                        src={feature.image}
                        alt={feature.imageAlt}
                        width={1200}
                        height={800}
                        className="h-auto w-full"
                        priority
                        sizes="100vw"
                      />
                    </div>
                    <div className="relative mt-10 hidden aspect-3/2 w-180 overflow-hidden rounded-xl bg-slate-50 sm:w-auto lg:mt-0 lg:block lg:w-271.25">
                      <Image
                        src={feature.image}
                        alt={feature.imageAlt}
                        fill
                        className="object-cover"
                        priority
                        sizes="(min-width: 1024px) 67.8125rem, (min-width: 640px) 100vw, 45rem"
                      />
                    </div>
                  </TabPanel>
                ))}
              </TabPanels>
            </>
          )}
        </TabGroup>
      </Container>
    </section>
  )
}
