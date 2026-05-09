import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { LegalSection } from '@/components/legal/legal-section'

export default function TermsOfServicePage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <Navbar />
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-3xl mx-auto space-y-10">
          <header className="space-y-3">
            <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Kullanım Şartları</p>
            <h1 className="text-4xl md:text-5xl font-semibold">Kullanım Şartları</h1>
            <p className="text-sm text-muted-foreground">Son güncelleme: 9 Mayıs 2026</p>
          </header>

          <LegalSection title="Kabul ve sözleşme">
            <p>
              Eclisor hizmetlerini kullanarak bu şartları ve ek sözleşmeleri kabul etmiş olursunuz. Şartları kabul
              etmiyorsanız hizmetleri kullanmayınız.
            </p>
          </LegalSection>

          <LegalSection title="Hizmet tanımı">
            <p>
              Eclisor; dijital müzik dağıtımı, royalty yönetimi, raporlama ve ilgili destek hizmetlerini sağlar. Hizmet
              kapsamı, planınıza ve sözleşmenize göre değişebilir.
            </p>
          </LegalSection>

          <LegalSection title="Üyelik ve sorumluluklar">
            <ul className="list-disc pl-5 space-y-2">
              <li>Hesabınızın güvenliğinden ve doğru bilgi sağlamaktan siz sorumlusunuz.</li>
              <li>Yüklenen içeriklerin haklarının size ait olduğunu veya gerekli izinlere sahip olduğunuzu taahhüt edersiniz.</li>
              <li>Yasaya aykırı, ihlal içeren veya telif hakkı sorunlu içerikler yüklenemez.</li>
            </ul>
          </LegalSection>

          <LegalSection title="Ücretlendirme ve ödeme">
            <p>
              Plan ücretleri, seçtiğiniz faturalama dönemine göre önceden tahsil edilir. Royalty ödemeleri, ilgili DSP
              raporları kesinleştikten sonra planınızda belirtilen split oranına göre yapılır.
            </p>
          </LegalSection>

          <LegalSection title="Fikri mülkiyet">
            <p>
              Eclisor markaları, arayüzleri ve yazılımları Eclisor&apos;a aittir. Hizmetler size yalnızca sınırlı kullanım
              hakkı verir; mülkiyet devri söz konusu değildir.
            </p>
          </LegalSection>

          <LegalSection title="Sorumluluğun sınırlandırılması">
            <p>
              Eclisor, dolaylı zararlar veya gelir kaybından sorumlu değildir. Hizmetlerdeki kesintiler için yasal sınırlar
              içinde sorumluluk kabul edilir.
            </p>
          </LegalSection>

          <LegalSection title="Fesih">
            <p>
              Şartların ihlali halinde hesabınız askıya alınabilir veya sonlandırılabilir. Siz de dilediğiniz zaman hesabınızı
              kapatabilirsiniz; zorunlu yasal kayıtlar saklanmaya devam eder.
            </p>
          </LegalSection>

          <LegalSection title="Uyuşmazlıklar">
            <p>
              Bu şartlar Türkiye Cumhuriyeti hukukuna tabidir. Uyuşmazlıklarda İstanbul (Merkez) mahkemeleri ve icra daireleri
              yetkilidir.
            </p>
          </LegalSection>
        </div>
      </section>
      <Footer />
    </main>
  )
}
