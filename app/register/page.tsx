import Link from 'next/link'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { RegisterForm } from './register-form'

export default function RegisterPage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <Navbar />
      <section className="pt-28 pb-20 px-6">
        <div className="max-w-5xl mx-auto grid gap-10 lg:grid-cols-2">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Eclisor&apos;a Katıl</p>
            <h1 className="mt-6 text-4xl md:text-6xl font-semibold">
              Yayın sürecini dakikalar içinde kur.
            </h1>
            <p className="mt-4 text-lg text-muted-foreground">
              Sanatçı profilini oluştur, kataloğunu yükle ve onayları tek panelden takip et.
            </p>
            <div className="mt-10 space-y-4">
              {[
                'Yönlendirmeli yüklemelerle hızlı başlangıç',
                'Profesyonel analitik ve royalty yönetimi',
                'Bir sonraki yayınınız için özel destek',
              ].map((item) => (
                <div key={item} className="flex items-start gap-3">
                  <span className="mt-2 h-1.5 w-1.5 rounded-full bg-foreground" />
                  <p className="text-sm text-muted-foreground">{item}</p>
                </div>
              ))}
            </div>
            <p className="mt-10 text-sm text-muted-foreground">
              Zaten hesabın var mı?{' '}
              <Link href="/login" className="text-foreground underline underline-offset-4">
                Giriş yap
              </Link>
            </p>
          </div>

          <div className="glass-card rounded-2xl p-8 border border-border/80">
            <RegisterForm />
          </div>
        </div>
      </section>
      <Footer />
    </main>
  )
}
