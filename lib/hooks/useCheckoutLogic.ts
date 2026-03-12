"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import type { CartItem } from "./useCartLogic";

/**
 * Business Logic: Checkout Form Validation
 */
const checkoutFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(7, "Phone must be at least 7 characters"),
  address: z.string().min(5, "Address must be at least 5 characters"),
  city: z.string().min(2, "City must be at least 2 characters"),
  state: z.string().min(2, "State must be at least 2 characters"),
  zip: z.string().min(4, "ZIP must be at least 4 characters"),
  country: z.string().min(2, "Country must be at least 2 characters"),
});

export type CheckoutFormData = z.infer<typeof checkoutFormSchema>;

/**
 * Business Logic: Checkout Process
 * Handles form validation, user auth prefill, and order submission
 */
export function useCheckoutLogic() {
  const router = useRouter();
  const [isLogged, setIsLogged] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<"cod" | "esewa">("cod");

  const form = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutFormSchema),
  });

  // Check auth and prefill user data
  useEffect(() => {
    const checkAuthAndPreFill = async () => {
      try {
        const res = await fetch("/api/profile");
        const data = await res.json();

        if (res.ok && data.user) {
          setIsLogged(true);
          form.setValue("name", data.user.name || "");
          form.setValue("email", data.user.email || "");

          if (data.user.profile?.addresses?.length > 0) {
            const addr = data.user.profile.addresses[0];
            form.setValue("address", addr.street || "");
            form.setValue("city", addr.city || "");
            form.setValue("state", addr.state || "");
            form.setValue("zip", addr.zip || "");
            form.setValue("country", addr.country || "");
          }
        }
      } catch {
        console.log("Guest checkout");
      }
    };

    checkAuthAndPreFill();
  }, [form]);

  /**
   * Business Logic: COD Order Creation
   */
  const submitCODOrder = async (
    data: CheckoutFormData,
    items: CartItem[],
    totalPrice: number,
    paymentMethod: "cod" | "esewa"
  ) => {
    if (items.length === 0) {
      toast.error("Cart is empty");
      return false;
    }

    const payload = {
      items: items.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
        price: item.price,
      })),
      shippingAddress: {
        name: data.name,
        phone: data.phone,
        address: data.address,
        city: data.city,
        state: data.state,
        zip: data.zip,
        country: data.country,
      },
      customerEmail: data.email,
      customerPhone: data.phone,
      paymentMethod: paymentMethod,
      amount: totalPrice,
    };

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await res.json();

      if (res.ok) {
        toast.success("Order placed successfully!");
        return result.orderId;
      } else {
        toast.error(result.error || "Failed to place order");
        return false;
      }
    } catch (err) {
      console.error(err);
      toast.error("Unexpected error occurred");
      return false;
    }
  };

  /**
   * Business Logic: eSewa Payment Flow
   */
  const submitESewaOrder = async (
    data: CheckoutFormData,
    items: CartItem[],
    totalPrice: number
  ) => {
    if (items.length === 0) {
      toast.error("Cart is empty");
      return false;
    }

    const payload = {
      items: items.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
        price: item.price,
      })),
      shippingAddress: {
        name: data.name,
        phone: data.phone,
        address: data.address,
        city: data.city,
        state: data.state,
        zip: data.zip,
        country: data.country,
      },
      customerEmail: data.email,
      customerPhone: data.phone,
      paymentMethod: "esewa",
      amount: totalPrice,
    };

    try {
      // Step 1: Create order
      const orderRes = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const order = await orderRes.json();

      if (!orderRes.ok) {
        toast.error(order.error);
        return false;
      }

      // Step 2: Initiate eSewa payment
      const payRes = await fetch("/api/payments/esewa/initiate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: totalPrice,
          orderId: order.orderId,
        }),
      });

      const payment = await payRes.json();

      // Step 3: Redirect to eSewa
      const form = document.createElement("form");
      form.method = "POST";
      form.action = payment.url;

      Object.entries(payment.formData).forEach(([key, value]) => {
        const input = document.createElement("input");
        input.type = "hidden";
        input.name = key;
        input.value = value as string;
        form.appendChild(input);
      });

      document.body.appendChild(form);
      form.submit();

      return order.orderId;
    } catch (err) {
      console.error(err);
      toast.error("Payment initiation failed");
      return false;
    }
  };

  const handleSubmit = async (
    data: CheckoutFormData,
    items: CartItem[],
    totalPrice: number
  ) => {
    if (selectedPayment === "cod") {
      return await submitCODOrder(data, items, totalPrice, "cod");
    } else if (selectedPayment === "esewa") {
      return await submitESewaOrder(data, items, totalPrice);
    }
  };

  return {
    form,
    isLogged,
    selectedPayment,
    setSelectedPayment,
    handleSubmit,
  };
}
