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
  isLoggedIn: boolean
  user: {
    id: string
    name: string
    email: string
    role: string
  } | null
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

export function AppProvider({ children }: { children: ReactNode }) {
  const router = useRouter()

  const [state, setState] = useState<AppState>({
    screen: "dashboard",
    previousScreen: "dashboard",
    selectedProductId: null,
    searchQuery: "",
    selectedCategory: "all",
    isLoggedIn: false,
    user: null,
    loading: true,
  })

  // Load auth from sessionStorage on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const stored = sessionStorage.getItem("stockpulse_auth")
        if (stored) {
          const auth = JSON.parse(stored)
          if (auth.isLoggedIn && auth.userId) {
            // Verify token is still valid by checking if we can make an API call
            const token = apiClient.getToken()
            if (token) {
              setState((prev) => ({
                ...prev,
                isLoggedIn: true,
                user: {
                  id: auth.userId,
                  name: auth.userName || "User",
                  email: auth.email || "",
                  role: auth.userRole || "staff",
                },
                loading: false,
              }))
              return
            }
          }
        }
        // Not logged in - redirect to login
        router.replace("/login")
      } catch {
        router.replace("/login")
      } finally {
        setState((prev) => ({ ...prev, loading: false }))
      }
    }

    checkAuth()
  }, [router])

  const navigate = useCallback((screen: Screen) => {
    setState((prev) => ({ ...prev, previousScreen: prev.screen, screen }))
  }, [])

  const goBack = useCallback(() => {
    setState((prev) => ({ ...prev, screen: prev.previousScreen, previousScreen: "dashboard" }))
  }, [])

  const logout = useCallback(() => {
    apiClient.logout()
    sessionStorage.removeItem("stockpulse_auth")
    setState((prev) => ({
      ...prev,
      isLoggedIn: false,
      user: null,
    }))
    router.push("/login")
  }, [router])

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
    // Individual screens will fetch their own data
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
