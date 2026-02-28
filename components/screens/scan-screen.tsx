"use client"

import { useState } from "react"
import { useApp } from "@/lib/app-context"
import { ArrowLeft, Flashlight, SwitchCamera, Keyboard, Package } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export function ScanScreen() {
  const { products, selectProduct, goBack, navigate } = useApp()
  const [flashOn, setFlashOn] = useState(false)
  const [manualMode, setManualMode] = useState(false)
  const [barcode, setBarcode] = useState("")
  const [scanResult, setScanResult] = useState<string | null>(null)
  const [notFound, setNotFound] = useState(false)

  const handleManualSearch = () => {
    if (!barcode.trim()) return
    const product = products.find(
      (p) => p.barcode === barcode.trim() || p.sku.toLowerCase() === barcode.trim().toLowerCase()
    )
    if (product) {
      setScanResult(product.id)
      setNotFound(false)
    } else {
      setScanResult(null)
      setNotFound(true)
    }
  }

  const handleSimulateScan = () => {
    // Simulate scanning a random product
    const randomProduct = products[Math.floor(Math.random() * products.length)]
    setScanResult(randomProduct.id)
    setNotFound(false)
  }

  const foundProduct = scanResult ? products.find((p) => p.id === scanResult) : null

  return (
    <div className="flex flex-col min-h-screen page-transition">
      {/* Header */}
      <div className="px-5 pt-6 pb-4 flex items-center justify-between relative z-10">
        <button onClick={goBack} className="w-10 h-10 rounded-xl glass flex items-center justify-center">
          <ArrowLeft className="w-5 h-5 text-foreground" />
        </button>
        <h1 className="text-lg font-bold text-foreground">Scan Product</h1>
        <div className="flex gap-2">
          <button
            onClick={() => setFlashOn(!flashOn)}
            className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
              flashOn ? "bg-warning text-background" : "glass text-foreground"
            }`}
          >
            <Flashlight className="w-4 h-4" />
          </button>
          <button
            onClick={() => setManualMode(!manualMode)}
            className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
              manualMode ? "bg-primary text-primary-foreground" : "glass text-foreground"
            }`}
          >
            <Keyboard className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Scanner Area */}
      <div className="flex-1 flex flex-col items-center justify-center px-5">
        {manualMode ? (
          <div className="w-full flex flex-col gap-4">
            <div className="glass rounded-2xl p-6 flex flex-col items-center gap-4">
              <Package className="w-12 h-12 text-muted-foreground" />
              <p className="text-sm text-muted-foreground text-center">
                Enter barcode number or SKU to search
              </p>
              <Input
                placeholder="Enter barcode or SKU..."
                value={barcode}
                onChange={(e) => setBarcode(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleManualSearch()}
                className="h-12 bg-secondary border-border rounded-xl text-foreground text-center text-lg font-mono"
              />
              <Button
                onClick={handleManualSearch}
                className="w-full h-11 rounded-xl bg-primary text-primary-foreground font-medium"
              >
                Search
              </Button>
            </div>
          </div>
        ) : (
          <div className="w-full flex flex-col items-center gap-6">
            {/* Simulated camera viewfinder */}
            <div className="relative w-64 h-64 rounded-2xl overflow-hidden">
              <div className="absolute inset-0 bg-secondary/80 flex items-center justify-center">
                <div className="w-48 h-48 relative">
                  {/* Corner brackets */}
                  <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-primary rounded-tl-lg" />
                  <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-primary rounded-tr-lg" />
                  <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-primary rounded-bl-lg" />
                  <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-primary rounded-br-lg" />

                  {/* Scan beam */}
                  <div className="absolute left-2 right-2 h-0.5 bg-primary neon-glow scan-beam" />
                </div>
              </div>
            </div>

            <p className="text-sm text-muted-foreground text-center">
              Position the barcode within the frame
            </p>

            <div className="flex gap-3">
              <Button
                onClick={handleSimulateScan}
                className="h-11 rounded-xl bg-primary text-primary-foreground font-medium px-6 neon-glow"
              >
                <SwitchCamera className="w-4 h-4 mr-2" />
                Simulate Scan
              </Button>
            </div>
          </div>
        )}

        {/* Result */}
        {foundProduct && (
          <div className="w-full mt-6 animate-count">
            <div className="glass rounded-2xl p-4 neon-glow">
              <p className="text-xs text-primary font-medium mb-2">Product Found</p>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center">
                  <Package className="w-6 h-6 text-muted-foreground" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-foreground truncate">{foundProduct.name}</p>
                  <p className="text-xs text-muted-foreground">{foundProduct.brand} &middot; ${foundProduct.sellPrice}</p>
                </div>
              </div>
              <div className="flex gap-2 mt-3">
                <Button
                  onClick={() => selectProduct(foundProduct.id)}
                  className="flex-1 h-9 rounded-lg bg-primary text-primary-foreground text-xs"
                >
                  View Details
                </Button>
                <Button
                  onClick={() => navigate("sales")}
                  variant="outline"
                  className="flex-1 h-9 rounded-lg text-xs"
                >
                  Add to Sale
                </Button>
              </div>
            </div>
          </div>
        )}

        {notFound && (
          <div className="w-full mt-6 animate-count">
            <div className="glass rounded-2xl p-4 border border-destructive/30">
              <p className="text-sm text-destructive font-medium mb-1">Product Not Found</p>
              <p className="text-xs text-muted-foreground mb-3">
                No product matches this barcode or SKU.
              </p>
              <Button
                onClick={() => navigate("add-product")}
                className="w-full h-9 rounded-lg bg-primary text-primary-foreground text-xs"
              >
                Add New Product
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
