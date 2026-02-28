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
  Users,
  ShoppingCart,
  Wrench,
  TrendingUp,
  QrCode,
  Receipt,
  CreditCard,
  Database,
  Download,
  AlertTriangle,
  Calendar,
  Settings,
} from "lucide-react"
import { CardSpotlight } from "@/components/ui/card-spotlight"

const features = [
  {
    icon: ScanBarcode,
    title: "Barcode Scanning",
    description: "Instantly scan product barcodes using your device camera. Check stock, update inventory, or process sales with a single scan.",
    color: "from-blue-500 to-cyan-500",
  },
  {
    icon: QrCode,
    title: "QR Code Generation",
    description: "Generate QR codes for products with embedded product information. Perfect for quick product lookup and inventory tracking.",
    color: "from-purple-500 to-pink-500",
  },
  {
    icon: Package,
    title: "Inventory Management",
    description: "Complete product CRUD operations. Organize by categories, track variants (color, storage, RAM), and manage stock levels efficiently.",
    color: "from-green-500 to-emerald-500",
  },
  {
    icon: ShoppingCart,
    title: "POS System",
    description: "Fast billing interface with product search, barcode scanning, discount/tax calculation, and multiple payment modes (Cash, UPI, Card).",
    color: "from-orange-500 to-red-500",
  },
  {
    icon: Receipt,
    title: "Invoice Generation",
    description: "Generate professional PDF invoices instantly. Download or print invoices with complete transaction details and customer information.",
    color: "from-indigo-500 to-blue-500",
  },
  {
    icon: Users,
    title: "Customer Management",
    description: "Store customer details, track purchase history, manage warranties, and build long-term customer relationships.",
    color: "from-teal-500 to-cyan-500",
  },
  {
    icon: Database,
    title: "Suppliers & Purchases",
    description: "Manage supplier information, track purchase orders, monitor supplier dues, and automatically update stock on purchase entry.",
    color: "from-amber-500 to-yellow-500",
  },
  {
    icon: Wrench,
    title: "Service & Repairs",
    description: "Create job cards for device repairs, track repair status, manage warranty claims, and estimate costs for service jobs.",
    color: "from-violet-500 to-purple-500",
  },
  {
    icon: BarChart3,
    title: "Sales Analytics",
    description: "Detailed daily, weekly, and monthly sales reports with visual charts. Track revenue, profit margins, and top-selling products.",
    color: "from-rose-500 to-pink-500",
  },
  {
    icon: TrendingUp,
    title: "Profit & Loss Reports",
    description: "Comprehensive financial reports showing profit margins, expenses, and revenue trends. Export to CSV or PDF for accounting.",
    color: "from-emerald-500 to-green-500",
  },
  {
    icon: AlertTriangle,
    title: "Low Stock Alerts",
    description: "Get notified when stock runs low. Set custom minimum thresholds per product so you never miss a restock opportunity.",
    color: "from-red-500 to-orange-500",
  },
  {
    icon: Calendar,
    title: "Expiry Date Tracking",
    description: "Track expiry dates for accessories and perishable items. Get alerts before products expire to minimize waste.",
    color: "from-sky-500 to-blue-500",
  },
  {
    icon: ShieldCheck,
    title: "Role-Based Access",
    description: "Admin and staff roles with different permission levels. Owners manage everything; staff handle day-to-day sales operations.",
    color: "from-lime-500 to-green-500",
  },
  {
    icon: Smartphone,
    title: "Mobile First Design",
    description: "Designed for use on phones and tablets at the shop counter. Fast, responsive, and optimized for touch interactions.",
    color: "from-fuchsia-500 to-pink-500",
  },
  {
    icon: Cloud,
    title: "Cloud Sync Ready",
    description: "Architecture ready for cloud synchronization. Access your inventory from any device, anywhere, with secure data backup.",
    color: "from-cyan-500 to-blue-500",
  },
  {
    icon: Download,
    title: "Data Export",
    description: "Export your inventory and sales data to PDF or CSV. Generate professional reports for accounting, tax filing, and analysis.",
    color: "from-slate-500 to-gray-500",
  },
  {
    icon: CreditCard,
    title: "Multiple Payment Modes",
    description: "Support for Cash, UPI, Credit/Debit Cards, and other payment methods. Track payment status and manage returns/refunds.",
    color: "from-blue-600 to-indigo-600",
  },
  {
    icon: Settings,
    title: "IMEI/Serial Tracking",
    description: "Track IMEI and serial numbers for mobile phones. Perfect for warranty management and device identification.",
    color: "from-gray-600 to-slate-600",
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
      <div className="max-w-7xl mx-auto px-6">
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

        {/* Features grid - Responsive card layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {features.map((feature, i) => {
            const Icon = feature.icon
            return (
              <div
                key={feature.title}
                ref={(el) => {
                  cardsRef.current[i] = el
                }}
                data-index={i}
                className={`transition-all duration-500 ${
                  visibleCards.has(i)
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-8"
                }`}
                style={{ transitionDelay: `${i * 50}ms` }}
              >
                <CardSpotlight
                  className="group h-full hover:neon-glow cursor-default transition-all duration-300"
                >
                  <div className="relative z-20">
                    {/* Icon with gradient background */}
                    <div 
                      className={`w-14 h-14 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg`}
                    >
                      <Icon className="w-7 h-7 text-white" />
                    </div>
                    
                    {/* Title */}
                    <h3 className="text-lg font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
                      {feature.title}
                    </h3>
                    
                    {/* Description */}
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </CardSpotlight>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
