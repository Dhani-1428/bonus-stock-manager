"use client"

import { UserPlus, Package, ScanBarcode, TrendingUp } from "lucide-react"
import { CardSpotlight } from "@/components/ui/card-spotlight"

const steps = [
  {
    icon: UserPlus,
    step: "01",
    title: "Create Your Account",
    description: "Sign up in seconds. Set up your shop profile and invite your staff members.",
  },
  {
    icon: Package,
    step: "02",
    title: "Add Your Products",
    description: "Import your inventory or add products manually with barcode, pricing, and stock details.",
  },
  {
    icon: ScanBarcode,
    step: "03",
    title: "Scan & Sell",
    description: "Use barcode scanning to quickly find products, process sales, and update stock automatically.",
  },
  {
    icon: TrendingUp,
    step: "04",
    title: "Track & Grow",
    description: "Monitor sales trends, identify top sellers, and make data-driven decisions to grow your business.",
  },
]

export function HowItWorksSection() {
  return (
    <section id="how-it-works" className="relative py-24 lg:py-32 scroll-mt-24">
      <div className="absolute inset-0">
        <div className="absolute top-1/2 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
      </div>

      <div className="relative max-w-6xl mx-auto px-6">
        {/* Section heading */}
        <div className="text-center mb-16">
          <p className="text-sm font-semibold text-primary uppercase tracking-wider mb-3">
            How It Works
          </p>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground text-balance mb-4">
            Up and Running in Minutes
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground max-w-xl mx-auto text-pretty leading-relaxed">
            Four simple steps to transform how you manage your shop inventory.
          </p>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 perspective-3d">
          {steps.map((step, i) => {
            const Icon = step.icon
            return (
              <div key={step.step} className="relative">
                {/* Connector line */}
                {i < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-10 left-[60%] w-[calc(100%-20%)] h-px border-t border-dashed border-border z-0" />
                )}
                <CardSpotlight className="text-center group">
                  <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-primary/10 mb-5 group-hover:bg-primary/20 transition-colors relative z-20">
                    <Icon className="w-8 h-8 text-primary" />
                  </div>

                  <div className="text-xs font-bold text-primary mb-2 relative z-20">
                    {step.step}
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2 relative z-20">
                    {step.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed max-w-xs mx-auto relative z-20">
                    {step.description}
                  </p>
                </CardSpotlight>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
