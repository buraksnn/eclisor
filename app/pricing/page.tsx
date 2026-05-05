import Link from 'next/link'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

const plans = [
  {
    name: 'Starter',
    priceMonthly: '$9',
    priceYearly: '$90',
    description: 'For new artists launching their first releases.',
    features: ['Unlimited uploads', 'Basic royalty splits', 'Global distribution', 'Artist analytics'],
  },
  {
    name: 'Pro',
    priceMonthly: '$19',
    priceYearly: '$190',
    description: 'For growing catalogs and serious promotion.',
    features: ['Everything in Starter', 'YouTube Content ID', 'Priority support', 'Pitching to playlists'],
    highlighted: true,
  },
  {
    name: 'Label',
    priceMonthly: '$49',
    priceYearly: '$490',
    description: 'For labels managing multiple artists.',
    features: ['Multi-artist dashboards', 'Advanced reporting', 'Custom contracts', 'Dedicated manager'],
  },
]

const comparison = [
  { feature: 'Stores & DSPs', starter: '200+', pro: '250+', label: '300+' },
  { feature: 'Royalty Splitter', starter: 'Basic', pro: 'Advanced', label: 'Custom' },
  { feature: 'YouTube Content ID', starter: '—', pro: 'Included', label: 'Included' },
  { feature: 'Priority Support', starter: '—', pro: 'Yes', label: 'Dedicated' },
  { feature: 'Label Suite', starter: '—', pro: '—', label: 'Yes' },
]

export default function PricingPage() {
  return (
    <main className="bg-background text-foreground">
      <Navbar />
      <section className="pt-28 pb-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="max-w-3xl">
            <Badge variant="outline" className="uppercase tracking-[0.2em] text-[0.6rem]">
              Pricing
            </Badge>
            <h1 className="mt-6 text-4xl md:text-6xl font-semibold">
              Transparent plans for every release.
            </h1>
            <p className="mt-4 text-lg text-muted-foreground">
              Switch between monthly and yearly billing to get the best value for your catalog.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg">
                <Link href="/register">Start distributing</Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href="/contact">Talk to us</Link>
              </Button>
            </div>
          </div>

          <div className="mt-12 grid gap-6 lg:grid-cols-3">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`border border-border/80 rounded-xl p-8 flex flex-col gap-6 ${
                  plan.highlighted ? 'bg-foreground text-background' : 'bg-card'
                }`}
              >
                <div>
                  {plan.highlighted ? (
                    <Badge className="bg-background text-foreground">Most Popular</Badge>
                  ) : (
                    <Badge variant="outline">Core Plan</Badge>
                  )}
                  <h3 className="mt-4 text-2xl font-semibold">{plan.name}</h3>
                  <p className={`mt-2 text-sm ${plan.highlighted ? 'text-background/80' : 'text-muted-foreground'}`}>
                    {plan.description}
                  </p>
                </div>
                <div>
                  <div className="flex items-end gap-3">
                    <span className="text-4xl font-semibold">{plan.priceMonthly}</span>
                    <span className={`text-sm ${plan.highlighted ? 'text-background/80' : 'text-muted-foreground'}`}>
                      /month
                    </span>
                  </div>
                  <p className={`text-xs mt-2 ${plan.highlighted ? 'text-background/70' : 'text-muted-foreground'}`}>
                    Or {plan.priceYearly} billed yearly.
                  </p>
                </div>
                <ul className={`space-y-2 text-sm ${plan.highlighted ? 'text-background/90' : 'text-foreground'}`}>
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2">
                      <span className={`h-1.5 w-1.5 rounded-full ${plan.highlighted ? 'bg-background' : 'bg-foreground'}`} />
                      {feature}
                    </li>
                  ))}
                </ul>
                <Button
                  asChild
                  size="lg"
                  variant={plan.highlighted ? 'secondary' : 'default'}
                  className={plan.highlighted ? 'bg-background text-foreground hover:bg-background/90' : ''}
                >
                  <Link href="/register">Choose {plan.name}</Link>
                </Button>
              </div>
            ))}
          </div>

          <div className="mt-16 border border-border/80 rounded-xl overflow-hidden">
            <div className="grid grid-cols-4 gap-0 text-sm">
              <div className="p-4 font-semibold uppercase tracking-[0.2em] text-[0.6rem]">Features</div>
              <div className="p-4 font-semibold uppercase tracking-[0.2em] text-[0.6rem]">Starter</div>
              <div className="p-4 font-semibold uppercase tracking-[0.2em] text-[0.6rem]">Pro</div>
              <div className="p-4 font-semibold uppercase tracking-[0.2em] text-[0.6rem]">Label</div>
              {comparison.map((row) => (
                <div key={row.feature} className="contents">
                  <div className="p-4 border-t border-border/80 text-muted-foreground">{row.feature}</div>
                  <div className="p-4 border-t border-border/80">{row.starter}</div>
                  <div className="p-4 border-t border-border/80">{row.pro}</div>
                  <div className="p-4 border-t border-border/80">{row.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  )
}
