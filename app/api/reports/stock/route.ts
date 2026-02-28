import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAuth } from '@/lib/auth-clerk'

export const GET = requireAuth(async (request: NextRequest) => {
  try {
    const { searchParams } = new URL(request.url)
    const lowStock = searchParams.get('lowStock') === 'true'
    const categoryId = searchParams.get('categoryId')

    const where: any = { isActive: true }

    if (lowStock) {
      const products = await prisma.product.findMany({
        where: { isActive: true },
        include: { category: true },
      })
      const lowStockProducts = products.filter(
        (p) => p.stock <= p.minStock
      )
      return NextResponse.json({ products: lowStockProducts })
    }

    if (categoryId) {
      where.categoryId = categoryId
    }

    const products = await prisma.product.findMany({
      where,
      include: {
        category: true,
        supplier: true,
      },
      orderBy: { name: 'asc' },
    })

    // Calculate stock value
    const totalStockValue = products.reduce(
      (sum, p) => sum + p.stock * p.buyPrice,
      0
    )

    return NextResponse.json({
      products,
      summary: {
        totalProducts: products.length,
        totalStockValue,
        lowStockCount: products.filter((p) => p.stock <= p.minStock).length,
      },
    })
  } catch (error) {
    console.error('Get stock report error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
})
