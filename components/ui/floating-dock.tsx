"use client"

import React, { useState, useRef, useEffect } from "react"
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion"

export interface DockItem {
  title: string
  icon: React.ReactNode
  href?: string
  onClick?: () => void
}

interface FloatingDockProps {
  items: DockItem[]
  mobileClassName?: string
}

export function FloatingDock({ items, mobileClassName }: FloatingDockProps) {
  const mouseX = useMotionValue(Infinity)

  return (
    <div 
      className={`fixed bottom-0 left-1/2 -translate-x-1/2 z-50 mb-4 ${mobileClassName || ""}`}
      onMouseMove={(e) => mouseX.set(e.clientX)}
      onMouseLeave={() => mouseX.set(Infinity)}
    >
      <motion.div
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: 0.5,
          type: "spring",
          stiffness: 260,
          damping: 20,
        }}
        className="flex h-16 items-end gap-2 rounded-2xl border border-border bg-background/80 backdrop-blur-lg px-3 pb-3 shadow-xl glass"
      >
        {items.map((item, idx) => (
          <DockItem key={item.title} item={item} index={idx} mouseX={mouseX} />
        ))}
      </motion.div>
    </div>
  )
}

function DockItem({ item, index, mouseX }: { item: DockItem; index: number; mouseX: ReturnType<typeof useMotionValue<number>> }) {
  const [isHovered, setIsHovered] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  const springConfig = { stiffness: 500, damping: 30 }
  const scale = useSpring(1, springConfig)
  const rotate = useSpring(0, springConfig)

  const distance = useTransform(mouseX, (val) => {
    const bounds = ref.current?.getBoundingClientRect() ?? { x: 0, width: 0 }
    return val - bounds.x - bounds.width / 2
  })

  const widthSync = useTransform(distance, [-150, 0, 150], [48, 64, 48])
  const width = useSpring(widthSync, springConfig)

  useEffect(() => {
    if (isHovered) {
      scale.set(1.15)
      rotate.set(5)
    } else {
      scale.set(1)
      rotate.set(0)
    }
  }, [isHovered, scale, rotate])

  const handleClick = () => {
    if (item.onClick) {
      item.onClick()
    } else if (item.href) {
      if (item.href.startsWith("#")) {
        // Handle hash links
        const element = document.querySelector(item.href)
        if (element) {
          element.scrollIntoView({ behavior: "smooth" })
        }
      } else {
        window.location.href = item.href
      }
    }
  }

  return (
    <motion.div
      ref={ref}
      data-dock-item={index}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleClick}
      style={{ width, scale, rotate }}
      className="relative flex aspect-square cursor-pointer items-center justify-center rounded-xl bg-secondary/30 transition-colors hover:bg-secondary/60 border border-border/50"
    >
      <motion.div
        style={{ scale }}
        className="flex items-center justify-center"
      >
        {item.icon}
      </motion.div>
      {isHovered && (
        <motion.div
          initial={{ opacity: 0, y: 10, x: "-50%" }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          className="absolute -top-10 left-1/2 -translate-x-1/2 whitespace-pre rounded-lg border border-border bg-popover px-2.5 py-1 text-xs font-medium text-popover-foreground shadow-lg backdrop-blur-sm"
        >
          {item.title}
        </motion.div>
      )}
    </motion.div>
  )
}
