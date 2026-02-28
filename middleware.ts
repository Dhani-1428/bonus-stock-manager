import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Only use Clerk middleware if publishable key is available
const clerkPublishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY

// No-op middleware when Clerk is not configured (for build time)
export default function middleware(request: NextRequest) {
  // If Clerk is not configured, allow all requests during build
  if (!clerkPublishableKey) {
    return NextResponse.next()
  }

  // Dynamically import and use Clerk middleware only at runtime
  // This prevents build-time errors when Clerk keys are not set
  try {
    const { clerkMiddleware, createRouteMatcher } = require('@clerk/nextjs/server')
    
    const publicRouteMatcher = createRouteMatcher([
      '/',
      '/login(.*)',
      '/signup(.*)',
      '/api/auth(.*)',
      '/api/webhooks(.*)',
      '/api/users/sync',
    ])

    return clerkMiddleware(async (auth: any, req: NextRequest) => {
      if (!publicRouteMatcher(req)) {
        await auth.protect()
      }
    })(request)
  } catch (error) {
    // Fallback if Clerk middleware fails to load
    return NextResponse.next()
  }
}

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
}
