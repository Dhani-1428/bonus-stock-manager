"use client"

import { useEffect } from "react"
import { useApp } from "@/lib/app-context"
import { Box } from "lucide-react"

export function SplashScreen() {
  const { navigate } = useApp()

  useEffect(() => {
    const timer = setTimeout(() => navigate("login"), 2500)
    return () => clearTimeout(timer)
  }, [navigate])

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background relative overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full bg-neon/10 blur-[100px] animate-pulse" />
        <div className="absolute bottom-1/4 left-1/3 w-48 h-48 rounded-full bg-chart-2/10 blur-[80px] animate-pulse delay-500" />
      </div>

      {/* Logo */}
      <div className="relative z-10 flex flex-col items-center gap-6">
        <div className="relative">
          <div className="w-24 h-24 rounded-2xl bg-primary/10 flex items-center justify-center neon-glow animate-[spin_4s_linear_infinite]">
            <Box className="w-12 h-12 text-primary" />
          </div>
          <div className="absolute inset-0 w-24 h-24 rounded-2xl bg-primary/5 animate-ping" />
        </div>

        <div className="flex flex-col items-center gap-2">
          <h1 className="text-3xl font-bold text-foreground tracking-tight">
            Stock<span className="text-primary neon-text">Pulse</span>
          </h1>
          <p className="text-sm text-muted-foreground">Inventory Management</p>
        </div>

        {/* Loading bar */}
        <div className="w-48 h-1 rounded-full bg-secondary overflow-hidden mt-8">
          <div
            className="h-full rounded-full bg-primary neon-glow"
            style={{
              animation: "loadBar 2s ease-in-out forwards",
            }}
          />
        </div>
      </div>

      <style jsx>{`
        @keyframes loadBar {
          0% { width: 0%; }
          100% { width: 100%; }
        }
      `}</style>
    </div>
  )
}
