import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding database...')

  // Create users
  const ownerPassword = await bcrypt.hash('owner123', 10)
  const staffPassword = await bcrypt.hash('staff123', 10)

  const owner = await prisma.user.upsert({
    where: { email: 'owner@stockpulse.com' },
    update: {},
    create: {
      email: 'owner@stockpulse.com',
      password: ownerPassword,
      name: 'Store Owner',
      role: 'OWNER',
      phone: '+1234567890',
    },
  })

  const staff = await prisma.user.upsert({
    where: { email: 'staff@stockpulse.com' },
    update: {},
    create: {
      email: 'staff@stockpulse.com',
      password: staffPassword,
      name: 'Staff Member',
      role: 'STAFF',
      phone: '+1234567891',
    },
  })

  console.log('Created users:', { owner: owner.email, staff: staff.email })

  // Create categories
  const categories = [
    { name: 'Mobiles', slug: 'mobiles', icon: 'Smartphone' },
    { name: 'Chargers', slug: 'chargers', icon: 'Zap' },
    { name: 'Earphones', slug: 'earphones', icon: 'Headphones' },
    { name: 'Covers', slug: 'covers', icon: 'Shield' },
    { name: 'Power Banks', slug: 'power-banks', icon: 'Battery' },
    { name: 'Watches', slug: 'watches', icon: 'Watch' },
    { name: 'Spare Parts', slug: 'spare-parts', icon: 'Cable' },
  ]

  const createdCategories = await Promise.all(
    categories.map((cat) =>
      prisma.category.upsert({
        where: { slug: cat.slug },
        update: {},
        create: cat,
      })
    )
  )

  console.log('Created categories:', createdCategories.length)

  // Create suppliers
  const suppliers = [
    {
      name: 'Apple Distribution Inc.',
      email: 'orders@appledist.com',
      phone: '+1-800-APPLE',
    },
    {
      name: 'Samsung Corporation',
      email: 'supply@samsung.com',
      phone: '+1-800-SAMSUNG',
    },
    {
      name: 'Anker Direct',
      email: 'wholesale@anker.com',
      phone: '+1-800-ANKER',
    },
  ]

  const createdSuppliers = await Promise.all(
    suppliers.map((sup) =>
      prisma.supplier.create({
        data: sup,
      })
    )
  )

  console.log('Created suppliers:', createdSuppliers.length)

  // Create sample products
  const products = [
    {
      name: 'iPhone 15 Pro Max',
      brand: 'Apple',
      categoryId: createdCategories[0].id,
      barcode: '8901234567890',
      sku: 'APL-IP15PM-256',
      buyPrice: 1199,
      sellPrice: 1399,
      mrp: 1499,
      stock: 12,
      minStock: 5,
      warranty: '12 months',
      supplierId: createdSuppliers[0].id,
    },
    {
      name: 'Samsung Galaxy S24 Ultra',
      brand: 'Samsung',
      categoryId: createdCategories[0].id,
      barcode: '8901234567891',
      sku: 'SAM-S24U-256',
      buyPrice: 1099,
      sellPrice: 1299,
      mrp: 1399,
      stock: 8,
      minStock: 5,
      warranty: '12 months',
      supplierId: createdSuppliers[1].id,
    },
    {
      name: 'AirPods Pro 2',
      brand: 'Apple',
      categoryId: createdCategories[2].id,
      barcode: '8901234567892',
      sku: 'APL-APP2',
      buyPrice: 199,
      sellPrice: 249,
      mrp: 279,
      stock: 25,
      minStock: 10,
      warranty: '6 months',
      supplierId: createdSuppliers[0].id,
    },
    {
      name: 'Anker 65W GaN Charger',
      brand: 'Anker',
      categoryId: createdCategories[1].id,
      barcode: '8901234567893',
      sku: 'ANK-65W-GAN',
      buyPrice: 35,
      sellPrice: 55,
      mrp: 65,
      stock: 40,
      minStock: 15,
      warranty: '18 months',
      supplierId: createdSuppliers[2].id,
    },
    {
      name: 'Spigen Ultra Hybrid Case',
      brand: 'Spigen',
      categoryId: createdCategories[3].id,
      barcode: '8901234567894',
      sku: 'SPG-UH-IP15',
      buyPrice: 12,
      sellPrice: 25,
      mrp: 30,
      stock: 3,
      minStock: 10,
      warranty: '3 months',
    },
    {
      name: 'Anker PowerCore 20000mAh',
      brand: 'Anker',
      categoryId: createdCategories[4].id,
      barcode: '8901234567895',
      sku: 'ANK-PC-20K',
      buyPrice: 30,
      sellPrice: 49,
      mrp: 59,
      stock: 18,
      minStock: 8,
      warranty: '12 months',
      supplierId: createdSuppliers[2].id,
    },
  ]

  const createdProducts = await Promise.all(
    products.map((prod) =>
      prisma.product.create({
        data: prod,
      })
    )
  )

  console.log('Created products:', createdProducts.length)

  // Create sample customers
  const customers = [
    {
      name: 'John Doe',
      phone: '+1234567890',
      email: 'john@example.com',
    },
    {
      name: 'Jane Smith',
      phone: '+1234567891',
      email: 'jane@example.com',
    },
  ]

  const createdCustomers = await Promise.all(
    customers.map((cust) =>
      prisma.customer.create({
        data: cust,
      })
    )
  )

  console.log('Created customers:', createdCustomers.length)

  console.log('✅ Seeding completed!')
  console.log('\nDefault login credentials:')
  console.log('Owner: owner@stockpulse.com / owner123')
  console.log('Staff: staff@stockpulse.com / staff123')
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
