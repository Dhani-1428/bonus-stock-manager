/**
 * Client-side barcode and QR code generation utilities
 * These functions should only be called in the browser
 */

/**
 * Generate QR code as data URL (client-side only)
 */
export async function generateQRCode(data: string): Promise<string> {
  if (typeof window === 'undefined') {
    throw new Error('generateQRCode can only be called on the client')
  }

  try {
    const QRCode = (await import('qrcode')).default
    const qrDataUrl = await QRCode.toDataURL(data, {
      width: 300,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#FFFFFF',
      },
    })
    return qrDataUrl
  } catch (error) {
    console.error('QR code generation error:', error)
    throw new Error('Failed to generate QR code')
  }
}

/**
 * Generate barcode as data URL (client-side only)
 */
export async function generateBarcode(
  data: string,
  format: 'CODE128' | 'EAN13' | 'UPC' = 'CODE128'
): Promise<string> {
  if (typeof window === 'undefined') {
    throw new Error('generateBarcode can only be called on the client')
  }

  return new Promise(async (resolve, reject) => {
    try {
      const JsBarcode = (await import('jsbarcode')).default
      const canvas = document.createElement('canvas')
      JsBarcode(canvas, data, {
        format,
        width: 2,
        height: 100,
        displayValue: true,
        fontSize: 16,
        margin: 10,
      })
      resolve(canvas.toDataURL('image/png'))
    } catch (error) {
      reject(error)
    }
  })
}
