'use client'

import { motion } from 'framer-motion'
import { Quote } from 'lucide-react'

const testimonials = [
  {
    name: 'Alex Rivera',
    role: 'Elektronik Sanatçı',
    quote: 'Eclisor sayesinde hiç ulaşamayacağımı düşündüğüm kitlelere ulaştım. Ekip inanılmaz.',
  },
  {
    name: 'Sarah Chen',
    role: 'Şarkıcı-Söz Yazarı',
    quote: 'Senkron lisanslama fırsatları kariyerim için oyunun kurallarını değiştirdi.',
  },
  {
    name: 'Marcus Johnson',
    role: 'Hip-Hop Prodüktörü',
    quote: 'Profesyoneller, şeffaflar ve sanatçı gelişimini gerçekten önemsiyorlar.',
  },
  {
    name: 'Luna Martinez',
    role: 'Pop Sanatçısı',
    quote: 'İlk günden beri desteklendim. Müzik kariyerim için verdiğim en iyi karardı.',
  },
]

export function Testimonials() {
  return (
    <section className="py-28 px-6 overflow-hidden">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <p className="section-tag">Referanslar</p>
          <h2 className="mt-4 text-4xl md:text-6xl font-display">Sanatçılar Ne Diyor</h2>
        </motion.div>

        <div className="flex gap-4 overflow-x-auto pb-4 -mx-6 px-6 snap-x snap-mandatory scrollbar-hide">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.name}
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="flex-shrink-0 w-[300px] md:w-[340px] glass-card rounded-sm p-6 snap-center"
            >
              <Quote className="h-7 w-7 text-accent/50 mb-4" strokeWidth={1} />
              <p className="text-foreground/90 text-sm leading-relaxed mb-6">
                &quot;{testimonial.quote}&quot;
              </p>
              <div>
                <div className="font-display text-lg tracking-wide">{testimonial.name}</div>
                <div className="text-xs uppercase tracking-[0.15em] text-muted-foreground mt-1">
                  {testimonial.role}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
