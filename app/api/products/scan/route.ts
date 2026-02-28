import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const barcode = searchParams.get('barcode')
    const qrCode = searchParams.get('qrCode')
    const imei = searchParams.get('imei')

    if (!barcode && !qrCode && !imei) {
      return NextResponse.json(
        { error: 'Barcode, QR code, or IMEI is required' },
        { status: 400 }
      )
    }

    const where: any = { isActive: true }

    if (barcode) {
      where.barcode = barcode
    } else if (qrCode) {
      where.qrCode = qrCode
    } else if (imei) {
      where.imei = imei
    }

    const product = await prisma.product.findFirst({
      where,
      include: {
        category: true,
        supplier: true,
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
    console.error('Scan product error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
