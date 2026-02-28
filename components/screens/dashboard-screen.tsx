"use client"

import { useMemo } from "react"
import { useApp } from "@/lib/app-context"
import {
  Package,
  TrendingUp,
  AlertTriangle,
  DollarSign,
  Smartphone,
  Headphones,
  Zap,
  Shield,
  Battery,
  ScanBarcode,
  Cable,
  Bell,
  ChevronRight,
} from "lucide-react"
import { BarChart, Bar, XAxis, ResponsiveContainer, Tooltip, Cell } from "recharts"
import { categories } from "@/lib/store"

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Smartphone, Headphones, Zap, Shield, Battery, Sim: ScanBarcode, Cable,
}

function AnimatedNumber({ value, prefix = "" }: { value: number; prefix?: string }) {
  return (
    <span className="animate-count inline-block tabular-nums">
      {prefix}{value.toLocaleString()}
    </span>
  )
}

export function DashboardScreen() {
  const { products, sales, navigate, userName, selectProduct } = useApp()

  const stats = useMemo(() => {
    const totalProducts = products.length
    const totalStock = products.reduce((sum, p) => sum + p.stock, 0)
    const lowStock = products.filter((p) => p.stock <= p.minStock).length
    const todaySales = sales
      .filter((s) => s.date === "2026-02-28")
      .reduce((sum, s) => sum + s.total, 0)
    const totalRevenue = sales.reduce((sum, s) => sum + s.total, 0)
    const totalCost = sales.reduce((s, sale) => {
      const product = products.find((p) => p.id === sale.productId)
      return s + (product ? product.buyPrice * sale.quantity : 0)
    }, 0)
    const profit = totalRevenue - totalCost

    return { totalProducts, totalStock, lowStock, todaySales, totalRevenue, profit }
  }, [products, sales])

  const chartData = useMemo(() => {
    const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
    return days.map((day, i) => ({
      day,
      sales: Math.floor(Math.random() * 2000) + 500 + i * 200,
    }))
  }, [])

  const lowStockProducts = useMemo(
    () => products.filter((p) => p.stock <= p.minStock),
    [products]
  )

  const recentSales = sales.slice(0, 4)

  return (
    <div className="flex flex-col pb-24 md:pb-6 page-transition">
      {/* Header */}
      <div className="px-5 md:px-8 pt-6 pb-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">Welcome back,</p>
            <h1 className="text-xl font-bold text-foreground">{userName || "Admin"}</h1>
          </div>
          <button
            onClick={() => navigate("settings")}
            className="relative w-10 h-10 rounded-xl glass flex items-center justify-center"
          >
            <Bell className="w-5 h-5 text-foreground" />
            {lowStockProducts.length > 0 && (
              <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-destructive flex items-center justify-center">
                <span className="text-[10px] font-bold text-destructive-foreground">{lowStockProducts.length}</span>
              </div>
            )}
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="px-5 md:px-8 grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        <div className="glass rounded-2xl p-4 flex flex-col gap-1">
          <div className="w-9 h-9 rounded-lg bg-primary/15 flex items-center justify-center mb-1">
            <Package className="w-4 h-4 text-primary" />
          </div>
          <span className="text-xs text-muted-foreground">Total Products</span>
          <span className="text-xl font-bold text-foreground">
            <AnimatedNumber value={stats.totalProducts} />
          </span>
        </div>
        <div className="glass rounded-2xl p-4 flex flex-col gap-1">
          <div className="w-9 h-9 rounded-lg bg-success/15 flex items-center justify-center mb-1">
            <TrendingUp className="w-4 h-4 text-success" />
          </div>
          <span className="text-xs text-muted-foreground">Total Stock</span>
          <span className="text-xl font-bold text-foreground">
            <AnimatedNumber value={stats.totalStock} />
          </span>
        </div>
        <div className="glass rounded-2xl p-4 flex flex-col gap-1">
          <div className="w-9 h-9 rounded-lg bg-warning/15 flex items-center justify-center mb-1">
            <AlertTriangle className="w-4 h-4 text-warning" />
          </div>
          <span className="text-xs text-muted-foreground">Low Stock</span>
          <span className="text-xl font-bold text-destructive">
            <AnimatedNumber value={stats.lowStock} />
          </span>
        </div>
        <div className="glass rounded-2xl p-4 flex flex-col gap-1">
          <div className="w-9 h-9 rounded-lg bg-chart-1/15 flex items-center justify-center mb-1">
            <DollarSign className="w-4 h-4 text-chart-1" />
          </div>
          <span className="text-xs text-muted-foreground">{"Today's Sales"}</span>
          <span className="text-xl font-bold text-foreground">
            <AnimatedNumber value={stats.todaySales} prefix="$" />
          </span>
        </div>
      </div>

      {/* Weekly Sales Chart */}
      <div className="px-5 md:px-8 mt-6">
        <div className="glass rounded-2xl p-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-foreground">Weekly Sales</h2>
            <span className="text-xs text-primary font-medium">
              $<AnimatedNumber value={stats.totalRevenue} />
            </span>
          </div>
          <ResponsiveContainer width="100%" height={140}>
            <BarChart data={chartData} barCategoryGap="20%">
              <XAxis
                dataKey="day"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "oklch(0.65 0 0)", fontSize: 11 }}
              />
              <Tooltip
                contentStyle={{
                  background: "oklch(0.17 0.008 260 / 0.9)",
                  border: "1px solid oklch(0.35 0.015 260 / 0.3)",
                  borderRadius: "12px",
                  backdropFilter: "blur(10px)",
                  color: "oklch(0.95 0 0)",
                  fontSize: "12px",
                }}
                cursor={{ fill: "oklch(0.75 0.18 195 / 0.05)" }}
                formatter={(value: number) => [`$${value}`, "Sales"]}
              />
              <Bar dataKey="sales" radius={[6, 6, 0, 0]}>
                {chartData.map((_, i) => (
                  <Cell key={i} fill={i === chartData.length - 1 ? "oklch(0.75 0.18 195)" : "oklch(0.75 0.18 195 / 0.3)"} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Categories */}
      <div className="px-5 md:px-8 mt-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold text-foreground">Categories</h2>
          <button onClick={() => navigate("products")} className="text-xs text-primary font-medium">
            View All
          </button>
        </div>
        <div className="flex gap-3 overflow-x-auto no-scrollbar pb-1">
          {categories.map((cat) => {
            const Icon = iconMap[cat.icon] || Package
            const count = products.filter((p) => p.category === cat.id).length
            return (
              <button
                key={cat.id}
                onClick={() => navigate("products")}
                className="flex flex-col items-center gap-2 min-w-[72px]"
              >
                <div className="w-14 h-14 rounded-xl glass flex items-center justify-center hover:neon-glow transition-all duration-300">
                  <Icon className="w-5 h-5 text-primary" />
                </div>
                <span className="text-[10px] text-muted-foreground whitespace-nowrap">{cat.label}</span>
                <span className="text-[10px] font-bold text-foreground -mt-1">{count}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Low Stock Alerts */}
      {lowStockProducts.length > 0 && (
        <div className="px-5 md:px-8 mt-6">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold text-foreground flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-warning" />
              Low Stock Alerts
            </h2>
          </div>
          <div className="flex flex-col gap-2">
            {lowStockProducts.map((product) => (
              <button
                key={product.id}
                onClick={() => selectProduct(product.id)}
                className="glass rounded-xl p-3 flex items-center gap-3 text-left w-full hover:bg-secondary/50 transition-colors"
              >
                <div className="w-10 h-10 rounded-lg bg-destructive/15 flex items-center justify-center shrink-0">
                  <AlertTriangle className="w-4 h-4 text-destructive" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">{product.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {product.stock} left &middot; Min: {product.minStock}
                  </p>
                </div>
                <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0" />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Recent Sales */}
      <div className="px-5 md:px-8 mt-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold text-foreground">Recent Sales</h2>
          <button onClick={() => navigate("sales")} className="text-xs text-primary font-medium">
            View All
          </button>
        </div>
        <div className="flex flex-col gap-2">
          {recentSales.map((sale) => (
            <div key={sale.id} className="glass rounded-xl p-3 flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-success/15 flex items-center justify-center shrink-0">
                <DollarSign className="w-4 h-4 text-success" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">{sale.productName}</p>
                <p className="text-xs text-muted-foreground">
                  Qty: {sale.quantity} &middot; {sale.customer}
                </p>
              </div>
              <span className="text-sm font-bold text-success">${sale.total}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
