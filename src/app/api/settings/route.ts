import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Settings from "@/models/Settings";
import { requireOrganization } from "@/lib/auth";

export async function GET(request: Request) {
  try {
    const organizationId = await requireOrganization();
    await dbConnect();

    // Find settings for organization, default threshold is seeded on signup
    let settings = await Settings.findOne({ organizationId });

    if (!settings) {
      // Fallback just in case they don't have settings yet
      settings = await Settings.create({
        organizationId,
        defaultLowStockThreshold: 10,
      });
    }

    return NextResponse.json(settings, { status: 200 });
  } catch (error: any) {
    console.error("Fetch Settings Error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch settings" },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const organizationId = await requireOrganization();
    await dbConnect();

    const body = await request.json();
    const { defaultLowStockThreshold } = body;

    if (defaultLowStockThreshold === undefined || defaultLowStockThreshold < 0) {
      return NextResponse.json(
        { error: "A valid positive low stock threshold is required" },
        { status: 400 }
      );
    }

    const updatedSettings = await Settings.findOneAndUpdate(
      { organizationId },
      { defaultLowStockThreshold },
      { new: true, upsert: true, runValidators: true }
    );

    return NextResponse.json(updatedSettings, { status: 200 });
  } catch (error: any) {
    console.error("Update Settings Error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to update settings" },
      { status: 500 }
    );
  }
}
