"use client"

import { useMemo, useState } from "react"
import { useApp } from "@/lib/app-context"
import {
  ArrowLeft,
  Package,
  Edit,
  Trash2,
  Barcode,
  DollarSign,
  Truck,
  Shield,
  TrendingUp,
  Minus,
  Plus,
} from "lucide-react"
import { Button } from "@/components/ui/button"

export function ProductDetailsScreen() {
  const { products, sales, selectedProductId, goBack, updateProduct, deleteProduct, navigate } = useApp()
  const [stockAdjust, setStockAdjust] = useState(0)
  const [showDelete, setShowDelete] = useState(false)

  const product = useMemo(
    () => products.find((p) => p.id === selectedProductId),
    [products, selectedProductId]
  )

  const productSales = useMemo(
    () => sales.filter((s) => s.productId === selectedProductId),
    [sales, selectedProductId]
  )

  if (!product) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen page-transition">
        <Package className="w-16 h-16 text-muted-foreground/30 mb-4" />
        <p className="text-muted-foreground">Product not found</p>
        <Button onClick={goBack} variant="ghost" className="mt-4 text-primary">
          Go Back
        </Button>
      </div>
    )
  }

  const profit = product.sellPrice - product.buyPrice
  const margin = product.buyPrice > 0 ? ((profit / product.buyPrice) * 100).toFixed(1) : "0"
  const totalSold = productSales.reduce((sum, s) => sum + s.quantity, 0)
  const totalRevenue = productSales.reduce((sum, s) => sum + s.total, 0)

  const handleStockUpdate = () => {
    if (stockAdjust !== 0) {
      updateProduct({ ...product, stock: Math.max(0, product.stock + stockAdjust) })
      setStockAdjust(0)
    }
  }

  return (
    <div className="flex flex-col pb-24 page-transition">
      {/* Header */}
      <div className="px-5 pt-6 pb-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button onClick={goBack} className="w-10 h-10 rounded-xl glass flex items-center justify-center">
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </button>
          <h1 className="text-lg font-bold text-foreground">Details</h1>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => navigate("add-product")}
            className="w-10 h-10 rounded-xl glass flex items-center justify-center"
          >
            <Edit className="w-4 h-4 text-foreground" />
          </button>
          <button
            onClick={() => setShowDelete(true)}
            className="w-10 h-10 rounded-xl glass flex items-center justify-center"
          >
            <Trash2 className="w-4 h-4 text-destructive" />
          </button>
        </div>
      </div>

      {/* Product Hero */}
      <div className="px-5 mb-4">
        <div className="glass rounded-2xl p-6 flex flex-col items-center">
          <div className="w-20 h-20 rounded-2xl bg-secondary flex items-center justify-center mb-4">
            <Package className="w-10 h-10 text-muted-foreground" />
          </div>
          <h2 className="text-lg font-bold text-foreground text-center">{product.name}</h2>
          <p className="text-sm text-muted-foreground mt-1">{product.brand}</p>
          <div className="flex items-center gap-4 mt-3">
            <span className="text-2xl font-bold text-primary">${product.sellPrice}</span>
            <span
              className={`text-xs px-3 py-1 rounded-full font-medium ${
                product.stock <= product.minStock
                  ? "bg-destructive/15 text-destructive"
                  : "bg-success/15 text-success"
              }`}
            >
              {product.stock} in stock
            </span>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="px-5 grid grid-cols-3 gap-3 mb-4">
        <div className="glass rounded-xl p-3 flex flex-col items-center gap-1">
          <DollarSign className="w-4 h-4 text-success" />
          <span className="text-xs text-muted-foreground">Profit</span>
          <span className="text-sm font-bold text-foreground">${profit}</span>
        </div>
        <div className="glass rounded-xl p-3 flex flex-col items-center gap-1">
          <TrendingUp className="w-4 h-4 text-primary" />
          <span className="text-xs text-muted-foreground">Margin</span>
          <span className="text-sm font-bold text-foreground">{margin}%</span>
        </div>
        <div className="glass rounded-xl p-3 flex flex-col items-center gap-1">
          <Package className="w-4 h-4 text-chart-4" />
          <span className="text-xs text-muted-foreground">Sold</span>
          <span className="text-sm font-bold text-foreground">{totalSold}</span>
        </div>
      </div>

      {/* Stock Adjustment */}
      <div className="px-5 mb-4">
        <div className="glass rounded-2xl p-4">
          <h3 className="text-sm font-semibold text-foreground mb-3">Stock Adjustment</h3>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setStockAdjust((p) => p - 1)}
              className="w-10 h-10 rounded-xl glass flex items-center justify-center"
            >
              <Minus className="w-4 h-4 text-foreground" />
            </button>
            <div className="flex-1 text-center">
              <span className={`text-2xl font-bold ${stockAdjust > 0 ? "text-success" : stockAdjust < 0 ? "text-destructive" : "text-foreground"}`}>
                {stockAdjust > 0 ? "+" : ""}{stockAdjust}
              </span>
              <p className="text-xs text-muted-foreground mt-1">
                New total: {Math.max(0, product.stock + stockAdjust)}
              </p>
            </div>
            <button
              onClick={() => setStockAdjust((p) => p + 1)}
              className="w-10 h-10 rounded-xl glass flex items-center justify-center"
            >
              <Plus className="w-4 h-4 text-foreground" />
            </button>
          </div>
          {stockAdjust !== 0 && (
            <Button
              onClick={handleStockUpdate}
              className="w-full h-10 rounded-xl bg-primary text-primary-foreground font-medium mt-3 text-sm"
            >
              Update Stock
            </Button>
          )}
        </div>
      </div>

      {/* Info Cards */}
      <div className="px-5 flex flex-col gap-3">
        <div className="glass rounded-2xl p-4 flex flex-col gap-3">
          <h3 className="text-sm font-semibold text-foreground">Product Info</h3>
          <InfoRow icon={<Barcode className="w-4 h-4" />} label="Barcode" value={product.barcode} />
          <InfoRow icon={<Package className="w-4 h-4" />} label="SKU" value={product.sku} />
          <InfoRow icon={<DollarSign className="w-4 h-4" />} label="Buy Price" value={`$${product.buyPrice}`} />
          <InfoRow icon={<Shield className="w-4 h-4" />} label="Warranty" value={product.warranty} />
          <InfoRow icon={<Truck className="w-4 h-4" />} label="Supplier" value={product.supplier} />
        </div>

        {/* Sales History */}
        {productSales.length > 0 && (
          <div className="glass rounded-2xl p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-foreground">Sales History</h3>
              <span className="text-xs text-primary font-medium">${totalRevenue} total</span>
            </div>
            <div className="flex flex-col gap-2">
              {productSales.map((sale) => (
                <div key={sale.id} className="flex items-center justify-between py-2 border-b border-border/50 last:border-0">
                  <div>
                    <p className="text-xs text-foreground">Qty: {sale.quantity}</p>
                    <p className="text-[10px] text-muted-foreground">{sale.date} &middot; {sale.customer}</p>
                  </div>
                  <span className="text-sm font-bold text-success">${sale.total}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Delete Confirmation */}
      {showDelete && (
        <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-6">
          <div className="glass rounded-2xl p-6 max-w-sm w-full">
            <h3 className="text-lg font-bold text-foreground mb-2">Delete Product?</h3>
            <p className="text-sm text-muted-foreground mb-6">
              This will permanently remove {product.name} from your inventory.
            </p>
            <div className="flex gap-3">
              <Button
                onClick={() => setShowDelete(false)}
                variant="outline"
                className="flex-1 h-10 rounded-xl"
              >
                Cancel
              </Button>
              <Button
                onClick={() => deleteProduct(product.id)}
                className="flex-1 h-10 rounded-xl bg-destructive text-destructive-foreground"
              >
                Delete
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function InfoRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center gap-3">
      <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center text-muted-foreground shrink-0">
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <span className="text-xs text-muted-foreground">{label}</span>
        <p className="text-sm text-foreground truncate">{value}</p>
      </div>
    </div>
  )
}
