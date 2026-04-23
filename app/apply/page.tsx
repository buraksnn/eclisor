'use client'

import { useState } from 'react'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Spinner } from '@/components/ui/spinner'
import toast from 'react-hot-toast'
import { motion } from 'framer-motion'

const genres = ['Pop', 'Hip-Hop', 'Electronic', 'Rock', 'R&B', 'Classical', 'Other']
const countries = [
  'United States', 'United Kingdom', 'Canada', 'Germany', 'France', 'Australia',
  'Japan', 'South Korea', 'Brazil', 'Mexico', 'Turkey', 'India', 'Other'
]

export default function ApplyPage() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    artistName: '',
    realName: '',
    email: '',
    country: '',
    genre: '',
    type: 'ARTIST',
    musicLink: '',
    socialLink: '',
    message: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const res = await fetch('/api/applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (!res.ok) {
        throw new Error('Failed to submit application')
      }

      toast.success('Your application has been received.')
      setFormData({
        artistName: '',
        realName: '',
        email: '',
        country: '',
        genre: '',
        type: 'ARTIST',
        musicLink: '',
        socialLink: '',
        message: '',
      })
    } catch {
      toast.error('Something went wrong. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="min-h-screen relative">
      <Navbar />
      
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-2xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl md:text-5xl font-extralight tracking-tight">Apply Now</h1>
            <p className="mt-4 text-muted-foreground font-light">
              Join our roster of talented artists and labels
            </p>
          </motion.div>

          <motion.form
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            onSubmit={handleSubmit}
            className="glass-card rounded-2xl p-8"
          >
            <FieldGroup>
              <div className="grid md:grid-cols-2 gap-6">
                <Field>
                  <FieldLabel>Artist / Stage Name *</FieldLabel>
                  <Input
                    required
                    value={formData.artistName}
                    onChange={(e) => setFormData({ ...formData, artistName: e.target.value })}
                    placeholder="Your artist name"
                    className="bg-input/50 border-border/50"
                  />
                </Field>

                <Field>
                  <FieldLabel>Real Full Name *</FieldLabel>
                  <Input
                    required
                    value={formData.realName}
                    onChange={(e) => setFormData({ ...formData, realName: e.target.value })}
                    placeholder="Your legal name"
                    className="bg-input/50 border-border/50"
                  />
                </Field>
              </div>

              <Field>
                <FieldLabel>Email Address *</FieldLabel>
                <Input
                  required
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="you@example.com"
                  className="bg-input/50 border-border/50"
                />
              </Field>

              <div className="grid md:grid-cols-2 gap-6">
                <Field>
                  <FieldLabel>Country *</FieldLabel>
                  <Select
                    value={formData.country}
                    onValueChange={(value) => setFormData({ ...formData, country: value })}
                  >
                    <SelectTrigger className="bg-input/50 border-border/50">
                      <SelectValue placeholder="Select country" />
                    </SelectTrigger>
                    <SelectContent>
                      {countries.map((country) => (
                        <SelectItem key={country} value={country}>{country}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </Field>

                <Field>
                  <FieldLabel>Genre *</FieldLabel>
                  <Select
                    value={formData.genre}
                    onValueChange={(value) => setFormData({ ...formData, genre: value })}
                  >
                    <SelectTrigger className="bg-input/50 border-border/50">
                      <SelectValue placeholder="Select genre" />
                    </SelectTrigger>
                    <SelectContent>
                      {genres.map((genre) => (
                        <SelectItem key={genre} value={genre}>{genre}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </Field>
              </div>

              <Field>
                <FieldLabel>Type *</FieldLabel>
                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, type: 'ARTIST' })}
                    className={`flex-1 py-3 rounded-lg border transition-all ${
                      formData.type === 'ARTIST'
                        ? 'bg-primary/20 border-primary text-foreground'
                        : 'bg-input/50 border-border/50 text-muted-foreground hover:border-border'
                    }`}
                  >
                    Artist
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, type: 'LABEL' })}
                    className={`flex-1 py-3 rounded-lg border transition-all ${
                      formData.type === 'LABEL'
                        ? 'bg-primary/20 border-primary text-foreground'
                        : 'bg-input/50 border-border/50 text-muted-foreground hover:border-border'
                    }`}
                  >
                    Label
                  </button>
                </div>
              </Field>

              <Field>
                <FieldLabel>Spotify or Music Link (optional)</FieldLabel>
                <Input
                  type="url"
                  value={formData.musicLink}
                  onChange={(e) => setFormData({ ...formData, musicLink: e.target.value })}
                  placeholder="https://open.spotify.com/..."
                  className="bg-input/50 border-border/50"
                />
              </Field>

              <Field>
                <FieldLabel>Social Media Link (optional)</FieldLabel>
                <Input
                  type="url"
                  value={formData.socialLink}
                  onChange={(e) => setFormData({ ...formData, socialLink: e.target.value })}
                  placeholder="https://instagram.com/..."
                  className="bg-input/50 border-border/50"
                />
              </Field>

              <Field>
                <FieldLabel>Tell us about yourself</FieldLabel>
                <Textarea
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Share your story, goals, and what makes you unique..."
                  rows={5}
                  className="bg-input/50 border-border/50 resize-none"
                />
              </Field>
            </FieldGroup>

            <Button
              type="submit"
              disabled={isSubmitting || !formData.artistName || !formData.realName || !formData.email || !formData.country || !formData.genre}
              className="w-full mt-8 bg-primary hover:bg-primary/90"
            >
              {isSubmitting ? <Spinner className="mr-2" /> : null}
              {isSubmitting ? 'Submitting...' : 'Submit Application'}
            </Button>
          </motion.form>
        </div>
      </section>

      <Footer />
    </main>
  )
}
