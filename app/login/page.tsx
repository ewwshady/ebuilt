"use client"

import type React from "react"
import { useState } from "react"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { useAuth } from "@/lib/use-auth"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import Link from "next/link"
import { Mail, Lock } from "lucide-react"

export default function LoginPage() {
  const { login } = useAuth()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    // Client-side validation
    if (password.length < 6) {
      setError("Password must be at least 6 characters long.")
      return
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address.")
      return
    }

    setLoading(true)
    try {
      await login(email, password)
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Invalid email or password."
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      {/* Page content area */}
      <main className="flex flex-1 items-center justify-center bg-gray-50 px-4 py-20">
        <Card className="w-full max-w-md border border-gray-200 shadow-sm">
          <CardHeader className="text-center space-y-1">
            <CardTitle className="text-2xl font-semibold text-gray-900">
              Admin Login
            </CardTitle>
            <CardDescription>
              Sign in to your Biozaar dashboard
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    className="pl-9"
                    placeholder="admin@yourstore.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="space-y-1">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="password"
                    type="password"
                    className="pl-9"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="flex justify-end text-sm">
                <Link
                  href="/forgot-password"
                  className="text-gray-600 hover:text-gray-900"
                >
                  Forgot password?
                </Link>
              </div>
              <Button
                type="submit"
                className="w-full"
                disabled={loading}
              >
                {loading ? "Signing in..." : "Sign In"}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="justify-center text-sm text-gray-600">
            <span>
              Don’t have an account?{" "}
              <Link href="/create-store" className="font-medium text-gray-900">
                Create one
              </Link>
            </span>
          </CardFooter>
        </Card>
      </main>
      <Footer />
    </div>
  )
}
