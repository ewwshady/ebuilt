// Comprehensive client-side and server-side validation utilities

export interface ValidationResult {
  valid: boolean
  error?: string
}

// Email validation
export function validateEmail(email: string): ValidationResult {
  if (!email || typeof email !== "string") {
    return { valid: false, error: "Email is required" }
  }

  const trimmedEmail = email.trim().toLowerCase()

  if (trimmedEmail.length > 254) {
    return { valid: false, error: "Email is too long" }
  }

  // RFC 5322 simplified email regex
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

  if (!emailRegex.test(trimmedEmail)) {
    return { valid: false, error: "Invalid email format" }
  }

  // Additional checks for common issues
  if (trimmedEmail.startsWith(".") || trimmedEmail.endsWith(".")) {
    return { valid: false, error: "Invalid email format" }
  }

  if (trimmedEmail.includes("..")) {
    return { valid: false, error: "Invalid email format" }
  }

  return { valid: true }
}

// Password validation
export function validatePassword(password: string): ValidationResult {
  if (!password || typeof password !== "string") {
    return { valid: false, error: "Password is required" }
  }

  if (password.length < 8) {
    return { valid: false, error: "Password must be at least 8 characters" }
  }

  if (password.length > 128) {
    return { valid: false, error: "Password is too long" }
  }

  // Check for at least one uppercase letter
  if (!/[A-Z]/.test(password)) {
    return { valid: false, error: "Password must contain at least one uppercase letter" }
  }

  // Check for at least one lowercase letter
  if (!/[a-z]/.test(password)) {
    return { valid: false, error: "Password must contain at least one lowercase letter" }
  }

  // Check for at least one number
  if (!/[0-9]/.test(password)) {
    return { valid: false, error: "Password must contain at least one number" }
  }

  // Check for at least one special character
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    return { valid: false, error: "Password must contain at least one special character" }
  }

  return { valid: true }
}

// Name validation
export function validateName(name: string): ValidationResult {
  if (!name || typeof name !== "string") {
    return { valid: false, error: "Name is required" }
  }

  const trimmedName = name.trim()

  if (trimmedName.length < 2) {
    return { valid: false, error: "Name must be at least 2 characters" }
  }

  if (trimmedName.length > 100) {
    return { valid: false, error: "Name is too long" }
  }

  // Allow letters, spaces, hyphens, and apostrophes
  if (!/^[a-zA-Z\s\-']+$/.test(trimmedName)) {
    return { valid: false, error: "Name contains invalid characters" }
  }

  return { valid: true }
}

// Phone number validation (basic international format)
export function validatePhone(phone: string): ValidationResult {
  if (!phone || typeof phone !== "string") {
    return { valid: false, error: "Phone number is required" }
  }

  const trimmedPhone = phone.trim().replace(/\s+/g, "")

  if (!/^\+?[1-9]\d{1,14}$/.test(trimmedPhone)) {
    return { valid: false, error: "Invalid phone number format" }
  }

  return { valid: true }
}

// OTP validation
export function validateOTP(otp: string): ValidationResult {
  if (!otp || typeof otp !== "string") {
    return { valid: false, error: "OTP is required" }
  }

  const trimmedOTP = otp.trim()

  if (!/^\d{6}$/.test(trimmedOTP)) {
    return { valid: false, error: "OTP must be 6 digits" }
  }

  return { valid: true }
}

// Address validation
export function validateAddress(address: {
  street?: string
  city?: string
  state?: string
  zip?: string
  country?: string
}): ValidationResult {
  if (!address.street || typeof address.street !== "string") {
    return { valid: false, error: "Street address is required" }
  }

  if (address.street.trim().length < 3) {
    return { valid: false, error: "Street address is too short" }
  }

  if (address.street.length > 100) {
    return { valid: false, error: "Street address is too long" }
  }

  if (!address.city || typeof address.city !== "string") {
    return { valid: false, error: "City is required" }
  }

  if (address.city.trim().length < 2) {
    return { valid: false, error: "City is too short" }
  }

  if (!address.state || typeof address.state !== "string") {
    return { valid: false, error: "State/Province is required" }
  }

  if (!address.zip || typeof address.zip !== "string") {
    return { valid: false, error: "ZIP/Postal code is required" }
  }

  if (!address.country || typeof address.country !== "string") {
    return { valid: false, error: "Country is required" }
  }

  return { valid: true }
}

// Product name validation
export function validateProductName(name: string): ValidationResult {
  if (!name || typeof name !== "string") {
    return { valid: false, error: "Product name is required" }
  }

  const trimmedName = name.trim()

  if (trimmedName.length < 3) {
    return { valid: false, error: "Product name must be at least 3 characters" }
  }

  if (trimmedName.length > 200) {
    return { valid: false, error: "Product name is too long" }
  }

  return { valid: true }
}

// Price validation
export function validatePrice(price: number | string): ValidationResult {
  const numPrice = typeof price === "string" ? parseFloat(price) : price

  if (isNaN(numPrice)) {
    return { valid: false, error: "Price must be a valid number" }
  }

  if (numPrice < 0) {
    return { valid: false, error: "Price cannot be negative" }
  }

  if (numPrice > 9999999.99) {
    return { valid: false, error: "Price is too high" }
  }

  return { valid: true }
}

// Quantity validation
export function validateQuantity(quantity: number | string): ValidationResult {
  const numQuantity = typeof quantity === "string" ? parseInt(quantity, 10) : quantity

  if (isNaN(numQuantity) || !Number.isInteger(numQuantity)) {
    return { valid: false, error: "Quantity must be a whole number" }
  }

  if (numQuantity < 0) {
    return { valid: false, error: "Quantity cannot be negative" }
  }

  if (numQuantity > 999999) {
    return { valid: false, error: "Quantity is too high" }
  }

  return { valid: true }
}

// Text/Description validation
export function validateDescription(text: string, maxLength: number = 5000): ValidationResult {
  if (!text || typeof text !== "string") {
    return { valid: false, error: "Description is required" }
  }

  const trimmedText = text.trim()

  if (trimmedText.length < 10) {
    return { valid: false, error: "Description must be at least 10 characters" }
  }

  if (trimmedText.length > maxLength) {
    return { valid: false, error: `Description cannot exceed ${maxLength} characters` }
  }

  return { valid: true }
}

// Tenant subdomain validation
export function validateSubdomain(subdomain: string): ValidationResult {
  if (!subdomain || typeof subdomain !== "string") {
    return { valid: false, error: "Subdomain is required" }
  }

  const trimmedSubdomain = subdomain.trim().toLowerCase()

  if (trimmedSubdomain.length < 3) {
    return { valid: false, error: "Subdomain must be at least 3 characters" }
  }

  if (trimmedSubdomain.length > 63) {
    return { valid: false, error: "Subdomain is too long" }
  }

  // Only alphanumeric and hyphens, must start and end with alphanumeric
  if (!/^[a-z0-9]([a-z0-9-]*[a-z0-9])?$/.test(trimmedSubdomain)) {
    return { valid: false, error: "Subdomain can only contain lowercase letters, numbers, and hyphens" }
  }

  return { valid: true }
}

// Store name validation
export function validateStoreName(name: string): ValidationResult {
  if (!name || typeof name !== "string") {
    return { valid: false, error: "Store name is required" }
  }

  const trimmedName = name.trim()

  if (trimmedName.length < 2) {
    return { valid: false, error: "Store name must be at least 2 characters" }
  }

  if (trimmedName.length > 100) {
    return { valid: false, error: "Store name is too long" }
  }

  return { valid: true }
}

// URL validation
export function validateURL(url: string): ValidationResult {
  if (!url || typeof url !== "string") {
    return { valid: false, error: "URL is required" }
  }

  try {
    new URL(url)
    return { valid: true }
  } catch {
    return { valid: false, error: "Invalid URL format" }
  }
}

// Coupon code validation
export function validateCouponCode(code: string): ValidationResult {
  if (!code || typeof code !== "string") {
    return { valid: false, error: "Coupon code is required" }
  }

  const trimmedCode = code.trim().toUpperCase()

  if (trimmedCode.length < 3) {
    return { valid: false, error: "Coupon code must be at least 3 characters" }
  }

  if (trimmedCode.length > 50) {
    return { valid: false, error: "Coupon code is too long" }
  }

  // Alphanumeric and hyphens only
  if (!/^[A-Z0-9\-]+$/.test(trimmedCode)) {
    return { valid: false, error: "Coupon code can only contain letters, numbers, and hyphens" }
  }

  return { valid: true }
}

// Batch validation helper
export function validateBatch(validations: Array<[string, ValidationResult]>): {
  valid: boolean
  errors: Record<string, string>
} {
  const errors: Record<string, string> = {}

  for (const [field, result] of validations) {
    if (!result.valid && result.error) {
      errors[field] = result.error
    }
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  }
}
