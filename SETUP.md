# StockPulse Setup Guide

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Environment Variables

Create a `.env` file in the root directory with:

```env
DATABASE_URL="file:./dev.db"
JWT_SECRET="your-secret-key-change-in-production"
NEXTAUTH_URL="http://localhost:3000"
```

### 3. Initialize Database

```bash
# Generate Prisma Client
npm run db:generate

# Create database and tables
npm run db:push

# Seed database with sample data
npm run db:seed
```

### 4. Run Development Server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

## Default Login Credentials

After seeding:

- **Owner**: `owner@stockpulse.com` / `owner123`
- **Staff**: `staff@stockpulse.com` / `staff123`

## Project Structure

```
├── app/
│   ├── api/              # API routes (REST endpoints)
│   ├── dashboard/        # Dashboard page
│   ├── login/            # Login page
│   └── signup/           # Signup page
├── components/
│   ├── screens/          # Screen components
│   ├── ui/               # Reusable UI components
│   ├── barcode-scanner.tsx
│   └── barcode-generator.tsx
├── lib/
│   ├── prisma.ts         # Prisma client singleton
│   ├── auth.ts           # Auth utilities
│   ├── api-client.ts     # API client for frontend
│   └── utils.ts          # Helper functions
└── prisma/
    ├── schema.prisma     # Database schema
    └── seed.ts           # Seed script
```

## Features Implemented

### ✅ Backend (API Routes)

- **Authentication**: `/api/auth/login`, `/api/auth/register`
- **Products**: Full CRUD with barcode scanning
- **Categories**: List and create
- **Sales**: Create sales with invoice generation
- **Customers**: Customer management
- **Suppliers**: Supplier management
- **Purchases**: Purchase order management
- **Services**: Service/repair job management
- **Reports**: Sales and stock reports
- **Invoices**: Invoice retrieval

### ✅ Frontend Components

- Barcode scanner (camera-based)
- Barcode/QR code generator
- API client for all backend calls
- Authentication context

### 🔄 In Progress

- Frontend screens integration with API
- POS system UI
- Reports dashboard
- PWA configuration

## Database Schema

Key models:
- `User` - Authentication (Owner/Staff roles)
- `Category` - Product categories
- `Product` - Inventory items with variants
- `Supplier` - Supplier information
- `Customer` - Customer data
- `Sale` - Sales transactions
- `Purchase` - Purchase orders
- `ServiceJob` - Repair/service jobs
- `Transaction` - Financial transactions
- `StockMovement` - Stock tracking

## Next Steps

1. Update frontend screens to use API client
2. Implement POS billing interface
3. Add invoice PDF generation
4. Create reports dashboard with charts
5. Add PWA manifest and service worker
6. Implement offline data caching

## Troubleshooting

### Database Connection Issues

If you see "Environment variable not found: DATABASE_URL":
1. Ensure `.env` file exists in root directory
2. Check that `DATABASE_URL="file:./dev.db"` is set
3. Run `npm run db:push` again

### Prisma Client Issues

If Prisma client is not found:
```bash
npm run db:generate
```

### Port Already in Use

Change the port in `package.json` or use:
```bash
PORT=3001 npm run dev
```
