import { type Metadata } from 'next'
import { notFound } from 'next/navigation'

import { ServiceLanding } from '@/components/site/ServiceLanding'
import { allServiceSlugs, getServicePage } from '@/lib/servicePages'

export const dynamicParams = false

export function generateStaticParams() {
  return allServiceSlugs().map((slug) => ({ slug }))
}

type Props = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const content = getServicePage(slug)
  if (!content) {
    return {}
  }

  const path = `/services/${slug}/`

  return {
    title: { absolute: content.pageTitle },
    description: content.metaDescription,
    keywords: [...content.keywords],
    alternates: { canonical: path },
    openGraph: {
      title: content.pageTitle,
      description: content.metaDescription,
      url: path,
    },
  }
}

export default async function ServicePage({ params }: Props) {
  const { slug } = await params
  const content = getServicePage(slug)
  if (!content) {
    notFound()
  }

  return <ServiceLanding content={content} />
}
