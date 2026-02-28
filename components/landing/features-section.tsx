"use client"

import { useEffect, useRef, useState } from "react"
import {
  ScanBarcode,
  BarChart3,
  Package,
  Bell,
  ShieldCheck,
  Smartphone,
  Cloud,
  FileSpreadsheet,
} from "lucide-react"
import { CardSpotlight } from "@/components/ui/card-spotlight"

const handleCard3D = (e: React.MouseEvent<HTMLDivElement>, card: HTMLDivElement) => {
  const rect = card.getBoundingClientRect()
  const x = e.clientX - rect.left
  const y = e.clientY - rect.top

  const centerX = rect.width / 2
  const centerY = rect.height / 2

  const rotateX = (y - centerY) / 10
  const rotateY = (centerX - x) / 10

  card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(10px)`
}

const resetCard3D = (card: HTMLDivElement) => {
  card.style.transform = "perspective(1000px) rotateX(0) rotateY(0) translateZ(0)"
}

const features = [
  {
    icon: ScanBarcode,
    title: "Barcode Scanning",
    description:
      "Instantly scan product barcodes to check stock, update inventory, or process sales. Works with any standard barcode format.",
  },
  {
    icon: BarChart3,
    title: "Sales Analytics",
    description:
      "Detailed daily, weekly, and monthly sales reports with visual charts. Track revenue, profit margins, and top-selling products.",
  },
  {
    icon: Package,
    title: "Stock Management",
    description:
      "Add, edit, and organize products by category. Track buy/sell prices, warranty info, supplier details, and more.",
  },
  {
    icon: Bell,
    title: "Smart Alerts",
    description:
      "Get notified when stock runs low. Set custom minimum thresholds per product so you never miss a restock.",
  },
  {
    icon: ShieldCheck,
    title: "Role-Based Access",
    description:
      "Admin and staff roles with different permission levels. Admins manage everything; staff handle day-to-day sales.",
  },
  {
    icon: Smartphone,
    title: "Mobile First",
    description:
      "Designed for use on phones and tablets at the shop counter. Fast, responsive, and works offline when needed.",
  },
  {
    icon: Cloud,
    title: "Cloud Sync",
    description:
      "All your data synced securely to the cloud. Access your inventory from any device, anywhere, anytime.",
  },
  {
    icon: FileSpreadsheet,
    title: "Export & Reports",
    description:
      "Export your inventory and sales data to PDF or Excel. Generate professional reports for accounting and analysis.",
  },
]

export function FeaturesSection() {
  const [visibleCards, setVisibleCards] = useState<Set<number>>(new Set())
  const cardsRef = useRef<(HTMLDivElement | null)[]>([])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = Number(entry.target.getAttribute("data-index"))
            setVisibleCards((prev) => new Set([...prev, index]))
          }
        })
      },
      { threshold: 0.15 }
    )

    cardsRef.current.forEach((el) => {
      if (el) observer.observe(el)
    })

    return () => observer.disconnect()
  }, [])

  return (
    <section id="features" className="relative py-24 lg:py-32 scroll-mt-24">
      <div className="max-w-6xl mx-auto px-6">
        {/* Section heading */}
        <div className="text-center mb-16">
          <p className="text-sm font-semibold text-primary uppercase tracking-wider mb-3">
            Features
          </p>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground text-balance mb-4">
            Everything You Need to Run Your Shop
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto text-pretty leading-relaxed">
            From barcode scanning to detailed analytics, StockPulse gives you the
            complete toolkit to manage inventory like a pro.
          </p>
        </div>

        {/* Features grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 perspective-3d">
          {features.map((feature, i) => {
            const Icon = feature.icon
            return (
              <CardSpotlight
                key={feature.title}
                className={`group transition-all duration-500 hover:neon-glow cursor-default ${
                  visibleCards.has(i)
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-8"
                }`}
                style={{ 
                  transitionDelay: `${i * 80}ms`,
                }}
              >
                <div 
                  className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors relative z-20"
                >
                  <Icon className="w-6 h-6 text-primary" />
                </div>
                <h3 
                  className="text-base font-semibold text-foreground mb-2 relative z-20"
                >
                  {feature.title}
                </h3>
                <p 
                  className="text-sm text-muted-foreground leading-relaxed relative z-20"
                >
                  {feature.description}
                </p>
              </CardSpotlight>
            )
          })}
        </div>
      </div>
    </section>
  )
}
