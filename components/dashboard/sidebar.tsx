'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { LayoutDashboard, FileText, Mail, Music, Settings, LogOut, Menu, X, Upload, ShieldCheck } from 'lucide-react'
import { Button } from '@/components/ui/button'
import toast from 'react-hot-toast'
import type { User } from '@/lib/db'

const navItems = [
  { href: '/dashboard', icon: LayoutDashboard, label: 'Overview' },
  { href: '/dashboard/upload', icon: Upload, label: 'Upload' },
  { href: '/dashboard/applications', icon: FileText, label: 'Applications' },
  { href: '/dashboard/messages', icon: Mail, label: 'Messages' },
  { href: '/dashboard/catalog', icon: Music, label: 'Catalog' },
  { href: '/dashboard/settings', icon: Settings, label: 'Settings' },
]

export function DashboardSidebar({ user }: { user: User }) {
  const pathname = usePathname()
  const router = useRouter()
  const [isMobileOpen, setIsMobileOpen] = useState(false)

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' })
      router.push('/login')
    } catch {
      toast.error('Failed to logout')
    }
  }

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 glass rounded-lg"
        aria-label="Toggle menu"
      >
        {isMobileOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-background/80 backdrop-blur-sm z-30"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-40 h-screen w-64 bg-sidebar border-r border-sidebar-border transition-transform duration-300 ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="flex flex-col h-full p-6">
          {/* Logo */}
          <div className="mb-10">
            <Link href="/dashboard" className="text-xl font-light tracking-wider text-sidebar-foreground">
              ECLISOR
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-2">
            {navItems.map((item) => {
              const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href))
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsMobileOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                      : 'text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground'
                  }`}
                >
                  <item.icon size={20} strokeWidth={1.5} />
                  <span className="font-light">{item.label}</span>
                </Link>
              )
            })}
            {user.role?.toLowerCase() === 'admin' && (
              <Link
                href="/admin/pending-releases"
                onClick={() => setIsMobileOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  pathname === '/admin/pending-releases'
                    ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                    : 'text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground'
                }`}
              >
                <ShieldCheck size={20} strokeWidth={1.5} />
                <span className="font-light">Pending Releases</span>
              </Link>
            )}
          </nav>

          {/* User Info & Logout */}
          <div className="border-t border-sidebar-border pt-6 mt-6">
            <div className="px-4 mb-4">
              <p className="text-sm font-light text-sidebar-foreground">{user.name}</p>
              <p className="text-xs text-sidebar-foreground/60 truncate">{user.email}</p>
            </div>
            <Button
              variant="ghost"
              onClick={handleLogout}
              className="w-full justify-start gap-3 text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent/50"
            >
              <LogOut size={20} strokeWidth={1.5} />
              <span className="font-light">Logout</span>
            </Button>
          </div>
        </div>
      </aside>
    </>
  )
}
