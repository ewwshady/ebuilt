import { NextRequest, NextResponse } from "next/server"
import { getDb } from "@/lib/mongodb"
import { getSession } from "@/lib/session"
import { getTenantFromSubdomainHeader } from "@/lib/tenant-admin"
import { adjustInventory } from "@/lib/inventory-service"
import { z } from "zod"
import { ObjectId } from "mongodb"

const adjustmentSchema = z.object({
  productId: z.string().min(1, "Product ID is required"),
  quantity: z.number().int("Quantity must be an integer"),
  reason: z.string().optional(),
})

type AdjustmentInput = z.infer<typeof adjustmentSchema>

export async function POST(request: NextRequest) {
  try {
    // Verify admin session
    const session = await getSession()
    if (!session || session.role !== "tenant_admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get tenant from subdomain
    const tenant = await getTenantFromSubdomainHeader()
    if (!tenant || tenant._id?.toString() !== session.tenantId) {
      return NextResponse.json({ error: "Tenant mismatch" }, { status: 403 })
    }

    const body = await request.json()
    const validation = adjustmentSchema.safeParse(body)

    if (!validation.success) {
      return NextResponse.json(
        { error: "Validation failed", errors: validation.error.format() },
        { status: 400 }
      )
    }

    const { productId, quantity, reason } = validation.data

    if (quantity === 0) {
      return NextResponse.json(
        { error: "Quantity cannot be zero" },
        { status: 400 }
      )
    }

    const db = await getDb()
    const result = await adjustInventory(
      db,
      new ObjectId(tenant._id),
      new ObjectId(productId),
      quantity,
      reason || "manual_adjustment"
    )

    if (!result.success) {
      return NextResponse.json(
        { error: result.error || "Failed to adjust inventory" },
        { status: 400 }
      )
    }

    return NextResponse.json({
      message: "Inventory adjusted successfully",
      adjustment: {
        productId,
        adjustmentQuantity: quantity,
        reason,
      },
    })
  } catch (error) {
    console.error("[Inventory Adjustment] Error:", error)
    return NextResponse.json({ error: "Failed to adjust inventory" }, { status: 500 })
  }
}
