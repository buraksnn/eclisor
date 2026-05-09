import type { ReactNode } from 'react'

type LegalSectionProps = {
  title: string
  children: ReactNode
}

export function LegalSection({ title, children }: LegalSectionProps) {
  return (
    <section className="space-y-3">
      <h2 className="text-xl font-semibold">{title}</h2>
      <div className="text-sm text-muted-foreground leading-relaxed space-y-3">{children}</div>
    </section>
  )
}
