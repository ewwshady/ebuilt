"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, AlertCircle, CheckCircle2, Store, User, Lock } from "lucide-react"
import Link from "next/link"

export default function CreateStorePage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)

  const [formData, setFormData] = useState({
    storeName: "",
    subdomain: "",
    description: "",
    ownerName: "",
    email: "",
    password: "",
    confirmPassword: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    setError("")
  }

  const validateStep = (): boolean => {
    if (step === 1) {
      if (!formData.storeName.trim()) {
        setError("Store name is required")
        return false
      }
      if (!formData.subdomain.trim() || !/^[a-z0-9-]{3,30}$/.test(formData.subdomain)) {
        setError("Subdomain must be 3-30 characters (lowercase, numbers, hyphens)")
        return false
      }
      return true
    }
    if (step === 2) {
      if (!formData.ownerName.trim()) {
        setError("Owner name is required")
        return false
      }
      if (!formData.email.includes("@")) {
        setError("Valid email is required")
        return false
      }
      if (formData.password.length < 8) {
        setError("Password must be at least 8 characters")
        return false
      }
      if (formData.password !== formData.confirmPassword) {
        setError("Passwords do not match")
        return false
      }
      return true
    }
    return true
  }

  const handleNext = () => {
    if (validateStep()) {
      setStep(step + 1)
    }
  }

  const handlePrev = () => setStep(step - 1)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateStep()) return

    setIsLoading(true)
    setError("")

    try {
      const response = await fetch("/api/tenants/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          storeName: formData.storeName,
          subdomain: formData.subdomain,
          description: formData.description,
          ownerName: formData.ownerName,
          email: formData.email,
          password: formData.password,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || data.errors?.[0]?.error || "Failed to create store")
        return
      }

      setSuccess(true)
      setTimeout(() => {
        window.location.href = `http://${formData.subdomain}.localhost:3000/admin`
      }, 2000)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-blue-600 rounded-lg">
              <Store className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">Launch Your Store</h1>
          <p className="text-lg text-slate-400">Create a professional ecommerce store in minutes</p>
        </div>

        {success && (
          <Alert className="mb-6 border-green-500 bg-green-950">
            <CheckCircle2 className="h-4 w-4 text-green-500" />
            <AlertDescription className="text-green-300">
              Store created successfully! Redirecting to your dashboard...
            </AlertDescription>
          </Alert>
        )}

        {error && (
          <Alert className="mb-6 border-red-500 bg-red-950">
            <AlertCircle className="h-4 w-4 text-red-500" />
            <AlertDescription className="text-red-300">{error}</AlertDescription>
          </Alert>
        )}

        <Card className="shadow-2xl border-slate-700 bg-slate-800">
          <CardHeader className="border-b border-slate-700 bg-gradient-to-r from-slate-800 to-slate-700">
            <div className="flex items-center gap-2">
              {step === 1 && <Store className="h-5 w-5 text-blue-400" />}
              {step === 2 && <User className="h-5 w-5 text-purple-400" />}
              {step === 3 && <Lock className="h-5 w-5 text-green-400" />}
              <div>
                <CardTitle className="text-white">
                  {step === 1 && "Store Details"}
                  {step === 2 && "Owner Information"}
                  {step === 3 && "Confirm & Create"}
                </CardTitle>
                <CardDescription>
                  {step === 1 && "Tell us about your store"}
                  {step === 2 && "Create your admin account"}
                  {step === 3 && "Review and launch"}
                </CardDescription>
              </div>
            </div>
          </CardHeader>

          <CardContent className="pt-8">
            {/* Progress Bar */}
            <div className="mb-8 flex gap-2">
              {[1, 2, 3].map(i => (
                <div
                  key={i}
                  className={`flex-1 h-2 rounded-full transition-all ${
                    i <= step ? "bg-blue-600" : "bg-slate-700"
                  }`}
                />
              ))}
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Step 1: Store Details */}
              {step === 1 && (
                <div className="space-y-5">
                  <div className="space-y-2">
                    <Label htmlFor="storeName" className="text-slate-200">
                      Store Name
                    </Label>
                    <Input
                      id="storeName"
                      name="storeName"
                      placeholder="e.g., Awesome Shop"
                      value={formData.storeName}
                      onChange={handleChange}
                      disabled={isLoading}
                      className="h-11 bg-slate-700 border-slate-600 text-white placeholder:text-slate-500"
                    />
                    <p className="text-xs text-slate-400">Your store's display name</p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="subdomain" className="text-slate-200">
                      Store URL
                    </Label>
                    <div className="flex gap-2">
                      <Input
                        id="subdomain"
                        name="subdomain"
                        placeholder="myshop"
                        value={formData.subdomain}
                        onChange={handleChange}
                        disabled={isLoading}
                        className="h-11 bg-slate-700 border-slate-600 text-white placeholder:text-slate-500"
                      />
                      <span className="flex items-center px-4 bg-slate-700 border border-slate-600 rounded-md text-sm text-slate-400 whitespace-nowrap">
                        .localhost:3000
                      </span>
                    </div>
                    <p className="text-xs text-slate-400">
                      Your store: {formData.subdomain || "myshop"}.localhost:3000
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description" className="text-slate-200">
                      Store Description (Optional)
                    </Label>
                    <Textarea
                      id="description"
                      name="description"
                      placeholder="Describe your business..."
                      value={formData.description}
                      onChange={handleChange}
                      disabled={isLoading}
                      rows={3}
                      className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-500"
                    />
                  </div>
                </div>
              )}

              {/* Step 2: Owner Information */}
              {step === 2 && (
                <div className="space-y-5">
                  <div className="space-y-2">
                    <Label htmlFor="ownerName" className="text-slate-200">
                      Your Full Name
                    </Label>
                    <Input
                      id="ownerName"
                      name="ownerName"
                      placeholder="John Doe"
                      value={formData.ownerName}
                      onChange={handleChange}
                      disabled={isLoading}
                      className="h-11 bg-slate-700 border-slate-600 text-white placeholder:text-slate-500"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-slate-200">
                      Email Address
                    </Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="your@email.com"
                      value={formData.email}
                      onChange={handleChange}
                      disabled={isLoading}
                      className="h-11 bg-slate-700 border-slate-600 text-white placeholder:text-slate-500"
                    />
                    <p className="text-xs text-slate-400">You'll use this to log in</p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-slate-200">
                      Password
                    </Label>
                    <Input
                      id="password"
                      name="password"
                      type="password"
                      placeholder="••••••••"
                      value={formData.password}
                      onChange={handleChange}
                      disabled={isLoading}
                      className="h-11 bg-slate-700 border-slate-600 text-white placeholder:text-slate-500"
                    />
                    <p className="text-xs text-slate-400">Minimum 8 characters</p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword" className="text-slate-200">
                      Confirm Password
                    </Label>
                    <Input
                      id="confirmPassword"
                      name="confirmPassword"
                      type="password"
                      placeholder="••••••••"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      disabled={isLoading}
                      className="h-11 bg-slate-700 border-slate-600 text-white placeholder:text-slate-500"
                    />
                  </div>
                </div>
              )}

              {/* Step 3: Review */}
              {step === 3 && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 p-4 bg-slate-700 rounded-lg">
                    <div>
                      <p className="text-xs text-slate-400">Store Name</p>
                      <p className="text-white font-semibold">{formData.storeName}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-400">Store URL</p>
                      <p className="text-white font-semibold">{formData.subdomain}.localhost:3000</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-400">Owner Name</p>
                      <p className="text-white font-semibold">{formData.ownerName}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-400">Email</p>
                      <p className="text-white font-semibold">{formData.email}</p>
                    </div>
                  </div>
                  <p className="text-sm text-slate-400">Click "Create Store" to launch your store</p>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex gap-3 pt-6 border-t border-slate-700">
                {step > 1 && (
                  <Button
                    type="button"
                    onClick={handlePrev}
                    variant="outline"
                    disabled={isLoading}
                    className="bg-slate-700 border-slate-600 text-white hover:bg-slate-600"
                  >
                    Back
                  </Button>
                )}

                {step < 3 && (
                  <Button
                    type="button"
                    onClick={handleNext}
                    disabled={isLoading}
                    className="ml-auto bg-blue-600 hover:bg-blue-700"
                  >
                    Continue
                  </Button>
                )}

                {step === 3 && (
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="ml-auto bg-green-600 hover:bg-green-700 text-white"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Creating...
                      </>
                    ) : (
                      "Create Store"
                    )}
                  </Button>
                )}
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-slate-400">
            Already have a store?{" "}
            <Link href="/login" className="text-blue-400 hover:text-blue-300 font-semibold">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

}
