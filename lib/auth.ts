import { NextRequest } from 'next/server'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production'

export interface AuthUser {
  userId: string
  email: string
  role: string
}

export async function getAuthUser(request: NextRequest): Promise<AuthUser | null> {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '') ||
                  request.cookies.get('token')?.value

    if (!token) {
      return null
    }

    const decoded = jwt.verify(token, JWT_SECRET) as AuthUser
    return decoded
  } catch (error) {
    return null
  }
}

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
