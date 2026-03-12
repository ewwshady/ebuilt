"use client";

import { useSearchParams, useRouter } from 'next/navigation';
import { Suspense } from 'react';

function OrderConfirmationContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const orderId = searchParams.get('orderId');

    return (
        <div className="container mx-auto px-4 py-16 text-center">
            <h1 className="text-3xl font-bold mb-4">Thank you for your order!</h1>
            <p className="text-lg mb-2">Your order has been placed successfully.</p>
            {orderId && <p className="text-lg mb-8">Your order ID is: <strong>{orderId}</strong></p>}

            <button onClick={() => router.push('/')} className="mt-8 px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                Continue Shopping
            </button>
        </div>
    );
}

export default function OrderConfirmationPage() {
    return (
        <Suspense fallback={<div className="text-center p-16">Loading Confirmation...</div>}>
            <OrderConfirmationContent />
        </Suspense>
    );
}