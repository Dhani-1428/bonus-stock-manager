"use client"

import { useMemo, useState } from "react"
import { useApp } from "@/lib/app-context"
import { Search, SlidersHorizontal, Plus, Package, ChevronRight } from "lucide-react"
import { Input } from "@/components/ui/input"
import { categories } from "@/lib/store"

export function ProductsScreen() {
  const { products, selectProduct, navigate, searchQuery, setSearchQuery } = useApp()
  const [selectedCat, setSelectedCat] = useState("all")
  const [sortBy, setSortBy] = useState<"name" | "stock" | "price">("name")
  const [showFilter, setShowFilter] = useState(false)

  const filtered = useMemo(() => {
    let result = products
    if (selectedCat !== "all") {
      result = result.filter((p) => p.category === selectedCat)
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase()
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.brand.toLowerCase().includes(q) ||
          p.barcode.includes(q)
      )
    }
    if (sortBy === "stock") result = [...result].sort((a, b) => a.stock - b.stock)
    else if (sortBy === "price") result = [...result].sort((a, b) => b.sellPrice - a.sellPrice)
    else result = [...result].sort((a, b) => a.name.localeCompare(b.name))
    return result
  }, [products, selectedCat, searchQuery, sortBy])

  return (
    <div className="flex flex-col pb-24 page-transition">
      {/* Header */}
      <div className="px-5 pt-6 pb-2">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-bold text-foreground">Products</h1>
          <button
            onClick={() => navigate("add-product")}
            className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center neon-glow"
          >
            <Plus className="w-5 h-5 text-primary-foreground" />
          </button>
        </div>

        {/* Search */}
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search by name, brand, barcode..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-11 bg-secondary border-border rounded-xl text-foreground placeholder:text-muted-foreground text-sm"
            />
          </div>
          <button
            onClick={() => setShowFilter(!showFilter)}
            className={`w-11 h-11 rounded-xl flex items-center justify-center transition-all ${
              showFilter ? "bg-primary text-primary-foreground" : "glass text-muted-foreground"
            }`}
          >
            <SlidersHorizontal className="w-4 h-4" />
          </button>
        </div>

        {/* Sort options */}
        {showFilter && (
          <div className="flex gap-2 mt-3 animate-count">
            {(["name", "stock", "price"] as const).map((s) => (
              <button
                key={s}
                onClick={() => setSortBy(s)}
                className={`px-4 py-2 rounded-lg text-xs font-medium transition-all ${
                  sortBy === s ? "bg-primary text-primary-foreground" : "glass text-muted-foreground"
                }`}
              >
                {s.charAt(0).toUpperCase() + s.slice(1)}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Category Pills */}
      <div className="px-5 py-3 flex gap-2 overflow-x-auto no-scrollbar">
        <button
          onClick={() => setSelectedCat("all")}
          className={`px-4 py-2 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
            selectedCat === "all" ? "bg-primary text-primary-foreground" : "glass text-muted-foreground"
          }`}
        >
          All ({products.length})
        </button>
        {categories.map((cat) => {
          const count = products.filter((p) => p.category === cat.id).length
          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCat(cat.id)}
              className={`px-4 py-2 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
                selectedCat === cat.id ? "bg-primary text-primary-foreground" : "glass text-muted-foreground"
              }`}
            >
              {cat.label} ({count})
            </button>
          )
        })}
      </div>

      {/* Product List */}
      <div className="px-5 flex flex-col gap-3">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 gap-3">
            <Package className="w-12 h-12 text-muted-foreground/30" />
            <p className="text-sm text-muted-foreground">No products found</p>
          </div>
        ) : (
          filtered.map((product, i) => (
            <button
              key={product.id}
              onClick={() => selectProduct(product.id)}
              className="glass rounded-2xl p-4 flex items-center gap-4 text-left w-full hover:bg-secondary/50 transition-all duration-200"
              style={{ animationDelay: `${i * 50}ms` }}
            >
              <div className="w-14 h-14 rounded-xl bg-secondary flex items-center justify-center shrink-0 overflow-hidden">
                <Package className="w-6 h-6 text-muted-foreground" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-foreground truncate">{product.name}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{product.brand} &middot; {product.sku}</p>
                <div className="flex items-center gap-3 mt-1.5">
                  <span className="text-xs font-bold text-primary">${product.sellPrice}</span>
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                      product.stock <= product.minStock
                        ? "bg-destructive/15 text-destructive"
                        : product.stock <= product.minStock * 2
                        ? "bg-warning/15 text-warning"
                        : "bg-success/15 text-success"
                    }`}
                  >
                    {product.stock} in stock
                  </span>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0" />
            </button>
          ))
        )}
      </div>
    </div>
  )
}
