import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import { headers } from "next/headers";
import CryptoJS from "crypto-js";

export async function POST(req: Request) {
  try {
    const { amount, orderId } = await req.json();

    if (!amount || !orderId) {
      return NextResponse.json(
        { error: "Missing amount or orderId" },
        { status: 400 }
      );
    }

  
    const headerList = await headers();

    const host = headerList.get("host");

    const protocol = host?.includes("localhost") ? "http" : "https";
    const baseUrl = `${protocol}://${host}`;

    const transaction_uuid = uuidv4();
    const total_amount = amount.toString();

    const product_code = process.env.ESEWA_MERCHANT_CODE!;
    const secretKey = process.env.ESEWA_SECRET_KEY!;

    const message =
      `total_amount=${total_amount},` +
      `transaction_uuid=${transaction_uuid},` +
      `product_code=${product_code}`;

    const hash = CryptoJS.HmacSHA256(message, secretKey);
    const signature = CryptoJS.enc.Base64.stringify(hash);

    return NextResponse.json({
      url: process.env.NEXT_PUBLIC_ESEWA_PAYMENT_URL,
      formData: {
        amount: total_amount,
        tax_amount: "0",
        total_amount,
        transaction_uuid,
        product_code,
        product_service_charge: "0",
        product_delivery_charge: "0",

        success_url: `${baseUrl}/payment/esewa/success?orderId=${orderId}`,
        failure_url: `${baseUrl}/payment/esewa/failure`,

        signed_field_names: "total_amount,transaction_uuid,product_code",
        signature,
      },
    });

  } catch (error) {
    console.error("Esewa initiate error:", error);

    return NextResponse.json(
      { error: "Failed to initiate payment" },
      { status: 500 }
    );
  }
}