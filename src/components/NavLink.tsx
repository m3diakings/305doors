import Link from 'next/link'

const linkClassName =
  'inline-block rounded-lg px-2 py-1 text-sm text-slate-700 hover:bg-slate-100 hover:text-slate-900'

export function NavLink({
  href,
  children,
}: {
  href: string
  children: React.ReactNode
}) {
  if (href.startsWith('#')) {
    return (
      <a href={href} className={linkClassName}>
        {children}
      </a>
    )
  }

  return (
    <Link href={href} className={linkClassName}>
      {children}
    </Link>
  )
}
