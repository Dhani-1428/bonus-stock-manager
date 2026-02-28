import { NextRequest, NextResponse } from 'next/server'
import { auth, currentUser } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth()
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const clerkUser = await currentUser()
    if (!clerkUser) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    const email = clerkUser.emailAddresses[0]?.emailAddress
    if (!email) {
      return NextResponse.json({ error: 'Email required' }, { status: 400 })
    }

    const name = clerkUser.firstName && clerkUser.lastName 
      ? `${clerkUser.firstName} ${clerkUser.lastName}` 
      : clerkUser.firstName || clerkUser.username || 'User'

    const role = (clerkUser.publicMetadata?.role as string) || 'STAFF'

    // Check if user exists in our database
    let user = await prisma.user.findUnique({
      where: { email },
    })

    if (user) {
      // Update existing user
      user = await prisma.user.update({
        where: { id: user.id },
        data: {
          name,
          phone: clerkUser.phoneNumbers[0]?.phoneNumber || null,
        },
      })
    } else {
      // Create new user from Clerk
      user = await prisma.user.create({
        data: {
          email,
          password: 'clerk-authenticated', // Placeholder, Clerk handles auth
          name,
          role: role as any,
          phone: clerkUser.phoneNumbers[0]?.phoneNumber || null,
        },
      })
    }

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    })
  } catch (error: any) {
    console.error('Sync user error:', error)
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}
