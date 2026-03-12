import Stripe from "stripe"
import { decrypt } from "@/lib/payment-crypto"

export async function POST(request: Request) {
  const body = await request.text()
  const sig = request.headers.get("stripe-signature")!

  // get tenant by metadata or custom header
  // fetch webhookSecret
  const webhookSecret = decrypt("stored_webhook_secret")

  const stripe = new Stripe(process.env.STRIPE_SECRET!, {
    apiVersion: "2023-10-16",
  })

  let event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      webhookSecret
    )
  } catch (err) {
    return new Response("Webhook error", { status: 400 })
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session
    const orderId = session.metadata?.orderId

    // mark order as paid
  }

  return new Response("ok", { status: 200 })
}