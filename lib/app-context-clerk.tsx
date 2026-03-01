"use client"

import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from "react"
import { useRouter } from "next/navigation"
import { apiClient } from "./api-client"

export type Screen =
  | "dashboard"
  | "scan"
  | "add-product"
  | "products"
  | "product-details"
  | "sales"
  | "pos"
  | "reports"
  | "customers"
  | "suppliers"
  | "purchases"
  | "services"
  | "settings"

interface AppState {
  screen: Screen
  previousScreen: Screen
  selectedProductId: string | null
  searchQuery: string
  selectedCategory: string
  loading: boolean
}

interface AppContextType extends AppState {
  navigate: (screen: Screen) => void
  goBack: () => void
  logout: () => void
  setSearchQuery: (q: string) => void
  setSelectedCategory: (c: string) => void
  selectProduct: (id: string) => void
  refreshData: () => Promise<void>
}

const AppContext = createContext<AppContextType | null>(null)

// Safe Clerk hooks that handle missing ClerkProvider
function useClerkUser() {
  const clerkKey = typeof window !== 'undefined' 
    ? process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
    : process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY

  if (!clerkKey) {
    return { user: null, isLoaded: true }
  }

  // Use dynamic import to avoid build-time errors and handle missing ClerkProvider
  if (typeof window === 'undefined') {
    return { user: null, isLoaded: false }
  }

  try {
    // Dynamically import Clerk hooks to avoid SSR issues
    const { useUser } = require('@clerk/nextjs')
    return useUser()
  } catch (error: any) {
    // If Clerk is not available or not in ClerkProvider, return safe defaults
    // This can happen if ClerkProvider is not wrapping the component
    if (error?.message?.includes('ClerkProvider') || error?.message?.includes('useUser')) {
      // Silently return defaults if ClerkProvider is missing
      return { user: null, isLoaded: true }
    }
    console.error('Clerk useUser error:', error)
    return { user: null, isLoaded: true }
  }
}

function useClerkAuth() {
  const clerkKey = typeof window !== 'undefined' 
    ? process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
    : process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY

  if (!clerkKey) {
    return { signOut: async () => {} }
  }

  // Use dynamic import to avoid build-time errors and handle missing ClerkProvider
  if (typeof window === 'undefined') {
    return { signOut: async () => {} }
  }

  try {
    // Dynamically import Clerk hooks to avoid SSR issues
    const { useAuth } = require('@clerk/nextjs')
    return useAuth()
  } catch (error: any) {
    // If Clerk is not available or not in ClerkProvider, return safe defaults
    if (error?.message?.includes('ClerkProvider') || error?.message?.includes('useAuth')) {
      // Silently return defaults if ClerkProvider is missing
      return { signOut: async () => {} }
    }
    console.error('Clerk useAuth error:', error)
    return { signOut: async () => {} }
  }
}

export function AppProvider({ children }: { children: ReactNode }) {
  const router = useRouter()
  const { user, isLoaded: userLoaded } = useClerkUser()
  const { signOut } = useClerkAuth()

  const [state, setState] = useState<AppState>({
    screen: "dashboard",
    previousScreen: "dashboard",
    selectedProductId: null,
    searchQuery: "",
    selectedCategory: "all",
    loading: false, // Don't wait for Clerk during build
  })

  // Set loading state immediately when user is loaded
  useEffect(() => {
    if (userLoaded) {
      setState((prev) => ({ ...prev, loading: false }))
    } else if (typeof window !== 'undefined') {
      // If we're in browser and user is not loaded yet, set loading to true
      setState((prev) => ({ ...prev, loading: true }))
    }
  }, [userLoaded])

  // Sync Clerk user with Prisma on mount (only in browser) - don't block UI
  useEffect(() => {
    if (typeof window === 'undefined') return
    if (!userLoaded || !user) return
    
    // Sync user in background without blocking
    const syncUser = async () => {
      try {
        // Sync user with backend
        const response = await fetch('/api/users/sync', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            clerkId: user.id,
            email: user.emailAddresses[0]?.emailAddress,
            name: user.firstName && user.lastName 
              ? `${user.firstName} ${user.lastName}` 
              : user.firstName || user.username || 'User',
            imageUrl: user.imageUrl,
          }),
        })
        
        if (!response.ok) {
          console.warn('User sync failed:', await response.text())
        }
      } catch (error) {
        // Don't block UI on sync errors
        console.error('Failed to sync user:', error)
      }
    }

    // Run sync in background
    syncUser()
  }, [user, userLoaded])

  const navigate = useCallback((screen: Screen) => {
    setState((prev) => ({ ...prev, previousScreen: prev.screen, screen }))
  }, [])

  const goBack = useCallback(() => {
    setState((prev) => ({ ...prev, screen: prev.previousScreen, previousScreen: "dashboard" }))
  }, [])

  const logout = useCallback(async () => {
    if (signOut) {
      await signOut()
    }
    router.push("/login")
  }, [signOut, router])

  const setSearchQuery = useCallback((q: string) => {
    setState((prev) => ({ ...prev, searchQuery: q }))
  }, [])

  const setSelectedCategory = useCallback((c: string) => {
    setState((prev) => ({ ...prev, selectedCategory: c }))
  }, [])

  const selectProduct = useCallback((id: string) => {
    setState((prev) => ({ ...prev, selectedProductId: id, previousScreen: prev.screen, screen: "product-details" }))
  }, [])

  const refreshData = useCallback(async () => {
    // This can be used to refresh data when needed
  }, [])

  return (
    <AppContext.Provider
      value={{
        ...state,
        navigate,
        goBack,
        logout,
        setSearchQuery,
        setSelectedCategory,
        selectProduct,
        refreshData,
      }}
    >
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error("useApp must be used within AppProvider")
  return ctx
}

// Export safe Clerk hooks
export function useUser() {
  return useClerkUser()
}

export function useAuth() {
  return useClerkAuth()
}
