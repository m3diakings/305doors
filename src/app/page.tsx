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
