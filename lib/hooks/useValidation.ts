import { useState, useCallback } from "react"
import {
  validateEmail,
  validatePassword,
  validateName,
  validatePhone,
  validateOTP,
  validateAddress,
  validateProductName,
  validatePrice,
  validateQuantity,
  validateDescription,
  validateSubdomain,
  validateStoreName,
  validateURL,
  validateCouponCode,
  type ValidationResult,
} from "@/lib/validation"

export interface ValidationErrors {
  [key: string]: string
}

export function useValidation() {
  const [errors, setErrors] = useState<ValidationErrors>({})

  const validateField = useCallback(
    (fieldName: string, value: unknown): boolean => {
      let result: ValidationResult

      switch (fieldName) {
        case "email":
          result = validateEmail(value as string)
          break
        case "password":
          result = validatePassword(value as string)
          break
        case "name":
        case "ownerName":
          result = validateName(value as string)
          break
        case "phone":
          result = validatePhone(value as string)
          break
        case "otp":
          result = validateOTP(value as string)
          break
        case "productName":
          result = validateProductName(value as string)
          break
        case "price":
          result = validatePrice(value as number | string)
          break
        case "quantity":
          result = validateQuantity(value as number | string)
          break
        case "description":
          result = validateDescription(value as string)
          break
        case "subdomain":
          result = validateSubdomain(value as string)
          break
        case "storeName":
          result = validateStoreName(value as string)
          break
        case "url":
          result = validateURL(value as string)
          break
        case "couponCode":
          result = validateCouponCode(value as string)
          break
        default:
          return true
      }

      if (!result.valid) {
        setErrors((prev) => ({
          ...prev,
          [fieldName]: result.error || "Invalid input",
        }))
        return false
      } else {
        setErrors((prev) => {
          const { [fieldName]: _, ...rest } = prev
          return rest
        })
        return true
      }
    },
    []
  )

  const validateAddress = useCallback((address: any): boolean => {
    const result = validateAddress(address)
    if (!result.valid) {
      setErrors((prev) => ({
        ...prev,
        address: result.error || "Invalid address",
      }))
      return false
    } else {
      setErrors((prev) => {
        const { address: _, ...rest } = prev
        return rest
      })
      return true
    }
  }, [])

  const clearErrors = useCallback(() => {
    setErrors({})
  }, [])

  const clearError = useCallback((fieldName: string) => {
    setErrors((prev) => {
      const { [fieldName]: _, ...rest } = prev
      return rest
    })
  }, [])

  return {
    errors,
    validateField,
    validateAddress,
    clearErrors,
    clearError,
    hasErrors: Object.keys(errors).length > 0,
  }
}
