import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAuth } from '@/lib/auth-clerk'

export const GET = requireAuth(async (request: NextRequest) => {
  try {
    const { searchParams } = new URL(request.url)
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')
    const groupBy = searchParams.get('groupBy') || 'day' // day, week, month

    const where: any = {}
    if (startDate || endDate) {
      where.createdAt = {}
      if (startDate) where.createdAt.gte = new Date(startDate)
      if (endDate) where.createdAt.lte = new Date(endDate)
    }

    const sales = await prisma.sale.findMany({
      where,
      include: {
        items: {
          include: {
            product: {
              select: {
                category: {
                  select: { name: true },
                },
              },
            },
          },
        },
      },
      orderBy: { createdAt: 'asc' },
    })

    // Calculate totals
    const totalSales = sales.length
    const totalRevenue = sales.reduce((sum, s) => sum + s.finalAmount, 0)
    const totalProfit = sales.reduce((sum, sale) => {
      const cost = sale.items.reduce((itemSum, item) => {
        return itemSum + (item.product.buyPrice || 0) * item.quantity
      }, 0)
      return sum + (sale.finalAmount - cost)
    }, 0)

    // Group by period
    const grouped: Record<string, any> = {}
    sales.forEach((sale) => {
      const date = new Date(sale.createdAt)
      let key = ''
      
      if (groupBy === 'day') {
        key = date.toISOString().split('T')[0]
      } else if (groupBy === 'week') {
        const week = getWeek(date)
        key = week
      } else if (groupBy === 'month') {
        key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
      }

      if (!grouped[key]) {
        grouped[key] = {
          period: key,
          sales: 0,
          revenue: 0,
          profit: 0,
        }
      }

      grouped[key].sales += 1
      grouped[key].revenue += sale.finalAmount
      const cost = sale.items.reduce((sum, item) => {
        return sum + (item.product.buyPrice || 0) * item.quantity
      }, 0)
      grouped[key].profit += sale.finalAmount - cost
    })

    return NextResponse.json({
      summary: {
        totalSales,
        totalRevenue,
        totalProfit,
        averageOrderValue: totalSales > 0 ? totalRevenue / totalSales : 0,
      },
      grouped: Object.values(grouped),
    })
  } catch (error) {
    console.error('Get sales report error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
})

function getWeek(date: Date): string {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()))
  const dayNum = d.getUTCDay() || 7
  d.setUTCDate(d.getUTCDate() + 4 - dayNum)
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1))
  return `${d.getUTCFullYear()}-W${String(Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7)).padStart(2, '0')}`
}
