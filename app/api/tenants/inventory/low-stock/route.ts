import { NextResponse } from "next/server"
import { getDb } from "@/lib/mongodb"
import { getSession } from "@/lib/session"
import { getTenantFromSubdomainHeader } from "@/lib/tenant-admin"
import { getLowStockProducts } from "@/lib/inventory-service"
import { ObjectId } from "mongodb"

export async function GET(request: Request) {
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

    const db = await getDb()
    const lowStockProducts = await getLowStockProducts(db, new ObjectId(tenant._id))

    // Separate by status
    const outOfStock = lowStockProducts.filter(p => p.status === "out_of_stock")
    const lowStock = lowStockProducts.filter(p => p.status === "low_stock")

    return NextResponse.json({
      summary: {
        totalOutOfStock: outOfStock.length,
        totalLowStock: lowStock.length,
        total: lowStockProducts.length,
      },
      outOfStock,
      lowStock,
      allProducts: lowStockProducts,
    })
  } catch (error) {
    console.error("[Low Stock Alerts] Error:", error)
    return NextResponse.json({ error: "Failed to fetch low stock alerts" }, { status: 500 })
  }
}
