import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { v4 as uuidv4 } from "uuid";

export async function POST(req: NextRequest) {
  const body = await req.json();

  if (!body.items || !body.paymentMethod) {
    return NextResponse.json({ error: "Missing parameters" }, { status: 400 });
  }

  // Only handling eSewa for test
  if (body.paymentMethod === "esewa") {
    const total = body.items.reduce((sum: number, i: any) => sum + (i.price || 0) * i.quantity, 0);

    const pid = uuidv4(); // unique transaction id

    const esewaPayload = {
      amt: total.toFixed(2),
      psc: 0,
      pdc: 0,
      tAmt: total.toFixed(2),
      pid,
      scd: "EPAYTEST", // eSewa test merchant code
      su: "http://ck.localhost:3000/order-confirmation?status=success&pid=" + pid,
      fu: "http://ck.localhost:3000/order-confirmation?status=fail&pid=" + pid,
    };

    // You can redirect user to eSewa sandbox test page
    const params = new URLSearchParams(esewaPayload as any).toString();
    const redirectUrl = `https://uat.esewa.com.np/epay/main?${params}`;

    return NextResponse.json({ redirectUrl, orderId: pid });
  }

  return NextResponse.json({ error: "Payment method not supported", status: 400 });
}