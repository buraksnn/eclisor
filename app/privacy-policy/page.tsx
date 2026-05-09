import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { LegalSection } from '@/components/legal/legal-section'

export default function PrivacyPolicyPage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <Navbar />
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-3xl mx-auto space-y-10">
          <header className="space-y-3">
            <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Gizlilik Politikası</p>
            <h1 className="text-4xl md:text-5xl font-semibold">Gizlilik Politikası</h1>
            <p className="text-sm text-muted-foreground">Son güncelleme: 9 Mayıs 2026</p>
          </header>

          <LegalSection title="Veri sorumlusu ve kapsam">
            <p>
              Bu gizlilik politikası, Eclisor&apos;un (Eclisor.com) hizmetlerini kullanırken paylaştığınız kişisel
              verilerin nasıl işlendiğini açıklar. Hizmetleri kullanarak bu politikayı kabul etmiş olursunuz.
            </p>
          </LegalSection>

          <LegalSection title="Toplanan bilgiler">
            <ul className="list-disc pl-5 space-y-2">
              <li>Hesap oluşturma ve iletişim için ad, e-posta, şirket bilgileri.</li>
              <li>Dağıtım ve raporlama için sanatçı/etiket bilgileri ile içerik meta verileri.</li>
              <li>Ödeme ve faturalama için gerekli finansal bilgiler (kart verileri üçüncü taraf ödeme sağlayıcılarındadır).</li>
              <li>Çerezler ve benzeri teknolojilerle toplanan kullanım verileri.</li>
            </ul>
          </LegalSection>

          <LegalSection title="Kullanım amaçları">
            <ul className="list-disc pl-5 space-y-2">
              <li>Hesap yönetimi, kimlik doğrulama ve müşteri desteği sağlamak.</li>
              <li>Dağıtım, raporlama, royalty hesaplama ve sözleşme yükümlülüklerini yerine getirmek.</li>
              <li>Hizmet kalitesini geliştirmek, güvenlik ve dolandırıcılık önleme faaliyetleri yürütmek.</li>
            </ul>
          </LegalSection>

          <LegalSection title="Paylaşım ve aktarım">
            <p>
              Verileriniz yalnızca hizmetin sağlanması için gerekli olan iş ortaklarıyla (DSP&apos;ler, ödeme sağlayıcıları,
              barındırma ve analitik servisleri) paylaşılır. Yasal zorunluluklar dışında üçüncü taraflara satılmaz.
            </p>
          </LegalSection>

          <LegalSection title="Saklama süreleri">
            <p>
              Veriler, sözleşmesel yükümlülükler ve yasal saklama süreleri boyunca tutulur. Hesabınızı kapatmanız halinde
              zorunlu kayıtlar dışında verileriniz güvenli şekilde silinir veya anonimleştirilir.
            </p>
          </LegalSection>

          <LegalSection title="Haklarınız">
            <p>
              KVKK kapsamında erişim, düzeltme, silme, işlemeyi kısıtlama ve itiraz haklarına sahipsiniz. Talepleriniz için
              support@eclisor.com adresinden bize ulaşabilirsiniz.
            </p>
          </LegalSection>

          <LegalSection title="Güncellemeler">
            <p>
              Bu politika zaman zaman güncellenebilir. Önemli değişikliklerde web sitemizde duyuru yaparız.
            </p>
          </LegalSection>
        </div>
      </section>
      <Footer />
    </main>
  )
}
