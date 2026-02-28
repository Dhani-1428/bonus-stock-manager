import { auth, currentUser } from '@clerk/nextjs/server'
import { NextRequest } from 'next/server'

export interface AuthUser {
  userId: string
  email: string
  role: string
  name?: string
}

/**
 * Get authenticated user from Clerk
 */
export async function getAuthUser(request?: NextRequest): Promise<AuthUser | null> {
  try {
    const { userId } = await auth()
    
    if (!userId) {
      return null
    }

    const user = await currentUser()
    
    if (!user) {
      return null
    }

    // Get role from user metadata or default to 'STAFF'
    const role = (user.publicMetadata?.role as string) || 'STAFF'

    return {
      userId,
      email: user.emailAddresses[0]?.emailAddress || '',
      role,
      name: user.firstName && user.lastName 
        ? `${user.firstName} ${user.lastName}` 
        : user.firstName || user.username || 'User',
    }
  } catch (error) {
    console.error('Clerk auth error:', error)
    return null
  }
}

/**
 * Require authentication for API routes
 */
export function requireAuth(handler: (request: NextRequest, user: AuthUser) => Promise<Response>) {
  return async (request: NextRequest) => {
    const user = await getAuthUser(request)
    
    if (!user) {
      return Response.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    return handler(request, user)
  }
}

/**
 * Require owner role for API routes
 */
export function requireOwner(handler: (request: NextRequest, user: AuthUser) => Promise<Response>) {
  return async (request: NextRequest) => {
    const user = await getAuthUser(request)
    
    if (!user) {
      return Response.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    if (user.role !== 'OWNER') {
      return Response.json(
        { error: 'Forbidden - Owner access required' },
        { status: 403 }
      )
    }

    return handler(request, user)
  }
}
