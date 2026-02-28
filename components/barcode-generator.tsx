"use client"

import { useEffect, useRef, useState } from 'react'
import { Download, QrCode, ScanBarcode } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { generateQRCode, generateBarcode } from '@/lib/barcode'

interface BarcodeGeneratorProps {
  productId: string
  productName: string
  sku: string
  barcode?: string
}

export function BarcodeGenerator({ productId, productName, sku, barcode }: BarcodeGeneratorProps) {
  const [qrCode, setQrCode] = useState<string | null>(null)
  const [barcodeImage, setBarcodeImage] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const qrRef = useRef<HTMLCanvasElement>(null)
  const barcodeRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const loadCodes = async () => {
      setLoading(true)
      try {
        // Generate QR code
        const qrData = JSON.stringify({ productId, sku, name: productName, barcode })
        const qr = await generateQRCode(qrData)
        setQrCode(qr)

        // Generate barcode
        if (barcode || sku) {
          const barcodeData = await generateBarcode(barcode || sku)
          setBarcodeImage(barcodeData)
        }
      } catch (error) {
        console.error('Error generating codes:', error)
      } finally {
        setLoading(false)
      }
    }

    loadCodes()
  }, [productId, sku, productName, barcode])

  const downloadQR = () => {
    if (qrCode && qrRef.current) {
      const link = document.createElement('a')
      link.download = `${sku}-qr.png`
      link.href = qrCode
      link.click()
    }
  }

  const downloadBarcode = () => {
    if (barcodeImage && barcodeRef.current) {
      const link = document.createElement('a')
      link.download = `${sku}-barcode.png`
      link.href = barcodeImage
      link.click()
    }
  }

  return (
    <div className="space-y-6">
      {/* QR Code */}
      <div className="glass rounded-2xl p-6">
        <div className="flex items-center gap-2 mb-4">
          <QrCode className="w-5 h-5 text-primary" />
          <h3 className="font-semibold text-foreground">QR Code</h3>
        </div>
        {loading ? (
          <div className="w-64 h-64 bg-muted animate-pulse rounded-lg mx-auto" />
        ) : qrCode ? (
          <div className="flex flex-col items-center gap-4">
            <img src={qrCode} alt="QR Code" className="w-64 h-64" />
            <Button onClick={downloadQR} variant="outline" size="sm" className="gap-2">
              <Download className="w-4 h-4" />
              Download QR Code
            </Button>
          </div>
        ) : (
          <p className="text-muted-foreground text-center">Unable to generate QR code</p>
        )}
      </div>

      {/* Barcode */}
      {barcode && (
        <div className="glass rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <ScanBarcode className="w-5 h-5 text-primary" />
            <h3 className="font-semibold text-foreground">Barcode</h3>
          </div>
          {loading ? (
            <div className="h-32 bg-muted animate-pulse rounded-lg" />
          ) : barcodeImage ? (
            <div className="flex flex-col items-center gap-4">
              <img src={barcodeImage} alt="Barcode" className="h-32 w-full object-contain bg-white p-4 rounded" />
              <Button onClick={downloadBarcode} variant="outline" size="sm" className="gap-2">
                <Download className="w-4 h-4" />
                Download Barcode
              </Button>
            </div>
          ) : (
            <p className="text-muted-foreground text-center">Unable to generate barcode</p>
          )}
        </div>
      )}
    </div>
  )
}
