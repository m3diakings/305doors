import { Footer } from '@/components/Footer'
import { Header } from '@/components/Header'
import { StickyCallBar } from '@/components/site/StickyCallBar'

export function BlogShell({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <main id="content" className="flex-1 pb-24 sm:pb-0">
        {children}
      </main>
      <Footer />
      <StickyCallBar />
    </>
  )
}
