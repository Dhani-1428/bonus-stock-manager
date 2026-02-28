import { AppProvider } from "@/lib/app-context-clerk"
import { AppShell } from "@/components/app-shell"
import { PWAInstall } from "@/components/pwa-install"

// Force dynamic rendering to avoid Clerk build issues
export const dynamic = 'force-dynamic'
export const revalidate = 0

export default function DashboardPage() {
  return (
    <AppProvider>
      <AppShell />
      <PWAInstall />
    </AppProvider>
  )
}
