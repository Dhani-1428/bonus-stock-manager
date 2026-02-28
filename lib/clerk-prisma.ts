import { auth, currentUser } from '@clerk/nextjs/server'
import { prisma } from './prisma'

/**
 * Get Prisma User ID from Clerk User ID
 * This syncs Clerk users with Prisma users
 */
export async function getPrismaUserId(): Promise<string | null> {
  try {
    const { userId: clerkUserId } = await auth()
    if (!clerkUserId) return null

    const clerkUser = await currentUser()
    if (!clerkUser) return null

    const email = clerkUser.emailAddresses[0]?.emailAddress
    if (!email) return null

    // Find or create user in Prisma
    let user = await prisma.user.findUnique({
      where: { email },
    })

    if (!user) {
      // Create user if doesn't exist
      const name = clerkUser.firstName && clerkUser.lastName 
        ? `${clerkUser.firstName} ${clerkUser.lastName}` 
        : clerkUser.firstName || clerkUser.username || 'User'

      const role = (clerkUser.publicMetadata?.role as string) || 'STAFF'

      user = await prisma.user.create({
        data: {
          email,
          password: 'clerk-authenticated',
          name,
          role: role as any,
          phone: clerkUser.phoneNumbers[0]?.phoneNumber || null,
        },
      })
    }

    return user.id
  } catch (error) {
    console.error('Error getting Prisma user ID:', error)
    return null
  }
}
