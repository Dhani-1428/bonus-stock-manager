import { AppProvider } from "@/lib/app-context-clerk"
import { AppShell } from "@/components/app-shell"
import { PWAInstall } from "@/components/pwa-install"

export default function DashboardPage() {
  return (
    <AppProvider>
      <AppShell />
      <PWAInstall />
    </AppProvider>
  )
}
