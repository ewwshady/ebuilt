"use client";

import { useState } from "react";
import { Zap, Truck, Lock, AlertCircle } from "lucide-react";
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
        <div className="inline-flex items-center gap-2 rounded-lg bg-blue-100 px-4 py-2 mb-4">
          <Zap className="h-5 w-5 text-blue-600" />
          <span className="font-semibold text-blue-900">Secure Checkout</span>
        </div>
        <h1 className="text-3xl font-bold text-gray-900">Complete Your Order</h1>
        <p className="mt-2 text-gray-600">Fast, secure, and easy checkout process</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Shipping Information */}
        <div className="rounded-lg border border-slate-200 bg-white p-6">
          <div className="mb-4 flex items-center gap-2">
            <Truck className="h-5 w-5 text-blue-600" />
            <h2 className="text-lg font-semibold text-gray-900">Delivery Address</h2>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <input
              type="text"
              placeholder="First Name"
              required
              value={formData.firstName}
              onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
              className="rounded-lg border border-slate-200 bg-white px-4 py-2 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-100"
            />
            <input
              type="text"
              placeholder="Last Name"
              required
              value={formData.lastName}
              onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
              className="rounded-lg border border-slate-200 bg-white px-4 py-2 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-100"
            />
            <input
              type="email"
              placeholder="Email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="rounded-lg border border-slate-200 bg-white px-4 py-2 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-100 md:col-span-2"
            />
            <input
              type="tel"
              placeholder="Phone Number"
              required
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="rounded-lg border border-slate-200 bg-white px-4 py-2 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-100 md:col-span-2"
            />
            <input
              type="text"
              placeholder="Street Address"
              required
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              className="rounded-lg border border-slate-200 bg-white px-4 py-2 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-100 md:col-span-2"
            />
            <input
              type="text"
              placeholder="City"
              required
              value={formData.city}
              onChange={(e) => setFormData({ ...formData, city: e.target.value })}
              className="rounded-lg border border-slate-200 bg-white px-4 py-2 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-100"
            />
            <input
              type="text"
              placeholder="Zip Code"
              required
              value={formData.zipCode}
              onChange={(e) => setFormData({ ...formData, zipCode: e.target.value })}
              className="rounded-lg border border-slate-200 bg-white px-4 py-2 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-100"
            />
          </div>
        </div>

        {/* Payment Method */}
        <div className="rounded-lg border border-slate-200 bg-white p-6">
          <div className="mb-4 flex items-center gap-2">
            <Lock className="h-5 w-5 text-blue-600" />
            <h2 className="text-lg font-semibold text-gray-900">Payment Method</h2>
          </div>

          <div className="space-y-3">
            <label className="flex items-center gap-3 cursor-pointer rounded-lg border border-slate-200 bg-slate-50 p-4 hover:bg-blue-50 hover:border-blue-300 transition">
              <input
                type="radio"
                name="payment"
                value="cod"
                checked={paymentMethod === "cod"}
                onChange={(e) => setPaymentMethod(e.target.value as "cod" | "esewa")}
                className="h-4 w-4 text-blue-600"
              />
              <div>
                <p className="font-semibold text-gray-900">Cash on Delivery</p>
                <p className="text-sm text-gray-600">Pay when your order arrives</p>
              </div>
            </label>

            <label className="flex items-center gap-3 cursor-pointer rounded-lg border border-slate-200 bg-slate-50 p-4 hover:bg-blue-50 hover:border-blue-300 transition">
              <input
                type="radio"
                name="payment"
                value="esewa"
                checked={paymentMethod === "esewa"}
                onChange={(e) => setPaymentMethod(e.target.value as "cod" | "esewa")}
                className="h-4 w-4 text-blue-600"
              />
              <div>
                <p className="font-semibold text-gray-900">eSewa Payment</p>
                <p className="text-sm text-gray-600">Quick and secure online payment</p>
              </div>
            </label>
          </div>
        </div>

        {/* Order Summary */}
        <div className="rounded-lg bg-gradient-to-br from-slate-50 to-blue-50 p-6 border border-slate-200">
          <h3 className="font-semibold text-gray-900 mb-4">Order Summary</h3>
          <div className="space-y-3 mb-4 max-h-48 overflow-y-auto">
            {items.map((item, idx) => (
              <div key={idx} className="flex justify-between text-sm items-center">
                <div>
                  <p className="font-medium text-gray-900">{item.name}</p>
                  <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                </div>
                <span className="font-semibold text-gray-900">Rs. {(item.price * item.quantity).toLocaleString()}</span>
              </div>
            ))}
          </div>
          <div className="border-t border-slate-300 pt-4">
            <div className="flex justify-between items-center">
              <span className="font-semibold text-gray-900">Total Amount:</span>
              <span className="text-3xl font-bold text-blue-600">Rs. {total.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Info Alert */}
        <div className="flex gap-3 rounded-lg border border-blue-200 bg-blue-50 p-4">
          <AlertCircle className="h-5 w-5 text-blue-600 flex-shrink-0" />
          <div className="text-sm text-blue-900">
            <p className="font-medium">Free Shipping on all orders!</p>
            <p className="text-xs mt-1">Delivery to anywhere in Nepal within 2-3 business days</p>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-blue-600 px-6 py-3 font-bold text-white transition-colors hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
        >
          {loading ? "Processing..." : "Place Order"}
        </button>

        {/* Security Note */}
        <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
          <Lock className="h-4 w-4" />
          <span>Your information is encrypted and secure</span>
        </div>
      </form>
    </div>
  );
}
