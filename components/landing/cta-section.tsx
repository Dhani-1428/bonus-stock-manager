"use client"

import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { GlareCard } from "@/components/ui/glare-card"

export function CTASection() {
  return (
    <section className="relative py-24 lg:py-32">
      <div className="max-w-4xl mx-auto px-6 text-center perspective-3d">
        <GlareCard className="p-10 md:p-16 neon-glow relative overflow-hidden">
          {/* Background accent */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-primary/10 rounded-full blur-3xl z-0" />

          <div className="relative z-20">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground text-balance mb-4">
              Ready to Modernize Your Shop?
            </h2>
            <p className="text-base sm:text-lg text-muted-foreground max-w-lg mx-auto mb-8 text-pretty leading-relaxed">
              Join hundreds of mobile shop owners who have already upgraded their
              inventory management with StockPulse.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/signup"
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:brightness-110 transition-all neon-glow"
              >
                Get Started Free
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="#features"
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl text-muted-foreground font-medium text-sm hover:text-foreground transition-colors"
              >
                Learn More
              </Link>
            </div>
          </div>
        </GlareCard>
      </div>
    </section>
  )
}
