// lib/payments/types.ts

export interface CreatePaymentInput {
  amount: number
  currency: string
  orderId: string
}

export interface PaymentProviderAdapter {
  createPayment(data: CreatePaymentInput): Promise<any>
}