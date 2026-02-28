"use client"

import Link from "next/link"
import { Check } from "lucide-react"
import { CardSpotlight } from "@/components/ui/card-spotlight"

const handleCard3D = (e: React.MouseEvent<HTMLDivElement>, card: HTMLDivElement) => {
  const rect = card.getBoundingClientRect()
  const x = e.clientX - rect.left
  const y = e.clientY - rect.top

  const centerX = rect.width / 2
  const centerY = rect.height / 2

  const rotateX = (y - centerY) / 12
  const rotateY = (centerX - x) / 12

  card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(20px) scale(1.02)`
}

const resetCard3D = (card: HTMLDivElement) => {
  card.style.transform = "perspective(1000px) rotateX(0) rotateY(0) translateZ(0) scale(1)"
}

const plans = [
  {
    name: "Starter",
    price: "Free",
    period: "forever",
    description: "Perfect for small shops just getting started",
    features: [
      "Up to 100 products",
      "Basic barcode scanning",
      "Daily sales summary",
      "1 staff account",
      "Email support",
    ],
    cta: "Start Free",
    featured: false,
  },
  {
    name: "Professional",
    price: "$29",
    period: "/month",
    description: "For growing shops that need more power",
    features: [
      "Unlimited products",
      "Advanced barcode scanning",
      "Full analytics & reports",
      "5 staff accounts",
      "Cloud sync & backup",
      "Export to PDF & Excel",
      "Priority support",
    ],
    cta: "Start Free Trial",
    featured: true,
  },
  {
    name: "Enterprise",
    price: "$79",
    period: "/month",
    description: "For chains and multi-location shops",
    features: [
      "Everything in Pro",
      "Unlimited staff accounts",
      "Multi-location support",
      "API access",
      "Custom integrations",
      "Dedicated account manager",
      "24/7 phone support",
    ],
    cta: "Contact Sales",
    featured: false,
  },
]

export function PricingSection() {
  return (
    <section id="pricing" className="relative py-24 lg:py-32 scroll-mt-24">
      <div className="max-w-6xl mx-auto px-6">
        {/* Section heading */}
        <div className="text-center mb-16">
          <p className="text-sm font-semibold text-primary uppercase tracking-wider mb-3">
            Pricing
          </p>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground text-balance mb-4">
            Simple, Transparent Pricing
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground max-w-xl mx-auto text-pretty leading-relaxed">
            Start free and scale as your business grows. No hidden fees.
          </p>
        </div>

        {/* Pricing cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 items-start perspective-3d">
          {plans.map((plan) => (
            <CardSpotlight
              key={plan.name}
              className={`relative transition-all ${
                plan.featured
                  ? "neon-glow"
                  : ""
              }`}
            >
              {plan.featured && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-primary text-primary-foreground text-xs font-semibold z-30">
                  Most Popular
                </div>
              )}

              <h3 className="text-lg font-semibold text-foreground mb-1 relative z-20">
                {plan.name}
              </h3>
              <p className="text-sm text-muted-foreground mb-5 relative z-20">
                {plan.description}
              </p>

              <div className="flex items-baseline gap-1 mb-6 relative z-20">
                <span className="text-4xl font-bold text-foreground">{plan.price}</span>
                <span className="text-sm text-muted-foreground">{plan.period}</span>
              </div>

              <Link
                href="/signup"
                className={`block w-full text-center py-3 rounded-xl font-semibold text-sm transition-all mb-8 relative z-20 ${
                  plan.featured
                    ? "bg-primary text-primary-foreground hover:brightness-110 neon-glow"
                    : "glass hover:bg-secondary/60 text-foreground"
                }`}
              >
                {plan.cta}
              </Link>

              <ul className="flex flex-col gap-3 relative z-20">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-primary/15 flex items-center justify-center shrink-0 mt-0.5">
                      <Check className="w-3 h-3 text-primary" />
                    </div>
                    <span className="text-sm text-muted-foreground">{feature}</span>
                  </li>
                ))}
              </ul>
            </CardSpotlight>
          ))}
        </div>
      </div>
    </section>
  )
}
