'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { Clock, Users, Settings, LogOut, Menu, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import toast from 'react-hot-toast'
import type { User } from '@/lib/db'

const navItems = [
  { href: '/admin/pending-releases', icon: Clock, label: 'Bekleyen Onaylar' },
  { href: '/admin/artists', icon: Users, label: 'Sanatçı Listesi' },
  { href: '/admin/settings', icon: Settings, label: 'Sistem Ayarları' },
]

export function AdminSidebar({ user }: { user: User }) {
  const pathname = usePathname()
  const router = useRouter()
  const [isMobileOpen, setIsMobileOpen] = useState(false)

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' })
      router.push('/login')
    } catch {
      toast.error('Çıkış yapılamadı')
    }
  }

  return (
    <>
      <button
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 border border-border/80 rounded-lg bg-foreground text-background"
        aria-label="Yönetici menüsünü aç/kapat"
      >
        {isMobileOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {isMobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-background/90 backdrop-blur-sm z-30"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      <aside
        className={`fixed top-0 left-0 z-40 h-screen w-72 bg-foreground text-background border-r border-border/50 transition-transform duration-300 ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="flex flex-col h-full px-6 py-8">
          <div className="mb-12">
            <Link href="/admin/pending-releases" className="text-lg font-semibold tracking-[0.35em]">
              ECLISOR
            </Link>
            <p className="mt-3 text-xs uppercase tracking-[0.3em] text-background/60">Yönetici Paneli</p>
          </div>

          <nav className="flex-1 space-y-2">
            {navItems.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(item.href)
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsMobileOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-background text-foreground'
                      : 'text-background/70 hover:text-background hover:bg-background/20'
                  }`}
                >
                  <item.icon size={20} strokeWidth={1.75} />
                  <span className="font-semibold text-sm tracking-wide">{item.label}</span>
                </Link>
              )
            })}
          </nav>

          <div className="border-t border-background/10 pt-6 mt-6">
            <div className="px-4 mb-4">
              <p className="text-sm font-semibold">{user.name}</p>
              <p className="text-xs text-background/60 truncate">{user.email}</p>
            </div>
            <Button
              variant="ghost"
              onClick={handleLogout}
              className="w-full justify-start gap-3 text-background/80 hover:text-background hover:bg-background/10"
            >
              <LogOut size={20} strokeWidth={1.75} />
              <span className="font-semibold text-sm tracking-wide">Çıkış</span>
            </Button>
          </div>
        </div>
      </aside>
    </>
  )
}
