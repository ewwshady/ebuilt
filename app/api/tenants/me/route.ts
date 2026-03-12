// import { NextResponse } from "next/server"
// import clientPromise from "@/lib/mongodb"
// import { getSession } from "@/lib/session"
// import { ObjectId } from "mongodb"

// export async function GET(req: Request) {
//   try {
//     const session = await getSession(req)
//     if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

//     const user = session.user
//     if (!user?.tenantId) {
//       return NextResponse.json({ error: "User has no tenant" }, { status: 400 })
//     }

//     const client = await clientPromise
//     const db = client.db("ebuilt")
//     const tenant = await db.collection("tenants").findOne({ _id: new ObjectId(user.tenantId) })

//     if (!tenant) return NextResponse.json({ error: "Tenant not found" }, { status: 404 })

//     return NextResponse.json({ tenant })
//   } catch (err) {
//     console.error("Get tenant error:", err)
//     return NextResponse.json({ error: "Failed to get tenant" }, { status: 500 })
//   }
// }
// /api/tenants/me.ts
import { NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"
import { getSession } from "@/lib/session"
import { ObjectId } from "mongodb"

export async function GET(req: Request) {
  try {
    const session = await getSession(req)
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const user = session.user

    if (!user?.tenantId) {
      return NextResponse.json({
        tenant: {
          _id: "default",
          name: "Default Tenant",
          header: {
            logo: "",
            showTitle: true,
            menu: [],
            icons: { search: true, cart: true, account: true },
          },
        },
      })
    }

    const client = await clientPromise
    const db = client.db("ebuilt")

    const tenant = await db
      .collection("tenants")
      .findOne({ _id: new ObjectId(user.tenantId) })

    if (!tenant) {
      return NextResponse.json({
        tenant: {
          _id: "default",
          name: "Default Tenant",
          header: {
            logo: "",
            showTitle: true,
            menu: [],
            icons: { search: true, cart: true, account: true },
          },
        },
      })
    }

    const safeTenant = {
      ...tenant,
      _id: tenant._id.toString(),
      tenantId: tenant.tenantId?.toString() ?? "",
      header: {
        logo: tenant.header?.logo ?? "",
        showTitle: tenant.header?.showTitle ?? true,
        menu: tenant.header?.menu ?? [],
        icons: {
          search: tenant.header?.icons?.search ?? true,
          cart: tenant.header?.icons?.cart ?? true,
          account: tenant.header?.icons?.account ?? true,
        },
      },
    }

    return NextResponse.json({ tenant: safeTenant })
  } catch (err) {
    console.error("Get tenant error:", err)
    return NextResponse.json({
      tenant: {
        _id: "default",
        name: "Default Tenant",
        header: {
          logo: "",
          showTitle: true,
          menu: [],
          icons: { search: true, cart: true, account: true },
        },
      },
    })
  }
}
