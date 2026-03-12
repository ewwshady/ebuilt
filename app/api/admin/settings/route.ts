import { NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"
import { verifyToken } from "@/lib/session"

export async function GET(request: Request) {
  try {
    const token = request.headers.get("authorization")?.replace("Bearer ", "")
    if (!token) {
      return NextResponse.json({ error: "Unauthorized - No token provided" }, { status: 401 })
    }

    const session = await verifyToken(token)
    if (!session || session.role !== "super_admin") {
      return NextResponse.json({ error: "Forbidden - Super admin access required" }, { status: 403 })
    }

    const client = await clientPromise
    const db = client.db("ebuilt")

    let settings = await db.collection("system_settings").findOne({})

    if (!settings) {
      // Create default settings
      settings = {
        maintenanceMode: false,
        allowNewTenants: true,
        defaultPlan: "basic",
        defaultCurrency: "NPR",
        platformFee: 5,
        emailNotifications: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      }
      await db.collection("system_settings").insertOne(settings)
    }

    return NextResponse.json({ settings })
  } catch (error) {
    console.error("Get settings error:", error)
    return NextResponse.json({ error: "Failed to fetch settings" }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const token = request.headers.get("authorization")?.replace("Bearer ", "")
    if (!token) {
      return NextResponse.json({ error: "Unauthorized - No token provided" }, { status: 401 })
    }

    const session = await verifyToken(token)
    if (!session || session.role !== "super_admin") {
      return NextResponse.json({ error: "Forbidden - Super admin access required" }, { status: 403 })
    }

    let body
    try {
      body = await request.json()
    } catch (error) {
      return NextResponse.json({ error: "Invalid JSON in request body" }, { status: 400 })
    }

    const client = await clientPromise
    const db = client.db("ebuilt")

    const updates: any = {
      updatedAt: new Date(),
    }

    if (body.maintenanceMode !== undefined) {
      updates.maintenanceMode = body.maintenanceMode
    }

    if (body.allowNewTenants !== undefined) {
      updates.allowNewTenants = body.allowNewTenants
    }

    if (body.defaultPlan) {
      updates.defaultPlan = body.defaultPlan
    }

    if (body.defaultCurrency) {
      updates.defaultCurrency = body.defaultCurrency
    }

    if (body.platformFee !== undefined) {
      updates.platformFee = body.platformFee
    }

    if (body.emailNotifications !== undefined) {
      updates.emailNotifications = body.emailNotifications
    }

    await db.collection("system_settings").updateOne({}, { $set: updates }, { upsert: true })

    const settings = await db.collection("system_settings").findOne({})

    return NextResponse.json({ settings })
  } catch (error) {
    console.error("Update settings error:", error)
    return NextResponse.json({ error: "Failed to update settings" }, { status: 500 })
  }
}
