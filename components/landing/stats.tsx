'use client'

import { useEffect, useState, useRef } from 'react'
import { motion, useInView } from 'framer-motion'

type StatItem = {
  value: number
  suffix: string
  label: string
}

function AnimatedCounter({ value, suffix, label, inView }: StatItem & { inView: boolean }) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (!inView) return

    const duration = 2000
    const steps = 60
    const stepValue = value / steps
    let current = 0

    const timer = setInterval(() => {
      current += stepValue
      if (current >= value) {
        setCount(value)
        clearInterval(timer)
      } else {
        setCount(Math.floor(current))
      }
    }, duration / steps)

    return () => clearInterval(timer)
  }, [inView, value])

  return (
    <div className="text-center">
      <div className="text-4xl md:text-5xl font-extralight tracking-tight text-foreground">
        {count.toLocaleString()}{suffix}
      </div>
      <div className="mt-2 text-sm text-muted-foreground font-light">{label}</div>
    </div>
  )
}

type StatsProps = {
  artistCount: number
  countryCount: number
  streamCount: string
}

export function Stats({ artistCount, countryCount, streamCount }: StatsProps) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-100px' })

  const stats: StatItem[] = [
    { value: artistCount, suffix: '+', label: 'Sanatçı' },
    { value: countryCount, suffix: '+', label: 'Ülke' },
    { value: parseInt(streamCount.replace(/[^0-9]/g, '')) || 10, suffix: 'M+', label: 'Dinlenme' },
  ]

  return (
    <section ref={ref} className="py-32 px-6 border-y border-border/30">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="grid grid-cols-3 gap-8"
        >
          {stats.map((stat) => (
            <AnimatedCounter key={stat.label} {...stat} inView={inView} />
          ))}
        </motion.div>
      </div>
    </section>
  )
}
