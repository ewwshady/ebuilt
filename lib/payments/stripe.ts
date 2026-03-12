// lib/payments/stripe.ts

import Stripe from "stripe"
import { decrypt } from "@/lib/payment-crypto"
import { PaymentProviderAdapter, CreatePaymentInput } from "./types"

export class StripeProvider implements PaymentProviderAdapter {
  private stripe: Stripe

  constructor(config: any) {
    const secretKey = decrypt(config.secretKey)

    this.stripe = new Stripe(secretKey, {
      apiVersion: "2023-10-16",
    })
  }

  async createPayment(data: CreatePaymentInput) {
    const session = await this.stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: data.currency,
            product_data: {
              name: `Order #${data.orderId}`,
            },
            unit_amount: data.amount * 100,
          },
          quantity: 1,
        },
      ],
      success_url: `${process.env.APP_URL}/success`,
      cancel_url: `${process.env.APP_URL}/cancel`,
      metadata: {
        orderId: data.orderId,
      },
    })

    return session
  }
}