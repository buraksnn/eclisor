'use client'

import { motion } from 'framer-motion'
import { FileText, Rocket, Search } from 'lucide-react'

const steps = [
  {
    icon: FileText,
    step: '01',
    title: 'Başvuru',
    description: 'Müziğin ve bilgilerinle başvurunu iletirsin; ekibimiz kataloğunu inceler.',
  },
  {
    icon: Search,
    step: '02',
    title: 'Değerlendirme',
    description: 'Potansiyel, kalite ve dağıtım uygunluğu uzman ekibimiz tarafından değerlendirilir.',
  },
  {
    icon: Rocket,
    step: '03',
    title: 'Yayın',
    description: 'Onay sonrası müziğin tüm büyük dijital platformlarda yayına girer.',
  },
]

export function HowItWorks() {
  return (
    <section className="py-28 px-6 relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-accent/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <p className="section-tag">Süreç</p>
          <h2 className="mt-4 text-4xl md:text-6xl font-display">Nasıl Çalışır</h2>
          <p className="mt-4 text-muted-foreground max-w-xl mx-auto leading-relaxed">
            Müziğini dünyaya duyurmak için üç adımlı süreç
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
                <div className="w-20 h-20 rounded-sm glass-card flex items-center justify-center border border-accent/10">
                  <step.icon className="h-8 w-8 text-accent" strokeWidth={1.25} />
                </div>
                <span className="absolute -top-2 -right-2 font-display text-lg text-accent/80">
                  {step.step}
                </span>
              </div>
              <h3 className="font-display text-2xl tracking-wide mb-2">{step.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed max-w-xs mx-auto">
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
