'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Spinner } from '@/components/ui/spinner'
import { User, Lock } from 'lucide-react'
import toast from 'react-hot-toast'

export default function SettingsPage() {
  const [isLoadingProfile, setIsLoadingProfile] = useState(true)
  const [isSavingProfile, setIsSavingProfile] = useState(false)
  const [isSavingPassword, setIsSavingPassword] = useState(false)

  const [profile, setProfile] = useState({ name: '', email: '' })
  const [passwords, setPasswords] = useState({ current: '', new: '', confirm: '' })

  useEffect(() => {
    fetch('/api/auth/session')
      .then((res) => res.json())
      .then((data) => {
        if (data.user) {
          setProfile({ name: data.user.name, email: data.user.email })
        }
      })
      .finally(() => setIsLoadingProfile(false))
  }, [])

  const handleSaveProfile = async () => {
    if (!profile.name || !profile.email) {
      toast.error('Lütfen tüm alanları doldurun')
      return
    }

    setIsSavingProfile(true)
    try {
      const res = await fetch('/api/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profile),
      })

      if (!res.ok) throw new Error()
      toast.success('Profil güncellendi')
    } catch {
      toast.error('Profil güncellenemedi')
    } finally {
      setIsSavingProfile(false)
    }
  }

  const handleSavePassword = async () => {
    if (!passwords.current || !passwords.new || !passwords.confirm) {
      toast.error('Lütfen tüm alanları doldurun')
      return
    }
    if (passwords.new !== passwords.confirm) {
      toast.error('Yeni şifreler eşleşmiyor')
      return
    }
    if (passwords.new.length < 6) {
      toast.error('Şifre en az 6 karakter olmalı')
      return
    }

    setIsSavingPassword(true)
    try {
      const res = await fetch('/api/password', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentPassword: passwords.current,
          newPassword: passwords.new,
        }),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Failed to update password')
      }

      toast.success('Şifre güncellendi')
      setPasswords({ current: '', new: '', confirm: '' })
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Şifre güncellenemedi')
    } finally {
      setIsSavingPassword(false)
    }
  }

  if (isLoadingProfile) {
    return (
      <div className="flex items-center justify-center h-64">
        <Spinner className="h-8 w-8" />
      </div>
    )
  }

  return (
    <div className="space-y-10 max-w-2xl">
      <div>
        <p className="text-xs uppercase tracking-[0.35em] text-muted-foreground">Hesap</p>
        <h1 className="mt-3 text-3xl md:text-5xl font-semibold">Hesap Ayarları</h1>
        <p className="mt-3 text-muted-foreground">Profilini güncelle ve güvenliğini yönet.</p>
      </div>

      <div className="bg-card border border-border/80 rounded-2xl p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <User className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h2 className="text-lg font-semibold">Profil Bilgileri</h2>
            <p className="text-sm text-muted-foreground">Adını ve e-postanı güncelle</p>
          </div>
        </div>

        <FieldGroup>
          <Field>
            <FieldLabel>Ad Soyad</FieldLabel>
            <Input
              value={profile.name}
              onChange={(e) => setProfile({ ...profile, name: e.target.value })}
            />
          </Field>

          <Field>
            <FieldLabel>E-posta</FieldLabel>
            <Input
              type="email"
              value={profile.email}
              onChange={(e) => setProfile({ ...profile, email: e.target.value })}
            />
          </Field>
        </FieldGroup>

        <Button onClick={handleSaveProfile} disabled={isSavingProfile} className="mt-6">
          {isSavingProfile ? <Spinner className="mr-2" /> : null}
          Kaydet
        </Button>
      </div>

      <div className="bg-card border border-border/80 rounded-2xl p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <Lock className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h2 className="text-lg font-semibold">Güvenlik</h2>
            <p className="text-sm text-muted-foreground">Şifreni güncelle</p>
          </div>
        </div>

        <FieldGroup>
          <Field>
            <FieldLabel>Mevcut Şifre</FieldLabel>
            <Input
              type="password"
              value={passwords.current}
              onChange={(e) => setPasswords({ ...passwords, current: e.target.value })}
            />
          </Field>

          <Field>
            <FieldLabel>Yeni Şifre</FieldLabel>
            <Input
              type="password"
              value={passwords.new}
              onChange={(e) => setPasswords({ ...passwords, new: e.target.value })}
            />
          </Field>

          <Field>
            <FieldLabel>Yeni Şifre (Tekrar)</FieldLabel>
            <Input
              type="password"
              value={passwords.confirm}
              onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })}
            />
          </Field>
        </FieldGroup>

        <Button onClick={handleSavePassword} disabled={isSavingPassword} className="mt-6">
          {isSavingPassword ? <Spinner className="mr-2" /> : null}
          Şifreyi Güncelle
        </Button>
      </div>
    </div>
  )
}
