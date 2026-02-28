import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAuthUser } from '@/lib/auth-clerk'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const service = await prisma.serviceJob.findUnique({
      where: { id },
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
    })

    if (!service) {
      return NextResponse.json(
        { error: 'Service job not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(service)
  } catch (error) {
    console.error('Get service error:', error)
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
    const { id } = await params
    const data = await request.json()

    const service = await prisma.serviceJob.update({
      where: { id },
      data: {
        status: data.status,
        actualCost: data.actualCost ? parseFloat(data.actualCost) : undefined,
        completedDate: data.completedDate ? new Date(data.completedDate) : undefined,
        deliveredDate: data.deliveredDate ? new Date(data.deliveredDate) : undefined,
        notes: data.notes,
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

    return NextResponse.json(service)
  } catch (error: any) {
    console.error('Update service error:', error)
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}
