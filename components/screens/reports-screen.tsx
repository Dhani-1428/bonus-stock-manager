"use client"

import { useMemo, useState } from "react"
import { useApp } from "@/lib/app-context"
import {
  TrendingUp,
  TrendingDown,
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

const COLORS = [
  "oklch(0.75 0.18 195)",
  "oklch(0.70 0.15 160)",
  "oklch(0.65 0.20 280)",
  "oklch(0.80 0.16 85)",
  "oklch(0.70 0.20 340)",
]

export function ReportsScreen() {
  const { products, sales } = useApp()
  const [tab, setTab] = useState<"overview" | "inventory" | "sales">("overview")

  const stats = useMemo(() => {
    const totalRevenue = sales.reduce((sum, s) => sum + s.total, 0)
    const totalCost = sales.reduce((sum, s) => {
      const p = products.find((pr) => pr.id === s.productId)
      return sum + (p ? p.buyPrice * s.quantity : 0)
    }, 0)
    const profit = totalRevenue - totalCost
    const totalStock = products.reduce((sum, p) => sum + p.stock, 0)
    const stockValue = products.reduce((sum, p) => sum + p.stock * p.buyPrice, 0)
    const lowStock = products.filter((p) => p.stock <= p.minStock).length

    return { totalRevenue, totalCost, profit, totalStock, stockValue, lowStock }
  }, [products, sales])

  const categoryData = useMemo(() => {
    const map: Record<string, number> = {}
    for (const p of products) {
      map[p.category] = (map[p.category] || 0) + p.stock
    }
    return Object.entries(map).map(([name, value]) => ({
      name: name.charAt(0).toUpperCase() + name.slice(1).replace("-", " "),
      value,
    }))
  }, [products])

  const weeklyData = useMemo(() => {
    return [
      { name: "Week 1", revenue: 3200, cost: 2100 },
      { name: "Week 2", revenue: 4100, cost: 2600 },
      { name: "Week 3", revenue: 3800, cost: 2400 },
      { name: "Week 4", revenue: 4958, cost: 2900 },
    ]
  }, [])

  const dailyTrend = useMemo(() => {
    return Array.from({ length: 14 }, (_, i) => ({
      day: `Feb ${15 + i}`,
      sales: Math.floor(Math.random() * 1500) + 300,
    }))
  }, [])

  const topProducts = useMemo(() => {
    const productSales: Record<string, { name: string; total: number; qty: number }> = {}
    for (const s of sales) {
      if (!productSales[s.productId]) {
        productSales[s.productId] = { name: s.productName, total: 0, qty: 0 }
      }
      productSales[s.productId].total += s.total
      productSales[s.productId].qty += s.quantity
    }
    return Object.values(productSales).sort((a, b) => b.total - a.total)
  }, [sales])

  return (
    <div className="flex flex-col pb-24 page-transition">
      {/* Header */}
      <div className="px-5 pt-6 pb-2">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-bold text-foreground">Reports</h1>
          <Button variant="outline" size="sm" className="rounded-lg text-xs gap-1.5 h-9">
            <Download className="w-3 h-3" />
            Export
          </Button>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-4">
          {(["overview", "inventory", "sales"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-4 py-2 rounded-lg text-xs font-medium transition-all ${
                tab === t ? "bg-primary text-primary-foreground" : "glass text-muted-foreground"
              }`}
            >
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {tab === "overview" && (
        <div className="px-5 flex flex-col gap-4">
          {/* Revenue & Profit Cards */}
          <div className="grid grid-cols-2 gap-3">
            <div className="glass rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <DollarSign className="w-4 h-4 text-success" />
                <span className="text-xs text-muted-foreground">Revenue</span>
              </div>
              <p className="text-xl font-bold text-foreground">${stats.totalRevenue.toLocaleString()}</p>
              <div className="flex items-center gap-1 mt-1">
                <TrendingUp className="w-3 h-3 text-success" />
                <span className="text-[10px] text-success">+12.5%</span>
              </div>
            </div>
            <div className="glass rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-4 h-4 text-primary" />
                <span className="text-xs text-muted-foreground">Profit</span>
              </div>
              <p className="text-xl font-bold text-foreground">${stats.profit.toLocaleString()}</p>
              <div className="flex items-center gap-1 mt-1">
                <TrendingUp className="w-3 h-3 text-success" />
                <span className="text-[10px] text-success">+8.3%</span>
              </div>
            </div>
          </div>

          {/* Weekly Revenue Chart */}
          <div className="glass rounded-2xl p-4">
            <div className="flex items-center gap-2 mb-4">
              <BarChart3 className="w-4 h-4 text-primary" />
              <h3 className="text-sm font-semibold text-foreground">Weekly Revenue vs Cost</h3>
            </div>
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={weeklyData} barCategoryGap="20%">
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
                  tickFormatter={(v) => `$${v / 1000}k`}
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
                <Bar dataKey="cost" fill="oklch(0.75 0.18 195 / 0.3)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Sales Trend */}
          <div className="glass rounded-2xl p-4">
            <h3 className="text-sm font-semibold text-foreground mb-4">14-Day Sales Trend</h3>
            <ResponsiveContainer width="100%" height={120}>
              <AreaChart data={dailyTrend}>
                <defs>
                  <linearGradient id="salesGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="oklch(0.75 0.18 195)" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="oklch(0.75 0.18 195)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <Tooltip
                  contentStyle={{
                    background: "oklch(0.17 0.008 260 / 0.9)",
                    border: "1px solid oklch(0.35 0.015 260 / 0.3)",
                    borderRadius: "12px",
                    color: "oklch(0.95 0 0)",
                    fontSize: "12px",
                  }}
                  formatter={(value: number) => [`$${value}`, "Sales"]}
                />
                <Area
                  type="monotone"
                  dataKey="sales"
                  stroke="oklch(0.75 0.18 195)"
                  strokeWidth={2}
                  fill="url(#salesGrad)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Top Products */}
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
                  <span className="text-sm font-bold text-primary">${p.total}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {tab === "inventory" && (
        <div className="px-5 flex flex-col gap-4">
          {/* Inventory Stats */}
          <div className="grid grid-cols-2 gap-3">
            <div className="glass rounded-2xl p-4">
              <Package className="w-4 h-4 text-primary mb-2" />
              <span className="text-xs text-muted-foreground">Total Stock</span>
              <p className="text-xl font-bold text-foreground">{stats.totalStock}</p>
            </div>
            <div className="glass rounded-2xl p-4">
              <DollarSign className="w-4 h-4 text-success mb-2" />
              <span className="text-xs text-muted-foreground">Stock Value</span>
              <p className="text-xl font-bold text-foreground">${stats.stockValue.toLocaleString()}</p>
            </div>
          </div>

          {/* Category Distribution */}
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

          {/* Low Stock Items */}
          <div className="glass rounded-2xl p-4">
            <div className="flex items-center gap-2 mb-3">
              <TrendingDown className="w-4 h-4 text-destructive" />
              <h3 className="text-sm font-semibold text-foreground">Low Stock Items ({stats.lowStock})</h3>
            </div>
            <div className="flex flex-col gap-2">
              {products
                .filter((p) => p.stock <= p.minStock)
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
        </div>
      )}

      {tab === "sales" && (
        <div className="px-5 flex flex-col gap-4">
          <div className="grid grid-cols-3 gap-3">
            <div className="glass rounded-xl p-3 flex flex-col items-center">
              <span className="text-xs text-muted-foreground">Orders</span>
              <span className="text-lg font-bold text-foreground">{sales.length}</span>
            </div>
            <div className="glass rounded-xl p-3 flex flex-col items-center">
              <span className="text-xs text-muted-foreground">Revenue</span>
              <span className="text-lg font-bold text-foreground">${stats.totalRevenue.toLocaleString()}</span>
            </div>
            <div className="glass rounded-xl p-3 flex flex-col items-center">
              <span className="text-xs text-muted-foreground">Avg Order</span>
              <span className="text-lg font-bold text-foreground">
                ${sales.length > 0 ? Math.round(stats.totalRevenue / sales.length) : 0}
              </span>
            </div>
          </div>

          {/* Sales by product chart */}
          <div className="glass rounded-2xl p-4">
            <h3 className="text-sm font-semibold text-foreground mb-4">Revenue by Product</h3>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={topProducts.slice(0, 5)} layout="vertical" barCategoryGap="20%">
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
                  width={100}
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
        </div>
      )}
    </div>
  )
}
