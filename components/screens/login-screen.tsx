"use client"

import { useState } from "react"
import { useApp } from "@/lib/app-context"
import { Box, Eye, EyeOff, Lock, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export function LoginScreen() {
  const { login } = useApp()
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [showPass, setShowPass] = useState(false)
  const [role, setRole] = useState<"admin" | "staff">("admin")
  const [isLoading, setIsLoading] = useState(false)

  const handleLogin = () => {
    setIsLoading(true)
    setTimeout(() => {
      login(username || "Admin User", role)
    }, 800)
  }

  return (
    <div className="flex flex-col min-h-screen bg-background page-transition">
      {/* Background effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 right-10 w-32 h-32 rounded-full bg-primary/8 blur-[60px]" />
        <div className="absolute bottom-40 left-10 w-40 h-40 rounded-full bg-chart-2/8 blur-[80px]" />
      </div>

      <div className="flex-1 flex flex-col justify-center px-6 relative z-10">
        {/* Logo */}
        <div className="flex flex-col items-center mb-12">
          <div className="w-16 h-16 rounded-xl bg-primary/10 flex items-center justify-center neon-glow mb-4">
            <Box className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">
            Stock<span className="text-primary neon-text">Pulse</span>
          </h1>
          <p className="text-sm text-muted-foreground mt-1">Sign in to manage your inventory</p>
        </div>

        {/* Role selector */}
        <div className="flex gap-3 mb-8">
          <button
            onClick={() => setRole("admin")}
            className={`flex-1 py-3 rounded-xl text-sm font-medium transition-all duration-300 ${
              role === "admin"
                ? "bg-primary text-primary-foreground neon-glow"
                : "glass text-muted-foreground"
            }`}
          >
            Admin
          </button>
          <button
            onClick={() => setRole("staff")}
            className={`flex-1 py-3 rounded-xl text-sm font-medium transition-all duration-300 ${
              role === "staff"
                ? "bg-primary text-primary-foreground neon-glow"
                : "glass text-muted-foreground"
            }`}
          >
            Staff
          </button>
        </div>

        {/* Form */}
        <div className="flex flex-col gap-4">
          <div className="relative">
            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="pl-11 h-12 bg-secondary border-border rounded-xl text-foreground placeholder:text-muted-foreground"
            />
          </div>
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              type={showPass ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="pl-11 pr-11 h-12 bg-secondary border-border rounded-xl text-foreground placeholder:text-muted-foreground"
            />
            <button
              onClick={() => setShowPass(!showPass)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground"
            >
              {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>

          <Button
            onClick={handleLogin}
            disabled={isLoading}
            className="h-12 rounded-xl bg-primary text-primary-foreground font-semibold text-base hover:bg-primary/90 neon-glow mt-2 transition-all duration-300"
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                <span>Signing in...</span>
              </div>
            ) : (
              "Sign In"
            )}
          </Button>
        </div>

        <p className="text-center text-xs text-muted-foreground mt-6">
          Demo mode — tap Sign In with any credentials
        </p>
      </div>
    </div>
  )
}
