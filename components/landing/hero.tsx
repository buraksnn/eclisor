'use client'

import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'

export function Hero() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)

    const stars: { x: number; y: number; size: number; opacity: number }[] = []
    for (let i = 0; i < 120; i++) {
      stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 1.5 + 0.3,
        opacity: Math.random(),
      })
    }

    let animationId: number
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      stars.forEach((star) => {
        star.opacity += (Math.random() - 0.5) * 0.02
        star.opacity = Math.max(0.05, Math.min(0.9, star.opacity))

        ctx.beginPath()
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(255, 255, 255, ${star.opacity * 0.5})`
        ctx.fill()
      })

      animationId = requestAnimationFrame(animate)
    }
    animate()

    return () => {
      window.removeEventListener('resize', resizeCanvas)
      cancelAnimationFrame(animationId)
    }
  }, [])

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 aurora-bg opacity-50" />
      <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none" />
      <div className="absolute inset-0 grain pointer-events-none" />

      <div className="relative z-10 text-center px-6 max-w-5xl mx-auto">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="section-tag mb-6"
        >
          Müzik Dağıtım Ajansı
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.15 }}
          className="text-[clamp(3.5rem,12vw,8rem)] leading-[0.9] font-display text-foreground"
        >
          <span className="block">Sesin.</span>
          <span className="block text-rap-outline mt-1">Senin Evrenin.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.35 }}
          className="mt-8 text-base md:text-lg text-muted-foreground max-w-xl mx-auto leading-relaxed"
        >
          Müziğini dünya çapında dağıtıyor, doğru fırsatlarla buluşturuyoruz. Bağımsız sanatçılar için
          şeffaf royalty, küresel erişim ve yaratıcı destek.
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.55 }}
          className="mt-14 flex flex-wrap items-center justify-center gap-6 text-xs uppercase tracking-[0.25em] text-muted-foreground"
        >
          <span>150+ platform</span>
          <span className="text-accent">•</span>
          <span>12+ ülke</span>
          <span className="text-accent">•</span>
          <span>50+ sanatçı</span>
        </motion.div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-background to-transparent" />
    </section>
  )
}
