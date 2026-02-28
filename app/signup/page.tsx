"use client"

import { SignUp } from "@clerk/nextjs"
import { ClerkProvider } from "@clerk/nextjs"
import Link from "next/link"
import { Package } from "lucide-react"

export default function SignupPage() {
  const clerkKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY

  const content = (
    <main className="min-h-screen bg-background flex items-center justify-center px-4 py-12">
      {/* Background effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/3 right-1/3 w-80 h-80 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 left-1/4 w-64 h-64 bg-primary/8 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 w-full max-w-md">
        {/* Logo */}
        <Link href="/" className="flex items-center justify-center gap-2.5 mb-8">
          <div className="w-10 h-10 rounded-xl bg-primary/15 flex items-center justify-center neon-glow">
            <Package className="w-5 h-5 text-primary" />
          </div>
          <span className="text-xl font-bold text-foreground">
            Stock<span className="text-primary">Pulse</span>
          </span>
        </Link>

        {/* Clerk Sign Up */}
        {clerkKey ? (
          <div className="flex justify-center">
            <SignUp
              appearance={{
                elements: {
                  rootBox: "mx-auto",
                  card: "glass rounded-2xl shadow-none border border-border",
                  headerTitle: "text-foreground",
                  headerSubtitle: "text-muted-foreground",
                  socialButtonsBlockButton: "bg-secondary hover:bg-secondary/80 text-foreground border-border",
                  formButtonPrimary: "bg-primary hover:bg-primary/90 text-primary-foreground",
                  formFieldInput: "bg-secondary border-border text-foreground",
                  formFieldLabel: "text-muted-foreground",
                  footerActionLink: "text-primary hover:text-primary/80",
                },
              }}
              routing="path"
              path="/signup"
              signInUrl="/login"
              afterSignUpUrl="/dashboard"
            />
          </div>
        ) : (
          <div className="glass rounded-2xl p-8 text-center">
            <p className="text-muted-foreground">Clerk authentication is not configured. Please set NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY.</p>
          </div>
        )}

        {/* Back to home */}
        <p className="text-center mt-6">
          <Link href="/" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
            Back to homepage
          </Link>
        </p>
      </div>
    </main>
  )

  // Wrap in ClerkProvider if key exists, otherwise return content directly
  if (clerkKey) {
    return <ClerkProvider publishableKey={clerkKey}>{content}</ClerkProvider>
  }

  return content
}
