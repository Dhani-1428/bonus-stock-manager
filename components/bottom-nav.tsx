"use client"

import { useApp, type Screen } from "@/lib/app-context-clerk"
import { FloatingDock, type DockItem } from "@/components/ui/floating-dock"
import {
  IconHome,
  IconPackage,
  IconScan,
  IconChartBar,
  IconSettings,
  IconShoppingCart,
} from "@tabler/icons-react"

export function BottomNav() {
  const { screen, navigate } = useApp()

  // Only show on main screens
  const mainScreens: Screen[] = ["dashboard", "products", "scan", "sales", "reports", "settings", "product-details", "add-product", "pos"]
  if (!mainScreens.includes(screen)) return null

  const dockItems: DockItem[] = [
    {
      title: "Dashboard",
      icon: (
        <IconHome className="h-5 w-5 text-foreground" />
      ),
      onClick: () => navigate("dashboard"),
    },
    {
      title: "Products",
      icon: (
        <IconPackage className="h-5 w-5 text-foreground" />
      ),
      onClick: () => navigate("products"),
    },
    {
      title: "POS",
      icon: (
        <IconShoppingCart className="h-5 w-5 text-foreground" />
      ),
      onClick: () => navigate("pos"),
    },
    {
      title: "Scan",
      icon: (
        <IconScan className="h-5 w-5 text-foreground" />
      ),
      onClick: () => navigate("scan"),
    },
    {
      title: "Reports",
      icon: (
        <IconChartBar className="h-5 w-5 text-foreground" />
      ),
      onClick: () => navigate("reports"),
    },
    {
      title: "Settings",
      icon: (
        <IconSettings className="h-5 w-5 text-foreground" />
      ),
      onClick: () => navigate("settings"),
    },
  ]

  return (
    <FloatingDock
      items={dockItems}
      mobileClassName="translate-y-0"
    />
  )
}
