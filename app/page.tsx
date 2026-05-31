import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { Hero } from '@/components/landing/hero'
import { Services } from '@/components/landing/services'
import { HowItWorks } from '@/components/landing/how-it-works'
import { Stats } from '@/components/landing/stats'
import { Testimonials } from '@/components/landing/testimonials'
import { siteStats } from '@/lib/site-content'

export default function HomePage() {
  return (
    <main className="relative">
      <Navbar />
      <Hero />
      <Services />
      <HowItWorks />
      <Stats
        artistCount={siteStats.artistCount}
        countryCount={siteStats.countryCount}
        streamCount={siteStats.streamLabel}
      />
      <Testimonials />
      <Footer />
    </main>
  )
}
