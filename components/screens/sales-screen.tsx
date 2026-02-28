"use client"

import { useMemo, useState } from "react"
import { useApp } from "@/lib/app-context"
import { DollarSign, Calendar, User, Package, Plus, X, Check } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import type { Sale } from "@/lib/store"

export function SalesScreen() {
  const { sales, products, addSale, navigate } = useApp()
  const [showAdd, setShowAdd] = useState(false)
  const [selectedProductId, setSelectedProductId] = useState("")
  const [quantity, setQuantity] = useState("1")
  const [customer, setCustomer] = useState("")

  const todaySales = useMemo(
    () => sales.filter((s) => s.date === "2026-02-28"),
    [sales]
  )
  const todayTotal = todaySales.reduce((sum, s) => sum + s.total, 0)

  const groupedByDate = useMemo(() => {
    const groups: Record<string, Sale[]> = {}
    for (const sale of sales) {
      if (!groups[sale.date]) groups[sale.date] = []
      groups[sale.date].push(sale)
    }
    return Object.entries(groups).sort(([a], [b]) => b.localeCompare(a))
  }, [sales])

  const handleAddSale = () => {
    if (!selectedProductId) return
    const product = products.find((p) => p.id === selectedProductId)
    if (!product) return
    const qty = parseInt(quantity) || 1
    const sale: Sale = {
      id: `s-${Date.now()}`,
      productId: product.id,
      productName: product.name,
      quantity: qty,
      total: product.sellPrice * qty,
      date: "2026-02-28",
      customer: customer || "Walk-in",
    }
    addSale(sale)
    setShowAdd(false)
    setSelectedProductId("")
    setQuantity("1")
    setCustomer("")
  }

  return (
    <div className="flex flex-col pb-24 page-transition">
      {/* Header */}
      <div className="px-5 pt-6 pb-2">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-bold text-foreground">Sales</h1>
          <button
            onClick={() => setShowAdd(true)}
            className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center neon-glow"
          >
            <Plus className="w-5 h-5 text-primary-foreground" />
          </button>
        </div>

        {/* Today summary */}
        <div className="glass rounded-2xl p-4 flex items-center gap-4 mb-4">
          <div className="w-12 h-12 rounded-xl bg-success/15 flex items-center justify-center">
            <DollarSign className="w-6 h-6 text-success" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground">{"Today's Revenue"}</p>
            <p className="text-2xl font-bold text-foreground">${todayTotal.toLocaleString()}</p>
            <p className="text-xs text-muted-foreground">{todaySales.length} transactions</p>
          </div>
        </div>
      </div>

      {/* Sales List */}
      <div className="px-5 flex flex-col gap-4">
        {groupedByDate.map(([date, dateSales]) => {
          const dateTotal = dateSales.reduce((sum, s) => sum + s.total, 0)
          return (
            <div key={date}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Calendar className="w-3 h-3 text-muted-foreground" />
                  <span className="text-xs font-medium text-muted-foreground">{date}</span>
                </div>
                <span className="text-xs font-bold text-primary">${dateTotal}</span>
              </div>
              <div className="flex flex-col gap-2">
                {dateSales.map((sale) => (
                  <div key={sale.id} className="glass rounded-xl p-3 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                      <Package className="w-4 h-4 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">{sale.productName}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-xs text-muted-foreground">Qty: {sale.quantity}</span>
                        <span className="text-xs text-muted-foreground">&middot;</span>
                        <div className="flex items-center gap-1">
                          <User className="w-3 h-3 text-muted-foreground" />
                          <span className="text-xs text-muted-foreground">{sale.customer}</span>
                        </div>
                      </div>
                    </div>
                    <span className="text-sm font-bold text-success">${sale.total}</span>
                  </div>
                ))}
              </div>
            </div>
          )
        })}
      </div>

      {/* Add Sale Modal */}
      {showAdd && (
        <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-end justify-center">
          <div className="glass rounded-t-3xl p-6 w-full max-w-md animate-count">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-foreground">New Sale</h3>
              <button onClick={() => setShowAdd(false)} className="w-8 h-8 rounded-lg glass flex items-center justify-center">
                <X className="w-4 h-4 text-foreground" />
              </button>
            </div>

            <div className="flex flex-col gap-4">
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">Product</label>
                <select
                  value={selectedProductId}
                  onChange={(e) => setSelectedProductId(e.target.value)}
                  className="w-full h-11 bg-secondary border border-border rounded-xl text-foreground text-sm px-3"
                >
                  <option value="">Select product...</option>
                  {products
                    .filter((p) => p.stock > 0)
                    .map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name} (${p.sellPrice}) - {p.stock} in stock
                      </option>
                    ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">Quantity</label>
                  <Input
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    min="1"
                    className="h-11 bg-secondary border-border rounded-xl text-foreground"
                  />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">Customer</label>
                  <Input
                    placeholder="Walk-in"
                    value={customer}
                    onChange={(e) => setCustomer(e.target.value)}
                    className="h-11 bg-secondary border-border rounded-xl text-foreground"
                  />
                </div>
              </div>

              {selectedProductId && (
                <div className="glass rounded-xl p-3 flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Total</span>
                  <span className="text-lg font-bold text-primary">
                    ${((products.find((p) => p.id === selectedProductId)?.sellPrice || 0) * (parseInt(quantity) || 1)).toLocaleString()}
                  </span>
                </div>
              )}

              <Button
                onClick={handleAddSale}
                disabled={!selectedProductId}
                className="h-12 rounded-xl bg-primary text-primary-foreground font-semibold neon-glow"
              >
                <Check className="w-4 h-4 mr-2" />
                Complete Sale
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
