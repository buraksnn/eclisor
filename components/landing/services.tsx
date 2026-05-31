'use client'

import { motion } from 'framer-motion'
import { Globe, Megaphone, Mic2, Music } from 'lucide-react'

const services = [
  {
    icon: Globe,
    title: 'Müzik Dağıtımı',
    description: 'Müziğini Spotify, Apple Music, Amazon ve 150+ platformda dünyaya ulaştır.',
  },
  {
    icon: Mic2,
    title: 'Sanatçı Gelişimi',
    description: 'Kariyerini büyütmek ve sürdürülebilir bir marka kurmak için stratejik rehberlik.',
  },
  {
    icon: Music,
    title: 'Senkron Lisanslama',
    description: 'Müziğini film, dizi, reklam ve oyun fırsatlarıyla buluştur.',
  },
  {
    icon: Megaphone,
    title: 'PR ve Tanıtım',
    description: 'Profesyonel basın çalışmaları, playlist pitching ve sosyal medya kampanyaları.',
  },
]

export function Services() {
  return (
    <section id="services" className="py-28 px-6">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <p className="section-tag">Hizmetler</p>
          <h2 className="mt-4 text-4xl md:text-6xl font-display">Ne Sunuyoruz</h2>
          <p className="mt-4 text-muted-foreground max-w-xl mx-auto leading-relaxed">
            Müzik kariyerini bir üst seviyeye taşımak için ihtiyaç duyduğun her şey
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-4">
          {services.map((service, index) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="glass-card rounded-sm p-8 hover:border-accent/20 transition-colors"
            >
              <service.icon className="h-9 w-9 text-accent mb-5" strokeWidth={1.25} />
              <h3 className="font-display text-2xl tracking-wide mb-2">{service.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{service.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
