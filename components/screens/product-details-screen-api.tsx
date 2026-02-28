"use client"

import { useMemo, useState, useEffect } from "react"
import { useApp } from "@/lib/app-context-clerk"
import { apiClient } from "@/lib/api-client"
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
import { BarcodeGenerator } from "@/components/barcode-generator"
import { toast } from "sonner"

export function ProductDetailsScreen() {
  const { selectedProductId, goBack, navigate } = useApp()
  const [product, setProduct] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [stockAdjust, setStockAdjust] = useState(0)
  const [showDelete, setShowDelete] = useState(false)
  const [showBarcode, setShowBarcode] = useState(false)

  useEffect(() => {
    if (selectedProductId) {
      loadProduct()
    }
  }, [selectedProductId])

  const loadProduct = async () => {
    try {
      setLoading(true)
      const data: any = await apiClient.getProduct(selectedProductId)
      setProduct(data)
    } catch (error: any) {
      toast.error(error.message || "Failed to load product")
      goBack()
    } finally {
      setLoading(false)
    }
  }

  const handleStockUpdate = async () => {
    if (stockAdjust === 0 || !product) return
    try {
      const newStock = Math.max(0, product.stock + stockAdjust)
      await apiClient.updateProduct(product.id, { stock: newStock })
      setProduct({ ...product, stock: newStock })
      setStockAdjust(0)
      toast.success("Stock updated successfully")
    } catch (error: any) {
      toast.error(error.message || "Failed to update stock")
    }
  }

  const handleDelete = async () => {
    if (!product) return
    try {
      await apiClient.deleteProduct(product.id)
      toast.success("Product deleted")
      navigate("products")
    } catch (error: any) {
      toast.error(error.message || "Failed to delete product")
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!product) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <Package className="w-16 h-16 text-muted-foreground/30 mb-4" />
        <p className="text-muted-foreground">Product not found</p>
        <Button onClick={goBack} variant="ghost" className="mt-4">
          Go Back
        </Button>
      </div>
    )
  }

  const profit = product.sellPrice - product.buyPrice
  const margin = product.buyPrice > 0 ? ((profit / product.buyPrice) * 100).toFixed(1) : "0"

  return (
    <div className="flex flex-col h-full overflow-y-auto">
      {/* Header */}
      <div className="px-6 py-4 border-b border-border flex items-center justify-between sticky top-0 bg-background/95 backdrop-blur z-10">
        <div className="flex items-center gap-3">
          <button onClick={goBack} className="w-10 h-10 rounded-xl glass flex items-center justify-center">
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </button>
          <h1 className="text-lg font-bold text-foreground">Product Details</h1>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setShowBarcode(!showBarcode)}
            className="w-10 h-10 rounded-xl glass flex items-center justify-center"
          >
            <Barcode className="w-4 h-4 text-foreground" />
          </button>
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

      <div className="flex-1 p-6 space-y-6">
        {/* Product Hero */}
        <div className="glass rounded-2xl p-6 flex flex-col items-center">
          {product.image && (
            <img src={product.image} alt={product.name} className="w-32 h-32 object-cover rounded-xl mb-4" />
          )}
          {!product.image && (
            <div className="w-20 h-20 rounded-2xl bg-secondary flex items-center justify-center mb-4">
              <Package className="w-10 h-10 text-muted-foreground" />
            </div>
          )}
          <h2 className="text-xl font-bold text-foreground text-center">{product.name}</h2>
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

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-3">
          <div className="glass rounded-xl p-3 flex flex-col items-center gap-1">
            <DollarSign className="w-4 h-4 text-success" />
            <span className="text-xs text-muted-foreground">Profit</span>
            <span className="text-sm font-bold text-foreground">${profit.toFixed(2)}</span>
          </div>
          <div className="glass rounded-xl p-3 flex flex-col items-center gap-1">
            <TrendingUp className="w-4 h-4 text-primary" />
            <span className="text-xs text-muted-foreground">Margin</span>
            <span className="text-sm font-bold text-foreground">{margin}%</span>
          </div>
          <div className="glass rounded-xl p-3 flex flex-col items-center gap-1">
            <Package className="w-4 h-4 text-chart-4" />
            <span className="text-xs text-muted-foreground">Category</span>
            <span className="text-sm font-bold text-foreground truncate w-full text-center">
              {product.category?.name || "N/A"}
            </span>
          </div>
        </div>

        {/* Stock Adjustment */}
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
              className="w-full h-10 rounded-xl bg-primary text-primary-foreground font-medium mt-3"
            >
              Update Stock
            </Button>
          )}
        </div>

        {/* Barcode Generator */}
        {showBarcode && (
          <div>
            <BarcodeGenerator
              productId={product.id}
              productName={product.name}
              sku={product.sku}
              barcode={product.barcode}
            />
          </div>
        )}

        {/* Info Cards */}
        <div className="glass rounded-2xl p-4 flex flex-col gap-3">
          <h3 className="text-sm font-semibold text-foreground">Product Info</h3>
          <InfoRow icon={<Barcode className="w-4 h-4" />} label="Barcode" value={product.barcode || "N/A"} />
          <InfoRow icon={<Package className="w-4 h-4" />} label="SKU" value={product.sku} />
          <InfoRow icon={<DollarSign className="w-4 h-4" />} label="Buy Price" value={`$${product.buyPrice}`} />
          <InfoRow icon={<Shield className="w-4 h-4" />} label="Warranty" value={product.warranty || "N/A"} />
          <InfoRow icon={<Truck className="w-4 h-4" />} label="Supplier" value={product.supplier?.name || "N/A"} />
          {product.imei && <InfoRow icon={<Package className="w-4 h-4" />} label="IMEI" value={product.imei} />}
          {product.color && <InfoRow icon={<Package className="w-4 h-4" />} label="Color" value={product.color} />}
          {product.storage && <InfoRow icon={<Package className="w-4 h-4" />} label="Storage" value={product.storage} />}
        </div>
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
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                onClick={handleDelete}
                className="flex-1 bg-destructive text-destructive-foreground"
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
