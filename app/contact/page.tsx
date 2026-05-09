'use client'

import { useState, useEffect } from 'react'
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
import { Mail, MapPin, Clock } from 'lucide-react'

const subjects = ['Genel Bilgi', 'İş Birliği', 'Basın', 'Diğer']

type SiteInfo = {
  contact_email: string
  location: string
  response_time: string
}

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [siteInfo, setSiteInfo] = useState<SiteInfo>({
    contact_email: 'info@eclisor.com',
    location: 'İstanbul, Türkiye',
    response_time: '48 saat',
  })
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    subject: '',
    message: '',
  })

  useEffect(() => {
    fetch('/api/site-settings')
      .then((res) => res.json())
      .then((data) => {
        if (data) {
            setSiteInfo({
              contact_email: data.contact_email || 'info@eclisor.com',
              location: data.location || 'İstanbul, Türkiye',
              response_time: data.response_time || '48 saat',
            })
        }
      })
      .catch(() => {})
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const res = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (!res.ok) {
        throw new Error('Mesaj gönderilemedi')
      }

      toast.success(`Mesajınız alındı. ${siteInfo.response_time} içinde dönüş yapacağız.`)
      setFormData({
        fullName: '',
        email: '',
        subject: '',
        message: '',
      })
    } catch {
      toast.error('Bir şeyler yanlış gitti. Lütfen tekrar deneyin.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="min-h-screen relative">
      <Navbar />
      
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl md:text-5xl font-extralight tracking-tight">İletişime Geçin</h1>
            <p className="mt-4 text-muted-foreground font-light">
              Sorularınız mı var? Sizden haber almayı çok isteriz.
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Contact Info */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="lg:col-span-1 space-y-6"
            >
              <div className="glass-card rounded-2xl p-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Mail className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-light mb-1">E-posta</h3>
                    <a
                      href={`mailto:${siteInfo.contact_email}`}
                      className="text-sm text-muted-foreground hover:text-primary transition-colors"
                    >
                      {siteInfo.contact_email}
                    </a>
                  </div>
                </div>
              </div>

              <div className="glass-card rounded-2xl p-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <MapPin className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-light mb-1">Konum</h3>
                    <p className="text-sm text-muted-foreground">{siteInfo.location}</p>
                  </div>
                </div>
              </div>

              <div className="glass-card rounded-2xl p-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Clock className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-light mb-1">Yanıt Süresi</h3>
                    <p className="text-sm text-muted-foreground">{siteInfo.response_time}</p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Contact Form */}
            <motion.form
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              onSubmit={handleSubmit}
              className="lg:col-span-2 glass-card rounded-2xl p-8"
            >
              <FieldGroup>
                <div className="grid md:grid-cols-2 gap-6">
                  <Field>
                    <FieldLabel>Ad Soyad *</FieldLabel>
                    <Input
                      required
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      placeholder="Adınız"
                      className="bg-input/50 border-border/50"
                    />
                  </Field>

                  <Field>
                    <FieldLabel>Email *</FieldLabel>
                    <Input
                      required
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="you@example.com"
                      className="bg-input/50 border-border/50"
                    />
                  </Field>
                </div>

                <Field>
                  <FieldLabel>Konu *</FieldLabel>
                  <Select
                    value={formData.subject}
                    onValueChange={(value) => setFormData({ ...formData, subject: value })}
                  >
                    <SelectTrigger className="bg-input/50 border-border/50">
                      <SelectValue placeholder="Konu seçin" />
                    </SelectTrigger>
                    <SelectContent>
                      {subjects.map((subject) => (
                        <SelectItem key={subject} value={subject}>{subject}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </Field>

                <Field>
                  <FieldLabel>Mesaj *</FieldLabel>
                  <Textarea
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Size nasıl yardımcı olabiliriz?"
                    rows={6}
                    className="bg-input/50 border-border/50 resize-none"
                  />
                </Field>
              </FieldGroup>

              <Button
                type="submit"
                disabled={isSubmitting || !formData.fullName || !formData.email || !formData.subject || !formData.message}
                className="w-full mt-8 bg-primary hover:bg-primary/90"
              >
                {isSubmitting ? <Spinner className="mr-2" /> : null}
                {isSubmitting ? 'Gönderiliyor...' : 'Mesaj Gönder'}
              </Button>
            </motion.form>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
