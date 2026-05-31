'use client'

import { useEffect, useState, useRef } from 'react'
import { motion, useInView } from 'framer-motion'

type StatItem = {
  value: number
  suffix: string
  label: string
  isText?: boolean
}

function AnimatedCounter({ value, suffix, label, inView, isText }: StatItem & { inView: boolean }) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (!inView || isText) return

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
  }, [inView, value, isText])

  const display = isText ? `${value}${suffix}` : `${count.toLocaleString()}${suffix}`

  return (
    <div className="text-center">
      <div className="font-display text-5xl md:text-6xl tracking-wide text-foreground">{display}</div>
      <div className="mt-2 text-xs uppercase tracking-[0.25em] text-muted-foreground">{label}</div>
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

  const streamNum = parseInt(streamCount.replace(/[^0-9]/g, '')) || 2
  const streamSuffix = streamCount.replace(/[0-9]/g, '') || 'M+'

  const stats: StatItem[] = [
    { value: artistCount, suffix: '+', label: 'Sanatçı' },
    { value: countryCount, suffix: '+', label: 'Ülke' },
    { value: streamNum, suffix: streamSuffix, label: 'Dinlenme', isText: true },
  ]

  return (
    <section ref={ref} className="py-28 px-6 border-y border-border">
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
