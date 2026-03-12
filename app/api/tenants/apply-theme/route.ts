import { NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { themeRegistry } from "@/themes";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { tenantId, themeKey } = body;

    // Validation
    if (!tenantId || !themeKey) {
      return NextResponse.json(
        { error: "tenantId and themeKey required" },
        { status: 400 }
      );
    }

    // Check if theme exists in registry
    if (!themeRegistry[themeKey]) {
      return NextResponse.json(
        { error: `Invalid themeKey: ${themeKey}` },
        { status: 400 }
      );
    }

    // Validate ObjectId
    let tenantObjectId: ObjectId;
    try {
      tenantObjectId = new ObjectId(tenantId);
    } catch {
      return NextResponse.json(
        { error: "Invalid tenantId format" },
        { status: 400 }
      );
    }

    // Get database and update tenant
    const db = await getDb();
    const tenants = db.collection("tenants");

    // Get existing tenant to preserve custom assets
    const tenant = await tenants.findOne({ _id: tenantObjectId });
    if (!tenant) {
      return NextResponse.json(
        { error: "Tenant not found" },
        { status: 404 }
      );
    }

    // Update with new theme key
    const result = await tenants.updateOne(
      { _id: tenantObjectId },
      {
        $set: {
          themeKey,
          updatedAt: new Date(),
        },
      }
    );

    if (result.modifiedCount === 0) {
      return NextResponse.json(
        { error: "Failed to update tenant theme" },
        { status: 400 }
      );
    }

    // Return success with theme metadata
    const theme = themeRegistry[themeKey];
    return NextResponse.json({
      success: true,
      message: `Theme "${themeKey}" applied successfully`,
      themeKey,
      theme: {
        id: theme.metadata.id,
        name: theme.metadata.name,
        description: theme.metadata.description,
      },
    });
  } catch (err) {
    console.error("Error applying theme:", err);
    return NextResponse.json(
      { error: "Failed to apply theme", details: String(err) },
      { status: 500 }
    );
  }
}
