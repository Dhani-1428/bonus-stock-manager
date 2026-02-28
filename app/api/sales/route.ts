import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAuth } from '@/lib/auth-clerk'
import { getPrismaUserId } from '@/lib/clerk-prisma'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')
    const customerId = searchParams.get('customerId')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '50')
    const skip = (page - 1) * limit

    const where: any = {}

    if (startDate || endDate) {
      where.createdAt = {}
      if (startDate) where.createdAt.gte = new Date(startDate)
      if (endDate) where.createdAt.lte = new Date(endDate)
    }

    if (customerId) {
      where.customerId = customerId
    }

    const [sales, total] = await Promise.all([
      prisma.sale.findMany({
        where,
        include: {
          customer: true,
          user: {
            select: { id: true, name: true, email: true },
          },
          items: {
            include: {
              product: {
                select: {
                  id: true,
                  name: true,
                  sku: true,
                  image: true,
                },
              },
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.sale.count({ where }),
    ])

    return NextResponse.json({
      sales,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error('Get sales error:', error)
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
      customerId,
      items,
      discount,
      tax,
      paymentMode,
      paymentStatus,
      notes,
    } = data

    if (!items || items.length === 0) {
      return NextResponse.json(
        { error: 'At least one item is required' },
        { status: 400 }
      )
    }

    // Calculate totals
    let totalAmount = 0
    for (const item of items) {
      const product = await prisma.product.findUnique({
        where: { id: item.productId },
      })

      if (!product) {
        return NextResponse.json(
          { error: `Product ${item.productId} not found` },
          { status: 400 }
        )
      }

      if (product.stock < item.quantity) {
        return NextResponse.json(
          { error: `Insufficient stock for ${product.name}. Available: ${product.stock}` },
          { status: 400 }
        )
      }

      totalAmount += (item.unitPrice || product.sellPrice) * item.quantity
    }

    const discountAmount = discount || 0
    const taxAmount = tax || 0
    const finalAmount = totalAmount - discountAmount + taxAmount

    // Generate invoice number
    const today = new Date()
    const dateStr = today.toISOString().split('T')[0].replace(/-/g, '')
    const count = await prisma.sale.count({
      where: {
        createdAt: {
          gte: new Date(today.setHours(0, 0, 0, 0)),
        },
      },
    })
    const invoiceNo = `INV-${dateStr}-${String(count + 1).padStart(4, '0')}`

    // Create sale with items
    const sale = await prisma.sale.create({
      data: {
        invoiceNo,
        customerId: customerId || null,
        userId: prismaUserId,
        totalAmount,
        discount: discountAmount,
        tax: taxAmount,
        finalAmount,
        paymentMode: paymentMode || 'CASH',
        paymentStatus: paymentStatus || 'paid',
        notes: notes || null,
        items: {
          create: items.map((item: any) => ({
            productId: item.productId,
            quantity: item.quantity,
            unitPrice: item.unitPrice || 0,
            discount: item.discount || 0,
            total: (item.unitPrice || 0) * item.quantity - (item.discount || 0),
          })),
        },
      },
      include: {
        customer: true,
        items: {
          include: {
            product: true,
          },
        },
      },
    })

    // Update stock and create stock movements
    for (const item of items) {
      await prisma.product.update({
        where: { id: item.productId },
        data: {
          stock: {
            decrement: item.quantity,
          },
        },
      })

      await prisma.stockMovement.create({
        data: {
          productId: item.productId,
          type: 'out',
          quantity: item.quantity,
          reason: 'Sale',
          referenceId: sale.id,
          userId: prismaUserId,
        },
      })
    }

    // Create transaction if paid
    if (paymentStatus === 'paid' || paymentStatus === 'partial') {
      await prisma.transaction.create({
        data: {
          type: 'SALE',
          saleId: sale.id,
          userId: prismaUserId,
          amount: finalAmount,
          paymentMode: paymentMode || 'CASH',
        },
      })
    }

    return NextResponse.json(sale, { status: 201 })
  } catch (error: any) {
    console.error('Create sale error:', error)
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
})
