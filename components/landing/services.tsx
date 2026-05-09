'use client'

import { motion } from 'framer-motion'
import { Globe, Mic2, Music, Megaphone } from 'lucide-react'

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
    <section id="services" className="py-32 px-6">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-extralight tracking-tight">Hizmetlerimiz</h2>
          <p className="mt-4 text-muted-foreground font-light max-w-xl mx-auto">
            Müzik kariyerini bir üst seviyeye taşımak için ihtiyaç duyduğun her şey
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6">
          {services.map((service, index) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="glass-card rounded-2xl p-8 hover:bg-card/60 transition-colors"
            >
              <service.icon className="h-10 w-10 text-primary mb-4" strokeWidth={1.5} />
              <h3 className="text-xl font-light mb-2">{service.title}</h3>
              <p className="text-muted-foreground font-light text-sm leading-relaxed">
                {service.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
