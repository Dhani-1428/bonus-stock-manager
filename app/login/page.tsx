"use client"

import { SignIn } from "@clerk/nextjs"
import { ClerkProvider } from "@clerk/nextjs"
import Link from "next/link"
import { Package } from "lucide-react"
import { motion } from "framer-motion"

export default function LoginPage() {
  const clerkKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY

  const content = (
    <main className="min-h-screen bg-gradient-to-br from-background via-background to-background/95 flex items-center justify-center px-4 py-12 relative overflow-hidden">
      {/* Enhanced Background effects */}
      <div className="fixed inset-0 pointer-events-none">
        {/* Animated gradient orbs */}
        <motion.div
          className="absolute top-1/4 left-1/3 w-96 h-96 bg-primary/10 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-primary/8 rounded-full blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.4, 0.6, 0.4],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl" />
        
        {/* Grid pattern overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
      </div>

      <div className="relative z-10 w-full max-w-md">
        {/* Enhanced Logo with animation */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Link href="/" className="flex items-center justify-center gap-3 mb-10 group">
            <motion.div
              className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center border border-primary/20 shadow-lg group-hover:shadow-primary/20 transition-all duration-300"
              whileHover={{ scale: 1.05, rotate: 5 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
            >
              <Package className="w-6 h-6 text-primary" />
            </motion.div>
            <span className="text-2xl font-bold text-foreground">
              Stock<span className="text-primary">Pulse</span>
            </span>
          </Link>
        </motion.div>

        {/* Clerk Sign In with enhanced styling */}
        {clerkKey ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex justify-center"
          >
            <SignIn
              appearance={{
                baseTheme: "dark",
                elements: {
                  rootBox: "mx-auto w-full",
                  card: "glass rounded-3xl shadow-2xl border border-border/50 bg-card/80 backdrop-blur-xl p-8",
                  headerTitle: "text-2xl font-bold text-foreground mb-2",
                  headerSubtitle: "text-sm text-muted-foreground mb-6",
                  socialButtonsBlockButton: "h-12 rounded-xl bg-secondary/50 hover:bg-secondary/70 text-foreground border border-border/50 transition-all duration-200 hover:scale-[1.02] hover:shadow-lg",
                  socialButtonsBlockButtonText: "font-medium",
                  dividerLine: "bg-border/50",
                  dividerText: "text-muted-foreground text-xs",
                  formFieldLabel: "text-sm font-medium text-muted-foreground mb-2",
                  formFieldInput: "h-12 rounded-xl bg-background/50 border border-border/50 text-foreground placeholder:text-muted-foreground/50 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200",
                  formButtonPrimary: "h-12 rounded-xl bg-gradient-to-r from-primary to-primary/90 text-primary-foreground font-semibold shadow-lg hover:shadow-primary/20 hover:scale-[1.02] transition-all duration-200",
                  formFieldInputShowPasswordButton: "text-muted-foreground hover:text-foreground",
                  footerActionLink: "text-primary hover:text-primary/80 font-medium transition-colors",
                  footer: "mt-6 pt-6 border-t border-border/50",
                  formResendCodeLink: "text-primary hover:text-primary/80",
                  identityPreviewEditButton: "text-primary hover:text-primary/80",
                  formFieldSuccessText: "text-primary",
                  formFieldErrorText: "text-destructive",
                },
                variables: {
                  colorPrimary: "hsl(var(--primary))",
                  colorBackground: "hsl(var(--background))",
                  colorInputBackground: "hsl(var(--background))",
                  colorInputText: "hsl(var(--foreground))",
                  borderRadius: "0.75rem",
                },
              }}
              routing="path"
              path="/login"
              signUpUrl="/signup"
              afterSignInUrl="/dashboard"
            />
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass rounded-3xl p-8 text-center border border-border/50"
          >
            <p className="text-muted-foreground">Clerk authentication is not configured. Please set NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY.</p>
          </motion.div>
        )}

        {/* Back to home with enhanced styling */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="text-center mt-8"
        >
          <Link
            href="/"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors inline-flex items-center gap-2 group"
          >
            <span>Back to homepage</span>
            <motion.span
              className="inline-block"
              initial={{ x: 0 }}
              whileHover={{ x: -4 }}
              transition={{ type: "spring", stiffness: 400 }}
            >
              ←
            </motion.span>
          </Link>
        </motion.p>
      </div>
    </main>
  )

  // Wrap in ClerkProvider if key exists, otherwise return content directly
  if (clerkKey) {
    return <ClerkProvider publishableKey={clerkKey}>{content}</ClerkProvider>
  }

  return content
}
