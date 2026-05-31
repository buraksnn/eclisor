import type { ReactNode } from 'react'

type AboutSectionProps = {
  title: string
  children: ReactNode
}

export function AboutSection({ title, children }: AboutSectionProps) {
  return (
    <section className="space-y-4">
      <h2 className="font-display text-2xl tracking-wide">{title}</h2>
      <div className="text-sm text-muted-foreground leading-relaxed space-y-3">{children}</div>
    </section>
  )
}
