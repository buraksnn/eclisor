import Link from 'next/link'

const footerLinks = [
  { href: '/', label: 'Ana Sayfa' },
  { href: '/#services', label: 'Hizmetler' },
  { href: '/pricing', label: 'Fiyatlandırma' },
  { href: '/about', label: 'Hakkımızda' },
  { href: '/contact', label: 'İletişim' },
  { href: '/privacy-policy', label: 'Gizlilik' },
  { href: '/terms-of-service', label: 'Şartlar' },
]

export function Footer() {
  return (
    <footer className="border-t border-border py-16 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col gap-10 md:flex-row md:items-end md:justify-between">
          <div>
            <Link
              href="/"
              className="font-display text-3xl tracking-[0.25em] text-foreground hover:text-accent transition-colors"
            >
              ECLISOR
            </Link>
            <p className="mt-3 text-sm text-muted-foreground max-w-xs leading-relaxed">
              Bağımsız sanatçılar için küresel müzik dağıtımı ve yaratıcı destek.
            </p>
          </div>

          <nav className="flex flex-wrap gap-x-8 gap-y-3">
            {footerLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-xs uppercase tracking-[0.15em] text-muted-foreground hover:text-accent transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        <p className="mt-12 text-xs text-muted-foreground/70 uppercase tracking-[0.2em]">
          &copy; {new Date().getFullYear()} Eclisor — Tüm hakları saklıdır.
        </p>
      </div>
    </footer>
  )
}
