"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { CheckCircle2, Loader2 } from "lucide-react"

export default function CheckoutPage() {
  const router = useRouter()
  const [step, setStep] = useState<"shipping" | "payment" | "confirmation">("shipping")
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
  })
  const [paymentMethod, setPaymentMethod] = useState("cod")

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleShippingSubmit = async () => {
    if (!formData.firstName || !formData.email || !formData.address || !formData.city) {
      alert("Please fill in all required fields")
      return
    }
    setStep("payment")
  }

  const handlePaymentSubmit = async () => {
    setIsLoading(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 2000))
      setStep("confirmation")
    } catch (error) {
      alert("Payment failed")
    } finally {
      setIsLoading(false)
    }
  }

  const orderTotal = 2197

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl font-bold text-slate-900 mb-8">Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              {[
                { key: "shipping", label: "Shipping" },
                { key: "payment", label: "Payment" },
                { key: "confirmation", label: "Confirmation" },
              ].map((s, idx) => (
                <div key={s.key} className="flex items-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                      step === s.key || (idx < ["shipping", "payment", "confirmation"].indexOf(step))
                        ? "bg-blue-600 text-white"
                        : "bg-slate-200 text-slate-600"
                    }`}
                  >
                    {idx + 1}
                  </div>
                  <p
                    className={`ml-2 font-medium ${
                      step === s.key ? "text-blue-600" : "text-slate-600"
                    }`}
                  >
                    {s.label}
                  </p>
                  {idx < 2 && <div className="w-16 h-1 bg-slate-200 mx-4" />}
                </div>
              ))}
            </div>
          </div>

          {step === "shipping" && (
            <Card>
              <CardHeader>
                <CardTitle>Shipping Address</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>First Name *</Label>
                    <Input
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      placeholder="John"
                      className="mt-2"
                    />
                  </div>
                  <div>
                    <Label>Last Name *</Label>
                    <Input
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      placeholder="Doe"
                      className="mt-2"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Email *</Label>
                    <Input
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="john@example.com"
                      className="mt-2"
                    />
                  </div>
                  <div>
                    <Label>Phone *</Label>
                    <Input
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="+977 98..."
                      className="mt-2"
                    />
                  </div>
                </div>

                <div>
                  <Label>Street Address *</Label>
                  <Input
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    placeholder="123 Main St"
                    className="mt-2"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>City *</Label>
                    <Input
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      placeholder="Kathmandu"
                      className="mt-2"
                    />
                  </div>
                  <div>
                    <Label>Postal Code</Label>
                    <Input
                      name="zipCode"
                      value={formData.zipCode}
                      onChange={handleInputChange}
                      placeholder="44600"
                      className="mt-2"
                    />
                  </div>
                </div>

                <Button
                  onClick={handleShippingSubmit}
                  className="w-full bg-blue-600 hover:bg-blue-700 h-11 mt-6"
                >
                  Continue to Payment
                </Button>
              </CardContent>
            </Card>
          )}

          {step === "payment" && (
            <Card>
              <CardHeader>
                <CardTitle>Payment Method</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                  <div className="flex items-center space-x-3 p-4 border rounded-lg cursor-pointer hover:bg-slate-50">
                    <RadioGroupItem value="cod" id="cod" />
                    <Label htmlFor="cod" className="flex-1 cursor-pointer">
                      <p className="font-semibold">Cash on Delivery (COD)</p>
                      <p className="text-sm text-slate-600">Pay when your order arrives</p>
                    </Label>
                  </div>

                  <div className="flex items-center space-x-3 p-4 border rounded-lg cursor-pointer hover:bg-slate-50">
                    <RadioGroupItem value="esewa" id="esewa" />
                    <Label htmlFor="esewa" className="flex-1 cursor-pointer">
                      <p className="font-semibold">eSewa</p>
                      <p className="text-sm text-slate-600">Secure online payment</p>
                    </Label>
                  </div>

                  <div className="flex items-center space-x-3 p-4 border rounded-lg cursor-pointer hover:bg-slate-50">
                    <RadioGroupItem value="khalti" id="khalti" />
                    <Label htmlFor="khalti" className="flex-1 cursor-pointer">
                      <p className="font-semibold">Khalti</p>
                      <p className="text-sm text-slate-600">Mobile wallet payment</p>
                    </Label>
                  </div>
                </RadioGroup>

                <div className="flex gap-3 pt-6">
                  <Button
                    onClick={() => setStep("shipping")}
                    variant="outline"
                    className="flex-1"
                  >
                    Back
                  </Button>
                  <Button
                    onClick={handlePaymentSubmit}
                    disabled={isLoading}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 h-11"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      "Place Order"
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {step === "confirmation" && (
            <div className="text-center py-12">
              <CheckCircle2 className="w-16 h-16 text-green-600 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-slate-900 mb-2">Order Confirmed!</h2>
              <p className="text-slate-600 mb-6">
                Thank you for your purchase. Your order has been placed successfully.
              </p>
              <div className="bg-slate-50 p-6 rounded-lg mb-6 text-left">
                <p className="text-sm text-slate-600">Order ID: <span className="font-bold">#ORD-20240312-001</span></p>
                <p className="text-sm text-slate-600 mt-2">A confirmation email has been sent to {formData.email}</p>
              </div>
              <Button
                onClick={() => router.push("/products")}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Continue Shopping
              </Button>
            </div>
          )}
        </div>

        <div>
          <Card className="sticky top-20">
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-600">Subtotal</span>
                  <span className="text-slate-900">Rs. 1898</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Shipping</span>
                  <span className="text-slate-900">FREE</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Tax (13%)</span>
                  <span className="text-slate-900">Rs. 247</span>
                </div>
                <div className="border-t pt-3">
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span>Rs. {orderTotal}</span>
                  </div>
                </div>
              </div>

              <div className="border-t pt-4 space-y-3">
                {[
                  { name: "Premium Lipstick", qty: 1, price: 599 },
                  { name: "Face Serum", qty: 2, price: 1299 },
                ].map((item, idx) => (
                  <div key={idx} className="text-sm">
                    <div className="flex justify-between mb-1">
                      <span className="text-slate-700">{item.name}</span>
                      <span className="text-slate-900 font-semibold">Rs. {item.price * item.qty}</span>
                    </div>
                    <p className="text-xs text-slate-500">Qty: {item.qty}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
