import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { AboutSection } from '@/components/about/about-section'

const teamCards = [
  {
    title: 'A&R ve Sanatçı Başarısı',
    description: 'Sanatçı gelişimi, katalog stratejisi ve büyüme planları.',
  },
  {
    title: 'Dağıtım ve Telifler',
    description: 'DSP dağıtımı, raporlama ve gelir takibi süreçleri.',
  },
  {
    title: 'Yaratıcı ve Marka',
    description: 'Görsel kimlik, kampanya kurguları ve yaratıcı üretim.',
  },
]

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <Navbar />
      <section className="pt-36 pb-24 px-6">
        <div className="max-w-5xl mx-auto space-y-14">
          <header className="space-y-4">
            <p className="section-tag">Hakkımızda</p>
            <h1 className="text-5xl md:text-7xl font-display">Eclisor</h1>
            <p className="text-muted-foreground max-w-2xl leading-relaxed">
              Bağımsız sanatçıları küresel sahneye taşımak için veri odaklı dağıtım, şeffaf raporlama ve
              yaratıcı destek sunuyoruz.
            </p>
          </header>

          <div className="grid gap-10 lg:grid-cols-2">
            <AboutSection title="Hikayemiz">
              <p>
                Eclisor, İstanbul&apos;da müzik sektörünün dijital dönüşümüne eşlik eden bir ekip tarafından
                kuruldu. Amacımız, sanatçıların dağıtım ve gelir yönetiminde bağımsız kalmasını sağlamak
                ve global pazarlara erişimlerini hızlandırmaktır.
              </p>
              <p>
                Bugün 50+ sanatçıyla çalışıyor, 12+ ülkede kataloglarımızı büyütüyor ve her ay yeni
                yayınları dünya çapında yayınlıyoruz.
              </p>
            </AboutSection>

            <AboutSection title="Misyonumuz">
              <p>
                Şeffaf royalty yönetimi, hızlı operasyon ve güçlü yaratıcı destek ile sanatçılara güvenli
                bir ekosistem sunuyoruz. Müzik üreticilerinin işini büyütürken haklarını koruyan sürdürülebilir
                bir dağıtım modeli geliştiriyoruz.
              </p>
            </AboutSection>
          </div>

          <AboutSection title="Ekibimiz">
            <p>
              Küçük ama uzman bir ekibiz. Her ekip üyesi sanatçıların ihtiyaçlarına göre uçtan uca destek
              sağlar.
            </p>
            <div className="mt-6 grid gap-4 md:grid-cols-3">
              {teamCards.map((card) => (
                <div key={card.title} className="glass-card rounded-sm p-5">
                  <h3 className="font-display text-xl tracking-wide">{card.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{card.description}</p>
                </div>
              ))}
            </div>
          </AboutSection>
        </div>
      </section>
      <Footer />
    </main>
  )
}
