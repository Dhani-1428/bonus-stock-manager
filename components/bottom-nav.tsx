"use client"

import { useApp, type Screen } from "@/lib/app-context"
import { LayoutDashboard, Package, ScanBarcode, BarChart3, Settings } from "lucide-react"

const navItems: { screen: Screen; icon: React.ComponentType<{ className?: string }>; label: string }[] = [
  { screen: "dashboard", icon: LayoutDashboard, label: "Home" },
  { screen: "products", icon: Package, label: "Products" },
  { screen: "scan", icon: ScanBarcode, label: "Scan" },
  { screen: "reports", icon: BarChart3, label: "Reports" },
  { screen: "settings", icon: Settings, label: "Settings" },
]

export function BottomNav() {
  const { screen, navigate } = useApp()

  // Only show on main screens
  const mainScreens: Screen[] = ["dashboard", "products", "scan", "sales", "reports", "settings", "product-details", "add-product"]
  if (!mainScreens.includes(screen)) return null

  return (
    <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md z-40">
      <div className="mx-3 mb-3 glass rounded-2xl px-2 py-2 flex items-center justify-around">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = screen === item.screen
          const isScan = item.screen === "scan"

          if (isScan) {
            return (
              <button
                key={item.screen}
                onClick={() => navigate(item.screen)}
                className="flex flex-col items-center gap-0.5 -mt-6"
              >
                <div
                  className={`w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300 ${
                    isActive
                      ? "bg-primary neon-glow scale-110"
                      : "bg-primary/80 hover:bg-primary"
                  }`}
                >
                  <Icon className="w-6 h-6 text-primary-foreground" />
                </div>
                <span className={`text-[10px] font-medium ${isActive ? "text-primary" : "text-muted-foreground"}`}>
                  {item.label}
                </span>
              </button>
            )
          }

          return (
            <button
              key={item.screen}
              onClick={() => navigate(item.screen)}
              className="flex flex-col items-center gap-0.5 py-1 px-3"
            >
              <div className="relative">
                <Icon
                  className={`w-5 h-5 transition-all duration-300 ${
                    isActive ? "text-primary" : "text-muted-foreground"
                  }`}
                />
                {isActive && (
                  <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-primary" />
                )}
              </div>
              <span
                className={`text-[10px] font-medium transition-colors ${
                  isActive ? "text-primary" : "text-muted-foreground"
                }`}
              >
                {item.label}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
