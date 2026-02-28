"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import {
  BarChart3,
  Package,
  ScanBarcode,
  TrendingUp,
  ArrowRight,
  Smartphone,
  Headphones,
  Battery,
  Shield,
  Zap,
} from "lucide-react"

const floatingIcons = [
  { icon: Smartphone, delay: 0, x: "10%", y: "20%" },
  { icon: Headphones, delay: 0.5, x: "85%", y: "15%" },
  { icon: Battery, delay: 1, x: "75%", y: "70%" },
  { icon: Shield, delay: 1.5, x: "15%", y: "75%" },
  { icon: Zap, delay: 2, x: "90%", y: "45%" },
]

export function HeroSection() {
  const [mounted, setMounted] = useState(false)
  const badgeRef = useRef<HTMLDivElement>(null)
  const button1Ref = useRef<HTMLAnchorElement>(null)
  const button2Ref = useRef<HTMLAnchorElement>(null)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return

    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e
      const { innerWidth, innerHeight } = window

      const xPos = (clientX / innerWidth - 0.5) * 20
      const yPos = (clientY / innerHeight - 0.5) * 20

      if (badgeRef.current) {
        badgeRef.current.style.transform = `translateY(0) rotateX(${-yPos * 0.5}deg) rotateY(${xPos * 0.5}deg)`
      }
      if (button1Ref.current) {
        button1Ref.current.style.transform = `translateY(0) rotateX(${-yPos * 0.3}deg) rotateY(${xPos * 0.3}deg) scale(1.02)`
      }
      if (button2Ref.current) {
        button2Ref.current.style.transform = `translateY(0) rotateX(${-yPos * 0.3}deg) rotateY(${xPos * 0.3}deg) scale(1.02)`
      }
    }

    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [mounted])

  return (
    <section id="about" className="relative min-h-screen flex items-center justify-center overflow-hidden pt-24 scroll-mt-24">
      {/* Background effects */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-primary/8 rounded-full blur-3xl" />
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
      </div>

      {/* Floating icons with 3D effect */}
      {mounted &&
        floatingIcons.map((item, i) => {
          const Icon = item.icon
          return (
            <div
              key={i}
              className="absolute hidden lg:block opacity-10 float-3d transform-3d"
              style={{
                left: item.x,
                top: item.y,
                animationDelay: `${item.delay}s`,
                transformStyle: "preserve-3d",
              }}
            >
              <Icon className="w-8 h-8 text-primary" style={{ transform: "translateZ(20px)" }} />
            </div>
          )
        })}

      <div className="relative z-10 max-w-6xl mx-auto px-6 py-24 text-center">
        {/* Badge */}
        <div
          ref={badgeRef}
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-8 transition-all duration-700 transform-3d ${
            mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
          style={{ transformStyle: "preserve-3d" }}
        >
          <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
          <span className="text-xs font-medium text-muted-foreground">
            Trusted by 500+ Mobile Shops
          </span>
        </div>

        {/* Main heading */}
        <h1
          className={`text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-balance leading-[1.1] mb-6 transition-all duration-700 delay-100 ${
            mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          <span className="text-foreground">Smart Inventory</span>
          <br />
          <span className="text-primary neon-text">for Smart Shops</span>
        </h1>

        {/* Subtitle */}
        <p
          className={`text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 text-pretty leading-relaxed transition-all duration-700 delay-200 ${
            mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          Manage your mobile phone shop inventory with barcode scanning,
          real-time stock tracking, sales analytics, and smart low-stock alerts.
          All in one powerful platform.
        </p>

        {/* CTA buttons */}
        <div
          className={`flex flex-col sm:flex-row items-center justify-center gap-4 mb-16 transition-all duration-700 delay-300 ${
            mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          <Link
            ref={button1Ref}
            href="/signup"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:brightness-110 transition-all neon-glow transform-3d"
            style={{ transformStyle: "preserve-3d" }}
          >
            <span style={{ transform: "translateZ(10px)" }}>Get Started Free</span>
            <ArrowRight className="w-4 h-4" style={{ transform: "translateZ(10px)" }} />
          </Link>
          <Link
            ref={button2Ref}
            href="/login"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl glass text-foreground font-medium text-sm hover:bg-secondary/60 transition-all transform-3d"
            style={{ transformStyle: "preserve-3d" }}
          >
            <span style={{ transform: "translateZ(10px)" }}>Sign In</span>
          </Link>
        </div>

        {/* Stats bar */}
        <div
          className={`flex flex-wrap items-center justify-center gap-8 md:gap-16 transition-all duration-700 delay-500 ${
            mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          {[
            { icon: Package, value: "50K+", label: "Products Tracked" },
            { icon: ScanBarcode, value: "1M+", label: "Scans Processed" },
            { icon: BarChart3, value: "99.9%", label: "Uptime" },
            { icon: TrendingUp, value: "35%", label: "Revenue Boost" },
          ].map((stat) => {
            const Icon = stat.icon
            return (
              <div key={stat.label} className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Icon className="w-5 h-5 text-primary" />
                </div>
                <div className="text-left">
                  <p className="text-lg font-bold text-foreground">{stat.value}</p>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                </div>
              </div>
            )
          })}
        </div>
      </div>

    </section>
  )
}
