"use client"

import { useMemo, useState, useEffect } from "react"
import { useApp } from "@/lib/app-context-clerk"
import { apiClient } from "@/lib/api-client"
import {
  TrendingUp,
  DollarSign,
  Package,
  BarChart3,
  PieChart as PieChartIcon,
  Download,
} from "lucide-react"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
} from "recharts"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"

const COLORS = [
  "oklch(0.75 0.18 195)",
  "oklch(0.70 0.15 160)",
  "oklch(0.65 0.20 280)",
  "oklch(0.80 0.16 85)",
  "oklch(0.70 0.20 340)",
]

export function ReportsScreen() {
  const { navigate } = useApp()
  const [tab, setTab] = useState<"overview" | "inventory" | "sales">("overview")
  const [products, setProducts] = useState<any[]>([])
  const [sales, setSales] = useState<any[]>([])
  const [salesReport, setSalesReport] = useState<any>(null)
  const [stockReport, setStockReport] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setLoading(true)
      const today = new Date()
      const monthAgo = new Date(today)
      monthAgo.setMonth(monthAgo.getMonth() - 1)

      const [productsRes, salesRes, salesReportRes, stockReportRes] = await Promise.all([
        apiClient.getProducts({ limit: 1000 }),
        apiClient.getSales({ startDate: monthAgo.toISOString().split('T')[0], limit: 1000 }),
        apiClient.getSalesReport({ startDate: monthAgo.toISOString().split('T')[0], groupBy: 'day' }),
        apiClient.getStockReport(),
      ])

      setProducts((productsRes as any).products || [])
      setSales((salesRes as any).sales || [])
      setSalesReport(salesReportRes as any)
      setStockReport(stockReportRes as any)
    } catch (error: any) {
      toast.error(error.message || "Failed to load reports")
    } finally {
      setLoading(false)
    }
  }

  const stats = useMemo(() => {
    const totalRevenue = sales.reduce((sum, s) => sum + s.finalAmount, 0)
    const profit = salesReport?.summary?.totalProfit || 0
    const totalStock = products.reduce((sum, p) => sum + p.stock, 0)
    const stockValue = products.reduce((sum, p) => sum + p.stock * p.buyPrice, 0)
    const lowStock = products.filter((p) => p.stock <= p.minStock).length

    return { totalRevenue, profit, totalStock, stockValue, lowStock }
  }, [products, sales, salesReport])

  const categoryData = useMemo(() => {
    const map: Record<string, number> = {}
    for (const p of products) {
      const catName = p.category?.name || 'Uncategorized'
      map[catName] = (map[catName] || 0) + p.stock
    }
    return Object.entries(map).map(([name, value]) => ({ name, value }))
  }, [products])

  const chartData = useMemo(() => {
    if (salesReport?.grouped) {
      return salesReport.grouped.slice(-7).map((item: any) => ({
        name: new Date(item.period).toLocaleDateString('en-US', { weekday: 'short' }),
        revenue: item.revenue || 0,
        profit: item.profit || 0,
      }))
    }
    return []
  }, [salesReport])

  const topProducts = useMemo(() => {
    const productSales: Record<string, { name: string; total: number; qty: number }> = {}
    for (const s of sales) {
      for (const item of s.items || []) {
        const productId = item.productId
        const productName = item.product?.name || 'Unknown'
        if (!productSales[productId]) {
          productSales[productId] = { name: productName, total: 0, qty: 0 }
        }
        productSales[productId].total += item.total
        productSales[productId].qty += item.quantity
      }
    }
    return Object.values(productSales).sort((a, b) => b.total - a.total)
  }, [sales])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="px-6 py-4 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold text-foreground">Reports</h1>
          <Button variant="outline" size="sm" className="gap-2">
            <Download className="w-4 h-4" />
            Export
          </Button>
        </div>

        {/* Tabs */}
        <div className="flex gap-2">
          {(["overview", "inventory", "sales"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                tab === t ? "bg-primary text-primary-foreground" : "glass text-muted-foreground hover:text-foreground"
              }`}
            >
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        {tab === "overview" && (
          <div className="space-y-6">
            {/* Revenue & Profit Cards */}
            <div className="grid grid-cols-2 gap-4">
              <div className="glass rounded-2xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <DollarSign className="w-4 h-4 text-success" />
                  <span className="text-xs text-muted-foreground">Revenue</span>
                </div>
                <p className="text-2xl font-bold text-foreground">${stats.totalRevenue.toLocaleString()}</p>
              </div>
              <div className="glass rounded-2xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="w-4 h-4 text-primary" />
                  <span className="text-xs text-muted-foreground">Profit</span>
                </div>
                <p className="text-2xl font-bold text-foreground">${stats.profit.toLocaleString()}</p>
              </div>
            </div>

            {/* Weekly Revenue Chart */}
            {chartData.length > 0 && (
              <div className="glass rounded-2xl p-4">
                <div className="flex items-center gap-2 mb-4">
                  <BarChart3 className="w-4 h-4 text-primary" />
                  <h3 className="text-sm font-semibold text-foreground">Weekly Revenue vs Profit</h3>
                </div>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={chartData} barCategoryGap="20%">
                    <XAxis
                      dataKey="name"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: "oklch(0.65 0 0)", fontSize: 10 }}
                    />
                    <YAxis
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: "oklch(0.65 0 0)", fontSize: 10 }}
                      tickFormatter={(v) => `$${v}`}
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
                      formatter={(value: number) => [`$${value}`, ""]}
                    />
                    <Bar dataKey="revenue" fill="oklch(0.75 0.18 195)" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="profit" fill="oklch(0.70 0.15 160)" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}

            {/* Top Products */}
            {topProducts.length > 0 && (
              <div className="glass rounded-2xl p-4">
                <h3 className="text-sm font-semibold text-foreground mb-3">Top Selling Products</h3>
                <div className="flex flex-col gap-2">
                  {topProducts.slice(0, 5).map((p, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <span className="text-xs font-bold text-muted-foreground w-5">{i + 1}</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-foreground truncate">{p.name}</p>
                        <p className="text-xs text-muted-foreground">Qty: {p.qty}</p>
                      </div>
                      <span className="text-sm font-bold text-primary">${p.total.toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {tab === "inventory" && (
          <div className="space-y-6">
            {/* Inventory Stats */}
            <div className="grid grid-cols-2 gap-4">
              <div className="glass rounded-2xl p-4">
                <Package className="w-4 h-4 text-primary mb-2" />
                <span className="text-xs text-muted-foreground">Total Stock</span>
                <p className="text-2xl font-bold text-foreground">{stats.totalStock}</p>
              </div>
              <div className="glass rounded-2xl p-4">
                <DollarSign className="w-4 h-4 text-success mb-2" />
                <span className="text-xs text-muted-foreground">Stock Value</span>
                <p className="text-2xl font-bold text-foreground">${stats.stockValue.toLocaleString()}</p>
              </div>
            </div>

            {/* Category Distribution */}
            {categoryData.length > 0 && (
              <div className="glass rounded-2xl p-4">
                <div className="flex items-center gap-2 mb-4">
                  <PieChartIcon className="w-4 h-4 text-primary" />
                  <h3 className="text-sm font-semibold text-foreground">Stock by Category</h3>
                </div>
                <div className="flex items-center gap-4">
                  <ResponsiveContainer width={140} height={140}>
                    <PieChart>
                      <Pie
                        data={categoryData}
                        cx="50%"
                        cy="50%"
                        innerRadius={35}
                        outerRadius={60}
                        dataKey="value"
                        stroke="none"
                      >
                        {categoryData.map((_, i) => (
                          <Cell key={i} fill={COLORS[i % COLORS.length]} />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="flex flex-col gap-1.5">
                    {categoryData.map((item, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <div className="w-2.5 h-2.5 rounded-full" style={{ background: COLORS[i % COLORS.length] }} />
                        <span className="text-xs text-muted-foreground">{item.name}</span>
                        <span className="text-xs font-bold text-foreground ml-auto">{item.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Low Stock Items */}
            {products.filter((p) => p.stock <= p.minStock).length > 0 && (
              <div className="glass rounded-2xl p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Package className="w-4 h-4 text-destructive" />
                  <h3 className="text-sm font-semibold text-foreground">Low Stock Items ({stats.lowStock})</h3>
                </div>
                <div className="flex flex-col gap-2">
                  {products
                    .filter((p) => p.stock <= p.minStock)
                    .slice(0, 10)
                    .map((p) => (
                      <div key={p.id} className="flex items-center justify-between py-2 border-b border-border/50 last:border-0">
                        <div className="min-w-0 flex-1">
                          <p className="text-sm text-foreground truncate">{p.name}</p>
                          <p className="text-xs text-muted-foreground">{p.brand}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-bold text-destructive">{p.stock} left</p>
                          <p className="text-xs text-muted-foreground">Min: {p.minStock}</p>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            )}
          </div>
        )}

        {tab === "sales" && (
          <div className="space-y-6">
            <div className="grid grid-cols-3 gap-4">
              <div className="glass rounded-xl p-4 flex flex-col items-center">
                <span className="text-xs text-muted-foreground">Orders</span>
                <span className="text-2xl font-bold text-foreground">{sales.length}</span>
              </div>
              <div className="glass rounded-xl p-4 flex flex-col items-center">
                <span className="text-xs text-muted-foreground">Revenue</span>
                <span className="text-2xl font-bold text-foreground">${stats.totalRevenue.toLocaleString()}</span>
              </div>
              <div className="glass rounded-xl p-4 flex flex-col items-center">
                <span className="text-xs text-muted-foreground">Avg Order</span>
                <span className="text-2xl font-bold text-foreground">
                  ${sales.length > 0 ? Math.round(stats.totalRevenue / sales.length) : 0}
                </span>
              </div>
            </div>

            {/* Sales by product chart */}
            {topProducts.length > 0 && (
              <div className="glass rounded-2xl p-4">
                <h3 className="text-sm font-semibold text-foreground mb-4">Revenue by Product</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={topProducts.slice(0, 10)} layout="vertical" barCategoryGap="20%">
                    <XAxis
                      type="number"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: "oklch(0.65 0 0)", fontSize: 10 }}
                      tickFormatter={(v) => `$${v}`}
                    />
                    <YAxis
                      type="category"
                      dataKey="name"
                      axisLine={false}
                      tickLine={false}
                      width={120}
                      tick={{ fill: "oklch(0.65 0 0)", fontSize: 9 }}
                    />
                    <Tooltip
                      contentStyle={{
                        background: "oklch(0.17 0.008 260 / 0.9)",
                        border: "1px solid oklch(0.35 0.015 260 / 0.3)",
                        borderRadius: "12px",
                        color: "oklch(0.95 0 0)",
                        fontSize: "12px",
                      }}
                      formatter={(value: number) => [`$${value}`, "Revenue"]}
                    />
                    <Bar dataKey="total" fill="oklch(0.75 0.18 195)" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
