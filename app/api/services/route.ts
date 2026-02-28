import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAuth } from '@/lib/auth-clerk'
import { getPrismaUserId } from '@/lib/clerk-prisma'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const customerId = searchParams.get('customerId')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '50')
    const skip = (page - 1) * limit

    const where: any = {}

    if (status) {
      where.status = status
    }

    if (customerId) {
      where.customerId = customerId
    }

    const [services, total] = await Promise.all([
      prisma.serviceJob.findMany({
        where,
        include: {
          customer: true,
          user: {
            select: { id: true, name: true, email: true },
          },
          items: {
            include: {
              product: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.serviceJob.count({ where }),
    ])

    return NextResponse.json({
      services,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error('Get services error:', error)
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
      deviceName,
      deviceModel,
      imei,
      serialNo,
      issue,
      estimatedCost,
      estimatedDate,
      warranty,
      notes,
      items,
    } = data

    if (!deviceName || !issue) {
      return NextResponse.json(
        { error: 'Device name and issue are required' },
        { status: 400 }
      )
    }

    // Generate job number
    const today = new Date()
    const dateStr = today.toISOString().split('T')[0].replace(/-/g, '')
    const count = await prisma.serviceJob.count({
      where: {
        createdAt: {
          gte: new Date(today.setHours(0, 0, 0, 0)),
        },
      },
    })
    const jobNo = `JOB-${dateStr}-${String(count + 1).padStart(4, '0')}`

    const service = await prisma.serviceJob.create({
      data: {
        jobNo,
        customerId: customerId || null,
        userId: prismaUserId,
        deviceName,
        deviceModel: deviceModel || null,
        imei: imei || null,
        serialNo: serialNo || null,
        issue,
        estimatedCost: estimatedCost ? parseFloat(estimatedCost) : null,
        estimatedDate: estimatedDate ? new Date(estimatedDate) : null,
        warranty: warranty || null,
        notes: notes || null,
        items: items
          ? {
              create: items.map((item: any) => ({
                productId: item.productId || null,
                name: item.name,
                quantity: item.quantity || 1,
                unitPrice: item.unitPrice || 0,
                total: (item.unitPrice || 0) * (item.quantity || 1),
              })),
            }
          : undefined,
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

    return NextResponse.json(service, { status: 201 })
  } catch (error: any) {
    console.error('Create service error:', error)
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
})
