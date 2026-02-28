import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAuthUser } from '@/lib/auth-clerk'
import { getPrismaUserId } from '@/lib/clerk-prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        category: true,
        supplier: true,
        stockMovements: {
          orderBy: { createdAt: 'desc' },
          take: 10,
        },
      },
    })

    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(product)
  } catch (error) {
    console.error('Get product error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getAuthUser(request)
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    // Get Prisma user ID from Clerk user
    const prismaUserId = await getPrismaUserId()
    if (!prismaUserId) {
      return NextResponse.json(
        { error: 'User not found in database' },
        { status: 404 }
      )
    }

    const { id } = await params
    const data = await request.json()
    const product = await prisma.product.findUnique({
      where: { id },
    })

    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      )
    }

    // Track stock change
    const oldStock = product.stock
    const newStock = data.stock !== undefined ? parseInt(data.stock) : oldStock
    const stockDiff = newStock - oldStock

    const updated = await prisma.product.update({
      where: { id },
      data: {
        name: data.name,
        brand: data.brand,
        categoryId: data.categoryId,
        barcode: data.barcode,
        sku: data.sku,
        imei: data.imei,
        serialNo: data.serialNo,
        buyPrice: data.buyPrice ? parseFloat(data.buyPrice) : undefined,
        sellPrice: data.sellPrice ? parseFloat(data.sellPrice) : undefined,
        mrp: data.mrp ? parseFloat(data.mrp) : undefined,
        stock: newStock,
        minStock: data.minStock ? parseInt(data.minStock) : undefined,
        maxStock: data.maxStock ? parseInt(data.maxStock) : undefined,
        color: data.color,
        storage: data.storage,
        ram: data.ram,
        variant: data.variant ? JSON.stringify(data.variant) : undefined,
        description: data.description,
        warranty: data.warranty,
        expiryDate: data.expiryDate ? new Date(data.expiryDate) : undefined,
        image: data.image,
        supplierId: data.supplierId,
        isActive: data.isActive !== undefined ? data.isActive : undefined,
      },
      include: {
        category: true,
        supplier: true,
      },
    })

    // Create stock movement if stock changed
    if (stockDiff !== 0) {
      await prisma.stockMovement.create({
        data: {
          productId: id,
          type: 'adjustment',
          quantity: Math.abs(stockDiff),
          reason: 'Stock update',
          userId: prismaUserId,
        },
      })
    }

    return NextResponse.json(updated)
  } catch (error: any) {
    console.error('Update product error:', error)
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getAuthUser(request)
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { id } = await params
    await prisma.product.update({
      where: { id },
      data: { isActive: false },
    })

    return NextResponse.json({ message: 'Product deleted successfully' })
  } catch (error) {
    console.error('Delete product error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
})
