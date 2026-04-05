import { type Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { Button } from '@/components/Button'
import { BlogMarkdown } from '@/components/site/BlogMarkdown'
import { Container } from '@/components/Container'
import { allBlogSlugs, formatBlogDate, getBlogPost } from '@/lib/blog'
import { BUSINESS_NAME, PHONE_TEL, SITE_ORIGIN } from '@/lib/site'

export const dynamicParams = false

export function generateStaticParams() {
  return allBlogSlugs().map((slug) => ({ slug }))
}

type Props = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const post = getBlogPost(slug)
  if (!post) {
    return {}
  }

  const path = `/blog/${slug}/`
  const ogImages = post.image
    ? [
        {
          url: post.image,
          alt: post.imageAlt ?? post.title,
        },
      ]
    : undefined

  return {
    title: post.title,
    description: post.description,
    alternates: { canonical: path },
    openGraph: {
      title: post.title,
      description: post.description,
      url: path,
      type: 'article',
      publishedTime: post.date,
      ...(ogImages ? { images: ogImages } : {}),
    },
  }
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params
  const post = getBlogPost(slug)
  if (!post) {
    notFound()
  }

  const url = `${SITE_ORIGIN}/blog/${slug}/`
  const jsonLd: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    author: {
      '@type': 'Organization',
      name: BUSINESS_NAME,
    },
    publisher: {
      '@type': 'Organization',
      name: BUSINESS_NAME,
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': url,
    },
  }

  if (post.image) {
    jsonLd.image = `${SITE_ORIGIN}${post.image}`
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Container className="!max-w-screen-2xl py-12 lg:py-16">
        <nav
          className="text-center text-sm text-slate-500"
          aria-label="Breadcrumb"
        >
          <ol className="flex flex-wrap items-center justify-center gap-x-2 gap-y-1">
            <li>
              <Link href="/" className="font-medium text-blue-600 hover:underline">
                Home
              </Link>
            </li>
            <li aria-hidden="true" className="text-slate-300">
              /
            </li>
            <li>
              <Link href="/blog/" className="font-medium text-blue-600 hover:underline">
                Blog
              </Link>
            </li>
            <li aria-hidden="true" className="text-slate-300">
              /
            </li>
            <li className="max-w-[min(100%,48rem)] text-pretty text-slate-700">{post.title}</li>
          </ol>
        </nav>

        <article className="mx-auto mt-10 max-w-5xl">
          <header className="border-b border-slate-200 pb-10">
            <time dateTime={post.date} className="text-sm text-slate-500">
              {formatBlogDate(post.date)}
            </time>
            <h1 className="mt-2 font-display text-4xl font-medium tracking-tight text-slate-900 sm:text-5xl">
              {post.title}
            </h1>
            <p className="mt-4 max-w-3xl text-lg text-slate-600">{post.description}</p>

            {post.image ? (
              <div className="relative mt-10 aspect-16/10 w-full overflow-hidden rounded-2xl bg-slate-100 ring-1 ring-slate-900/5">
                <Image
                  src={post.image}
                  alt={post.imageAlt ?? post.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 768px"
                  priority
                />
              </div>
            ) : null}
          </header>

          <div className="py-10">
            <BlogMarkdown markdown={post.content} />
          </div>

          <footer className="rounded-2xl bg-slate-50 p-8 text-center">
            <p className="font-display text-lg font-medium text-slate-900">
              Need a garage door pro in South Florida?
            </p>
            <p className="mt-2 text-slate-600">
              Get a free quote or call us for emergency service.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-4">
              <Button href="/#contact" color="blue">
                Free quote
              </Button>
              <Button href={`tel:${PHONE_TEL}`} variant="outline" color="slate">
                Call now
              </Button>
            </div>
          </footer>
        </article>
      </Container>
    </>
  )
}
