import Link from 'next/link'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'

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
    features: ['Çoklu sanatçı yönetimi', 'Gelişmiş raporlama', 'Özel sözleşmeler', 'Özel temsilci'],
  },
]

const comparison = [
  { feature: "Mağazalar & DSP'ler", starterPlan: '200+', proPlan: '250+', labelPlan: '300+' },
  { feature: 'Royalty Paylaşımı', starterPlan: 'Sanatçıya %80', proPlan: 'Sanatçıya %85', labelPlan: 'Sanatçıya %90' },
  { feature: 'YouTube Content ID', starterPlan: '—', proPlan: 'Dahil', labelPlan: 'Dahil' },
  { feature: 'Öncelikli Destek', starterPlan: '—', proPlan: 'Var', labelPlan: 'Özel' },
  { feature: 'Label Paketi', starterPlan: '—', proPlan: '—', labelPlan: 'Var' },
]

export default function PricingPage() {
  return (
    <main className="bg-background text-foreground">
      <Navbar />
      <section className="pt-36 pb-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="max-w-3xl">
            <p className="section-tag">Fiyatlandırma</p>
            <h1 className="mt-4 text-5xl md:text-7xl font-display">Şeffaf Planlar</h1>
            <p className="mt-6 text-muted-foreground leading-relaxed">
              Aylık veya yıllık faturalama seçenekleriyle kataloğun için en uygun planı inceleyebilirsin.
              Detaylı bilgi ve başvuru için{' '}
              <Link href="/contact" className="text-accent hover:underline">
                iletişim
              </Link>{' '}
              sayfamıza göz at.
            </p>
          </div>

          <div className="mt-14 grid gap-4 lg:grid-cols-3">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`rounded-sm p-8 flex flex-col gap-6 border ${
                  plan.highlighted
                    ? 'border-accent/40 bg-accent/5'
                    : 'border-border glass-card'
                }`}
              >
                <div>
                  {plan.highlighted && (
                    <span className="text-[0.65rem] uppercase tracking-[0.3em] text-accent">
                      En popüler
                    </span>
                  )}
                  <h3 className="mt-2 font-display text-3xl tracking-wide">{plan.name}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{plan.description}</p>
                </div>
                <div>
                  <div className="flex items-end gap-2">
                    <span className="font-display text-5xl">{plan.priceMonthly}</span>
                    <span className="text-sm text-muted-foreground pb-1">/ ay</span>
                  </div>
                  <p className="text-xs mt-2 text-muted-foreground">veya yıllık {plan.priceYearly}</p>
                </div>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>Royalty: sanatçıya %{plan.royaltySplit}</li>
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2">
                      <span className="h-1 w-1 rounded-full bg-accent shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="mt-14 grid gap-4 md:grid-cols-2">
            <div className="glass-card rounded-sm p-6">
              <h2 className="font-display text-xl tracking-wide">Faturalama</h2>
              <ul className="mt-4 space-y-2 text-sm text-muted-foreground leading-relaxed">
                <li>Aylık veya yıllık faturalama; planlar her dönemde aynı takvim gününde yenilenir.</li>
                <li>Faturalar otomatik oluşturulur ve kayıtlı e-posta adresine gönderilir.</li>
              </ul>
            </div>
            <div className="glass-card rounded-sm p-6">
              <h2 className="font-display text-xl tracking-wide">Komisyon ve ödemeler</h2>
              <ul className="mt-4 space-y-2 text-sm text-muted-foreground leading-relaxed">
                <li>Royalty payı: %80 (Başlangıç), %85 (Pro), %90 (Label).</li>
                <li>Ödemeler DSP raporları kesinleştikten sonra aylık olarak yapılır.</li>
              </ul>
            </div>
          </div>

          <div className="mt-14 border border-border rounded-sm overflow-hidden">
            <div className="grid grid-cols-4 gap-0 text-sm">
              <div className="p-4 font-display text-xs tracking-[0.2em] uppercase bg-muted/30">Özellik</div>
              <div className="p-4 font-display text-xs tracking-[0.2em] uppercase bg-muted/30">Başlangıç</div>
              <div className="p-4 font-display text-xs tracking-[0.2em] uppercase bg-muted/30">Pro</div>
              <div className="p-4 font-display text-xs tracking-[0.2em] uppercase bg-muted/30">Label</div>
              {comparison.map((row) => (
                <div key={row.feature} className="contents">
                  <div className="p-4 border-t border-border text-muted-foreground">{row.feature}</div>
                  <div className="p-4 border-t border-border">{row.starterPlan}</div>
                  <div className="p-4 border-t border-border">{row.proPlan}</div>
                  <div className="p-4 border-t border-border">{row.labelPlan}</div>
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
