import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAuth } from '@/lib/auth-clerk'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search')

    const where: any = { isActive: true }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { phone: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
      ]
    }

    const suppliers = await prisma.supplier.findMany({
      where,
      include: {
        _count: {
          select: { products: true, purchases: true },
        },
      },
      orderBy: { name: 'asc' },
    })

    return NextResponse.json(suppliers)
  } catch (error) {
    console.error('Get suppliers error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export const POST = requireAuth(async (request: NextRequest) => {
  try {
    const { name, email, phone, address, gstin, pan } = await request.json()

    if (!name) {
      return NextResponse.json(
        { error: 'Name is required' },
        { status: 400 }
      )
    }

    const supplier = await prisma.supplier.create({
      data: {
        name,
        email: email || null,
        phone: phone || null,
        address: address || null,
        gstin: gstin || null,
        pan: pan || null,
      },
    })

    return NextResponse.json(supplier, { status: 201 })
  } catch (error) {
    console.error('Create supplier error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
})
