"use client"

import { useState } from "react"
import { useApp } from "@/lib/app-context"
import {
  User,
  Shield,
  Bell,
  Cloud,
  Database,
  Printer,
  HelpCircle,
  LogOut,
  ChevronRight,
  Moon,
  Wifi,
} from "lucide-react"
import { Switch } from "@/components/ui/switch"

interface SettingItem {
  icon: React.ComponentType<{ className?: string }>
  label: string
  description: string
  hasToggle?: boolean
  danger?: boolean
  action?: () => void
}

export function SettingsScreen() {
  const { userName, userRole, logout } = useApp()
  const [notifications, setNotifications] = useState(true)
  const [cloudSync, setCloudSync] = useState(true)
  const [darkMode, setDarkMode] = useState(true)
  const [offlineMode, setOfflineMode] = useState(false)

  const sections: { title: string; items: SettingItem[] }[] = [
    {
      title: "Account",
      items: [
        { icon: User, label: "Profile", description: "Edit your profile information" },
        { icon: Shield, label: "Security", description: "Password & two-factor auth" },
      ],
    },
    {
      title: "Preferences",
      items: [
        { icon: Moon, label: "Dark Mode", description: "Use dark theme", hasToggle: true },
        { icon: Bell, label: "Notifications", description: "Low stock & sale alerts", hasToggle: true },
        { icon: Wifi, label: "Offline Mode", description: "Work without internet", hasToggle: true },
      ],
    },
    {
      title: "Data",
      items: [
        { icon: Cloud, label: "Cloud Sync", description: "Auto-sync with cloud", hasToggle: true },
        { icon: Database, label: "Backup & Restore", description: "Manage your data backups" },
        { icon: Printer, label: "Export Data", description: "Export to PDF or Excel" },
      ],
    },
    {
      title: "Support",
      items: [
        { icon: HelpCircle, label: "Help Center", description: "FAQs & documentation" },
        { icon: LogOut, label: "Sign Out", description: "Log out of your account", danger: true, action: logout },
      ],
    },
  ]

  const getToggleValue = (label: string) => {
    switch (label) {
      case "Dark Mode": return darkMode
      case "Notifications": return notifications
      case "Cloud Sync": return cloudSync
      case "Offline Mode": return offlineMode
      default: return false
    }
  }

  const handleToggle = (label: string) => {
    switch (label) {
      case "Dark Mode": setDarkMode(!darkMode); break
      case "Notifications": setNotifications(!notifications); break
      case "Cloud Sync": setCloudSync(!cloudSync); break
      case "Offline Mode": setOfflineMode(!offlineMode); break
    }
  }

  return (
    <div className="flex flex-col pb-24 page-transition">
      {/* Header */}
      <div className="px-5 pt-6 pb-2">
        <h1 className="text-xl font-bold text-foreground mb-4">Settings</h1>

        {/* Profile Card */}
        <div className="glass rounded-2xl p-4 flex items-center gap-4 mb-4">
          <div className="w-14 h-14 rounded-full bg-primary/15 flex items-center justify-center neon-glow">
            <span className="text-lg font-bold text-primary">
              {(userName || "A").charAt(0).toUpperCase()}
            </span>
          </div>
          <div className="flex-1">
            <p className="text-base font-semibold text-foreground">{userName || "Admin User"}</p>
            <p className="text-xs text-muted-foreground capitalize">{userRole} Account</p>
          </div>
          <div className="px-3 py-1 rounded-full bg-primary/15">
            <span className="text-[10px] font-medium text-primary capitalize">{userRole}</span>
          </div>
        </div>
      </div>

      {/* Settings Sections */}
      <div className="px-5 flex flex-col gap-5">
        {sections.map((section) => (
          <div key={section.title}>
            <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2 px-1">
              {section.title}
            </h3>
            <div className="glass rounded-2xl overflow-hidden">
              {section.items.map((item, i) => {
                const Icon = item.icon
                const Wrapper = item.hasToggle ? "div" : "button"
                return (
                  <Wrapper
                    key={item.label}
                    onClick={() => {
                      if (!item.hasToggle) item.action?.()
                    }}
                    className={`w-full flex items-center gap-3 p-4 text-left transition-colors hover:bg-secondary/50 ${
                      i < section.items.length - 1 ? "border-b border-border/50" : ""
                    }`}
                  >
                    <div
                      className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                        item.danger ? "bg-destructive/15" : "bg-secondary"
                      }`}
                    >
                      <Icon className={`w-4 h-4 ${item.danger ? "text-destructive" : "text-muted-foreground"}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-medium ${item.danger ? "text-destructive" : "text-foreground"}`}>
                        {item.label}
                      </p>
                      <p className="text-xs text-muted-foreground">{item.description}</p>
                    </div>
                    {item.hasToggle ? (
                      <Switch
                        checked={getToggleValue(item.label)}
                        onCheckedChange={() => handleToggle(item.label)}
                      />
                    ) : (
                      <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0" />
                    )}
                  </Wrapper>
                )
              })}
            </div>
          </div>
        ))}
      </div>

      {/* App Version */}
      <div className="px-5 mt-8 mb-4 text-center">
        <p className="text-xs text-muted-foreground">StockPulse v1.0.0</p>
        <p className="text-[10px] text-muted-foreground/60 mt-1">Built with Next.js</p>
      </div>
    </div>
  )
}
