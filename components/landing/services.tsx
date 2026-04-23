'use client'

import { motion } from 'framer-motion'
import { Globe, Mic2, Music, Megaphone } from 'lucide-react'

const services = [
  {
    icon: Globe,
    title: 'Music Distribution',
    description: 'Get your music on Spotify, Apple Music, Amazon, and 150+ platforms worldwide.',
  },
  {
    icon: Mic2,
    title: 'Artist Development',
    description: 'Strategic guidance to help you grow your career and build a sustainable brand.',
  },
  {
    icon: Music,
    title: 'Sync Licensing',
    description: 'Connect your music with film, TV, commercials, and gaming opportunities.',
  },
  {
    icon: Megaphone,
    title: 'PR & Promotion',
    description: 'Professional press coverage, playlist pitching, and social media campaigns.',
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
          <h2 className="text-3xl md:text-4xl font-extralight tracking-tight">Our Services</h2>
          <p className="mt-4 text-muted-foreground font-light max-w-xl mx-auto">
            Everything you need to take your music career to the next level
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
