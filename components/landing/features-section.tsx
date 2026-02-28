"use client"

import { useRef } from "react"
import { motion, useInView } from "framer-motion"
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
import { GlareCard } from "@/components/ui/glare-card"

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

function FeatureCard({ feature, index }: { feature: typeof features[0]; index: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const cardRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })
  const Icon = feature.icon

  const handleCard3D = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return
    const card = cardRef.current
    const rect = card.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    const centerX = rect.width / 2
    const centerY = rect.height / 2

    const rotateX = (y - centerY) / 30
    const rotateY = (centerX - x) / 30

    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(10px)`
  }

  const resetCard3D = () => {
    if (!cardRef.current) return
    cardRef.current.style.transform = "perspective(1000px) rotateX(0) rotateY(0) translateZ(0)"
  }

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50, rotateX: 10 }}
      animate={isInView ? { opacity: 1, y: 0, rotateX: 0 } : { opacity: 0, y: 50, rotateX: 10 }}
      transition={{
        duration: 0.6,
        delay: index * 0.1,
        ease: [0.21, 1.11, 0.81, 0.99],
      }}
      className="h-full m-2 sm:m-3"
      style={{ perspective: 1000 }}
    >
      <GlareCard 
        ref={cardRef}
        className="group h-full hover:neon-glow cursor-default transition-all duration-300 transform-3d"
        style={{ transformStyle: "preserve-3d" }}
        onMouseMove={handleCard3D}
        onMouseLeave={resetCard3D}
      >
        <div className="relative z-20 p-6 sm:p-8 lg:p-10">
          {/* Icon with gradient background */}
          <motion.div
            className={`w-14 h-14 sm:w-16 sm:h-16 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-5 sm:mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg`}
            whileHover={{ rotate: 360 }}
            transition={{ duration: 0.5 }}
          >
            <Icon className="w-7 h-7 sm:w-8 sm:h-8 text-white" />
          </motion.div>

          {/* Title */}
          <h3 className="text-lg sm:text-xl font-bold text-foreground mb-3 sm:mb-4 group-hover:text-primary transition-colors">
            {feature.title}
          </h3>

          {/* Description */}
          <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
            {feature.description}
          </p>
        </div>
      </GlareCard>
    </motion.div>
  )
}

export function FeaturesSection() {
  return (
    <section
      id="features"
      className="relative py-24 lg:py-32 scroll-mt-24"
    >
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

        {/* Features grid - Responsive card layout with scroll animations */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {features.map((feature, i) => (
            <FeatureCard key={feature.title} feature={feature} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}
