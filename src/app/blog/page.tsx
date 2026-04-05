import { type Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'

import { Container } from '@/components/Container'
import { formatBlogDate, getAllBlogPostsForArchive } from '@/lib/blog'
import { BUSINESS_NAME } from '@/lib/site'

export const metadata: Metadata = {
  title: 'Blog',
  description: `Garage door tips, safety, and local guides from ${BUSINESS_NAME} — Miami-Dade, Broward, Palm Beach, and nearby counties.`,
  alternates: { canonical: '/blog/' },
  openGraph: {
    title: `Blog | ${BUSINESS_NAME}`,
    description: `Garage door tips and guides from ${BUSINESS_NAME}.`,
    url: '/blog/',
  },
}

export default function BlogArchivePage() {
  const posts = getAllBlogPostsForArchive()

  return (
    <Container className="!max-w-screen-2xl py-16 lg:py-24">
      <header className="mx-auto max-w-3xl text-center">
        <p className="font-display text-base font-semibold text-blue-600">{BUSINESS_NAME}</p>
        <h1 className="mt-2 font-display text-4xl font-medium tracking-tight text-slate-900 sm:text-5xl">
          Garage door tips &amp; local guides
        </h1>
        <p className="mt-4 text-lg text-slate-600">
          Practical advice for South Florida homeowners and businesses — from hurricane prep to everyday
          maintenance.
        </p>
      </header>

      {posts.length === 0 ? (
        <p className="mx-auto mt-16 max-w-2xl text-center text-slate-600">
          New articles are on the way. In the meantime,{' '}
          <Link href="/#contact" className="font-semibold text-blue-600 hover:underline">
            request a free quote
          </Link>{' '}
          or explore our{' '}
          <Link href="/services/garage-door-repair/" className="font-semibold text-blue-600 hover:underline">
            repair
          </Link>{' '}
          and{' '}
          <Link href="/services/garage-door-installation/" className="font-semibold text-blue-600 hover:underline">
            installation
          </Link>{' '}
          services.
        </p>
      ) : (
        <ul className="mx-auto mt-16 max-w-5xl space-y-14">
          {posts.map((post) => (
            <li
              key={post.slug}
              className="border-b border-slate-200 pb-14 last:border-b-0 last:pb-0"
            >
              <article className="flex flex-col gap-6 sm:flex-row sm:gap-8">
                {post.image ? (
                  <Link
                    href={`/blog/${post.slug}/`}
                    className="relative aspect-16/10 w-full shrink-0 overflow-hidden rounded-xl bg-slate-100 ring-1 ring-slate-900/5 sm:aspect-4/3 sm:w-56 md:w-72"
                  >
                    <Image
                      src={post.image}
                      alt={post.imageAlt ?? post.title}
                      fill
                      className="object-cover transition hover:opacity-95"
                      sizes="(max-width: 640px) 100vw, 288px"
                    />
                  </Link>
                ) : null}
                <div className="min-w-0 flex-1">
                  <time dateTime={post.date} className="text-sm text-slate-500">
                    {formatBlogDate(post.date)}
                  </time>
                  <h2 className="mt-2 font-display text-2xl font-medium tracking-tight text-slate-900 sm:text-3xl">
                    <Link
                      href={`/blog/${post.slug}/`}
                      className="hover:text-blue-600"
                    >
                      {post.title}
                    </Link>
                  </h2>
                  <p className="mt-3 text-slate-600">{post.description}</p>
                  <Link
                    href={`/blog/${post.slug}/`}
                    className="mt-4 inline-block text-sm font-semibold text-blue-600 hover:underline"
                  >
                    Read article
                  </Link>
                </div>
              </article>
            </li>
          ))}
        </ul>
      )}
    </Container>
  )
}
