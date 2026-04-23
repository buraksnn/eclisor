import { sql, SiteSettings } from '@/lib/db'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { Hero } from '@/components/landing/hero'
import { Services } from '@/components/landing/services'
import { HowItWorks } from '@/components/landing/how-it-works'
import { Stats } from '@/components/landing/stats'
import { Testimonials } from '@/components/landing/testimonials'

async function getSiteSettings(): Promise<SiteSettings | null> {
  try {
    const settings = await sql`SELECT * FROM site_settings LIMIT 1`
    return settings[0] as SiteSettings || null
  } catch {
    return null
  }
}

export default async function HomePage() {
  const settings = await getSiteSettings()

  return (
    <main className="relative">
      <Navbar />
      <Hero />
      <Services />
      <HowItWorks />
      <Stats
        artistCount={settings?.artist_count || 500}
        countryCount={settings?.country_count || 50}
        streamCount={settings?.stream_count || '10M+'}
      />
      <Testimonials />
      <Footer />
    </main>
  )
}
