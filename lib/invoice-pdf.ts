import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'

interface InvoiceData {
  invoiceNo: string
  date: string
  customer?: {
    name: string
    phone?: string
    email?: string
    address?: string
  }
  items: Array<{
    name: string
    sku: string
    quantity: number
    unitPrice: number
    discount: number
    total: number
  }>
  subtotal: number
  discount: number
  tax: number
  finalAmount: number
  paymentMode: string
  paymentStatus: string
}

export async function generateInvoicePDF(data: InvoiceData): Promise<void> {
  const doc = new jsPDF()
  const pageWidth = doc.internal.pageSize.getWidth()
  const pageHeight = doc.internal.pageSize.getHeight()
  const margin = 20
  let yPos = margin

  // Header
  doc.setFontSize(24)
  doc.setTextColor(0, 0, 0)
  doc.text('INVOICE', pageWidth - margin, yPos, { align: 'right' })
  yPos += 10

  doc.setFontSize(12)
  doc.setTextColor(100, 100, 100)
  doc.text(`Invoice #: ${data.invoiceNo}`, pageWidth - margin, yPos, { align: 'right' })
  yPos += 5
  doc.text(`Date: ${new Date(data.date).toLocaleDateString()}`, pageWidth - margin, yPos, { align: 'right' })
  yPos += 15

  // Company Info
  doc.setFontSize(16)
  doc.setTextColor(0, 0, 0)
  doc.text('StockPulse', margin, yPos)
  yPos += 7
  doc.setFontSize(10)
  doc.setTextColor(100, 100, 100)
  doc.text('Mobile Phones & Accessories Shop', margin, yPos)
  yPos += 5
  doc.text('123 Business Street, City, State 12345', margin, yPos)
  yPos += 5
  doc.text('Phone: +1 (555) 123-4567', margin, yPos)
  yPos += 15

  // Customer Info
  if (data.customer) {
    doc.setFontSize(12)
    doc.setTextColor(0, 0, 0)
    doc.text('Bill To:', margin, yPos)
    yPos += 7
    doc.setFontSize(10)
    doc.text(data.customer.name, margin, yPos)
    yPos += 5
    if (data.customer.phone) {
      doc.text(`Phone: ${data.customer.phone}`, margin, yPos)
      yPos += 5
    }
    if (data.customer.email) {
      doc.text(`Email: ${data.customer.email}`, margin, yPos)
      yPos += 5
    }
    if (data.customer.address) {
      doc.text(data.customer.address, margin, yPos)
      yPos += 5
    }
  }
  yPos += 10

  // Items Table
  const tableTop = yPos
  const colWidths = {
    item: 80,
    qty: 20,
    price: 30,
    discount: 30,
    total: 30,
  }
  const startX = margin

  // Table Header
  doc.setFillColor(240, 240, 240)
  doc.rect(startX, yPos, pageWidth - 2 * margin, 8, 'F')
  yPos += 6
  doc.setFontSize(10)
  doc.setTextColor(0, 0, 0)
  doc.setFont('helvetica', 'bold')
  doc.text('Item', startX + 2, yPos)
  doc.text('Qty', startX + colWidths.item + 2, yPos)
  doc.text('Price', startX + colWidths.item + colWidths.qty + 2, yPos)
  doc.text('Discount', startX + colWidths.item + colWidths.qty + colWidths.price + 2, yPos)
  doc.text('Total', startX + colWidths.item + colWidths.qty + colWidths.price + colWidths.discount + 2, yPos)
  yPos += 8

  // Table Rows
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(9)
  data.items.forEach((item) => {
    if (yPos > pageHeight - 40) {
      doc.addPage()
      yPos = margin
    }

    // Item name (may wrap)
    const itemLines = doc.splitTextToSize(item.name, colWidths.item - 4)
    doc.text(itemLines[0], startX + 2, yPos)
    if (itemLines.length > 1) {
      doc.text(itemLines[1], startX + 2, yPos + 4)
    }

    // SKU
    doc.setTextColor(100, 100, 100)
    doc.setFontSize(8)
    doc.text(`SKU: ${item.sku}`, startX + 2, yPos + (itemLines.length > 1 ? 8 : 4))
    doc.setFontSize(9)
    doc.setTextColor(0, 0, 0)

    // Quantity
    doc.text(item.quantity.toString(), startX + colWidths.item + 2, yPos)

    // Price
    doc.text(`$${item.unitPrice.toFixed(2)}`, startX + colWidths.item + colWidths.qty + 2, yPos)

    // Discount
    doc.text(`$${item.discount.toFixed(2)}`, startX + colWidths.item + colWidths.qty + colWidths.price + 2, yPos)

    // Total
    doc.text(`$${item.total.toFixed(2)}`, startX + colWidths.item + colWidths.qty + colWidths.price + colWidths.discount + 2, yPos)

    yPos += Math.max(8, itemLines.length * 4 + 4)
  })

  yPos += 5

  // Totals
  const totalsX = pageWidth - margin - colWidths.total
  doc.setFontSize(10)

  // Subtotal
  doc.text('Subtotal:', totalsX - 50, yPos, { align: 'right' })
  doc.text(`$${data.subtotal.toFixed(2)}`, totalsX, yPos, { align: 'right' })
  yPos += 7

  // Discount
  if (data.discount > 0) {
    doc.text('Discount:', totalsX - 50, yPos, { align: 'right' })
    doc.text(`-$${data.discount.toFixed(2)}`, totalsX, yPos, { align: 'right' })
    yPos += 7
  }

  // Tax
  if (data.tax > 0) {
    doc.text('Tax:', totalsX - 50, yPos, { align: 'right' })
    doc.text(`$${data.tax.toFixed(2)}`, totalsX, yPos, { align: 'right' })
    yPos += 7
  }

  // Total
  doc.setFontSize(12)
  doc.setFont('helvetica', 'bold')
  doc.text('Total:', totalsX - 50, yPos, { align: 'right' })
  doc.text(`$${data.finalAmount.toFixed(2)}`, totalsX, yPos, { align: 'right' })
  yPos += 15

  // Payment Info
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(10)
  doc.text(`Payment Mode: ${data.paymentMode}`, margin, yPos)
  yPos += 5
  doc.text(`Status: ${data.paymentStatus.toUpperCase()}`, margin, yPos)
  yPos += 15

  // Footer
  doc.setFontSize(8)
  doc.setTextColor(100, 100, 100)
  doc.text('Thank you for your business!', pageWidth / 2, pageHeight - 15, { align: 'center' })
  doc.text('For inquiries, contact us at support@stockpulse.com', pageWidth / 2, pageHeight - 10, { align: 'center' })

  // Save PDF
  doc.save(`invoice-${data.invoiceNo}.pdf`)
}
