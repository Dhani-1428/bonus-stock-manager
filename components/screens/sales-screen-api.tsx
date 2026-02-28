"use client"

import { useMemo, useState, useEffect } from "react"
import { useApp } from "@/lib/app-context-clerk"
import { apiClient } from "@/lib/api-client"
import { DollarSign, Calendar, User, Package, Receipt, Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { generateInvoicePDF } from "@/lib/invoice-pdf"
import { toast } from "sonner"

export function SalesScreen() {
  const { navigate } = useApp()
  const [sales, setSales] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [dateFilter, setDateFilter] = useState<'today' | 'week' | 'month' | 'all'>('today')

  useEffect(() => {
    loadSales()
  }, [dateFilter])

  const loadSales = async () => {
    try {
      setLoading(true)
      const today = new Date()
      let startDate: string | undefined
      
      if (dateFilter === 'today') {
        startDate = today.toISOString().split('T')[0]
      } else if (dateFilter === 'week') {
        const weekAgo = new Date(today)
        weekAgo.setDate(weekAgo.getDate() - 7)
        startDate = weekAgo.toISOString().split('T')[0]
      } else if (dateFilter === 'month') {
        const monthAgo = new Date(today)
        monthAgo.setMonth(monthAgo.getMonth() - 1)
        startDate = monthAgo.toISOString().split('T')[0]
      }

      const response: any = await apiClient.getSales({ 
        startDate,
        limit: 100 
      })
      setSales(response.sales || [])
    } catch (error: any) {
      toast.error(error.message || "Failed to load sales")
    } finally {
      setLoading(false)
    }
  }

  const todaySales = useMemo(() => {
    const today = new Date().toISOString().split('T')[0]
    return sales.filter((s) => s.createdAt?.startsWith(today))
  }, [sales])

  const todayTotal = useMemo(() => {
    return todaySales.reduce((sum, s) => sum + s.finalAmount, 0)
  }, [todaySales])

  const groupedByDate = useMemo(() => {
    const groups: Record<string, any[]> = {}
    for (const sale of sales) {
      const date = sale.createdAt?.split('T')[0] || 'Unknown'
      if (!groups[date]) groups[date] = []
      groups[date].push(sale)
    }
    return Object.entries(groups).sort(([a], [b]) => b.localeCompare(a))
  }, [sales])

  const handlePrintInvoice = async (sale: any) => {
    try {
      const invoiceData = {
        invoiceNo: sale.invoiceNo,
        date: sale.createdAt,
        customer: sale.customer ? {
          name: sale.customer.name,
          phone: sale.customer.phone,
          email: sale.customer.email,
          address: sale.customer.address,
        } : undefined,
        items: sale.items.map((item: any) => ({
          name: item.product.name,
          sku: item.product.sku,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          discount: item.discount,
          total: item.total,
        })),
        subtotal: sale.totalAmount,
        discount: sale.discount,
        tax: sale.tax,
        finalAmount: sale.finalAmount,
        paymentMode: sale.paymentMode,
        paymentStatus: sale.paymentStatus,
      }
      await generateInvoicePDF(invoiceData)
      toast.success("Invoice downloaded")
    } catch (error: any) {
      toast.error(error.message || "Failed to generate invoice")
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="px-6 py-4 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold text-foreground">Sales</h1>
          <Button onClick={() => navigate("pos")} className="gap-2">
            <Package className="w-4 h-4" />
            New Sale
          </Button>
        </div>

        {/* Date Filter */}
        <div className="flex gap-2 mb-4">
          {(['today', 'week', 'month', 'all'] as const).map((filter) => (
            <button
              key={filter}
              onClick={() => setDateFilter(filter)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                dateFilter === filter
                  ? "bg-primary text-primary-foreground"
                  : "glass text-muted-foreground hover:text-foreground"
              }`}
            >
              {filter.charAt(0).toUpperCase() + filter.slice(1)}
            </button>
          ))}
        </div>

        {/* Today summary */}
        <div className="glass rounded-2xl p-4 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-success/15 flex items-center justify-center">
            <DollarSign className="w-6 h-6 text-success" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Today's Revenue</p>
            <p className="text-2xl font-bold text-foreground">${todayTotal.toLocaleString()}</p>
            <p className="text-xs text-muted-foreground">{todaySales.length} transactions</p>
          </div>
        </div>
      </div>

      {/* Sales List */}
      <div className="flex-1 overflow-y-auto p-6">
        {sales.length === 0 ? (
          <div className="text-center py-12">
            <Package className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
            <p className="text-muted-foreground">No sales found</p>
            <Button onClick={() => navigate("pos")} className="mt-4" variant="outline">
              Create First Sale
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            {groupedByDate.map(([date, dateSales]) => {
              const dateTotal = dateSales.reduce((sum, s) => sum + s.finalAmount, 0)
              return (
                <div key={date}>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm font-medium text-foreground">
                        {new Date(date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                      </span>
                    </div>
                    <span className="text-sm font-bold text-primary">${dateTotal.toFixed(2)}</span>
                  </div>
                  <div className="flex flex-col gap-2">
                    {dateSales.map((sale) => (
                      <div key={sale.id} className="glass rounded-xl p-4 flex items-center gap-4 hover:bg-secondary/50 transition-colors">
                        <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                          <Receipt className="w-5 h-5 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <p className="text-sm font-semibold text-foreground">{sale.invoiceNo}</p>
                            <span className={`text-xs px-2 py-0.5 rounded-full ${
                              sale.paymentStatus === 'paid' 
                                ? 'bg-success/15 text-success' 
                                : 'bg-warning/15 text-warning'
                            }`}>
                              {sale.paymentStatus}
                            </span>
                          </div>
                          <p className="text-xs text-muted-foreground mb-1">
                            {sale.items?.length || 0} items
                            {sale.customer && ` • ${sale.customer.name}`}
                          </p>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <span>{sale.paymentMode}</span>
                            <span>•</span>
                            <span>{new Date(sale.createdAt).toLocaleTimeString()}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-lg font-bold text-success">${sale.finalAmount.toFixed(2)}</span>
                          <Button
                            onClick={() => handlePrintInvoice(sale)}
                            variant="outline"
                            size="sm"
                            className="gap-2"
                          >
                            <Download className="w-4 h-4" />
                            Invoice
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
