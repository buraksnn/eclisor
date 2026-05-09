'use client'

import { motion } from 'framer-motion'
import { FileText, Search, Rocket } from 'lucide-react'

const steps = [
  {
    icon: FileText,
    step: '01',
    title: 'Başvur',
    description: 'Müziğin ve bilgilerinle başvurunu gönder.',
  },
  {
    icon: Search,
    step: '02',
    title: 'Değerlendirme',
    description: 'Ekibimiz başvurunu inceler ve potansiyelini değerlendirir.',
  },
  {
    icon: Rocket,
    step: '03',
    title: 'Yayına Al',
    description: 'Onaylandıktan sonra müziğin tüm büyük platformlarda yayına girer.',
  },
]

export function HowItWorks() {
  return (
    <section className="py-32 px-6 relative overflow-hidden">
      {/* Background gradient accent */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl pointer-events-none" />
      
      <div className="max-w-6xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-extralight tracking-tight">Nasıl Çalışır</h2>
          <p className="mt-4 text-muted-foreground font-light max-w-xl mx-auto">
            Müziğini dünyaya duyurmak için üç adımlı basit süreç
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <motion.div
              key={step.step}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.15 }}
              className="text-center"
            >
              <div className="relative inline-flex items-center justify-center mb-6">
                <div className="w-20 h-20 rounded-full glass-card flex items-center justify-center">
                  <step.icon className="h-8 w-8 text-primary" strokeWidth={1.5} />
                </div>
                <span className="absolute -top-2 -right-2 text-xs font-mono text-primary/60">
                  {step.step}
                </span>
              </div>
              <h3 className="text-xl font-light mb-2">{step.title}</h3>
              <p className="text-muted-foreground font-light text-sm leading-relaxed max-w-xs mx-auto">
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
