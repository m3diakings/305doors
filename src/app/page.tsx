import { Footer } from '@/components/Footer'
import { Header } from '@/components/Header'
import { CallToActionBand } from '@/components/site/CallToActionBand'
import { GarageFaqs } from '@/components/site/GarageFaqs'
import { HeroSection } from '@/components/site/HeroSection'
import { PrimaryServices } from '@/components/site/PrimaryServices'
import { PromoSection } from '@/components/site/PromoSection'
import { SecondaryServices } from '@/components/site/SecondaryServices'
import { StickyCallBar } from '@/components/site/StickyCallBar'
import { WorkShowcase } from '@/components/site/WorkShowcase'

export default function Home() {
  return (
    <>
      <a
        href="#content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-blue-600 focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-white focus:outline-none"
      >
        Skip to main content
      </a>
      <Header />
      <main id="content" className="flex-1 pb-24 sm:pb-0">
        <HeroSection />
        <PrimaryServices />
        <SecondaryServices />
        <PromoSection />
        <CallToActionBand />
        <WorkShowcase />
        <GarageFaqs />
      </main>
      <Footer />
      <StickyCallBar />
    </>
  )
}
