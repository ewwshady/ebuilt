import { NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function POST(req: Request) {

  const { orderId } = await req.json();

  const db = await getDb();

  await db.collection("orders").updateOne(
    { _id: new ObjectId(orderId) },
    {
      $set: {
        paymentStatus: "paid",
        status: "processing",
        updatedAt: new Date(),
      },
    }
  );

  return NextResponse.json({ success: true });
}