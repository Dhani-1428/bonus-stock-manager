import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function clearDatabase() {
  console.log('Clearing all data from database...')

  try {
    // Delete in order to respect foreign key constraints
    await prisma.stockMovement.deleteMany()
    console.log('✓ Cleared StockMovement')

    await prisma.transaction.deleteMany()
    console.log('✓ Cleared Transaction')

    await prisma.serviceItem.deleteMany()
    console.log('✓ Cleared ServiceItem')

    await prisma.serviceJob.deleteMany()
    console.log('✓ Cleared ServiceJob')

    await prisma.purchaseItem.deleteMany()
    console.log('✓ Cleared PurchaseItem')

    await prisma.purchase.deleteMany()
    console.log('✓ Cleared Purchase')

    await prisma.saleItem.deleteMany()
    console.log('✓ Cleared SaleItem')

    await prisma.sale.deleteMany()
    console.log('✓ Cleared Sale')

    await prisma.product.deleteMany()
    console.log('✓ Cleared Product')

    await prisma.customer.deleteMany()
    console.log('✓ Cleared Customer')

    await prisma.supplier.deleteMany()
    console.log('✓ Cleared Supplier')

    await prisma.category.deleteMany()
    console.log('✓ Cleared Category')

    await prisma.user.deleteMany()
    console.log('✓ Cleared User')

    console.log('\n✅ Database cleared successfully!')
  } catch (error) {
    console.error('❌ Error clearing database:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

clearDatabase()
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
