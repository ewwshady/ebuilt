import { NextResponse } from "next/server"
import { getDb } from "@/lib/mongodb"
import { ObjectId } from "mongodb"
import { verifyToken } from "@/lib/session"
import { cookies } from "next/headers"

async function getSession(request: Request) {
  const authHeader = request.headers.get("authorization")?.replace("Bearer ", "")
  const cookieStore = await cookies()
  const sessionCookie = cookieStore.get("session")?.value
  const token = authHeader || sessionCookie
  if (!token) return null
  return await verifyToken(token)
}

export async function GET(request: Request) {
  try {
    const session = await getSession(request)
    if (!session) return NextResponse.json({ error: "Not logged in" }, { status: 401 })

    const db = await getDb()
    const user = await db.collection("users").findOne(
      { _id: new ObjectId(session.userId) },
      { projection: { password: 0 } }
    )

    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 })

    return NextResponse.json({
      user: {
        ...user,
        _id: user._id.toString(),
        tenantId: user.tenantId?.toString(),
      }
    })
  } catch (error) {
    console.error("GET /api/profile error:", error)
    return NextResponse.json({ error: "Server Error" }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const session = await getSession(request)
    if (!session) return NextResponse.json({ error: "Not logged in" }, { status: 401 })

    const body = await request.json()

    const updateFields: any = {
      updatedAt: new Date(),
    }

    // Top-level fields
    if (body.name !== undefined) updateFields.name = body.name
    if (body.acceptsMarketing !== undefined) updateFields.acceptsMarketing = body.acceptsMarketing

    // 🔥 FIXED: Support BOTH nested (new) and flat (old) payloads
    const profileData = body.profile || body   // ← magic line

    if (profileData.phone !== undefined) {
      updateFields["profile.phone"] = profileData.phone
    }
    if (profileData.avatar !== undefined) {
      updateFields["profile.avatar"] = profileData.avatar
    }
    if (profileData.addresses !== undefined) {
      updateFields["profile.addresses"] = profileData.addresses
    }

    const db = await getDb()

    const result = await db.collection("users").updateOne(
      { _id: new ObjectId(session.userId) },
      { $set: updateFields }
    )

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Return fresh user
    const updatedUser = await db.collection("users").findOne(
      { _id: new ObjectId(session.userId) },
      { projection: { password: 0 } }
    )

    return NextResponse.json({
      success: true,
      message: "Profile updated successfully",
      user: {
        ...updatedUser,
        _id: updatedUser!._id.toString(),
        tenantId: updatedUser!.tenantId?.toString(),
      }
    })
  } catch (error) {
    console.error("PUT /api/profile error:", error)
    return NextResponse.json({ error: "Server Error" }, { status: 500 })
  }
}