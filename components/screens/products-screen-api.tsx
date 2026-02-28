"use client"

import { useMemo, useState, useEffect } from "react"
import { useApp } from "@/lib/app-context-clerk"
import { apiClient } from "@/lib/api-client"
import { Search, SlidersHorizontal, Plus, Package, ChevronRight, AlertTriangle } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"

export function ProductsScreen() {
  const { selectProduct, navigate, searchQuery, setSearchQuery, selectedCategory, setSelectedCategory } = useApp()
  const [products, setProducts] = useState<any[]>([])
  const [categories, setCategories] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [sortBy, setSortBy] = useState<"name" | "stock" | "price">("name")
  const [showFilter, setShowFilter] = useState(false)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setLoading(true)
      const [productsRes, categoriesRes] = await Promise.all([
        apiClient.getProducts({ limit: 100 }),
        apiClient.getCategories(),
      ])
      setProducts((productsRes as any).products || [])
      setCategories((categoriesRes as any) || [])
    } catch (error: any) {
      toast.error(error.message || "Failed to load products")
    } finally {
      setLoading(false)
    }
  }

  const filtered = useMemo(() => {
    let result = products
    if (selectedCategory !== "all") {
      result = result.filter((p) => p.categoryId === selectedCategory)
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase()
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.brand?.toLowerCase().includes(q) ||
          p.barcode?.toLowerCase().includes(q) ||
          p.sku.toLowerCase().includes(q)
      )
    }
    if (sortBy === "stock") result = [...result].sort((a, b) => a.stock - b.stock)
    else if (sortBy === "price") result = [...result].sort((a, b) => b.sellPrice - a.sellPrice)
    else result = [...result].sort((a, b) => a.name.localeCompare(b.name))
    return result
  }, [products, selectedCategory, searchQuery, sortBy])

  const lowStockCount = useMemo(() => {
    return products.filter((p) => p.stock <= p.minStock).length
  }, [products])

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="px-6 py-4 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Products</h1>
            <p className="text-sm text-muted-foreground mt-1">
              {products.length} products • {lowStockCount} low stock
            </p>
          </div>
          <Button onClick={() => navigate("add-product")} className="gap-2">
            <Plus className="w-4 h-4" />
            Add Product
          </Button>
        </div>

        {/* Search */}
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button
            variant="outline"
            onClick={() => setShowFilter(!showFilter)}
            className={showFilter ? "bg-primary/10" : ""}
          >
            <SlidersHorizontal className="w-4 h-4" />
          </Button>
        </div>

        {/* Filters */}
        {showFilter && (
          <div className="mt-4 p-4 glass rounded-xl space-y-3">
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Category</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-secondary border border-border text-foreground text-sm"
              >
                <option value="all">All Categories</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Sort By</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as "name" | "stock" | "price")}
                className="w-full px-3 py-2 rounded-lg bg-secondary border border-border text-foreground text-sm"
              >
                <option value="name">Name</option>
                <option value="stock">Stock</option>
                <option value="price">Price</option>
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Products Grid */}
      <div className="flex-1 overflow-y-auto p-6">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-12">
            <Package className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
            <p className="text-muted-foreground">No products found</p>
            <Button onClick={() => navigate("add-product")} className="mt-4" variant="outline">
              Add Your First Product
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filtered.map((product) => {
              const isLowStock = product.stock <= product.minStock
              return (
                <button
                  key={product.id}
                  onClick={() => selectProduct(product.id)}
                  className="glass rounded-xl p-4 text-left hover:neon-glow transition-all group"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="font-semibold text-foreground mb-1 line-clamp-2 group-hover:text-primary transition-colors">
                        {product.name}
                      </h3>
                      <p className="text-xs text-muted-foreground">{product.sku}</p>
                    </div>
                    {isLowStock && (
                      <div className="flex items-center gap-1 text-destructive">
                        <AlertTriangle className="w-4 h-4" />
                      </div>
                    )}
                  </div>

                  {product.image && (
                    <div className="w-full h-32 bg-secondary rounded-lg mb-3 overflow-hidden">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = 'none'
                        }}
                      />
                    </div>
                  )}

                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <p className="text-xs text-muted-foreground">Stock</p>
                      <p className={`text-sm font-semibold ${isLowStock ? "text-destructive" : "text-foreground"}`}>
                        {product.stock} units
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-muted-foreground">Price</p>
                      <p className="text-sm font-bold text-primary">${product.sellPrice}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-border">
                    <span className="text-xs text-muted-foreground">{product.category?.name || "Uncategorized"}</span>
                    <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                  </div>
                </button>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
