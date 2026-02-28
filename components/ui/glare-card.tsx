"use client"

import React, { useRef, useState } from "react"
import { cn } from "@/lib/utils"

interface GlareCardProps {
  children: React.ReactNode
  className?: string
  onMouseMove?: (e: React.MouseEvent<HTMLDivElement>) => void
  onMouseLeave?: () => void
}

export const GlareCard = React.forwardRef<HTMLDivElement, GlareCardProps>(
  ({ children, className, onMouseMove, onMouseLeave }, ref) => {
    const divRef = useRef<HTMLDivElement>(null)
    const [position, setPosition] = useState({ x: 0, y: 0 })
    const [opacity, setOpacity] = useState(0)

    // Use forwarded ref or internal ref
    const cardRef = (ref as React.RefObject<HTMLDivElement>) || divRef

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
      if (!cardRef.current) return

      const div = cardRef.current
      const rect = div.getBoundingClientRect()

      setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top })
      setOpacity(1)

      // Call external onMouseMove if provided
      if (onMouseMove) {
        onMouseMove(e)
      }
    }

    const handleMouseLeave = () => {
      setOpacity(0)
      if (onMouseLeave) {
        onMouseLeave()
      }
    }

    return (
      <div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className={cn(
          "relative rounded-3xl border border-border/50 bg-card overflow-hidden group",
          className
        )}
      >
        {/* Glare effect */}
        <div
          className="pointer-events-none absolute -inset-px opacity-0 transition-opacity duration-500"
          style={{
            opacity,
            background: `radial-gradient(600px circle at ${position.x}px ${position.y}px, rgba(255, 255, 255, 0.1), transparent 40%)`,
          }}
        />
        {children}
      </div>
    )
  }
)

GlareCard.displayName = "GlareCard"
