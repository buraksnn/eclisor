import Link from 'next/link'

const footerLinks = [
  { href: '/', label: 'Ana Sayfa' },
  { href: '/#services', label: 'Hizmetler' },
  { href: '/pricing', label: 'Fiyatlandırma' },
  { href: '/about', label: 'Hakkımızda' },
  { href: '/contact', label: 'İletişim' },
  { href: '/privacy-policy', label: 'Gizlilik Politikası' },
  { href: '/terms-of-service', label: 'Kullanım Şartları' },
]

export function Footer() {
  return (
    <footer className="border-t border-border/50 py-12 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <Link href="/" className="text-xl font-light tracking-wider">
            ECLISOR
          </Link>

          <nav className="flex items-center gap-8">
            {footerLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} Eclisor. Tüm hakları saklıdır.
          </p>
        </div>
      </div>
    </footer>
  )
}
