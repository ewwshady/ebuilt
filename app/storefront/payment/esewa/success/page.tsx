"use client";

import { useSearchParams } from "next/navigation";
import { useEffect } from "react";

export default function SuccessPage() {

  const params = useSearchParams();

  useEffect(() => {

    const orderId = params.get("orderId");
    const data = params.get("data");

    if (!data) return;

    const decoded = JSON.parse(atob(data));

    console.log("eSewa Response:", decoded);

    fetch("/api/payments/esewa/verify", {
      method: "POST",
      body: JSON.stringify({
        orderId,
        esewaData: decoded
      })
    });

  }, []);

  return (
    <div className="p-10">
      Payment Successful 🎉
    </div>
  );
}