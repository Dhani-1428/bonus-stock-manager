"use client"

import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from "react"
import { useRouter } from "next/navigation"
import { sampleProducts, sampleSales, type Product, type Sale } from "./store"

export type Screen =
  | "dashboard"
  | "scan"
  | "add-product"
  | "products"
  | "product-details"
  | "sales"
  | "reports"
  | "settings"

interface AppState {
  screen: Screen
  previousScreen: Screen
  products: Product[]
  sales: Sale[]
  selectedProductId: string | null
  searchQuery: string
  selectedCategory: string
  isLoggedIn: boolean
  userName: string
  userRole: "admin" | "staff"
}

interface AppContextType extends AppState {
  navigate: (screen: Screen) => void
  goBack: () => void
  logout: () => void
  setSearchQuery: (q: string) => void
  setSelectedCategory: (c: string) => void
  selectProduct: (id: string) => void
  addProduct: (product: Product) => void
  updateProduct: (product: Product) => void
  deleteProduct: (id: string) => void
  addSale: (sale: Sale) => void
}

const AppContext = createContext<AppContextType | null>(null)

export function AppProvider({ children }: { children: ReactNode }) {
  const router = useRouter()

  const [state, setState] = useState<AppState>({
    screen: "dashboard",
    previousScreen: "dashboard",
    products: sampleProducts,
    sales: sampleSales,
    selectedProductId: null,
    searchQuery: "",
    selectedCategory: "all",
    isLoggedIn: false,
    userName: "",
    userRole: "admin",
  })

  // Load auth from sessionStorage on mount
  useEffect(() => {
    try {
      const stored = sessionStorage.getItem("stockpulse_auth")
      if (stored) {
        const auth = JSON.parse(stored)
        if (auth.isLoggedIn) {
          setState((prev) => ({
            ...prev,
            isLoggedIn: true,
            userName: auth.userName || "Admin",
            userRole: auth.userRole || "admin",
          }))
          return
        }
      }
      // Not logged in - redirect to login
      router.replace("/login")
    } catch {
      router.replace("/login")
    }
  }, [router])

  const navigate = useCallback((screen: Screen) => {
    setState((prev) => ({ ...prev, previousScreen: prev.screen, screen }))
  }, [])

  const goBack = useCallback(() => {
    setState((prev) => ({ ...prev, screen: prev.previousScreen, previousScreen: "dashboard" }))
  }, [])

  const logout = useCallback(() => {
    sessionStorage.removeItem("stockpulse_auth")
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

  const addProduct = useCallback((product: Product) => {
    setState((prev) => ({ ...prev, products: [product, ...prev.products] }))
  }, [])

  const updateProduct = useCallback((product: Product) => {
    setState((prev) => ({
      ...prev,
      products: prev.products.map((p) => (p.id === product.id ? product : p)),
    }))
  }, [])

  const deleteProduct = useCallback((id: string) => {
    setState((prev) => ({
      ...prev,
      products: prev.products.filter((p) => p.id !== id),
      screen: "products",
    }))
  }, [])

  const addSale = useCallback((sale: Sale) => {
    setState((prev) => ({
      ...prev,
      sales: [sale, ...prev.sales],
      products: prev.products.map((p) =>
        p.id === sale.productId ? { ...p, stock: p.stock - sale.quantity } : p
      ),
    }))
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
        addProduct,
        updateProduct,
        deleteProduct,
        addSale,
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
