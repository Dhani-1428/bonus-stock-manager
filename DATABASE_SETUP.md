# Database Setup - MySQL

The application is now configured to use MySQL instead of SQLite.

## Connection Details

- **Provider**: MySQL
- **SSL**: Required

## Environment Variables

The `.env` file should contain your MySQL connection string:

```
DATABASE_URL=mysql://username:password@host:port/database?ssl-mode=REQUIRED
```

**Note**: Never commit your `.env` file or database credentials to version control.

## Database Schema

The schema has been successfully pushed to the MySQL database. All tables for the Stock Manager application have been created:

- User
- Category
- Product
- Supplier
- Customer
- Sale
- SaleItem
- Purchase
- PurchaseItem
- ServiceJob
- ServiceItem
- Transaction
- StockMovement

## Commands

- `npm run db:generate` - Generate Prisma Client
- `npm run db:push` - Push schema changes to database
- `npm run db:migrate` - Create and run migrations
- `npm run db:seed` - Seed the database with sample data
- `npm run db:studio` - Open Prisma Studio to view/edit data

## Note

The database previously contained tables from another application. These have been replaced with the Stock Manager schema. If you need to preserve any existing data, please back it up before running migrations.
