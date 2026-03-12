import { NextResponse } from "next/server";
import { z } from "zod";
import { getDb } from "@/lib/mongodb";
import { getSession } from "@/lib/session"; // Added session check
import { getTenantFromSubdomainHeader } from "@/lib/tenant-admin";
import { ObjectId } from "mongodb";
import type { Order, Product } from "@/lib/schemas";

const checkoutSchema = z.object({
  items: z.array(z.object({
      productId: z.string(),
      quantity: z.number().min(1),
  })).min(1),
  shippingAddress: z.object({
      name: z.string().min(1),
      address: z.string().min(1),
      phone: z.string().min(7), 
      city: z.string().min(1),
      state: z.string().min(1),
      zip: z.string().min(1),
      country: z.string().min(1),
  }),
  customerEmail: z.string().email(),
  paymentMethod: z.string().min(1),
  customerPhone: z.string().min(7),
});

export async function POST(request: Request) {
  try {
    const tenant = await getTenantFromSubdomainHeader();
    if (!tenant) return NextResponse.json({ error: "Store not found" }, { status: 404 });

    const session = await getSession(); // Check if user is logged in
    const body = await request.json();
    const validation = checkoutSchema.safeParse(body);
    if (!validation.success) return NextResponse.json({ error: validation.error.format() }, { status: 400 });

    const { items, shippingAddress, customerEmail, customerPhone, paymentMethod } = validation.data;
    const db = await getDb();

    // 1. Validate Products and calculate subtotal
    const productIds = items.map(item => new ObjectId(item.productId));
    const products = await db.collection<Product>("products").find({
      _id: { $in: productIds },
      tenantId: new ObjectId(tenant._id)
    }).toArray();

    let subtotal = 0;
    const orderItems = items.map(item => {
      const product = products.find(p => p._id?.toString() === item.productId);
      if (!product) throw new Error("Product not found");
      const itemTotal = product.price * item.quantity;
      subtotal += itemTotal;
      return {
        productId: product._id,
        name: product.name,
        price: product.price,
        quantity: item.quantity,
        total: itemTotal,
      };
    });

    const tax = subtotal * ((tenant.settings?.taxRate || 0) / 100);
    const orderTotal = subtotal + tax;

    // 2. Resolve Customer ID (Logged in vs Guest)
    let customerId: ObjectId;
    if (session && session.role === "customer") {
      customerId = new ObjectId(session.userId);
    } else {
      // Guest lookup/creation
      const existing = await db.collection("users").findOne({ 
        email: customerEmail.toLowerCase(), 
        tenantId: new ObjectId(tenant._id) 
      });
      if (existing) {
        customerId = existing._id;
      } else {
        const guest = await db.collection("users").insertOne({
          email: customerEmail.toLowerCase(),
          role: "customer",
          status: "guest",
          tenantId: new ObjectId(tenant._id),
          createdAt: new Date(),
          updatedAt: new Date()
        });
        customerId = guest.insertedId;
      }
    }

    // 3. Create Order
    const newOrder: any = {
      tenantId: new ObjectId(tenant._id),
      orderNumber: `ORD-${Date.now()}`,
      customerId,
      customerEmail: customerEmail.toLowerCase(),
      customerPhone, 
      items: orderItems,
      subtotal,
      tax,
      total: orderTotal,
      status: "pending",
      paymentStatus: "pending",
      paymentMethod,
      shippingAddress,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await db.collection("orders").insertOne(newOrder);

    // 4. Update Inventory
    if (tenant.settings?.enableInventory) {
      for (const item of orderItems) {
        await db.collection("products").updateOne(
          { _id: item.productId },
          { $inc: { "inventory.quantity": -item.quantity } }
        );
      }
    }

    return NextResponse.json({ orderId: result.insertedId.toString() }, { status: 201 });
  } catch (error: any) {
    console.error("Checkout error:", error);
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 });
  }
}
