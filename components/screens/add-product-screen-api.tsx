"use client"

import { useState, useEffect } from "react"
import { useApp } from "@/lib/app-context-clerk"
import { apiClient } from "@/lib/api-client"
import { ArrowLeft, Camera, Save } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"

export function AddProductScreen() {
  const { goBack, navigate } = useApp()
  const [categories, setCategories] = useState<any[]>([])
  const [suppliers, setSuppliers] = useState<any[]>([])
  const [form, setForm] = useState({
    name: "",
    brand: "",
    categoryId: "",
    barcode: "",
    sku: "",
    buyPrice: "",
    sellPrice: "",
    stock: "",
    minStock: "5",
    warranty: "",
    supplierId: "",
    imei: "",
    color: "",
    storage: "",
  })
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      const [categoriesRes, suppliersRes] = await Promise.all([
        apiClient.getCategories(),
        apiClient.getSuppliers(),
      ])
      setCategories((categoriesRes as any) || [])
      setSuppliers((suppliersRes as any) || [])
      if (categories.length > 0 && !form.categoryId) {
        setForm(prev => ({ ...prev, categoryId: categories[0].id }))
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to load data")
    }
  }

  const update = (key: string, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  const handleSave = async () => {
    if (!form.name || !form.categoryId || !form.sku) {
      toast.error("Please fill in required fields (Name, Category, SKU)")
      return
    }

    setSaving(true)
    try {
      await apiClient.createProduct({
        name: form.name,
        brand: form.brand || null,
        categoryId: form.categoryId,
        barcode: form.barcode || null,
        sku: form.sku,
        buyPrice: parseFloat(form.buyPrice) || 0,
        sellPrice: parseFloat(form.sellPrice) || 0,
        stock: parseInt(form.stock) || 0,
        minStock: parseInt(form.minStock) || 5,
        warranty: form.warranty || null,
        supplierId: form.supplierId || null,
        imei: form.imei || null,
        color: form.color || null,
        storage: form.storage || null,
      })
      toast.success("Product created successfully")
      navigate("products")
    } catch (error: any) {
      toast.error(error.message || "Failed to create product")
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="flex flex-col h-full overflow-y-auto">
      {/* Header */}
      <div className="px-6 py-4 border-b border-border sticky top-0 bg-background/95 backdrop-blur z-10">
        <div className="flex items-center gap-3">
          <button onClick={goBack} className="w-10 h-10 rounded-xl glass flex items-center justify-center">
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </button>
          <h1 className="text-xl font-bold text-foreground">Add Product</h1>
        </div>
      </div>

      <div className="flex-1 p-6 space-y-4">
        {/* Image placeholder */}
        <button
          onClick={() => navigate("scan")}
          className="w-full h-36 rounded-2xl glass flex flex-col items-center justify-center gap-2 hover:bg-secondary/50 transition-colors"
        >
          <Camera className="w-8 h-8 text-muted-foreground" />
          <span className="text-xs text-muted-foreground">Tap to scan barcode or add image</span>
        </button>

        {/* Form Fields */}
        <div className="flex flex-col gap-4">
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Product Name *</label>
            <Input
              placeholder="e.g. iPhone 16 Pro"
              value={form.name}
              onChange={(e) => update("name", e.target.value)}
              className="h-11"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Brand</label>
              <Input
                placeholder="e.g. Apple"
                value={form.brand}
                onChange={(e) => update("brand", e.target.value)}
                className="h-11"
              />
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Category *</label>
              <select
                value={form.categoryId}
                onChange={(e) => update("categoryId", e.target.value)}
                className="w-full h-11 px-3 rounded-xl bg-secondary border border-border text-foreground text-sm"
              >
                <option value="">Select category...</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
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
                className="h-11"
              />
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">SKU *</label>
              <Input
                placeholder="Auto-generate"
                value={form.sku}
                onChange={(e) => update("sku", e.target.value)}
                className="h-11"
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
                className="h-11"
              />
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Sell Price ($)</label>
              <Input
                type="number"
                placeholder="0.00"
                value={form.sellPrice}
                onChange={(e) => update("sellPrice", e.target.value)}
                className="h-11"
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
                className="h-11"
              />
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Min Stock Alert</label>
              <Input
                type="number"
                placeholder="5"
                value={form.minStock}
                onChange={(e) => update("minStock", e.target.value)}
                className="h-11"
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
                className="h-11"
              />
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Supplier</label>
              <select
                value={form.supplierId}
                onChange={(e) => update("supplierId", e.target.value)}
                className="w-full h-11 px-3 rounded-xl bg-secondary border border-border text-foreground text-sm"
              >
                <option value="">Select supplier...</option>
                {suppliers.map((sup) => (
                  <option key={sup.id} value={sup.id}>
                    {sup.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">IMEI</label>
              <Input
                placeholder="For mobiles"
                value={form.imei}
                onChange={(e) => update("imei", e.target.value)}
                className="h-11"
              />
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Color</label>
              <Input
                placeholder="e.g. Black"
                value={form.color}
                onChange={(e) => update("color", e.target.value)}
                className="h-11"
              />
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Storage</label>
              <Input
                placeholder="e.g. 256GB"
                value={form.storage}
                onChange={(e) => update("storage", e.target.value)}
                className="h-11"
              />
            </div>
          </div>
        </div>

        <Button
          onClick={handleSave}
          disabled={saving || !form.name || !form.categoryId || !form.sku}
          className="w-full h-12 rounded-xl bg-primary text-primary-foreground font-semibold neon-glow"
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
