'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FieldGroup, Field, FieldLabel } from '@/components/ui/field';
import type { CheckoutFormData } from '@/lib/hooks/useCheckout';

interface CheckoutFormProps {
  step: 'shipping' | 'payment' | 'confirmation';
  formData: Partial<CheckoutFormData>;
  isProcessing?: boolean;
  error?: string | null;
  orderId?: string | null;
  onFormChange?: (data: Partial<CheckoutFormData>) => void;
  onNext?: () => void;
  onBack?: () => void;
  onComplete?: () => void;
}

export function CheckoutForm({
  step,
  formData,
  isProcessing = false,
  error,
  orderId,
  onFormChange,
  onNext,
  onBack,
  onComplete,
}: CheckoutFormProps) {
  const [localErrors, setLocalErrors] = useState<Record<string, string>>({});

  if (step === 'confirmation' && orderId) {
    return (
      <Card className="mx-auto max-w-2xl">
        <CardContent className="flex flex-col items-center justify-center py-12 text-center">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
            <svg
              className="h-8 w-8 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h2 className="mb-2 text-2xl font-bold text-gray-900">Order Confirmed!</h2>
          <p className="mb-6 text-gray-600">Thank you for your purchase.</p>
          <div className="rounded-lg bg-gray-100 px-6 py-4">
            <p className="text-sm text-gray-600">Order ID</p>
            <p className="font-mono text-xl font-bold text-gray-900">{orderId}</p>
          </div>
          <p className="mt-6 text-sm text-gray-600">
            You will receive an email confirmation shortly with tracking information.
          </p>
          <Button
            onClick={onComplete}
            className="mt-8 bg-gradient-to-r from-pink-500 to-purple-600 text-white hover:from-pink-600 hover:to-purple-700"
          >
            Continue Shopping
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mx-auto max-w-2xl">
      <CardHeader>
        <CardTitle>
          {step === 'shipping' && 'Shipping Information'}
          {step === 'payment' && 'Payment Details'}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {error && (
          <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
        )}

        {step === 'shipping' && (
          <FieldGroup>
            <div className="grid gap-4 md:grid-cols-2">
              <Field>
                <FieldLabel>First Name</FieldLabel>
                <Input
                  value={formData.firstName || ''}
                  onChange={(e) =>
                    onFormChange?.({ ...formData, firstName: e.target.value })
                  }
                  error={localErrors.firstName}
                />
              </Field>
              <Field>
                <FieldLabel>Last Name</FieldLabel>
                <Input
                  value={formData.lastName || ''}
                  onChange={(e) =>
                    onFormChange?.({ ...formData, lastName: e.target.value })
                  }
                  error={localErrors.lastName}
                />
              </Field>
            </div>

            <Field>
              <FieldLabel>Email Address</FieldLabel>
              <Input
                type="email"
                value={formData.email || ''}
                onChange={(e) =>
                  onFormChange?.({ ...formData, email: e.target.value })
                }
                error={localErrors.email}
              />
            </Field>

            <Field>
              <FieldLabel>Address</FieldLabel>
              <Input
                value={formData.address || ''}
                onChange={(e) =>
                  onFormChange?.({ ...formData, address: e.target.value })
                }
                error={localErrors.address}
              />
            </Field>

            <div className="grid gap-4 md:grid-cols-3">
              <Field>
                <FieldLabel>City</FieldLabel>
                <Input
                  value={formData.city || ''}
                  onChange={(e) =>
                    onFormChange?.({ ...formData, city: e.target.value })
                  }
                  error={localErrors.city}
                />
              </Field>
              <Field>
                <FieldLabel>State/Province</FieldLabel>
                <Input
                  value={formData.state || ''}
                  onChange={(e) =>
                    onFormChange?.({ ...formData, state: e.target.value })
                  }
                  error={localErrors.state}
                />
              </Field>
              <Field>
                <FieldLabel>Zip Code</FieldLabel>
                <Input
                  value={formData.zipCode || ''}
                  onChange={(e) =>
                    onFormChange?.({ ...formData, zipCode: e.target.value })
                  }
                  error={localErrors.zipCode}
                />
              </Field>
            </div>

            <Field>
              <FieldLabel>Country</FieldLabel>
              <Input
                value={formData.country || ''}
                onChange={(e) =>
                  onFormChange?.({ ...formData, country: e.target.value })
                }
                error={localErrors.country}
              />
            </Field>
          </FieldGroup>
        )}

        {step === 'payment' && (
          <FieldGroup>
            <Field>
              <FieldLabel>Card Number</FieldLabel>
              <Input
                placeholder="1234 5678 9012 3456"
                value={formData.cardNumber || ''}
                onChange={(e) =>
                  onFormChange?.({ ...formData, cardNumber: e.target.value })
                }
                error={localErrors.cardNumber}
              />
            </Field>

            <div className="grid gap-4 md:grid-cols-2">
              <Field>
                <FieldLabel>Expiry Date</FieldLabel>
                <Input
                  placeholder="MM/YY"
                  value={formData.expiryDate || ''}
                  onChange={(e) =>
                    onFormChange?.({ ...formData, expiryDate: e.target.value })
                  }
                  error={localErrors.expiryDate}
                />
              </Field>
              <Field>
                <FieldLabel>CVV</FieldLabel>
                <Input
                  placeholder="123"
                  type="password"
                  value={formData.cvv || ''}
                  onChange={(e) =>
                    onFormChange?.({ ...formData, cvv: e.target.value })
                  }
                  error={localErrors.cvv}
                />
              </Field>
            </div>
          </FieldGroup>
        )}

        {/* Action Buttons */}
        <div className="flex gap-3 pt-6">
          {step !== 'shipping' && (
            <Button
              variant="outline"
              onClick={onBack}
              disabled={isProcessing}
              className="flex-1"
            >
              Back
            </Button>
          )}
          <Button
            onClick={onNext}
            disabled={isProcessing}
            className="flex-1 bg-gradient-to-r from-pink-500 to-purple-600 text-white hover:from-pink-600 hover:to-purple-700"
          >
            {isProcessing && (
              <svg className="mr-2 h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
              </svg>
            )}
            {step === 'payment' ? 'Complete Order' : 'Continue'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
