import { NextRequest, NextResponse } from "next/server"
import { getDb } from "@/lib/mongodb"
import { getSession } from "@/lib/session"
import { z } from "zod"
import { ObjectId } from "mongodb"

const addressSchema = z.object({
  street: z.string().min(5, "Street is required"),
  city: z.string().min(2, "City is required"),
  state: z.string().min(2, "State/Province is required"),
  zip: z.string().min(3, "Postal code is required"),
  country: z.string().min(2, "Country is required"),
  type: z.enum(["shipping", "billing", "both"]).default("shipping"),
  isDefault: z.boolean().default(false),
})

type AddressInput = z.infer<typeof addressSchema>

/**
 * GET - Retrieve all addresses for the logged-in user
 */
export async function GET(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session || session.role !== "customer") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const db = await getDb()
    const user = await db.collection("users").findOne(
      { _id: new ObjectId(session.userId) },
      { projection: { "profile.addresses": 1 } }
    )

    const addresses = user?.profile?.addresses || []

    return NextResponse.json({
      addresses: addresses.map((addr: any) => ({
        id: addr.id,
        street: addr.street,
        city: addr.city,
        state: addr.state,
        zip: addr.zip,
        country: addr.country,
        type: addr.type,
        isDefault: addr.isDefault,
      })),
    })
  } catch (error) {
    console.error("[Get Addresses] Error:", error)
    return NextResponse.json({ error: "Failed to fetch addresses" }, { status: 500 })
  }
}

/**
 * POST - Create a new address
 */
export async function POST(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session || session.role !== "customer") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const validation = addressSchema.safeParse(body)

    if (!validation.success) {
      return NextResponse.json(
        { error: "Validation failed", errors: validation.error.format() },
        { status: 400 }
      )
    }

    const db = await getDb()
    const userId = new ObjectId(session.userId)

    // Generate unique ID for address
    const addressId = new ObjectId().toString()

    // If this is the first address or marked as default, set it as default
    const user = await db.collection("users").findOne({ _id: userId })
    const existingAddresses = user?.profile?.addresses || []
    const isFirstAddress = existingAddresses.length === 0

    const newAddress = {
      id: addressId,
      ...validation.data,
      isDefault: validation.data.isDefault || isFirstAddress,
    }

    // If setting as default, unset other defaults
    if (newAddress.isDefault) {
      await db.collection("users").updateOne(
        { _id: userId },
        {
          $set: {
            "profile.addresses.$[].isDefault": false,
          },
        }
      )
    }

    // Add new address
    const result = await db.collection("users").updateOne(
      { _id: userId },
      {
        $push: {
          "profile.addresses": newAddress,
        },
      }
    )

    if (result.modifiedCount === 0) {
      return NextResponse.json({ error: "Failed to add address" }, { status: 400 })
    }

    return NextResponse.json(
      { message: "Address added successfully", address: newAddress },
      { status: 201 }
    )
  } catch (error) {
    console.error("[Create Address] Error:", error)
    return NextResponse.json({ error: "Failed to create address" }, { status: 500 })
  }
}

/**
 * PUT - Update an address
 */
export async function PUT(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session || session.role !== "customer") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { addressId } = body

    if (!addressId) {
      return NextResponse.json({ error: "Address ID is required" }, { status: 400 })
    }

    const validation = addressSchema.safeParse(body)

    if (!validation.success) {
      return NextResponse.json(
        { error: "Validation failed", errors: validation.error.format() },
        { status: 400 }
      )
    }

    const db = await getDb()
    const userId = new ObjectId(session.userId)

    // If setting as default, unset other defaults
    if (validation.data.isDefault) {
      await db.collection("users").updateOne(
        { _id: userId },
        {
          $set: {
            "profile.addresses.$[].isDefault": false,
          },
        }
      )
    }

    // Update specific address
    const result = await db.collection("users").updateOne(
      { _id: userId, "profile.addresses.id": addressId },
      {
        $set: {
          "profile.addresses.$": {
            id: addressId,
            ...validation.data,
          },
        },
      }
    )

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "Address not found" }, { status: 404 })
    }

    return NextResponse.json({
      message: "Address updated successfully",
      address: {
        id: addressId,
        ...validation.data,
      },
    })
  } catch (error) {
    console.error("[Update Address] Error:", error)
    return NextResponse.json({ error: "Failed to update address" }, { status: 500 })
  }
}

/**
 * DELETE - Delete an address
 */
export async function DELETE(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session || session.role !== "customer") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const addressId = request.nextUrl.searchParams.get("id")

    if (!addressId) {
      return NextResponse.json({ error: "Address ID is required" }, { status: 400 })
    }

    const db = await getDb()
    const userId = new ObjectId(session.userId)

    const result = await db.collection("users").updateOne(
      { _id: userId },
      {
        $pull: {
          "profile.addresses": {
            id: addressId,
          },
        },
      }
    )

    if (result.modifiedCount === 0) {
      return NextResponse.json({ error: "Address not found" }, { status: 404 })
    }

    return NextResponse.json({ message: "Address deleted successfully" })
  } catch (error) {
    console.error("[Delete Address] Error:", error)
    return NextResponse.json({ error: "Failed to delete address" }, { status: 500 })
  }
}
