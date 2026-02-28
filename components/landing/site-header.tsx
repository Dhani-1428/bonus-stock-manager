"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { Package, Menu, X, Globe } from "lucide-react"
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion"

const navLinks = [
  { href: "#about", label: "About" },
  { href: "#features", label: "Features" },
  { href: "#pricing", label: "Pricing" },
  { href: "#testimonials", label: "Testimonials" },
  { href: "#faq", label: "FAQ" },
  { href: "#contact", label: "Contact" },
]

function NavItem({ link, mouseX, onNavClick }: { link: typeof navLinks[0]; mouseX: ReturnType<typeof useMotionValue<number>>; onNavClick: (e: React.MouseEvent<HTMLAnchorElement>, href: string) => void }) {
  const [isHovered, setIsHovered] = useState(false)
  const ref = useRef<HTMLAnchorElement>(null)

  const springConfig = { stiffness: 500, damping: 30 }
  const scale = useSpring(1, springConfig)
  const rotate = useSpring(0, springConfig)

  const distance = useTransform(mouseX, (val) => {
    const bounds = ref.current?.getBoundingClientRect() ?? { x: 0, width: 0 }
    return val - bounds.x - bounds.width / 2
  })

  const widthSync = useTransform(distance, [-150, 0, 150], [1, 1.1, 1])
  const width = useSpring(widthSync, springConfig)

  useEffect(() => {
    if (isHovered) {
      scale.set(1.1)
      rotate.set(2)
    } else {
      scale.set(1)
      rotate.set(0)
    }
  }, [isHovered, scale, rotate])

  return (
    <motion.a
      ref={ref}
      href={link.href}
      onClick={(e) => onNavClick(e, link.href)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{ scale, rotate, width }}
      className="relative text-sm text-muted-foreground hover:text-foreground transition-colors cursor-pointer px-3 py-2 rounded-lg hover:bg-secondary/30 flex items-center justify-center"
    >
      <motion.span style={{ scale }}>{link.label}</motion.span>
      {isHovered && (
        <motion.div
          initial={{ opacity: 0, y: 10, x: "-50%" }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          className="absolute -top-10 left-1/2 -translate-x-1/2 whitespace-pre rounded-lg border border-border bg-popover px-2.5 py-1 text-xs font-medium text-popover-foreground shadow-lg backdrop-blur-sm z-50"
        >
          {link.label}
        </motion.div>
      )}
    </motion.a>
  )
}

export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const mouseX = useMotionValue(Infinity)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault()
    const element = document.querySelector(href)
    if (element) {
      const headerOffset = 100
      const elementPosition = element.getBoundingClientRect().top
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      })
    }
    setMobileOpen(false)
  }

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "py-3"
          : "py-5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6">
        <nav 
          className="bg-card/80 backdrop-blur-xl border border-border/50 rounded-2xl px-6 py-4 flex items-center justify-between transform-3d"
          style={{ transformStyle: "preserve-3d" }}
          onMouseMove={(e) => {
            const nav = e.currentTarget
            const rect = nav.getBoundingClientRect()
            const x = e.clientX - rect.left
            const y = e.clientY - rect.top
            const centerX = rect.width / 2
            const centerY = rect.height / 2
            const rotateX = (y - centerY) / 30
            const rotateY = (centerX - x) / 30
            nav.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(5px)`
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "perspective(1000px) rotateX(0) rotateY(0) translateZ(0)"
          }}
        >
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-primary/15 flex items-center justify-center">
              <Package className="w-5 h-5 text-primary" />
            </div>
            <span className="text-lg font-bold text-foreground">
              Stock<span className="text-primary">Pulse</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <nav 
            className="hidden lg:flex items-center gap-2"
            onMouseMove={(e) => mouseX.set(e.clientX)}
            onMouseLeave={() => mouseX.set(Infinity)}
          >
            {navLinks.map((link) => (
              <NavItem key={link.href} link={link} mouseX={mouseX} onNavClick={handleNavClick} />
            ))}
          </nav>

          {/* Right side: Language, Log In, Sign Up */}
          <div className="hidden lg:flex items-center gap-6">
            {/* Language Selector */}
            <div className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors cursor-pointer">
              <Globe className="w-4 h-4" />
              <span>English</span>
            </div>

            {/* Log In */}
            <Link
              href="/login"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Log In
            </Link>

            {/* Sign Up Button with Gradient */}
            <Link
              href="/signup"
              className="text-sm font-semibold text-white px-5 py-2.5 rounded-lg transition-all hover:brightness-110 bg-gradient-to-b from-blue-500 to-purple-600"
            >
              Sign Up
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden p-2 text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </nav>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="lg:hidden mt-2 mx-6 bg-card/80 backdrop-blur-xl border border-border/50 rounded-2xl p-5 flex flex-col gap-4">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={(e) => handleNavClick(e, link.href)}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors py-2 cursor-pointer"
            >
              {link.label}
            </a>
          ))}
          <div className="border-t border-border/50 pt-4 flex flex-col gap-3">
            <div className="flex items-center gap-2 text-sm text-muted-foreground py-2">
              <Globe className="w-4 h-4" />
              <span>English</span>
            </div>
            <Link
              href="/login"
              onClick={() => setMobileOpen(false)}
              className="text-sm font-medium text-center text-muted-foreground hover:text-foreground transition-colors py-2.5"
            >
              Log In
            </Link>
            <Link
              href="/signup"
              onClick={() => setMobileOpen(false)}
              className="text-sm font-semibold text-center text-white px-5 py-2.5 rounded-lg hover:brightness-110 transition-all bg-gradient-to-b from-blue-500 to-purple-600"
            >
              Sign Up
            </Link>
          </div>
        </div>
      )}
    </header>
  )
}
