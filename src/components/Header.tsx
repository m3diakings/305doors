'use client'

import Link from 'next/link'
import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
  Popover,
  PopoverBackdrop,
  PopoverButton,
  PopoverPanel,
  useClose,
} from '@headlessui/react'
import clsx from 'clsx'

import { Button } from '@/components/Button'
import { Container } from '@/components/Container'
import { Logo } from '@/components/Logo'
import { NavLink } from '@/components/NavLink'
import { SERVICE_NAV_LINKS } from '@/lib/servicePages'
import { PHONE_DISPLAY, PHONE_TEL } from '@/lib/site'

const secondaryNav = [
  { href: '#work', label: 'Work' },
  { href: '#faq', label: 'FAQ' },
  { href: '#contact', label: 'Contact' },
] as const

function ChevronDownIcon({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 20 20"
      fill="currentColor"
      className={className}
    >
      <path
        fillRule="evenodd"
        d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.94a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
        clipRule="evenodd"
      />
    </svg>
  )
}

function ServicesMenuDesktop() {
  return (
    <Menu as="div" className="relative">
      <MenuButton className="inline-flex items-center gap-0.5 rounded-lg px-2 py-1 text-sm text-slate-700 hover:bg-slate-100 hover:text-slate-900 focus:outline-hidden data-active:bg-slate-100 data-hover:bg-slate-100 data-hover:text-slate-900">
        Services
        <ChevronDownIcon className="h-4 w-4 text-slate-500" />
      </MenuButton>
      <MenuItems
        transition
        anchor="bottom start"
        className="z-50 mt-2 min-w-56 origin-top-left rounded-xl bg-white py-1 shadow-lg ring-1 ring-slate-900/5 transition duration-100 ease-out [--anchor-gap:8px] focus:outline-hidden data-closed:scale-95 data-closed:opacity-0"
      >
        {SERVICE_NAV_LINKS.map((item) => (
          <MenuItem key={item.href}>
            {({ focus }) => (
              <Link
                href={item.href}
                className={clsx(
                  'block rounded-lg px-3 py-2 text-sm text-slate-700',
                  focus && 'bg-slate-100 text-slate-900',
                )}
              >
                {item.label}
              </Link>
            )}
          </MenuItem>
        ))}
      </MenuItems>
    </Menu>
  )
}

function MobileNavIcon({ open }: { open: boolean }) {
  return (
    <svg
      aria-hidden="true"
      className="h-3.5 w-3.5 overflow-visible stroke-slate-700"
      fill="none"
      strokeWidth={2}
      strokeLinecap="round"
    >
      <path
        d="M0 1H14M0 7H14M0 13H14"
        className={clsx(
          'origin-center transition',
          open && 'scale-90 opacity-0',
        )}
      />
      <path
        d="M2 2L12 12M12 2L2 12"
        className={clsx(
          'origin-center transition',
          !open && 'scale-90 opacity-0',
        )}
      />
    </svg>
  )
}

function MobileCloseLink({
  href,
  className,
  children,
}: {
  href: string
  className?: string
  children: React.ReactNode
}) {
  const close = useClose()
  return (
    <Link href={href} className={className} onClick={() => close()}>
      {children}
    </Link>
  )
}

function MobileNavigation() {
  return (
    <Popover>
      <PopoverButton
        className="relative z-10 flex h-8 w-8 items-center justify-center focus:not-data-focus:outline-hidden"
        aria-label="Toggle navigation"
      >
        {({ open }) => <MobileNavIcon open={open} />}
      </PopoverButton>
      <PopoverBackdrop
        transition
        className="fixed inset-0 bg-slate-300/50 duration-150 data-closed:opacity-0 data-enter:ease-out data-leave:ease-in"
      />
      <PopoverPanel
        transition
        className="absolute inset-x-0 top-full mt-4 flex max-h-[min(80vh,32rem)] origin-top flex-col gap-1 overflow-y-auto rounded-2xl bg-white p-4 text-lg tracking-tight text-slate-900 shadow-xl ring-1 ring-slate-900/5 data-closed:scale-95 data-closed:opacity-0 data-enter:duration-150 data-enter:ease-out data-leave:duration-100 data-leave:ease-in"
      >
        <Disclosure as="div" className="flex flex-col gap-1">
          {({ open }) => (
            <>
              <DisclosureButton className="flex w-full items-center justify-between rounded-lg px-2 py-2 text-left font-medium text-slate-900 hover:bg-slate-50 focus:outline-hidden">
                Services
                <ChevronDownIcon
                  className={clsx('h-5 w-5 text-slate-500 transition', open && 'rotate-180')}
                />
              </DisclosureButton>
              <DisclosurePanel className="flex flex-col gap-1 py-1 pl-2">
                {SERVICE_NAV_LINKS.map((item) => (
                  <MobileCloseLink
                    key={item.href}
                    href={item.href}
                    className="block rounded-lg py-2 text-base text-slate-600 hover:text-slate-900"
                  >
                    {item.label}
                  </MobileCloseLink>
                ))}
              </DisclosurePanel>
            </>
          )}
        </Disclosure>
        {secondaryNav.map((item) => (
          <MobileCloseLink
            key={item.href}
            href={item.href}
            className="block w-full rounded-lg px-2 py-2 text-slate-900 hover:bg-slate-50"
          >
            {item.label}
          </MobileCloseLink>
        ))}
      </PopoverPanel>
    </Popover>
  )
}

export function Header() {
  return (
    <header className="py-10">
      <Container>
        <nav className="relative z-50 flex justify-between">
          <div className="flex items-center md:gap-x-12">
            <Link href="/" aria-label="305 Doors home">
              <Logo className="h-10 w-auto" priority />
            </Link>
            <div className="hidden md:flex md:items-center md:gap-x-6">
              <ServicesMenuDesktop />
              {secondaryNav.map((item) => (
                <NavLink key={item.href} href={item.href}>
                  {item.label}
                </NavLink>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-x-5 md:gap-x-8">
            <div className="md:hidden">
              <Button href={`tel:${PHONE_TEL}`} color="blue">
                Call now
              </Button>
            </div>
            <div className="hidden items-center gap-x-7 md:flex lg:gap-x-8">
              <a
                href={`tel:${PHONE_TEL}`}
                className="shrink-0 text-sm font-semibold whitespace-nowrap text-slate-700 transition hover:text-blue-600"
              >
                {PHONE_DISPLAY}
              </a>
              <Button href="#contact" color="blue">
                <span>
                  Free quote <span className="hidden lg:inline">today</span>
                </span>
              </Button>
            </div>
            <div className="-mr-1 md:hidden">
              <MobileNavigation />
            </div>
          </div>
        </nav>
      </Container>
    </header>
  )
}
