'use client';

import { useState, useCallback } from 'react';
import type { CartItem } from './useCart';

export interface CheckoutFormData {
  email: string;
  firstName: string;
  lastName: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  cardNumber: string;
  expiryDate: string;
  cvv: string;
}

export interface CheckoutState {
  step: 'shipping' | 'payment' | 'confirmation';
  formData: Partial<CheckoutFormData>;
  isProcessing: boolean;
  error: string | null;
  orderId: string | null;
}

export function useCheckout() {
  const [checkoutState, setCheckoutState] = useState<CheckoutState>({
    step: 'shipping',
    formData: {},
    isProcessing: false,
    error: null,
    orderId: null,
  });

  const updateFormData = useCallback((data: Partial<CheckoutFormData>) => {
    setCheckoutState((prev) => ({
      ...prev,
      formData: { ...prev.formData, ...data },
      error: null,
    }));
  }, []);

  const goToNextStep = useCallback(() => {
    const steps: CheckoutState['step'][] = ['shipping', 'payment', 'confirmation'];
    const currentIndex = steps.indexOf(checkoutState.step);
    if (currentIndex < steps.length - 1) {
      setCheckoutState((prev) => ({
        ...prev,
        step: steps[currentIndex + 1],
      }));
    }
  }, [checkoutState.step]);

  const goToPreviousStep = useCallback(() => {
    const steps: CheckoutState['step'][] = ['shipping', 'payment', 'confirmation'];
    const currentIndex = steps.indexOf(checkoutState.step);
    if (currentIndex > 0) {
      setCheckoutState((prev) => ({
        ...prev,
        step: steps[currentIndex - 1],
      }));
    }
  }, [checkoutState.step]);

  const processPayment = useCallback(async (cartItems: CartItem[], total: number) => {
    setCheckoutState((prev) => ({
      ...prev,
      isProcessing: true,
      error: null,
    }));

    try {
      // Simulate API call for payment processing
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // In a real app, this would call your payment processor (Stripe, etc.)
      // For now, we'll generate a mock order ID
      const orderId = `ORD-${Date.now()}`;

      setCheckoutState((prev) => ({
        ...prev,
        isProcessing: false,
        orderId,
        step: 'confirmation',
      }));

      return { success: true, orderId };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Payment failed';
      setCheckoutState((prev) => ({
        ...prev,
        isProcessing: false,
        error: errorMessage,
      }));
      return { success: false, error: errorMessage };
    }
  }, []);

  const resetCheckout = useCallback(() => {
    setCheckoutState({
      step: 'shipping',
      formData: {},
      isProcessing: false,
      error: null,
      orderId: null,
    });
  }, []);

  const validateShippingInfo = useCallback((data: Partial<CheckoutFormData>) => {
    const errors: Record<string, string> = {};

    if (!data.email?.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      errors.email = 'Valid email is required';
    }
    if (!data.firstName?.trim()) {
      errors.firstName = 'First name is required';
    }
    if (!data.lastName?.trim()) {
      errors.lastName = 'Last name is required';
    }
    if (!data.address?.trim()) {
      errors.address = 'Address is required';
    }
    if (!data.city?.trim()) {
      errors.city = 'City is required';
    }
    if (!data.zipCode?.trim()) {
      errors.zipCode = 'Zip code is required';
    }

    return { isValid: Object.keys(errors).length === 0, errors };
  }, []);

  const validatePaymentInfo = useCallback((data: Partial<CheckoutFormData>) => {
    const errors: Record<string, string> = {};

    if (!data.cardNumber?.replace(/\s/g, '').match(/^\d{16}$/)) {
      errors.cardNumber = 'Valid 16-digit card number is required';
    }
    if (!data.expiryDate?.match(/^\d{2}\/\d{2}$/)) {
      errors.expiryDate = 'Expiry date must be MM/YY format';
    }
    if (!data.cvv?.match(/^\d{3,4}$/)) {
      errors.cvv = 'Valid CVV is required';
    }

    return { isValid: Object.keys(errors).length === 0, errors };
  }, []);

  return {
    checkoutState,
    updateFormData,
    goToNextStep,
    goToPreviousStep,
    processPayment,
    resetCheckout,
    validateShippingInfo,
    validatePaymentInfo,
  };
}
