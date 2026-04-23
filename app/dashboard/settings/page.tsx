'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Spinner } from '@/components/ui/spinner'
import { User, Lock, Settings } from 'lucide-react'
import toast from 'react-hot-toast'

type UserProfile = {
  id: number
  name: string
  email: string
}

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

export default function SettingsPage() {
  const [user, setUser] = useState<UserProfile | null>(null)
  const [isLoadingProfile, setIsLoadingProfile] = useState(true)
  const [isSavingProfile, setIsSavingProfile] = useState(false)
  const [isSavingPassword, setIsSavingPassword] = useState(false)
  const [isSavingSite, setIsSavingSite] = useState(false)

  const [profile, setProfile] = useState({ name: '', email: '' })
  const [passwords, setPasswords] = useState({ current: '', new: '', confirm: '' })
  const [siteSettings, setSiteSettings] = useState<SiteSettingsData>({
    tagline: 'Your Sound. Your Universe.',
    contact_email: 'info@eclisor.com',
    location: 'Istanbul, Turkey',
    response_time: '48 hours',
    artist_count: 500,
    country_count: 50,
    stream_count: '10M+',
  })

  useEffect(() => {
    // Fetch user profile
    fetch('/api/auth/session')
      .then((res) => res.json())
      .then((data) => {
        if (data.user) {
          setUser(data.user)
          setProfile({ name: data.user.name, email: data.user.email })
        }
      })
      .finally(() => setIsLoadingProfile(false))

    // Fetch site settings
    fetch('/api/site-settings')
      .then((res) => res.json())
      .then((data) => {
        if (data) {
          setSiteSettings({
            id: data.id,
            tagline: data.tagline || 'Your Sound. Your Universe.',
            contact_email: data.contact_email || 'info@eclisor.com',
            location: data.location || 'Istanbul, Turkey',
            response_time: data.response_time || '48 hours',
            artist_count: data.artist_count || 500,
            country_count: data.country_count || 50,
            stream_count: data.stream_count || '10M+',
          })
        }
      })
  }, [])

  const handleSaveProfile = async () => {
    if (!profile.name || !profile.email) {
      toast.error('Please fill all fields')
      return
    }

    setIsSavingProfile(true)
    try {
      const res = await fetch('/api/admin/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profile),
      })

      if (!res.ok) throw new Error()
      toast.success('Profile updated')
    } catch {
      toast.error('Failed to update profile')
    } finally {
      setIsSavingProfile(false)
    }
  }

  const handleSavePassword = async () => {
    if (!passwords.current || !passwords.new || !passwords.confirm) {
      toast.error('Please fill all password fields')
      return
    }
    if (passwords.new !== passwords.confirm) {
      toast.error('New passwords do not match')
      return
    }
    if (passwords.new.length < 6) {
      toast.error('Password must be at least 6 characters')
      return
    }

    setIsSavingPassword(true)
    try {
      const res = await fetch('/api/admin/password', {
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

      toast.success('Password updated')
      setPasswords({ current: '', new: '', confirm: '' })
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to update password')
    } finally {
      setIsSavingPassword(false)
    }
  }

  const handleSaveSiteSettings = async () => {
    setIsSavingSite(true)
    try {
      const res = await fetch('/api/admin/site-settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(siteSettings),
      })

      if (!res.ok) throw new Error()
      toast.success('Site settings updated')
    } catch {
      toast.error('Failed to update site settings')
    } finally {
      setIsSavingSite(false)
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
    <div className="space-y-8 max-w-2xl">
      <div>
        <h1 className="text-2xl font-light">Settings</h1>
        <p className="text-muted-foreground font-light mt-1">Manage your account and site settings</p>
      </div>

      {/* Profile Section */}
      <div className="glass-card rounded-xl p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <User className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h2 className="text-lg font-light">Profile</h2>
            <p className="text-sm text-muted-foreground">Update your display name and email</p>
          </div>
        </div>

        <FieldGroup>
          <Field>
            <FieldLabel>Display Name</FieldLabel>
            <Input
              value={profile.name}
              onChange={(e) => setProfile({ ...profile, name: e.target.value })}
              className="bg-input/50"
            />
          </Field>

          <Field>
            <FieldLabel>Email</FieldLabel>
            <Input
              type="email"
              value={profile.email}
              onChange={(e) => setProfile({ ...profile, email: e.target.value })}
              className="bg-input/50"
            />
          </Field>
        </FieldGroup>

        <Button
          onClick={handleSaveProfile}
          disabled={isSavingProfile}
          className="mt-6 bg-primary hover:bg-primary/90"
        >
          {isSavingProfile ? <Spinner className="mr-2" /> : null}
          Save Profile
        </Button>
      </div>

      {/* Security Section */}
      <div className="glass-card rounded-xl p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <Lock className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h2 className="text-lg font-light">Security</h2>
            <p className="text-sm text-muted-foreground">Change your password</p>
          </div>
        </div>

        <FieldGroup>
          <Field>
            <FieldLabel>Current Password</FieldLabel>
            <Input
              type="password"
              value={passwords.current}
              onChange={(e) => setPasswords({ ...passwords, current: e.target.value })}
              className="bg-input/50"
            />
          </Field>

          <Field>
            <FieldLabel>New Password</FieldLabel>
            <Input
              type="password"
              value={passwords.new}
              onChange={(e) => setPasswords({ ...passwords, new: e.target.value })}
              className="bg-input/50"
            />
          </Field>

          <Field>
            <FieldLabel>Confirm New Password</FieldLabel>
            <Input
              type="password"
              value={passwords.confirm}
              onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })}
              className="bg-input/50"
            />
          </Field>
        </FieldGroup>

        <Button
          onClick={handleSavePassword}
          disabled={isSavingPassword}
          className="mt-6 bg-primary hover:bg-primary/90"
        >
          {isSavingPassword ? <Spinner className="mr-2" /> : null}
          Update Password
        </Button>
      </div>

      {/* Site Settings Section */}
      <div className="glass-card rounded-xl p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <Settings className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h2 className="text-lg font-light">Site Settings</h2>
            <p className="text-sm text-muted-foreground">Customize your public-facing content</p>
          </div>
        </div>

        <FieldGroup>
          <Field>
            <FieldLabel>Tagline</FieldLabel>
            <Input
              value={siteSettings.tagline}
              onChange={(e) => setSiteSettings({ ...siteSettings, tagline: e.target.value })}
              className="bg-input/50"
            />
          </Field>

          <div className="grid grid-cols-2 gap-4">
            <Field>
              <FieldLabel>Contact Email</FieldLabel>
              <Input
                value={siteSettings.contact_email}
                onChange={(e) => setSiteSettings({ ...siteSettings, contact_email: e.target.value })}
                className="bg-input/50"
              />
            </Field>

            <Field>
              <FieldLabel>Location</FieldLabel>
              <Input
                value={siteSettings.location}
                onChange={(e) => setSiteSettings({ ...siteSettings, location: e.target.value })}
                className="bg-input/50"
              />
            </Field>
          </div>

          <Field>
            <FieldLabel>Response Time</FieldLabel>
            <Input
              value={siteSettings.response_time}
              onChange={(e) => setSiteSettings({ ...siteSettings, response_time: e.target.value })}
              className="bg-input/50"
            />
          </Field>

          <div className="grid grid-cols-3 gap-4">
            <Field>
              <FieldLabel>Artist Count</FieldLabel>
              <Input
                type="number"
                value={siteSettings.artist_count}
                onChange={(e) => setSiteSettings({ ...siteSettings, artist_count: parseInt(e.target.value) || 0 })}
                className="bg-input/50"
              />
            </Field>

            <Field>
              <FieldLabel>Country Count</FieldLabel>
              <Input
                type="number"
                value={siteSettings.country_count}
                onChange={(e) => setSiteSettings({ ...siteSettings, country_count: parseInt(e.target.value) || 0 })}
                className="bg-input/50"
              />
            </Field>

            <Field>
              <FieldLabel>Stream Count</FieldLabel>
              <Input
                value={siteSettings.stream_count}
                onChange={(e) => setSiteSettings({ ...siteSettings, stream_count: e.target.value })}
                className="bg-input/50"
                placeholder="e.g. 10M+"
              />
            </Field>
          </div>
        </FieldGroup>

        <Button
          onClick={handleSaveSiteSettings}
          disabled={isSavingSite}
          className="mt-6 bg-primary hover:bg-primary/90"
        >
          {isSavingSite ? <Spinner className="mr-2" /> : null}
          Save Site Settings
        </Button>
      </div>
    </div>
  )
}
