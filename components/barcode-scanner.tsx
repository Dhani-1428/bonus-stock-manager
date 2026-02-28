"use client"

import { useEffect, useRef, useState } from 'react'
import { ScanBarcode, X, Camera } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface BarcodeScannerProps {
  onScan: (barcode: string) => void
  onClose: () => void
  mode?: 'barcode' | 'qr' | 'imei'
}

export function BarcodeScanner({ onScan, onClose, mode = 'barcode' }: BarcodeScannerProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isScanning, setIsScanning] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const streamRef = useRef<MediaStream | null>(null)

  useEffect(() => {
    return () => {
      // Cleanup stream on unmount
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop())
      }
    }
  }, [])

  const startScanning = async () => {
    try {
      setError(null)
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'environment', // Use back camera on mobile
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
      })

      if (videoRef.current) {
        videoRef.current.srcObject = stream
        streamRef.current = stream
        setIsScanning(true)

        // Use HTML5 barcode scanning library (you can integrate QuaggaJS or ZXing)
        // For now, we'll use a manual input fallback
      }
    } catch (err: any) {
      setError(err.message || 'Failed to access camera')
      console.error('Camera error:', err)
    }
  }

  const stopScanning = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop())
      streamRef.current = null
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null
    }
    setIsScanning(false)
  }

  const handleManualInput = () => {
    const barcode = prompt(`Enter ${mode === 'imei' ? 'IMEI' : mode === 'qr' ? 'QR Code' : 'Barcode'} manually:`)
    if (barcode) {
      onScan(barcode)
      onClose()
    }
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4">
      <div className="relative w-full max-w-2xl">
        {/* Close button */}
        <button
          onClick={() => {
            stopScanning()
            onClose()
          }}
          className="absolute top-4 right-4 z-10 p-2 rounded-full glass hover:neon-glow"
        >
          <X className="w-6 h-6 text-foreground" />
        </button>

        {/* Video container */}
        <div className="relative aspect-video bg-black rounded-2xl overflow-hidden">
          {!isScanning ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
              <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center">
                <Camera className="w-10 h-10 text-primary" />
              </div>
              <p className="text-foreground text-center px-4">
                {error || 'Click start to begin scanning'}
              </p>
              <div className="flex gap-3">
                <Button onClick={startScanning} className="gap-2">
                  <ScanBarcode className="w-4 h-4" />
                  Start Scanning
                </Button>
                <Button variant="outline" onClick={handleManualInput}>
                  Enter Manually
                </Button>
              </div>
            </div>
          ) : (
            <>
              <video
                ref={videoRef}
                autoPlay
                playsInline
                className="w-full h-full object-cover"
              />
              {/* Scanning overlay */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-64 h-64 border-2 border-primary rounded-lg relative">
                  <div className="absolute -top-1 -left-1 w-6 h-6 border-t-4 border-l-4 border-primary rounded-tl-lg" />
                  <div className="absolute -top-1 -right-1 w-6 h-6 border-t-4 border-r-4 border-primary rounded-tr-lg" />
                  <div className="absolute -bottom-1 -left-1 w-6 h-6 border-b-4 border-l-4 border-primary rounded-bl-lg" />
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 border-b-4 border-r-4 border-primary rounded-br-lg" />
                </div>
              </div>
              <div className="absolute bottom-4 left-0 right-0 text-center">
                <p className="text-white text-sm mb-2">Point camera at {mode === 'imei' ? 'IMEI' : mode === 'qr' ? 'QR code' : 'barcode'}</p>
                <Button variant="outline" onClick={stopScanning} size="sm">
                  Stop Scanning
                </Button>
              </div>
            </>
          )}
        </div>

        {/* Instructions */}
        <div className="mt-4 glass rounded-xl p-4">
          <p className="text-sm text-muted-foreground text-center">
            {mode === 'imei'
              ? 'Scan the IMEI number from the device or packaging'
              : mode === 'qr'
              ? 'Scan the QR code on the product'
              : 'Scan the barcode on the product label'}
          </p>
        </div>
      </div>
    </div>
  )
}
