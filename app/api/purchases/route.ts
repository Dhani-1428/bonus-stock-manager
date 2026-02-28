import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAuth } from '@/lib/auth-clerk'
import { getPrismaUserId } from '@/lib/clerk-prisma'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')
    const supplierId = searchParams.get('supplierId')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '50')
    const skip = (page - 1) * limit

    const where: any = {}

    if (startDate || endDate) {
      where.createdAt = {}
      if (startDate) where.createdAt.gte = new Date(startDate)
      if (endDate) where.createdAt.lte = new Date(endDate)
    }

    if (supplierId) {
      where.supplierId = supplierId
    }

    const [purchases, total] = await Promise.all([
      prisma.purchase.findMany({
        where,
        include: {
          supplier: true,
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
                },
              },
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.purchase.count({ where }),
    ])

    return NextResponse.json({
      purchases,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error('Get purchases error:', error)
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
      supplierId,
      items,
      discount,
      tax,
      paymentStatus,
      dueDate,
      notes,
    } = data

    if (!supplierId || !items || items.length === 0) {
      return NextResponse.json(
        { error: 'Supplier and items are required' },
        { status: 400 }
      )
    }

    // Calculate totals
    let totalAmount = 0
    for (const item of items) {
      totalAmount += item.unitPrice * item.quantity
    }

    const discountAmount = discount || 0
    const taxAmount = tax || 0
    const finalAmount = totalAmount - discountAmount + taxAmount

    // Generate invoice number
    const today = new Date()
    const dateStr = today.toISOString().split('T')[0].replace(/-/g, '')
    const count = await prisma.purchase.count({
      where: {
        createdAt: {
          gte: new Date(today.setHours(0, 0, 0, 0)),
        },
      },
    })
    const invoiceNo = `PUR-${dateStr}-${String(count + 1).padStart(4, '0')}`

    // Create purchase with items
    const purchase = await prisma.purchase.create({
      data: {
        invoiceNo,
        supplierId,
        userId: prismaUserId,
        totalAmount,
        discount: discountAmount,
        tax: taxAmount,
        finalAmount,
        paymentStatus: paymentStatus || 'pending',
        dueDate: dueDate ? new Date(dueDate) : null,
        notes: notes || null,
        items: {
          create: items.map((item: any) => ({
            productId: item.productId,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            total: item.unitPrice * item.quantity,
          })),
        },
      },
      include: {
        supplier: true,
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
            increment: item.quantity,
          },
        },
      })

      await prisma.stockMovement.create({
        data: {
          productId: item.productId,
          type: 'in',
          quantity: item.quantity,
          reason: 'Purchase',
          referenceId: purchase.id,
          userId: prismaUserId,
        },
      })
    }

    // Create transaction if paid
    if (paymentStatus === 'paid' || paymentStatus === 'partial') {
      await prisma.transaction.create({
        data: {
          type: 'PURCHASE',
          purchaseId: purchase.id,
          supplierId,
          userId: prismaUserId,
          amount: finalAmount,
          paymentMode: 'BANK_TRANSFER',
        },
      })
    }

    return NextResponse.json(purchase, { status: 201 })
  } catch (error: any) {
    console.error('Create purchase error:', error)
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
})
