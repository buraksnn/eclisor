import { LucideIcon } from 'lucide-react'

type StatsCardProps = {
  title: string
  value: number | string
  icon: LucideIcon
  trend?: string
}

export function StatsCard({ title, value, icon: Icon, trend }: StatsCardProps) {
  return (
    <div className="glass-card rounded-xl p-6 border border-border/80">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-muted-foreground font-semibold">{title}</p>
          <p className="text-3xl font-semibold mt-2">{value}</p>
          {trend && (
            <p className="text-xs text-primary mt-2">{trend}</p>
          )}
        </div>
        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
          <Icon className="h-5 w-5 text-primary" strokeWidth={1.5} />
        </div>
      </div>
    </div>
  )
}
