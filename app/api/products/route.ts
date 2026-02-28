import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAuth } from '@/lib/auth-clerk'
import { getPrismaUserId } from '@/lib/clerk-prisma'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const categoryId = searchParams.get('categoryId')
    const search = searchParams.get('search')
    const lowStock = searchParams.get('lowStock') === 'true'
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '50')
    const skip = (page - 1) * limit

    const where: any = {
      isActive: true,
    }

    if (categoryId) {
      where.categoryId = categoryId
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { sku: { contains: search, mode: 'insensitive' } },
        { barcode: { contains: search, mode: 'insensitive' } },
        { brand: { contains: search, mode: 'insensitive' } },
      ]
    }

    if (lowStock) {
      where.stock = { lte: prisma.product.fields.minStock }
    }

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        include: {
          category: true,
          supplier: true,
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.product.count({ where }),
    ])

    return NextResponse.json({
      products,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error('Get products error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export const POST = requireAuth(async (request: NextRequest, user) => {
  try {
    // Get Prisma user ID from Clerk user
    const prismaUserId = await getPrismaUserId()
    if (!prismaUserId) {
      return NextResponse.json(
        { error: 'User not found in database' },
        { status: 404 }
      )
    }

    const data = await request.json()
    const {
      name,
      brand,
      categoryId,
      barcode,
      sku,
      imei,
      serialNo,
      buyPrice,
      sellPrice,
      mrp,
      stock,
      minStock,
      maxStock,
      color,
      storage,
      ram,
      variant,
      description,
      warranty,
      expiryDate,
      image,
      supplierId,
    } = data

    if (!name || !categoryId || !sku) {
      return NextResponse.json(
        { error: 'Name, category, and SKU are required' },
        { status: 400 }
      )
    }

    // Check if SKU or barcode already exists
    const existing = await prisma.product.findFirst({
      where: {
        OR: [
          { sku },
          ...(barcode ? [{ barcode }] : []),
        ],
      },
    })

    if (existing) {
      return NextResponse.json(
        { error: 'Product with this SKU or barcode already exists' },
        { status: 400 }
      )
    }

    const product = await prisma.product.create({
      data: {
        name,
        brand: brand || null,
        categoryId,
        barcode: barcode || null,
        sku,
        imei: imei || null,
        serialNo: serialNo || null,
        buyPrice: parseFloat(buyPrice) || 0,
        sellPrice: parseFloat(sellPrice) || 0,
        mrp: mrp ? parseFloat(mrp) : null,
        stock: parseInt(stock) || 0,
        minStock: parseInt(minStock) || 5,
        maxStock: maxStock ? parseInt(maxStock) : null,
        color: color || null,
        storage: storage || null,
        ram: ram || null,
        variant: variant ? JSON.stringify(variant) : null,
        description: description || null,
        warranty: warranty || null,
        expiryDate: expiryDate ? new Date(expiryDate) : null,
        image: image || null,
        supplierId: supplierId || null,
      },
      include: {
        category: true,
        supplier: true,
      },
    })

    // Create stock movement for initial stock
    if (product.stock > 0) {
      await prisma.stockMovement.create({
        data: {
          productId: product.id,
          type: 'in',
          quantity: product.stock,
          reason: 'Initial stock',
          userId: prismaUserId,
        },
      })
    }

    return NextResponse.json(product, { status: 201 })
  } catch (error: any) {
    console.error('Create product error:', error)
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
})
