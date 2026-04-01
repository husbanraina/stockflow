import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Product from "@/models/Product";
import Settings from "@/models/Settings";
import { requireOrganization } from "@/lib/auth";

export async function GET(request: Request) {
  try {
    const organizationId = await requireOrganization();
    await dbConnect();

    // Get organization's default settings
    const settings = await Settings.findOne({ organizationId });
    const defaultThreshold = settings?.defaultLowStockThreshold || 10;

    // Fetch all products for the dashboard summary
    const products = await Product.find({ organizationId });

    let totalProducts = products.length;
    let totalQuantity = 0;
    
    // Calculate total quantity and collect low stock items
    const lowStockItems = [];

    for (const product of products) {
      totalQuantity += product.quantity;
      
      const threshold = product.lowStockThreshold ?? defaultThreshold;
      if (product.quantity <= threshold) {
        lowStockItems.push(product);
      }
    }

    // Sort low stock items by quantity ascending (most critical first)
    lowStockItems.sort((a, b) => a.quantity - b.quantity);

    // Limit low stock items for dashboard display (e.g. top 10)
    const limitedLowStockItems = lowStockItems.slice(0, 10);

    return NextResponse.json(
      {
        totalProducts,
        totalQuantity,
        lowStockCount: lowStockItems.length,
        lowStockItems: limitedLowStockItems,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Dashboard API Error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch dashboard data" },
      { status: 500 }
    );
  }
}
