# Bonus Stock Manager - Stock Management System

A complete stock management web application for mobile phones & accessories shops built with Next.js, TypeScript, Prisma, and SQLite.

## Features

- ✅ **Authentication** - Login/Register with role-based access (Owner/Staff)
- ✅ **Inventory Management** - Full CRUD for products with categories
- ✅ **Barcode & QR Scanning** - Generate and scan barcodes/QR codes
- ✅ **POS System** - Fast billing with invoice generation
- ✅ **Customers** - Customer management with purchase history
- ✅ **Suppliers & Purchases** - Track suppliers and purchase orders
- ✅ **Service & Repairs** - Job cards for device repairs
- ✅ **Reports** - Sales, stock, and profit reports
- ✅ **Responsive UI** - Mobile-first design with desktop admin panel

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Database**: Prisma + SQLite
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Charts**: Recharts
- **PDF**: jsPDF + html2canvas
- **Barcode**: jsbarcode + qrcode

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Environment Variables

Create a `.env` file in the root directory:

```env
DATABASE_URL="file:./dev.db"
JWT_SECRET="your-secret-key-change-in-production"
NEXTAUTH_URL="http://localhost:3000"
```

### 3. Initialize Database

```bash
# Generate Prisma Client
npm run db:generate

# Push schema to database
npm run db:push

# Seed database with sample data
npm run db:seed
```

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Default Login Credentials

After seeding:

- **Owner**: `owner@stockpulse.com` / `owner123`
- **Staff**: `staff@stockpulse.com` / `staff123`

## Project Structure

```
├── app/
│   ├── api/              # API routes
│   ├── dashboard/        # Dashboard page
│   ├── login/            # Login page
│   └── signup/           # Signup page
├── components/
│   ├── screens/          # Screen components
│   ├── ui/               # Reusable UI components
│   └── landing/          # Landing page components
├── lib/
│   ├── prisma.ts         # Prisma client
│   ├── auth.ts           # Auth utilities
│   └── utils.ts          # Helper functions
└── prisma/
    ├── schema.prisma     # Database schema
    └── seed.ts           # Seed script
```

## API Routes

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration

### Products
- `GET /api/products` - List products (with filters)
- `POST /api/products` - Create product
- `GET /api/products/[id]` - Get product details
- `PUT /api/products/[id]` - Update product
- `DELETE /api/products/[id]` - Delete product
- `GET /api/products/scan` - Scan product by barcode/QR/IMEI
- `GET /api/products/[id]/barcode` - Generate barcode/QR code

### Categories
- `GET /api/categories` - List categories
- `POST /api/categories` - Create category

### Sales
- `GET /api/sales` - List sales (with filters)
- `POST /api/sales` - Create sale/invoice

### Customers
- `GET /api/customers` - List customers
- `POST /api/customers` - Create customer

### Suppliers
- `GET /api/suppliers` - List suppliers
- `POST /api/suppliers` - Create supplier

### Purchases
- `GET /api/purchases` - List purchases
- `POST /api/purchases` - Create purchase order

### Services
- `GET /api/services` - List service jobs
- `POST /api/services` - Create service job
- `GET /api/services/[id]` - Get service details
- `PUT /api/services/[id]` - Update service job

### Reports
- `GET /api/reports/sales` - Sales report
- `GET /api/reports/stock` - Stock report

### Invoices
- `GET /api/invoices/[id]` - Get invoice details

## Database Schema

The application uses Prisma with SQLite. Key models:

- **User** - Authentication and user management
- **Category** - Product categories
- **Product** - Inventory items with variants
- **Supplier** - Supplier information
- **Customer** - Customer data
- **Sale** - Sales transactions
- **Purchase** - Purchase orders
- **ServiceJob** - Repair/service jobs
- **Transaction** - Financial transactions
- **StockMovement** - Stock tracking

## Development

### Database Commands

```bash
# Generate Prisma Client
npm run db:generate

# Push schema changes
npm run db:push

# Create migration
npm run db:migrate

# Open Prisma Studio
npm run db:studio

# Seed database
npm run db:seed
```

### Building for Production

```bash
npm run build
npm start
```

## Features in Detail

### Inventory Management
- Add/edit products with variants (color, storage, RAM)
- Track stock levels with min/max thresholds
- Low stock alerts
- IMEI/Serial number tracking for mobile phones
- Expiry date tracking for accessories
- Barcode and QR code generation

### POS System
- Fast billing interface
- Add products by scanning or search
- Discount and tax support
- Multiple payment modes (Cash, UPI, Card)
- Invoice generation (PDF)
- Returns and refunds

### Reports
- Daily/monthly sales reports
- Profit & Loss statements
- Low stock reports
- Export to CSV/PDF

### Service & Repairs
- Create job cards for device repairs
- Track repair status
- Estimate and actual costs
- Warranty tracking

## PWA Support

The app is configured for PWA with:
- Service worker for offline support
- Installable on mobile devices
- Offline data caching

## License

MIT
