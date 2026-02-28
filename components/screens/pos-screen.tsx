"use client"

import { useState, useEffect, useMemo } from "react"
import { useApp } from "@/lib/app-context-clerk"
import { apiClient } from "@/lib/api-client"
import { ScanBarcode, Search, Plus, Minus, Trash2, X, Calculator, CreditCard, Wallet, Receipt, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { BarcodeScanner } from "@/components/barcode-scanner"
import { toast } from "sonner"

interface CartItem {
  productId: string
  name: string
  sku: string
  quantity: number
  unitPrice: number
  discount: number
  total: number
  stock: number
}

export function POSScreen() {
  const { navigate } = useApp()
  const [cart, setCart] = useState<CartItem[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [showScanner, setShowScanner] = useState(false)
  const [customerPhone, setCustomerPhone] = useState("")
  const [customer, setCustomer] = useState<any>(null)
  const [discount, setDiscount] = useState({ type: "percent" as "percent" | "fixed", value: 0 })
  const [tax, setTax] = useState(0)
  const [paymentMode, setPaymentMode] = useState<"CASH" | "UPI" | "CARD">("CASH")
  const [showPaymentModal, setShowPaymentModal] = useState(false)

  useEffect(() => {
    loadProducts()
  }, [])

  const loadProducts = async () => {
    try {
      setLoading(true)
      const response: any = await apiClient.getProducts({ limit: 100 })
      setProducts(response.products || [])
    } catch (error: any) {
      toast.error(error.message || "Failed to load products")
    } finally {
      setLoading(false)
    }
  }

  const handleScan = async (barcode: string) => {
    try {
      const product: any = await apiClient.scanProduct(barcode)
      addToCart(product)
      setShowScanner(false)
      toast.success(`${product.name} added to cart`)
    } catch (error: any) {
      toast.error(error.message || "Product not found")
    }
  }

  const addToCart = (product: any) => {
    const existingItem = cart.find((item) => item.productId === product.id)

    if (existingItem) {
      if (existingItem.quantity >= product.stock) {
        toast.error("Insufficient stock")
        return
      }
      setCart(
        cart.map((item) =>
          item.productId === product.id
            ? { ...item, quantity: item.quantity + 1, total: (item.quantity + 1) * item.unitPrice - item.discount }
            : item
        )
      )
    } else {
      setCart([
        ...cart,
        {
          productId: product.id,
          name: product.name,
          sku: product.sku,
          quantity: 1,
          unitPrice: product.sellPrice,
          discount: 0,
          total: product.sellPrice,
          stock: product.stock,
        },
      ])
    }
  }

  const updateQuantity = (productId: string, delta: number) => {
    setCart(
      cart
        .map((item) => {
          if (item.productId === productId) {
            const newQuantity = item.quantity + delta
            if (newQuantity < 1) return null
            if (newQuantity > item.stock) {
              toast.error("Insufficient stock")
              return item
            }
            return {
              ...item,
              quantity: newQuantity,
              total: newQuantity * item.unitPrice - item.discount,
            }
          }
          return item
        })
        .filter(Boolean) as CartItem[]
    )
  }

  const removeFromCart = (productId: string) => {
    setCart(cart.filter((item) => item.productId !== productId))
  }

  const updateDiscount = (productId: string, discountValue: number) => {
    setCart(
      cart.map((item) => {
        if (item.productId === productId) {
          const discountAmount = discountValue
          return {
            ...item,
            discount: discountAmount,
            total: item.quantity * item.unitPrice - discountAmount,
          }
        }
        return item
      })
    )
  }

  const subtotal = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.total, 0)
  }, [cart])

  const discountAmount = useMemo(() => {
    if (discount.type === "percent") {
      return (subtotal * discount.value) / 100
    }
    return discount.value
  }, [subtotal, discount])

  const finalAmount = useMemo(() => {
    return subtotal - discountAmount + tax
  }, [subtotal, discountAmount, tax])

  const searchProducts = async () => {
    if (!searchQuery.trim()) {
      loadProducts()
      return
    }
    try {
      setLoading(true)
      const response: any = await apiClient.getProducts({ search: searchQuery, limit: 20 })
      setProducts(response.products || [])
    } catch (error: any) {
      toast.error(error.message || "Search failed")
    } finally {
      setLoading(false)
    }
  }

  const findCustomer = async () => {
    if (!customerPhone.trim()) return
    try {
      const response: any = await apiClient.getCustomers({ search: customerPhone })
      if (response.customers && response.customers.length > 0) {
        setCustomer(response.customers[0])
        toast.success(`Customer found: ${response.customers[0].name}`)
      } else {
        setCustomer(null)
        toast.info("Customer not found. Will create new customer.")
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to search customer")
    }
  }

  const processPayment = async () => {
    if (cart.length === 0) {
      toast.error("Cart is empty")
      return
    }

    try {
      setLoading(true)
      const saleData = {
        customerId: customer?.id || null,
        items: cart.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          discount: item.discount,
        })),
        discount: discountAmount,
        tax,
        paymentMode,
        paymentStatus: "paid",
      }

      const sale: any = await apiClient.createSale(saleData)
      toast.success(`Sale completed! Invoice: ${sale.invoiceNo}`)
      
      // Clear cart and reset
      setCart([])
      setCustomer(null)
      setCustomerPhone("")
      setDiscount({ type: "percent", value: 0 })
      setTax(0)
      setShowPaymentModal(false)
      
      // Navigate to invoice or sales list
      navigate("sales")
    } catch (error: any) {
      toast.error(error.message || "Payment failed")
    } finally {
      setLoading(false)
    }
  }

  const filteredProducts = useMemo(() => {
    if (!searchQuery) return products.slice(0, 12)
    return products.filter(
      (p) =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.barcode?.toLowerCase().includes(searchQuery.toLowerCase())
    )
  }, [products, searchQuery])

  return (
    <div className="flex flex-col h-screen bg-background">
      {showScanner && <BarcodeScanner onScan={handleScan} onClose={() => setShowScanner(false)} />}

      {/* Header */}
      <div className="px-6 py-4 border-b border-border glass">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-foreground">Point of Sale</h1>
          <div className="flex gap-2">
            <Button onClick={() => setShowScanner(true)} variant="outline" size="sm" className="gap-2">
              <ScanBarcode className="w-4 h-4" />
              Scan
            </Button>
            <Button onClick={() => navigate("sales")} variant="outline" size="sm">
              View Sales
            </Button>
          </div>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Products Panel */}
        <div className="flex-1 flex flex-col border-r border-border">
          {/* Search */}
          <div className="p-4 border-b border-border">
            <div className="flex gap-2">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search products by name, SKU, or barcode..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && searchProducts()}
                  className="pl-10"
                />
              </div>
              <Button onClick={searchProducts}>Search</Button>
            </div>
          </div>

          {/* Products Grid */}
          <div className="flex-1 overflow-y-auto p-4">
            {loading ? (
              <div className="flex items-center justify-center h-64">
                <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="text-center text-muted-foreground py-12">
                <p>No products found</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {filteredProducts.map((product) => (
                  <button
                    key={product.id}
                    onClick={() => addToCart(product)}
                    disabled={product.stock === 0}
                    className="glass rounded-xl p-4 text-left hover:neon-glow transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <div className="font-semibold text-sm text-foreground mb-1 line-clamp-1">{product.name}</div>
                    <div className="text-xs text-muted-foreground mb-2">{product.sku}</div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-bold text-primary">${product.sellPrice}</span>
                      <span className="text-xs text-muted-foreground">Stock: {product.stock}</span>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Cart Panel */}
        <div className="w-96 flex flex-col border-l border-border">
          {/* Customer */}
          <div className="p-4 border-b border-border">
            <div className="flex items-center gap-2 mb-2">
              <User className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm font-medium text-foreground">Customer</span>
            </div>
            <div className="flex gap-2">
              <Input
                placeholder="Phone number"
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && findCustomer()}
                className="flex-1 text-sm"
              />
              <Button onClick={findCustomer} size="sm">Find</Button>
            </div>
            {customer && (
              <div className="mt-2 text-xs text-muted-foreground">
                {customer.name} • {customer.phone}
              </div>
            )}
          </div>

          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto p-4">
            <div className="text-sm font-semibold text-foreground mb-3">Cart ({cart.length})</div>
            {cart.length === 0 ? (
              <div className="text-center text-muted-foreground py-12">
                <p>Cart is empty</p>
                <p className="text-xs mt-2">Add products to get started</p>
              </div>
            ) : (
              <div className="space-y-3">
                {cart.map((item) => (
                  <div key={item.productId} className="glass rounded-xl p-3">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <div className="font-medium text-sm text-foreground">{item.name}</div>
                        <div className="text-xs text-muted-foreground">{item.sku}</div>
                      </div>
                      <button
                        onClick={() => removeFromCart(item.productId)}
                        className="text-destructive hover:text-destructive/80"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => updateQuantity(item.productId, -1)}
                          className="w-6 h-6 rounded bg-secondary flex items-center justify-center"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="text-sm font-medium w-8 text-center">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.productId, 1)}
                          className="w-6 h-6 rounded bg-secondary flex items-center justify-center"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-bold text-foreground">${item.total.toFixed(2)}</div>
                        <div className="text-xs text-muted-foreground">${item.unitPrice} × {item.quantity}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Totals */}
          <div className="p-4 border-t border-border space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Subtotal</span>
              <span className="font-medium text-foreground">${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex items-center gap-2">
              <Input
                type="number"
                placeholder="Discount"
                value={discount.value || ""}
                onChange={(e) => setDiscount({ ...discount, value: parseFloat(e.target.value) || 0 })}
                className="flex-1 text-sm"
              />
              <select
                value={discount.type}
                onChange={(e) => setDiscount({ ...discount, type: e.target.value as "percent" | "fixed" })}
                className="px-2 py-1.5 rounded bg-secondary text-sm"
              >
                <option value="percent">%</option>
                <option value="fixed">$</option>
              </select>
            </div>
            <div className="flex items-center gap-2">
              <Input
                type="number"
                placeholder="Tax"
                value={tax || ""}
                onChange={(e) => setTax(parseFloat(e.target.value) || 0)}
                className="flex-1 text-sm"
              />
              <span className="text-sm text-muted-foreground">$</span>
            </div>
            <div className="pt-3 border-t border-border">
              <div className="flex justify-between items-center mb-4">
                <span className="text-lg font-bold text-foreground">Total</span>
                <span className="text-2xl font-bold text-primary">${finalAmount.toFixed(2)}</span>
              </div>
              <Button
                onClick={() => setShowPaymentModal(true)}
                disabled={cart.length === 0 || loading}
                className="w-full h-12 text-base font-semibold neon-glow"
              >
                <Calculator className="w-5 h-5 mr-2" />
                Process Payment
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="glass rounded-2xl p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-foreground">Select Payment Method</h2>
              <button onClick={() => setShowPaymentModal(false)} className="text-muted-foreground hover:text-foreground">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-3 mb-6">
              <button
                onClick={() => setPaymentMode("CASH")}
                className={`w-full p-4 rounded-xl border-2 transition-all ${
                  paymentMode === "CASH"
                    ? "border-primary bg-primary/10 neon-glow"
                    : "border-border glass hover:border-primary/50"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Wallet className="w-5 h-5 text-primary" />
                  <div className="text-left">
                    <div className="font-semibold text-foreground">Cash</div>
                    <div className="text-xs text-muted-foreground">Pay with cash</div>
                  </div>
                </div>
              </button>
              <button
                onClick={() => setPaymentMode("UPI")}
                className={`w-full p-4 rounded-xl border-2 transition-all ${
                  paymentMode === "UPI"
                    ? "border-primary bg-primary/10 neon-glow"
                    : "border-border glass hover:border-primary/50"
                }`}
              >
                <div className="flex items-center gap-3">
                  <CreditCard className="w-5 h-5 text-primary" />
                  <div className="text-left">
                    <div className="font-semibold text-foreground">UPI</div>
                    <div className="text-xs text-muted-foreground">Pay via UPI</div>
                  </div>
                </div>
              </button>
              <button
                onClick={() => setPaymentMode("CARD")}
                className={`w-full p-4 rounded-xl border-2 transition-all ${
                  paymentMode === "CARD"
                    ? "border-primary bg-primary/10 neon-glow"
                    : "border-border glass hover:border-primary/50"
                }`}
              >
                <div className="flex items-center gap-3">
                  <CreditCard className="w-5 h-5 text-primary" />
                  <div className="text-left">
                    <div className="font-semibold text-foreground">Card</div>
                    <div className="text-xs text-muted-foreground">Pay with card</div>
                  </div>
                </div>
              </button>
            </div>
            <div className="flex gap-3">
              <Button onClick={() => setShowPaymentModal(false)} variant="outline" className="flex-1">
                Cancel
              </Button>
              <Button onClick={processPayment} disabled={loading} className="flex-1 neon-glow">
                {loading ? (
                  <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                ) : (
                  <>
                    <Receipt className="w-4 h-4 mr-2" />
                    Complete Payment
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
