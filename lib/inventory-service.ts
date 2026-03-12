import { Db, ObjectId } from "mongodb"

export interface InventoryItem {
  productId: ObjectId
  quantity: number
}

export interface InventoryChange {
  productId: ObjectId
  tenantId: ObjectId
  previousQuantity: number
  newQuantity: number
  change: number
  reason: "order_placed" | "order_cancelled" | "manual_adjustment" | "stock_received"
  orderId?: ObjectId
  timestamp: Date
}

/**
 * Deduct inventory when order is placed
 */
export async function deductInventory(
  db: Db,
  tenantId: ObjectId,
  items: InventoryItem[],
  orderId?: ObjectId
): Promise<{ success: boolean; errors: string[] }> {
  const errors: string[] = []

  try {
    for (const item of items) {
      // Get current product
      const product = await db.collection("products").findOne({
        _id: item.productId,
        tenantId,
      })

      if (!product) {
        errors.push(`Product ${item.productId} not found`)
        continue
      }

      const currentQuantity = product.inventory?.quantity || 0

      // Check if sufficient stock
      if (currentQuantity < item.quantity) {
        errors.push(
          `Product "${product.name}" has insufficient stock. Available: ${currentQuantity}, Requested: ${item.quantity}`
        )
        continue
      }

      const newQuantity = currentQuantity - item.quantity

      // Update product inventory
      await db.collection("products").updateOne(
        { _id: item.productId },
        {
          $set: {
            "inventory.quantity": newQuantity,
            updatedAt: new Date(),
          },
        }
      )

      // Log inventory change
      await logInventoryChange(db, {
        productId: item.productId,
        tenantId,
        previousQuantity: currentQuantity,
        newQuantity,
        change: -item.quantity,
        reason: "order_placed",
        orderId,
        timestamp: new Date(),
      })
    }

    return {
      success: errors.length === 0,
      errors,
    }
  } catch (error) {
    console.error("[Inventory Deduction] Error:", error)
    return {
      success: false,
      errors: [String(error)],
    }
  }
}

/**
 * Restore inventory when order is cancelled
 */
export async function restoreInventory(
  db: Db,
  tenantId: ObjectId,
  items: InventoryItem[],
  orderId: ObjectId
): Promise<{ success: boolean; errors: string[] }> {
  const errors: string[] = []

  try {
    for (const item of items) {
      const product = await db.collection("products").findOne({
        _id: item.productId,
        tenantId,
      })

      if (!product) {
        errors.push(`Product ${item.productId} not found`)
        continue
      }

      const currentQuantity = product.inventory?.quantity || 0
      const newQuantity = currentQuantity + item.quantity

      // Update product inventory
      await db.collection("products").updateOne(
        { _id: item.productId },
        {
          $set: {
            "inventory.quantity": newQuantity,
            updatedAt: new Date(),
          },
        }
      )

      // Log inventory change
      await logInventoryChange(db, {
        productId: item.productId,
        tenantId,
        previousQuantity: currentQuantity,
        newQuantity,
        change: item.quantity,
        reason: "order_cancelled",
        orderId,
        timestamp: new Date(),
      })
    }

    return {
      success: errors.length === 0,
      errors,
    }
  } catch (error) {
    console.error("[Inventory Restoration] Error:", error)
    return {
      success: false,
      errors: [String(error)],
    }
  }
}

/**
 * Get low stock products for alerts
 */
export async function getLowStockProducts(
  db: Db,
  tenantId: ObjectId
): Promise<any[]> {
  try {
    const lowStockProducts = await db
      .collection("products")
      .find({
        tenantId,
        status: "active",
        "inventory.trackInventory": true,
        $expr: {
          $lte: [
            "$inventory.quantity",
            {
              $cond: [
                { $gte: ["$inventory.lowStockThreshold", 0] },
                "$inventory.lowStockThreshold",
                5, // Default threshold of 5
              ],
            },
          ],
        },
      })
      .toArray()

    return lowStockProducts.map((p: any) => ({
      _id: p._id?.toString(),
      name: p.name,
      sku: p.inventory?.sku,
      currentQuantity: p.inventory?.quantity || 0,
      lowStockThreshold: p.inventory?.lowStockThreshold || 5,
      status: p.inventory?.quantity === 0 ? "out_of_stock" : "low_stock",
    }))
  } catch (error) {
    console.error("[Low Stock Check] Error:", error)
    return []
  }
}

/**
 * Get inventory history
 */
export async function getInventoryHistory(
  db: Db,
  productId?: ObjectId,
  tenantId?: ObjectId,
  limit: number = 50
): Promise<InventoryChange[]> {
  try {
    const query: any = {}

    if (productId) {
      query.productId = productId
    }

    if (tenantId) {
      query.tenantId = tenantId
    }

    const history = await db
      .collection("inventoryLogs")
      .find(query)
      .sort({ timestamp: -1 })
      .limit(limit)
      .toArray()

    return history as InventoryChange[]
  } catch (error) {
    console.error("[Inventory History] Error:", error)
    return []
  }
}

/**
 * Log inventory change (internal helper)
 */
async function logInventoryChange(db: Db, change: InventoryChange) {
  try {
    await db.collection("inventoryLogs").insertOne(change)
  } catch (error) {
    console.error("[Log Inventory Change] Error:", error)
  }
}

/**
 * Adjust inventory manually
 */
export async function adjustInventory(
  db: Db,
  tenantId: ObjectId,
  productId: ObjectId,
  adjustmentQuantity: number,
  reason: string = "manual_adjustment"
): Promise<{ success: boolean; error?: string }> {
  try {
    const product = await db.collection("products").findOne({
      _id: productId,
      tenantId,
    })

    if (!product) {
      return { success: false, error: "Product not found" }
    }

    const currentQuantity = product.inventory?.quantity || 0
    const newQuantity = Math.max(0, currentQuantity + adjustmentQuantity)

    await db.collection("products").updateOne(
      { _id: productId },
      {
        $set: {
          "inventory.quantity": newQuantity,
          updatedAt: new Date(),
        },
      }
    )

    // Log the change
    await logInventoryChange(db, {
      productId,
      tenantId,
      previousQuantity: currentQuantity,
      newQuantity,
      change: adjustmentQuantity,
      reason: "manual_adjustment" as const,
      timestamp: new Date(),
    })

    return { success: true }
  } catch (error) {
    console.error("[Adjust Inventory] Error:", error)
    return { success: false, error: String(error) }
  }
}
