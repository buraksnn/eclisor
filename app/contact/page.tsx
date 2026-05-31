import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { siteContact } from '@/lib/site-content'
import { Clock, Mail, MapPin } from 'lucide-react'

const contactItems = [
  {
    icon: Mail,
    title: 'E-posta',
    value: siteContact.email,
    href: `mailto:${siteContact.email}`,
  },
  {
    icon: MapPin,
    title: 'Konum',
    value: siteContact.location,
  },
  {
    icon: Clock,
    title: 'Yanıt süresi',
    value: siteContact.responseTime,
  },
]

export default function ContactPage() {
  return (
    <main className="min-h-screen relative">
      <Navbar />

      <section className="pt-36 pb-24 px-6">
        <div className="max-w-3xl mx-auto">
          <p className="section-tag text-center">İletişim</p>
          <h1 className="mt-4 text-center text-5xl md:text-7xl font-display">Bize Ulaşın</h1>
          <p className="mt-6 text-center text-muted-foreground leading-relaxed">
            Sorularınız, iş birliği teklifleri veya basın talepleri için doğrudan aşağıdaki kanallardan
            bize ulaşabilirsiniz.
          </p>

          <div className="mt-14 space-y-4">
            {contactItems.map((item) => (
              <div key={item.title} className="glass-card rounded-sm p-6 md:p-8">
                <div className="flex items-start gap-5">
                  <div className="w-11 h-11 rounded-sm bg-accent/10 flex items-center justify-center shrink-0">
                    <item.icon className="h-5 w-5 text-accent" strokeWidth={1.5} />
                  </div>
                  <div>
                    <h2 className="font-display text-xl tracking-wide text-foreground">{item.title}</h2>
                    {item.href ? (
                      <a
                        href={item.href}
                        className="mt-2 inline-block text-sm text-muted-foreground hover:text-accent transition-colors"
                      >
                        {item.value}
                      </a>
                    ) : (
                      <p className="mt-2 text-sm text-muted-foreground">{item.value}</p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <p className="mt-12 text-center text-xs uppercase tracking-[0.2em] text-muted-foreground/80">
            Instagram: {siteContact.instagram}
          </p>
        </div>
      </section>

      <Footer />
    </main>
  )
}
