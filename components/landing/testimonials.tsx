'use client'

import { motion } from 'framer-motion'
import { Quote } from 'lucide-react'

const testimonials = [
  {
    name: 'Alex Rivera',
    role: 'Electronic Artist',
    quote: 'Eclisor helped me reach audiences I never thought possible. Their team is incredible.',
  },
  {
    name: 'Sarah Chen',
    role: 'Singer-Songwriter',
    quote: 'The sync licensing opportunities have been game-changing for my career.',
  },
  {
    name: 'Marcus Johnson',
    role: 'Hip-Hop Producer',
    quote: 'Professional, transparent, and they genuinely care about artist development.',
  },
  {
    name: 'Luna Martinez',
    role: 'Pop Artist',
    quote: 'From day one, I felt supported. Best decision I made for my music career.',
  },
]

export function Testimonials() {
  return (
    <section className="py-32 px-6 overflow-hidden">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-extralight tracking-tight">What Artists Say</h2>
          <p className="mt-4 text-muted-foreground font-light max-w-xl mx-auto">
            Hear from artists who have grown with Eclisor
          </p>
        </motion.div>

        <div className="flex gap-6 overflow-x-auto pb-4 -mx-6 px-6 snap-x snap-mandatory scrollbar-hide">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.name}
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="flex-shrink-0 w-[300px] md:w-[350px] glass-card rounded-2xl p-6 snap-center"
            >
              <Quote className="h-8 w-8 text-primary/40 mb-4" strokeWidth={1} />
              <p className="text-foreground/90 font-light text-sm leading-relaxed mb-6">
                &quot;{testimonial.quote}&quot;
              </p>
              <div>
                <div className="font-light">{testimonial.name}</div>
                <div className="text-sm text-muted-foreground">{testimonial.role}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
