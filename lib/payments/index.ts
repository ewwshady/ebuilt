import { StripeProvider } from "./stripe"
import { EsewaProvider } from "./esewa"

export function getPaymentProvider(type: string, config: any) {
  switch (type) {
    case "stripe":
      return new StripeProvider(config)

    case "esewa":
      return new EsewaProvider(config)

    default:
      throw new Error("Unsupported payment provider")
  }
}