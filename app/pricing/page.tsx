import Link from 'next/link'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

const plans = [
  {
    name: 'Başlangıç',
    priceMonthly: '$9',
    priceYearly: '$90',
    description: 'İlk yayınlarını çıkaran yeni sanatçılar için.',
    royaltySplit: 80,
    features: ['Sınırsız yükleme', 'Temel royalty paylaşımı', 'Küresel dağıtım', 'Sanatçı analitiği'],
  },
  {
    name: 'Pro',
    priceMonthly: '$19',
    priceYearly: '$190',
    description: 'Büyüyen kataloglar ve ciddi tanıtım için.',
    royaltySplit: 85,
    features: ['Başlangıç planındaki her şey', 'YouTube Content ID', 'Öncelikli destek', 'Playlist pitching'],
    highlighted: true,
  },
  {
    name: 'Label',
    priceMonthly: '$49',
    priceYearly: '$490',
    description: 'Birden fazla sanatçı yöneten label ekipleri için.',
    royaltySplit: 90,
    features: ['Çoklu sanatçı panelleri', 'Gelişmiş raporlama', 'Özel sözleşmeler', 'Özel temsilci'],
  },
]

const comparison = [
  { feature: 'Mağazalar & DSP\'ler', starter: '200+', pro: '250+', label: '300+' },
  { feature: 'Royalty Paylaşımı', starter: 'Sanatçıya %80', pro: 'Sanatçıya %85', label: 'Sanatçıya %90' },
  { feature: 'YouTube Content ID', starter: '—', pro: 'Dahil', label: 'Dahil' },
  { feature: 'Öncelikli Destek', starter: '—', pro: 'Var', label: 'Özel' },
  { feature: 'Label Paketi', starter: '—', pro: '—', label: 'Var' },
]

function BillingDetails() {
  return (
    <div className="mt-14 grid gap-6 md:grid-cols-2">
      <div className="border border-border/80 rounded-xl p-6 bg-card">
        <h2 className="text-lg font-semibold">Faturalama takvimi</h2>
        <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
          <li>Aylık veya yıllık faturalama. Planlar her dönemde aynı takvim gününde yenilenir.</li>
          <li>Faturalar otomatik oluşturulur ve e-posta adresinize gönderilir.</li>
          <li>Panelinizden aylık ve yıllık ödeme arasında geçiş yapabilirsiniz.</li>
        </ul>
      </div>
      <div className="border border-border/80 rounded-xl p-6 bg-card">
        <h2 className="text-lg font-semibold">Komisyon ve ödemeler</h2>
        <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
          <li>Royalty payı sanatçıya ödenir: %80 (Başlangıç), %85 (Pro), %90 (Label).</li>
          <li>Eclisor kalan komisyonu dağıtım, raporlama ve destek hizmetleri için alır.</li>
          <li>Ödemeler DSP raporları kesinleştikten sonra aylık olarak yapılır.</li>
        </ul>
      </div>
    </div>
  )
}

export default function PricingPage() {
  return (
    <main className="bg-background text-foreground">
      <Navbar />
      <section className="pt-28 pb-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="max-w-3xl">
            <Badge variant="outline" className="uppercase tracking-[0.2em] text-[0.6rem]">
              Fiyatlandırma
            </Badge>
            <h1 className="mt-6 text-4xl md:text-6xl font-semibold">
              Her yayın için şeffaf planlar.
            </h1>
            <p className="mt-4 text-lg text-muted-foreground">
              Aylık ve yıllık ödeme arasında geçiş yaparak kataloğunuz için en iyi değeri yakalayın.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg">
                <Link href="/register">Dağıtıma başla</Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href="/contact">Bizimle konuş</Link>
              </Button>
            </div>
          </div>

          <div className="mt-12 grid gap-6 lg:grid-cols-3">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`border border-border/80 rounded-xl p-8 flex flex-col gap-6 ${
                  plan.highlighted ? 'bg-foreground text-background' : 'bg-card'
                }`}
              >
                <div>
                  {plan.highlighted ? (
                    <Badge className="bg-background text-foreground">En Popüler</Badge>
                  ) : (
                    <Badge variant="outline">Temel Plan</Badge>
                  )}
                  <h3 className="mt-4 text-2xl font-semibold">{plan.name}</h3>
                  <p className={`mt-2 text-sm ${plan.highlighted ? 'text-background/80' : 'text-muted-foreground'}`}>
                    {plan.description}
                  </p>
                </div>
                <div>
                  <div className="flex items-end gap-3">
                    <span className="text-4xl font-semibold">{plan.priceMonthly}</span>
                    <span className={`text-sm ${plan.highlighted ? 'text-background/80' : 'text-muted-foreground'}`}>
                      /ay
                    </span>
                  </div>
                  <p className={`text-xs mt-2 ${plan.highlighted ? 'text-background/70' : 'text-muted-foreground'}`}>
                    veya yıllık {plan.priceYearly} olarak.
                  </p>
                </div>
                <ul className={`space-y-2 text-sm ${plan.highlighted ? 'text-background/90' : 'text-foreground'}`}>
                  <li className="flex items-center gap-2">
                    <span className={`h-1.5 w-1.5 rounded-full ${plan.highlighted ? 'bg-background' : 'bg-foreground'}`} />
                    Royalty paylaşımı: sanatçıya %{plan.royaltySplit}
                  </li>
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2">
                      <span className={`h-1.5 w-1.5 rounded-full ${plan.highlighted ? 'bg-background' : 'bg-foreground'}`} />
                      {feature}
                    </li>
                  ))}
                </ul>
                <Button
                  asChild
                  size="lg"
                  variant={plan.highlighted ? 'secondary' : 'default'}
                  className={plan.highlighted ? 'bg-background text-foreground hover:bg-background/90' : ''}
                >
                  <Link href="/register">{plan.name} seç</Link>
                </Button>
              </div>
            ))}
          </div>

          <BillingDetails />

          <div className="mt-16 border border-border/80 rounded-xl overflow-hidden">
            <div className="grid grid-cols-4 gap-0 text-sm">
              <div className="p-4 font-semibold uppercase tracking-[0.2em] text-[0.6rem]">Özellikler</div>
              <div className="p-4 font-semibold uppercase tracking-[0.2em] text-[0.6rem]">Başlangıç</div>
              <div className="p-4 font-semibold uppercase tracking-[0.2em] text-[0.6rem]">Pro</div>
              <div className="p-4 font-semibold uppercase tracking-[0.2em] text-[0.6rem]">Label</div>
              {comparison.map((row) => (
                <div key={row.feature} className="contents">
                  <div className="p-4 border-t border-border/80 text-muted-foreground">{row.feature}</div>
                  <div className="p-4 border-t border-border/80">{row.starter}</div>
                  <div className="p-4 border-t border-border/80">{row.pro}</div>
                  <div className="p-4 border-t border-border/80">{row.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  )
}
