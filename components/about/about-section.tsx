import type { ReactNode } from 'react'

type AboutSectionProps = {
  title: string
  children: ReactNode
}

export function AboutSection({ title, children }: AboutSectionProps) {
  return (
    <section className="space-y-4">
      <h2 className="text-2xl font-semibold">{title}</h2>
      <div className="text-sm text-muted-foreground leading-relaxed space-y-3">{children}</div>
    </section>
  )
}
