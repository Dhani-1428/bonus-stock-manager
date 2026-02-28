"use client"

import { useApp, type Screen } from "@/lib/app-context-clerk"
import { useUser } from "@/lib/app-context-clerk"
import { UserButton } from "@clerk/nextjs"
import { DashboardScreen } from "@/components/screens/dashboard-screen-api"
import { ProductsScreen } from "@/components/screens/products-screen-api"
import { AddProductScreen } from "@/components/screens/add-product-screen-api"
import { ProductDetailsScreen } from "@/components/screens/product-details-screen-api"
import { ScanScreen } from "@/components/screens/scan-screen"
import { SalesScreen } from "@/components/screens/sales-screen-api"
import { POSScreen } from "@/components/screens/pos-screen"
import { ReportsScreen } from "@/components/screens/reports-screen-api"
import { SettingsScreen } from "@/components/screens/settings-screen"
import { BottomNav } from "@/components/bottom-nav"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import {
  LayoutDashboard,
  Package,
  ScanBarcode,
  BarChart3,
  Settings,
  Bell,
} from "lucide-react"
import { useIsMobile } from "@/hooks/use-mobile"
import { Button } from "@/components/ui/button"

const navItems: { screen: Screen; icon: React.ComponentType<{ className?: string }>; label: string }[] = [
  { screen: "dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { screen: "pos", icon: ScanBarcode, label: "POS" },
  { screen: "products", icon: Package, label: "Products" },
  { screen: "sales", icon: BarChart3, label: "Sales" },
  { screen: "reports", icon: BarChart3, label: "Reports" },
  { screen: "settings", icon: Settings, label: "Settings" },
]

export function AppShell() {
  const { screen, navigate, logout, loading } = useApp()
  const { user, isLoaded: userLoaded } = useUser()
  const isMobile = useIsMobile()
  
  const isLoggedIn = userLoaded && !!user

  // Show loading while checking auth
  if (loading || !isLoggedIn) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  const renderScreen = () => {
    switch (screen) {
      case "dashboard":
        return <DashboardScreen />
      case "products":
        return <ProductsScreen />
      case "add-product":
        return <AddProductScreen />
      case "product-details":
        return <ProductDetailsScreen />
      case "scan":
        return <ScanScreen />
      case "pos":
        return <POSScreen />
      case "sales":
        return <SalesScreen />
      case "reports":
        return <ReportsScreen />
      case "settings":
        return <SettingsScreen />
      default:
        return <DashboardScreen />
    }
  }

  // Mobile layout
  if (isMobile) {
    return (
      <div className="min-h-screen bg-background max-w-md mx-auto relative">
        {renderScreen()}
        <BottomNav />
      </div>
    )
  }

  // Desktop layout with sidebar
  return (
    <SidebarProvider defaultOpen={true}>
      <div className="flex min-h-screen w-full bg-background">
        <Sidebar variant="inset" className="border-r border-border">
          <SidebarContent>
            {/* Header */}
            <div className="flex items-center gap-2 px-4 py-4 border-b border-border">
              <div className="w-8 h-8 rounded-lg bg-primary/15 flex items-center justify-center">
                <Package className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1">
                <h2 className="text-sm font-bold text-foreground">StockPulse</h2>
                <p className="text-xs text-muted-foreground">Admin Panel</p>
              </div>
            </div>

            {/* Navigation */}
            <SidebarGroup>
              <SidebarGroupLabel>Navigation</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {navItems.map((item) => {
                    const Icon = item.icon
                    const isActive = screen === item.screen
                    return (
                      <SidebarMenuItem key={item.screen}>
                        <SidebarMenuButton
                          onClick={() => navigate(item.screen)}
                          isActive={isActive}
                          className="w-full"
                        >
                          <Icon className="w-4 h-4" />
                          <span>{item.label}</span>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    )
                  })}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            {/* User Section */}
            <div className="mt-auto px-4 py-4 border-t border-border">
              <div className="flex items-center gap-3">
                <UserButton 
                  appearance={{
                    elements: {
                      avatarBox: "w-8 h-8",
                      userButtonPopoverCard: "bg-background border-border",
                      userButtonPopoverActions: "text-foreground",
                    },
                  }}
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">
                    {user?.firstName && user?.lastName 
                      ? `${user.firstName} ${user.lastName}` 
                      : user?.firstName || user?.username || "User"}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {(user?.publicMetadata?.role as string) || "Staff"}
                  </p>
                </div>
              </div>
            </div>
          </SidebarContent>
        </Sidebar>

        {/* Main Content */}
        <main className="flex-1 flex flex-col min-w-0">
          {/* Top Header */}
          <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-6">
            <SidebarTrigger className="-ml-1" />
            <div className="flex-1" />
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate("settings")}
                className="relative"
              >
                <Bell className="w-5 h-5" />
              </Button>
            </div>
          </header>

          {/* Content Area */}
          <div className="flex-1 overflow-auto">
            <div className="w-full">
              {renderScreen()}
            </div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  )
}
