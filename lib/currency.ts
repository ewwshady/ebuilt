/**
 * Currency utilities for NPR (Nepalese Rupee)
 */

export const CURRENCY_CONFIG = {
  NPR: {
    symbol: "Rs.",
    code: "NPR",
    locale: "ne-NP",
    decimals: 2,
  },
}

/**
 * Format amount as NPR currency
 */
export function formatNPR(amount: number, includeSymbol = true): string {
  const formatted = amount.toFixed(2)
  return includeSymbol ? `Rs. ${formatted}` : formatted
}

/**
 * Format amount with localization
 */
export function formatCurrency(amount: number, currency: string = "NPR"): string {
  const config = CURRENCY_CONFIG[currency as keyof typeof CURRENCY_CONFIG] || CURRENCY_CONFIG.NPR

  const formatter = new Intl.NumberFormat(config.locale, {
    style: "currency",
    currency: config.code,
    minimumFractionDigits: config.decimals,
    maximumFractionDigits: config.decimals,
  })

  return formatter.format(amount)
}

/**
 * Parse currency string to number
 */
export function parseCurrency(value: string): number {
  // Remove currency symbols and convert to number
  const cleaned = value.replace(/[^0-9.-]/g, "")
  return parseFloat(cleaned) || 0
}

/**
 * Validate price
 */
export function isValidPrice(value: any): boolean {
  const num = parseFloat(value)
  return !isNaN(num) && num >= 0
}

/**
 * Calculate percentage of amount
 */
export function calculatePercentage(amount: number, percentage: number): number {
  return (amount * percentage) / 100
}

/**
 * Calculate discount
 */
export function calculateDiscount(originalPrice: number, discountPercent: number): {
  discountAmount: number
  finalPrice: number
} {
  const discountAmount = calculatePercentage(originalPrice, discountPercent)
  const finalPrice = originalPrice - discountAmount

  return {
    discountAmount: parseFloat(discountAmount.toFixed(2)),
    finalPrice: parseFloat(finalPrice.toFixed(2)),
  }
}

/**
 * Calculate tax
 */
export function calculateTax(amount: number, taxRate: number): number {
  return parseFloat((amount * taxRate).toFixed(2))
}

/**
 * Calculate total with tax
 */
export function calculateTotal(subtotal: number, taxRate: number): {
  tax: number
  total: number
} {
  const tax = calculateTax(subtotal, taxRate)
  const total = subtotal + tax

  return {
    tax: parseFloat(tax.toFixed(2)),
    total: parseFloat(total.toFixed(2)),
  }
}

/**
 * Format table-friendly currency (for exports)
 */
export function formatCurrencyForTable(amount: number): string {
  return formatNPR(amount, true)
}

/**
 * Get currency symbol
 */
export function getCurrencySymbol(currency: string = "NPR"): string {
  const config = CURRENCY_CONFIG[currency as keyof typeof CURRENCY_CONFIG]
  return config?.symbol || "Rs."
}
