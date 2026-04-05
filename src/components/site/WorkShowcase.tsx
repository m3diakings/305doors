'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import clsx from 'clsx'

import { Container } from '@/components/Container'
import type { LocalizedSiteSections } from '@/lib/locationPages'

const defaultSlides = [
  {
    src: '/images/305doors/services/installation-louver.jpg',
    title: 'Residential upgrade',
    caption: 'Full replacement with insulated panel door and new hardware.',
    imageAlt:
      'Residential garage door upgrade with insulated panel door and new hardware installed by 305 Doors in South Florida.',
  },
  {
    src: '/images/305doors/services/roll-up-doors.jpg',
    title: 'Commercial roll-up',
    caption: 'Steel roll-up and sectional installs for warehouses, retail bays, and loading docks.',
    imageAlt:
      'Commercial steel roll-up garage doors installed for South Florida warehouses and retail bays — 305 Doors Corp.',
  },
  {
    src: '/images/305doors/gallery/work-03.jpeg',
    title: 'Curb appeal',
    caption: 'Modern finish and clean lines to match the home exterior.',
    imageAlt:
      'Modern residential garage door improving curb appeal and matching home exterior, 305 Doors.',
  },
  {
    src: '/images/305doors/gallery/latest-work/latest-work-16.jpeg',
    title: 'Repair & tune-up',
    caption: 'Safety inspection, balance, and operator alignment.',
    imageAlt:
      'Garage door repair and tune-up — safety inspection, balance, and hardware service on a South Florida home by 305 Doors.',
  },
  {
    src: '/images/305doors/gallery/work-05.jpeg',
    title: 'Opener upgrade',
    caption: 'Quiet drive system with smart access options.',
    imageAlt:
      'Garage door opener upgrade with quiet drive and smart access options installed by 305 Doors.',
  },
  {
    src: '/images/305doors/gallery/work-06.jpeg',
    title: 'South Florida install',
    caption: 'Local crew, same attention to detail on every job.',
    imageAlt:
      'Garage door installation project completed by 305 Doors crew in South Florida.',
  },
] as const

type WorkSlide = {
  src: string
  title: string
  caption: string
  imageAlt: string
}

type WorkShowcaseProps = {
  locale?: LocalizedSiteSections
}

const DESKTOP_COLUMNS = 3
const LG_QUERY = '(min-width: 1024px)'

function ChevronLeft(props: React.ComponentPropsWithoutRef<'svg'>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <path
        d="M15 6l-6 6 6 6"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function ChevronRight(props: React.ComponentPropsWithoutRef<'svg'>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <path
        d="M9 6l6 6-6 6"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function ProjectCard({ project }: { project: WorkSlide }) {
  return (
    <figure className="relative flex h-full w-full flex-col overflow-hidden rounded-2xl bg-white ring-1 ring-slate-900/5">
      <div className="relative aspect-4/3 w-full shrink-0">
        <Image
          src={project.src}
          alt={project.imageAlt}
          fill
          className="object-cover"
          sizes="(min-width: 1024px) 33vw, 100vw"
        />
      </div>
      <figcaption className="relative flex flex-1 flex-col border-t border-slate-100 p-5 sm:p-6">
        <p className="font-display text-base text-slate-900 sm:text-lg">
          {project.title}
        </p>
        <p className="mt-2 text-sm text-slate-600">{project.caption}</p>
      </figcaption>
    </figure>
  )
}

function readScrollStep(scroller: HTMLDivElement): number {
  const first = scroller.children[0] as HTMLElement | undefined
  if (!first) return 0
  const { gap, columnGap } = getComputedStyle(scroller)
  const g = parseFloat(gap || columnGap || '0') || 24
  return first.offsetWidth + g
}

export function WorkShowcase({ locale }: WorkShowcaseProps) {
  const slides = locale?.workSlides ?? defaultSlides
  const workTitle = locale?.workTitle ?? 'Recent work across South Florida.'
  const workSubtitle =
    locale?.workSubtitle ??
    'A snapshot of installs and repairs we have completed for neighbors throughout Miami-Dade, Broward, and nearby counties.'

  const scrollerRef = useRef<HTMLDivElement>(null)
  const scrollSettleRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const [start, setStart] = useState(0)
  const [isLg, setIsLg] = useState(false)

  const count = slides.length
  const maxStartDesktop = Math.max(0, count - DESKTOP_COLUMNS)
  const maxStart = isLg ? maxStartDesktop : count - 1

  useEffect(() => {
    const mq = window.matchMedia(LG_QUERY)
    const update = () => setIsLg(mq.matches)
    update()
    mq.addEventListener('change', update)
    return () => mq.removeEventListener('change', update)
  }, [])

  useEffect(() => {
    setStart((s) => Math.min(s, maxStart))
  }, [maxStart, count])

  const scrollToIndex = useCallback(
    (rawIndex: number, behavior: ScrollBehavior = 'smooth') => {
      const scroller = scrollerRef.current
      if (!scroller) return

      let idx = rawIndex
      if (isLg) {
        idx = Math.max(0, Math.min(maxStartDesktop, idx))
      } else {
        idx = ((rawIndex % count) + count) % count
      }

      const step = readScrollStep(scroller)
      if (step <= 0) {
        setStart(idx)
        return
      }

      const maxScroll = scroller.scrollWidth - scroller.clientWidth
      const target = Math.min(idx * step, maxScroll)
      scroller.scrollTo({ left: target, behavior })
      setStart(idx)
    },
    [count, isLg, maxStartDesktop],
  )

  useEffect(() => {
    const scroller = scrollerRef.current
    if (!scroller) return
    const raf = requestAnimationFrame(() => {
      setStart((s) => {
        const ms = isLg ? maxStartDesktop : count - 1
        const idx = Math.min(s, ms)
        const step = readScrollStep(scroller)
        if (step > 0) {
          const maxScroll = scroller.scrollWidth - scroller.clientWidth
          scroller.scrollLeft = Math.min(idx * step, maxScroll)
        }
        return idx
      })
    })
    return () => cancelAnimationFrame(raf)
  }, [count, isLg, maxStartDesktop, slides])

  useEffect(() => {
    const el = scrollerRef.current
    if (!el) return

    const onScroll = () => {
      if (scrollSettleRef.current) clearTimeout(scrollSettleRef.current)
      scrollSettleRef.current = setTimeout(() => {
        const step = readScrollStep(el)
        if (step <= 0) return
        const raw = Math.round(el.scrollLeft / step)
        const clamped = Math.max(0, Math.min(maxStart, raw))
        setStart(clamped)
      }, 100)
    }

    el.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      el.removeEventListener('scroll', onScroll)
      if (scrollSettleRef.current) clearTimeout(scrollSettleRef.current)
    }
  }, [maxStart])

  const goPrev = () => scrollToIndex(start - 1)

  const goNext = () => scrollToIndex(start + 1)

  const dotCount = isLg ? maxStartDesktop + 1 : count
  const activeDot = start

  const canPrev = isLg ? start > 0 : true
  const canNext = isLg ? start < maxStartDesktop : true

  const visibleTitles = isLg
    ? slides.slice(start, start + DESKTOP_COLUMNS)
    : [slides[start]]

  const srSummary = isLg
    ? `Showing projects ${start + 1}–${start + visibleTitles.length} of ${count}`
    : `Slide ${start + 1} of ${count}: ${slides[start].title}`

  return (
    <section
      id="work"
      aria-label={
        locale ? `Recent garage door projects — ${locale.focusLabel}` : 'Recent garage door projects'
      }
      className="bg-slate-50 py-20 sm:py-32"
    >
      <Container>
        <div className="mx-auto max-w-2xl md:text-center lg:max-w-3xl">
          <h2 className="font-display text-3xl tracking-tight text-slate-900 sm:text-4xl">
            {workTitle}
          </h2>
          <p className="mt-4 text-lg tracking-tight text-slate-700">{workSubtitle}</p>
        </div>

        <div
          className="relative mx-auto mt-16 w-full max-w-none lg:mt-20 lg:max-w-7xl"
          aria-roledescription="carousel"
          aria-label="Project gallery"
          aria-live="polite"
        >
          <p className="sr-only">{srSummary}</p>

          <div className="relative px-0 lg:px-14">
            <div
              ref={scrollerRef}
              tabIndex={0}
              className="flex snap-x snap-mandatory gap-6 overflow-x-auto overflow-y-hidden scroll-smooth pb-2 [-webkit-overflow-scrolling:touch] [scrollbar-width:none] focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 [&::-webkit-scrollbar]:hidden"
              aria-label="Scroll horizontally to browse projects"
            >
              {slides.map((project, index) => (
                <div
                  key={`${project.src}-${project.title}-${index}`}
                  className="w-full shrink-0 snap-start lg:w-[calc((100%-3rem)/3)] lg:min-w-0"
                >
                  <ProjectCard project={project} />
                </div>
              ))}
            </div>

            <div className="pointer-events-none absolute inset-y-0 left-0 right-0 hidden items-center justify-between lg:flex">
              <button
                type="button"
                onClick={goPrev}
                disabled={!canPrev}
                className={clsx(
                  'pointer-events-auto flex h-11 w-11 items-center justify-center rounded-full border border-slate-200/90 bg-white/95 text-slate-700 shadow-md backdrop-blur-sm transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600',
                  canPrev
                    ? 'hover:border-slate-300 hover:bg-white hover:text-slate-900'
                    : 'cursor-not-allowed opacity-40',
                )}
                aria-label="Previous"
              >
                <ChevronLeft className="h-5 w-5 -translate-x-px" />
              </button>
              <button
                type="button"
                onClick={goNext}
                disabled={!canNext}
                className={clsx(
                  'pointer-events-auto flex h-11 w-11 items-center justify-center rounded-full border border-slate-200/90 bg-white/95 text-slate-700 shadow-md backdrop-blur-sm transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600',
                  canNext
                    ? 'hover:border-slate-300 hover:bg-white hover:text-slate-900'
                    : 'cursor-not-allowed opacity-40',
                )}
                aria-label="Next"
              >
                <ChevronRight className="h-5 w-5 translate-x-px" />
              </button>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
            {Array.from({ length: dotCount }, (_, i) => (
              <button
                key={i}
                type="button"
                aria-label={
                  isLg
                    ? `Show projects starting at ${i + 1} of ${count}`
                    : `Go to project ${i + 1} of ${count}`
                }
                aria-current={i === activeDot ? 'true' : undefined}
                onClick={() => scrollToIndex(i)}
                className={clsx(
                  'h-2 rounded-full transition-all duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600',
                  i === activeDot
                    ? 'w-8 bg-blue-600'
                    : 'w-2 bg-slate-300 hover:bg-slate-400',
                )}
              />
            ))}
          </div>
        </div>
      </Container>
    </section>
  )
}
