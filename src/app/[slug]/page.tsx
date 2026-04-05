import { type Metadata } from 'next'
import { notFound } from 'next/navigation'

import { LocationLanding } from '@/components/site/LocationLanding'
import { ALL_LOCATION_SLUGS, getLocationViewModel } from '@/lib/locationPages'

export const dynamicParams = false

export function generateStaticParams() {
  return ALL_LOCATION_SLUGS.map((slug) => ({ slug }))
}

type Props = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const model = getLocationViewModel(slug)
  if (!model) {
    return {}
  }

  return {
    title: model.pageTitle,
    description: model.metaDescription,
    alternates: { canonical: `/${slug}/` },
    openGraph: {
      title: model.pageTitle,
      description: model.metaDescription,
      url: `/${slug}/`,
    },
  }
}

export default async function LocationPage({ params }: Props) {
  const { slug } = await params
  const model = getLocationViewModel(slug)
  if (!model) {
    notFound()
  }

  return <LocationLanding model={model} />
}
