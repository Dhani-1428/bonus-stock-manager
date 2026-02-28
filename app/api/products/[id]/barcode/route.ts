import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAuthUser } from '@/lib/auth-clerk'
import QRCode from 'qrcode'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getAuthUser(request)
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { id } = await params
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type') || 'qr' // qr or barcode

    const product = await prisma.product.findUnique({
      where: { id },
    })

    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      )
    }

    if (type === 'qr') {
      const qrData = JSON.stringify({
        id: product.id,
        sku: product.sku,
        name: product.name,
        barcode: product.barcode,
      })
      const qrCode = await QRCode.toDataURL(qrData, {
        width: 300,
        margin: 2,
      })
      return NextResponse.json({ qrCode, data: qrData })
    } else {
      // For barcode, return the barcode data
      // Client will generate using jsbarcode
      return NextResponse.json({
        barcode: product.barcode || product.sku,
        format: 'CODE128',
      })
    }
  } catch (error) {
    console.error('Generate barcode error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
