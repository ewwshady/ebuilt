import { NextResponse } from "next/server";
import { getAllThemes } from "@/themes";

export async function GET() {
  try {
    const themes = getAllThemes();

    return NextResponse.json({ 
      success: true,
      themes 
    });
  } catch (err) {
    console.error("Error loading themes:", err);
    return NextResponse.json(
      { success: false, error: "Failed to load themes" },
      { status: 500 }
    );
  }
}
