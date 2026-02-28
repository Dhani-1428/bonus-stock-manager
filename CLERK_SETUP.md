# Clerk Authentication Integration

Clerk middleware has been added to the StockPulse application. The application currently supports both:

1. **Custom JWT Authentication** (existing system)
2. **Clerk Authentication** (newly added)

## Setup Instructions

### 1. Environment Variables

Add Clerk keys to your `.env` file:

```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
```

Get these keys from your [Clerk Dashboard](https://dashboard.clerk.com)

### 2. Middleware Configuration

The middleware (`middleware.ts`) is already configured to:
- Protect all routes except public ones (`/`, `/login`, `/signup`, `/api/auth`)
- Use Clerk authentication for protected routes

### 3. Using Clerk in API Routes

You can now use Clerk auth in API routes:

```typescript
import { getAuthUser } from '@/lib/auth-clerk'

export async function GET(request: NextRequest) {
  const user = await getAuthUser(request)
  
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  
  // Use user.userId, user.email, user.role
}
```

### 4. Using Clerk in Components

```typescript
'use client'
import { useUser, useAuth } from '@clerk/nextjs'

export function MyComponent() {
  const { user, isLoaded } = useUser()
  const { signOut } = useAuth()
  
  if (!isLoaded) return <div>Loading...</div>
  
  return <div>Hello {user?.firstName}</div>
}
```

## Migration Options

### Option 1: Keep Both Systems
- Use Clerk for new features
- Keep existing JWT auth for backward compatibility

### Option 2: Migrate to Clerk Only
1. Update all API routes to use `@/lib/auth-clerk`
2. Replace login/signup pages with Clerk components
3. Update app context to use Clerk hooks

### Option 3: Use Clerk for Frontend, JWT for API
- Use Clerk UI components for authentication
- Sync Clerk users with your Prisma User table
- Use JWT for API authentication

## Current Status

- ✅ Clerk middleware installed and configured
- ✅ ClerkProvider added to root layout
- ✅ Helper functions in `lib/auth-clerk.ts`
- ⚠️ API routes still use custom JWT auth (can be migrated)
- ⚠️ Frontend still uses custom auth (can be migrated)

## Next Steps

To fully migrate to Clerk:

1. Update API routes to use `requireAuth` from `@/lib/auth-clerk`
2. Replace login/signup pages with Clerk's `<SignIn />` and `<SignUp />` components
3. Update app context to use `useUser()` and `useAuth()` from Clerk
4. Sync Clerk users with Prisma User table on first login

## Clerk Features Available

- Email/password authentication
- Social logins (Google, GitHub, etc.)
- Multi-factor authentication
- User management dashboard
- Session management
- Organization support (for multi-tenant)
