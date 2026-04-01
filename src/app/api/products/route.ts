import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Product from "@/models/Product";
import { requireOrganization } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const organizationId = await requireOrganization();
    await dbConnect();

    const body = await request.json();
    const {
      name,
      sku,
      description,
      quantity,
      costPrice,
      sellingPrice,
      lowStockThreshold,
    } = body;

    // Validate main required fields
    if (
      !name ||
      !sku ||
      quantity === undefined ||
      costPrice === undefined ||
      sellingPrice === undefined
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Check if SKU already exists for this organization (since SKU is unique per org)
    const existingProduct = await Product.findOne({ organizationId, sku });
    if (existingProduct) {
      return NextResponse.json(
        { error: "Product with this SKU already exists" },
        { status: 409 }
      );
    }

    const newProduct = await Product.create({
      organizationId,
      name,
      sku,
      description,
      quantity,
      costPrice,
      sellingPrice,
      lowStockThreshold,
    });

    return NextResponse.json(newProduct, { status: 201 });
  } catch (error: any) {
    console.error("Create Product Error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to create product" },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    const organizationId = await requireOrganization();
    await dbConnect();

    // Setup search filter
    const url = new URL(request.url);
    const search = url.searchParams.get("search");

    let query: any = { organizationId };

    // Support searching optionally by name or SKU
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { sku: { $regex: search, $options: "i" } },
      ];
    }

    // Default sorting by newest first
    const products = await Product.find(query).sort({ createdAt: -1 });
    
    // Fetch settings for global low stock threshold fallback
    const Settings = (await import("@/models/Settings")).default;
    const settings = await Settings.findOne({ organizationId });
    const defaultThreshold = settings?.defaultLowStockThreshold || 10;

    // Map over products to calculate isLowStock dynamically
    const enrichedProducts = products.map((product) => {
      const threshold = product.lowStockThreshold ?? defaultThreshold;
      return {
        ...product.toJSON(),
        isLowStock: product.quantity <= threshold && product.quantity > 0,
        isOutOfStock: product.quantity === 0
      };
    });

    return NextResponse.json(enrichedProducts, { status: 200 });
  } catch (error: any) {
    console.error("Fetch Products Error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch products" },
      { status: 500 }
    );
  }
}

