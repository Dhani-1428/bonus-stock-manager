"use client"

import { useRef } from "react"
import Link from "next/link"
import { Check } from "lucide-react"
import { GlareCard } from "@/components/ui/glare-card"

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
          {plans.map((plan) => {
            const cardRef = useRef<HTMLDivElement>(null)

            const handleCard3D = (e: React.MouseEvent<HTMLDivElement>) => {
              if (!cardRef.current) return
              const card = cardRef.current
              const rect = card.getBoundingClientRect()
              const x = e.clientX - rect.left
              const y = e.clientY - rect.top

              const centerX = rect.width / 2
              const centerY = rect.height / 2

              const rotateX = (y - centerY) / 12
              const rotateY = (centerX - x) / 12

              card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(20px) scale(1.02)`
            }

            const resetCard3D = () => {
              if (!cardRef.current) return
              cardRef.current.style.transform = "perspective(1000px) rotateX(0) rotateY(0) translateZ(0) scale(1)"
            }

            return (
              <div className="relative">
                {plan.featured && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-primary text-primary-foreground text-xs font-semibold z-30 shadow-lg">
                    Most Popular
                  </div>
                )}
                <GlareCard
                  key={plan.name}
                  ref={cardRef}
                  className={`relative transition-all h-full transform-3d ${
                    plan.featured
                      ? "neon-glow border-primary/50"
                      : ""
                  }`}
                  style={{ transformStyle: "preserve-3d" }}
                  onMouseMove={handleCard3D}
                  onMouseLeave={resetCard3D}
                >
                  <div className={`relative z-20 flex flex-col h-full ${plan.featured ? "pt-8" : ""} p-6 sm:p-8 lg:p-10`}>

                  <h3 className="text-xl sm:text-2xl font-bold text-foreground mb-2">
                    {plan.name}
                  </h3>
                  <p className="text-sm sm:text-base text-muted-foreground mb-6">
                    {plan.description}
                  </p>

                  <div className="flex items-baseline gap-1 mb-6">
                    <span className="text-4xl sm:text-5xl font-bold text-foreground">{plan.price}</span>
                    <span className="text-sm sm:text-base text-muted-foreground">{plan.period}</span>
                  </div>

                  <Link
                    href="/signup"
                    className={`block w-full text-center py-3.5 rounded-xl font-semibold text-sm sm:text-base transition-all mb-8 ${
                      plan.featured
                        ? "bg-primary text-primary-foreground hover:brightness-110 neon-glow"
                        : "glass hover:bg-secondary/60 text-foreground"
                    }`}
                  >
                    {plan.cta}
                  </Link>

                  <ul className="flex flex-col gap-3.5 flex-grow">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-3">
                        <div className="w-5 h-5 rounded-full bg-primary/15 flex items-center justify-center shrink-0 mt-0.5">
                          <Check className="w-3 h-3 text-primary" />
                        </div>
                        <span className="text-sm sm:text-base text-muted-foreground leading-relaxed">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  </div>
                </GlareCard>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
