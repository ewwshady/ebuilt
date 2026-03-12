"use client";

import { useState } from "react";
import { toast } from "sonner";

/**
 * Business Logic: Promo Code Validation
 * Handles promo code validation and discount calculation
 */
export function usePromoCode() {
  const [promoCode, setPromoCode] = useState("");
  const [appliedCode, setAppliedCode] = useState<string | null>(null);

  // Valid promo codes (can be moved to database)
  const VALID_PROMO_CODES: Record<string, { discount: number; type: "percentage" | "fixed" }> = {
    BEAUTY10: { discount: 10, type: "percentage" },
    BEAUTY20: { discount: 20, type: "percentage" },
    SAVE5: { discount: 5, type: "fixed" },
  };

  const applyPromoCode = (code: string) => {
    const normalizedCode = code.toUpperCase().trim();

    if (VALID_PROMO_CODES[normalizedCode]) {
      setAppliedCode(normalizedCode);
      toast.success(`Promo code "${normalizedCode}" applied!`);
      return true;
    } else {
      toast.error("Invalid promo code");
      setAppliedCode(null);
      return false;
    }
  };

  const removePromoCode = () => {
    setPromoCode("");
    setAppliedCode(null);
  };

  const getDiscount = (subtotal: number) => {
    if (!appliedCode) return 0;

    const code = VALID_PROMO_CODES[appliedCode];
    if (code.type === "percentage") {
      return subtotal * (code.discount / 100);
    } else {
      return code.discount;
    }
  };

  return {
    promoCode,
    setPromoCode,
    appliedCode,
    applyPromoCode,
    removePromoCode,
    getDiscount,
  };
}
