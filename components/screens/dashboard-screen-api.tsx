"use client"

import { useMemo, useState, useEffect } from "react"
import { useApp, useUser } from "@/lib/app-context-clerk"
import { apiClient } from "@/lib/api-client"
import {
  Package,
  TrendingUp,
  AlertTriangle,
  DollarSign,
  Bell,
  ChevronRight,
} from "lucide-react"
import { BarChart, Bar, XAxis, ResponsiveContainer, Tooltip, Cell } from "recharts"
import { toast } from "sonner"

function AnimatedNumber({ value, prefix = "" }: { value: number; prefix?: string }) {
  return (
    <span className="animate-count inline-block tabular-nums">
      {prefix}{value.toLocaleString()}
    </span>
  )
}

export function DashboardScreen() {
  const { navigate, selectProduct } = useApp()
  const { user } = useUser()
  const [products, setProducts] = useState<any[]>([])
  const [sales, setSales] = useState<any[]>([])
  const [categories, setCategories] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [salesReport, setSalesReport] = useState<any>(null)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setLoading(true)
      const today = new Date().toISOString().split('T')[0]
      const [productsRes, salesRes, categoriesRes, reportRes] = await Promise.all([
        apiClient.getProducts({ limit: 100 }),
        apiClient.getSales({ startDate: today }),
        apiClient.getCategories(),
        apiClient.getSalesReport({ startDate: today, groupBy: 'day' }),
      ])
      setProducts((productsRes as any).products || [])
      setSales((salesRes as any).sales || [])
      setCategories((categoriesRes as any) || [])
      setSalesReport(reportRes as any)
    } catch (error: any) {
      toast.error(error.message || "Failed to load dashboard data")
    } finally {
      setLoading(false)
    }
  }

  const stats = useMemo(() => {
    const totalProducts = products.length
    const totalStock = products.reduce((sum, p) => sum + p.stock, 0)
    const lowStock = products.filter((p) => p.stock <= p.minStock).length
    const todaySales = sales.reduce((sum, s) => sum + s.finalAmount, 0)
    const totalRevenue = sales.reduce((sum, s) => sum + s.finalAmount, 0)
    const profit = salesReport?.summary?.totalProfit || 0

    return { totalProducts, totalStock, lowStock, todaySales, totalRevenue, profit }
  }, [products, sales, salesReport])

  const chartData = useMemo(() => {
    if (salesReport?.grouped) {
      return salesReport.grouped.slice(-7).map((item: any) => ({
        day: new Date(item.period).toLocaleDateString('en-US', { weekday: 'short' }),
        sales: item.revenue || 0,
      }))
    }
    return []
  }, [salesReport])

  const lowStockProducts = useMemo(
    () => products.filter((p) => p.stock <= p.minStock).slice(0, 5),
    [products]
  )

  const recentSales = useMemo(() => sales.slice(0, 4), [sales])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full overflow-y-auto">
      {/* Header */}
      <div className="px-6 py-4 border-b border-border">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">Welcome back,</p>
            <h1 className="text-2xl font-bold text-foreground">{user?.name || "Admin"}</h1>
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

      <div className="flex-1 p-6 space-y-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
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
            <span className="text-xs text-muted-foreground">Today's Sales</span>
            <span className="text-xl font-bold text-foreground">
              <AnimatedNumber value={stats.todaySales} prefix="$" />
            </span>
          </div>
        </div>

        {/* Weekly Sales Chart */}
        {chartData.length > 0 && (
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
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Low Stock Alerts */}
          {lowStockProducts.length > 0 && (
            <div>
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
          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-semibold text-foreground">Recent Sales</h2>
              <button onClick={() => navigate("sales")} className="text-xs text-primary font-medium">
                View All
              </button>
            </div>
            <div className="flex flex-col gap-2">
              {recentSales.length === 0 ? (
                <div className="glass rounded-xl p-6 text-center text-muted-foreground">
                  <p className="text-sm">No sales today</p>
                </div>
              ) : (
                recentSales.map((sale: any) => (
                  <div key={sale.id} className="glass rounded-xl p-3 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-success/15 flex items-center justify-center shrink-0">
                      <DollarSign className="w-4 h-4 text-success" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">
                        {sale.items?.[0]?.product?.name || 'Sale'}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {sale.items?.reduce((sum: number, item: any) => sum + item.quantity, 0) || 0} items &middot; {sale.customer?.name || 'Walk-in'}
                      </p>
                    </div>
                    <span className="text-sm font-bold text-success">${sale.finalAmount}</span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
