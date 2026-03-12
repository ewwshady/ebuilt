"use client";

import { useState } from "react";
import { BookOpen, Truck, Lock } from "lucide-react";
import type { Tenant } from "@/lib/schemas";

interface CheckoutFormProps {
  tenant: Tenant;
  total: number;
  items: any[];
  onSubmit: (data: any) => Promise<void>;
}

export function CheckoutForm({ tenant, total, items, onSubmit }: CheckoutFormProps) {
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<"cod" | "esewa">("cod");
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    zipCode: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onSubmit({
        ...formData,
        paymentMethod,
        items,
        total,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <div className="inline-flex items-center gap-2 rounded-lg bg-amber-100 px-4 py-2 mb-4">
          <BookOpen className="h-5 w-5 text-amber-600" />
          <span className="font-semibold text-amber-900">Secure Checkout</span>
        </div>
        <h1 className="text-3xl font-bold text-gray-900">Complete Your Order</h1>
        <p className="mt-2 text-gray-600">Enter your details and choose a payment method</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Shipping Information */}
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-6">
          <div className="mb-4 flex items-center gap-2">
            <Truck className="h-5 w-5 text-amber-600" />
            <h2 className="text-xl font-semibold text-gray-900">Shipping Address</h2>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <input
              type="text"
              placeholder="First Name"
              required
              value={formData.firstName}
              onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
              className="rounded-lg border border-amber-200 bg-white px-4 py-2 focus:border-amber-600 focus:outline-none"
            />
            <input
              type="text"
              placeholder="Last Name"
              required
              value={formData.lastName}
              onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
              className="rounded-lg border border-amber-200 bg-white px-4 py-2 focus:border-amber-600 focus:outline-none"
            />
            <input
              type="email"
              placeholder="Email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="rounded-lg border border-amber-200 bg-white px-4 py-2 focus:border-amber-600 focus:outline-none md:col-span-2"
            />
            <input
              type="tel"
              placeholder="Phone Number"
              required
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="rounded-lg border border-amber-200 bg-white px-4 py-2 focus:border-amber-600 focus:outline-none md:col-span-2"
            />
            <input
              type="text"
              placeholder="Address"
              required
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              className="rounded-lg border border-amber-200 bg-white px-4 py-2 focus:border-amber-600 focus:outline-none md:col-span-2"
            />
            <input
              type="text"
              placeholder="City"
              required
              value={formData.city}
              onChange={(e) => setFormData({ ...formData, city: e.target.value })}
              className="rounded-lg border border-amber-200 bg-white px-4 py-2 focus:border-amber-600 focus:outline-none"
            />
            <input
              type="text"
              placeholder="Zip Code"
              required
              value={formData.zipCode}
              onChange={(e) => setFormData({ ...formData, zipCode: e.target.value })}
              className="rounded-lg border border-amber-200 bg-white px-4 py-2 focus:border-amber-600 focus:outline-none"
            />
          </div>
        </div>

        {/* Payment Method */}
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-6">
          <div className="mb-4 flex items-center gap-2">
            <Lock className="h-5 w-5 text-amber-600" />
            <h2 className="text-xl font-semibold text-gray-900">Payment Method</h2>
          </div>

          <div className="space-y-3">
            <label className="flex items-center gap-3 cursor-pointer rounded-lg border border-amber-200 bg-white p-4 hover:bg-amber-50 transition">
              <input
                type="radio"
                name="payment"
                value="cod"
                checked={paymentMethod === "cod"}
                onChange={(e) => setPaymentMethod(e.target.value as "cod" | "esewa")}
                className="h-4 w-4 text-amber-600"
              />
              <div>
                <p className="font-semibold text-gray-900">Cash on Delivery</p>
                <p className="text-sm text-gray-600">Pay when your books arrive</p>
              </div>
            </label>

            <label className="flex items-center gap-3 cursor-pointer rounded-lg border border-amber-200 bg-white p-4 hover:bg-amber-50 transition">
              <input
                type="radio"
                name="payment"
                value="esewa"
                checked={paymentMethod === "esewa"}
                onChange={(e) => setPaymentMethod(e.target.value as "cod" | "esewa")}
                className="h-4 w-4 text-amber-600"
              />
              <div>
                <p className="font-semibold text-gray-900">eSewa</p>
                <p className="text-sm text-gray-600">Secure online payment</p>
              </div>
            </label>
          </div>
        </div>

        {/* Order Summary */}
        <div className="rounded-lg bg-gradient-to-br from-amber-50 to-yellow-50 p-6 border border-amber-200">
          <h3 className="font-semibold text-gray-900 mb-4">Order Summary</h3>
          <div className="space-y-2 mb-4">
            {items.map((item, idx) => (
              <div key={idx} className="flex justify-between text-sm">
                <span className="text-gray-600">{item.name} × {item.quantity}</span>
                <span className="font-medium text-gray-900">Rs. {item.price * item.quantity}</span>
              </div>
            ))}
          </div>
          <div className="border-t border-amber-200 pt-4">
            <div className="flex justify-between items-center">
              <span className="text-lg font-semibold text-gray-900">Total:</span>
              <span className="text-3xl font-bold text-amber-600">Rs. {total}</span>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-amber-600 px-6 py-3 font-bold text-white transition-colors hover:bg-amber-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Processing..." : "Complete Order"}
        </button>

        {/* Security Note */}
        <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
          <Lock className="h-4 w-4" />
          <span>Your payment information is secure and encrypted</span>
        </div>
      </form>
    </div>
  );
}
