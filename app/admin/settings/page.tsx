'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Spinner } from '@/components/ui/spinner'
import { Settings } from 'lucide-react'
import toast from 'react-hot-toast'

type SiteSettingsData = {
  id?: number
  tagline: string
  contact_email: string
  location: string
  response_time: string
  artist_count: number
  country_count: number
  stream_count: string
}

export default function AdminSettingsPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [siteSettings, setSiteSettings] = useState<SiteSettingsData>({
    tagline: 'Sesin. Senin Evrenin.',
    contact_email: 'info@eclisor.com',
    location: 'İstanbul, Türkiye',
    response_time: '48 saat',
    artist_count: 50,
    country_count: 12,
    stream_count: '2M+',
  })

  useEffect(() => {
    fetch('/api/site-settings')
      .then((res) => res.json())
      .then((data) => {
        if (data) {
            setSiteSettings({
              id: data.id,
              tagline: data.tagline || 'Sesin. Senin Evrenin.',
              contact_email: data.contact_email || 'info@eclisor.com',
              location: data.location || 'İstanbul, Türkiye',
              response_time: data.response_time || '48 saat',
              artist_count: data.artist_count || 50,
              country_count: data.country_count || 12,
              stream_count: data.stream_count || '2M+',
            })
        }
      })
      .finally(() => setIsLoading(false))
  }, [])

  const handleSaveSiteSettings = async () => {
    setIsSaving(true)
    try {
      const res = await fetch('/api/admin/site-settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(siteSettings),
      })

      if (!res.ok) throw new Error()
      toast.success('Sistem ayarları güncellendi')
    } catch {
      toast.error('Sistem ayarları güncellenemedi')
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Spinner className="h-8 w-8" />
      </div>
    )
  }

  return (
    <div className="space-y-10 max-w-3xl">
      <div>
        <p className="text-xs uppercase tracking-[0.35em] text-muted-foreground">Yönetim</p>
        <h1 className="mt-3 text-3xl md:text-5xl font-semibold">Sistem Ayarları</h1>
        <p className="mt-3 text-muted-foreground">
          Ana sayfa metinleri ve genel metrikleri buradan güncelleyebilirsiniz.
        </p>
      </div>

      <div className="bg-card border border-border/80 rounded-2xl p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <Settings className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h2 className="text-lg font-semibold">Genel Ayarlar</h2>
            <p className="text-sm text-muted-foreground">Kamuya açık içerikleri düzenleyin</p>
          </div>
        </div>

        <FieldGroup>
          <Field>
            <FieldLabel>Slogan</FieldLabel>
            <Input
              value={siteSettings.tagline}
              onChange={(e) => setSiteSettings({ ...siteSettings, tagline: e.target.value })}
            />
          </Field>

          <div className="grid gap-4 md:grid-cols-2">
            <Field>
              <FieldLabel>İletişim E-Postası</FieldLabel>
              <Input
                value={siteSettings.contact_email}
                onChange={(e) => setSiteSettings({ ...siteSettings, contact_email: e.target.value })}
              />
            </Field>

            <Field>
              <FieldLabel>Konum</FieldLabel>
              <Input
                value={siteSettings.location}
                onChange={(e) => setSiteSettings({ ...siteSettings, location: e.target.value })}
              />
            </Field>
          </div>

          <Field>
            <FieldLabel>Yanıt Süresi</FieldLabel>
            <Input
              value={siteSettings.response_time}
              onChange={(e) => setSiteSettings({ ...siteSettings, response_time: e.target.value })}
            />
          </Field>

          <div className="grid gap-4 md:grid-cols-3">
            <Field>
              <FieldLabel>Sanatçı Sayısı</FieldLabel>
              <Input
                type="number"
                value={siteSettings.artist_count}
                onChange={(e) => setSiteSettings({ ...siteSettings, artist_count: parseInt(e.target.value) || 0 })}
              />
            </Field>

            <Field>
              <FieldLabel>Ülke Sayısı</FieldLabel>
              <Input
                type="number"
                value={siteSettings.country_count}
                onChange={(e) => setSiteSettings({ ...siteSettings, country_count: parseInt(e.target.value) || 0 })}
              />
            </Field>

            <Field>
              <FieldLabel>Dinlenme</FieldLabel>
              <Input
                value={siteSettings.stream_count}
                onChange={(e) => setSiteSettings({ ...siteSettings, stream_count: e.target.value })}
                placeholder="örn. 10M+"
              />
            </Field>
          </div>
        </FieldGroup>

        <Button onClick={handleSaveSiteSettings} disabled={isSaving} className="mt-6">
          {isSaving ? <Spinner className="mr-2" /> : null}
          Kaydet
        </Button>
      </div>
    </div>
  )
}
