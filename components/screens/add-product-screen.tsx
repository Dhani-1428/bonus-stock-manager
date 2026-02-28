"use client"

import { useState } from "react"
import { useApp } from "@/lib/app-context"
import { ArrowLeft, Camera, Save } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { categories, type Product } from "@/lib/store"

export function AddProductScreen() {
  const { addProduct, goBack, navigate } = useApp()
  const [form, setForm] = useState({
    name: "",
    brand: "",
    category: "mobiles" as Product["category"],
    barcode: "",
    sku: "",
    buyPrice: "",
    sellPrice: "",
    stock: "",
    minStock: "",
    warranty: "",
    supplier: "",
  })
  const [saving, setSaving] = useState(false)

  const update = (key: string, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  const handleSave = () => {
    if (!form.name || !form.brand) return
    setSaving(true)
    setTimeout(() => {
      const product: Product = {
        id: Date.now().toString(),
        name: form.name,
        brand: form.brand,
        category: form.category,
        barcode: form.barcode || Math.random().toString().slice(2, 15),
        sku: form.sku || `SKU-${Date.now().toString().slice(-6)}`,
        buyPrice: parseFloat(form.buyPrice) || 0,
        sellPrice: parseFloat(form.sellPrice) || 0,
        stock: parseInt(form.stock) || 0,
        minStock: parseInt(form.minStock) || 5,
        warranty: form.warranty || "N/A",
        image: "",
        dateAdded: new Date().toISOString().split("T")[0],
        supplier: form.supplier || "N/A",
      }
      addProduct(product)
      navigate("products")
      setSaving(false)
    }, 500)
  }

  return (
    <div className="flex flex-col pb-24 page-transition">
      {/* Header */}
      <div className="px-5 pt-6 pb-4 flex items-center gap-3">
        <button onClick={goBack} className="w-10 h-10 rounded-xl glass flex items-center justify-center">
          <ArrowLeft className="w-5 h-5 text-foreground" />
        </button>
        <h1 className="text-xl font-bold text-foreground">Add Product</h1>
      </div>

      <div className="px-5 flex flex-col gap-4">
        {/* Image placeholder */}
        <button
          onClick={() => navigate("scan")}
          className="w-full h-36 rounded-2xl glass flex flex-col items-center justify-center gap-2 hover:bg-secondary/50 transition-colors"
        >
          <Camera className="w-8 h-8 text-muted-foreground" />
          <span className="text-xs text-muted-foreground">Tap to scan barcode or add image</span>
        </button>

        {/* Form Fields */}
        <div className="flex flex-col gap-3">
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Product Name *</label>
            <Input
              placeholder="e.g. iPhone 16 Pro"
              value={form.name}
              onChange={(e) => update("name", e.target.value)}
              className="h-11 bg-secondary border-border rounded-xl text-foreground"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Brand *</label>
              <Input
                placeholder="e.g. Apple"
                value={form.brand}
                onChange={(e) => update("brand", e.target.value)}
                className="h-11 bg-secondary border-border rounded-xl text-foreground"
              />
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Category</label>
              <select
                value={form.category}
                onChange={(e) => update("category", e.target.value)}
                className="w-full h-11 bg-secondary border border-border rounded-xl text-foreground text-sm px-3"
              >
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Barcode</label>
              <Input
                placeholder="Scan or enter"
                value={form.barcode}
                onChange={(e) => update("barcode", e.target.value)}
                className="h-11 bg-secondary border-border rounded-xl text-foreground"
              />
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">SKU</label>
              <Input
                placeholder="Auto-generate"
                value={form.sku}
                onChange={(e) => update("sku", e.target.value)}
                className="h-11 bg-secondary border-border rounded-xl text-foreground"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Buy Price ($)</label>
              <Input
                type="number"
                placeholder="0.00"
                value={form.buyPrice}
                onChange={(e) => update("buyPrice", e.target.value)}
                className="h-11 bg-secondary border-border rounded-xl text-foreground"
              />
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Sell Price ($)</label>
              <Input
                type="number"
                placeholder="0.00"
                value={form.sellPrice}
                onChange={(e) => update("sellPrice", e.target.value)}
                className="h-11 bg-secondary border-border rounded-xl text-foreground"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Stock Qty</label>
              <Input
                type="number"
                placeholder="0"
                value={form.stock}
                onChange={(e) => update("stock", e.target.value)}
                className="h-11 bg-secondary border-border rounded-xl text-foreground"
              />
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Min Stock Alert</label>
              <Input
                type="number"
                placeholder="5"
                value={form.minStock}
                onChange={(e) => update("minStock", e.target.value)}
                className="h-11 bg-secondary border-border rounded-xl text-foreground"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Warranty</label>
              <Input
                placeholder="e.g. 12 months"
                value={form.warranty}
                onChange={(e) => update("warranty", e.target.value)}
                className="h-11 bg-secondary border-border rounded-xl text-foreground"
              />
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Supplier</label>
              <Input
                placeholder="Supplier name"
                value={form.supplier}
                onChange={(e) => update("supplier", e.target.value)}
                className="h-11 bg-secondary border-border rounded-xl text-foreground"
              />
            </div>
          </div>
        </div>

        <Button
          onClick={handleSave}
          disabled={saving || !form.name || !form.brand}
          className="h-12 rounded-xl bg-primary text-primary-foreground font-semibold neon-glow mt-2"
        >
          {saving ? (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
              Saving...
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Save className="w-4 h-4" />
              Save Product
            </div>
          )}
        </Button>
      </div>
    </div>
  )
}
