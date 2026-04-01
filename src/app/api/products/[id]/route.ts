import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Product from "@/models/Product";
import { requireOrganization } from "@/lib/auth";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const organizationId = await requireOrganization();
    await dbConnect();

    const { id } = await params;
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

    // Check if the product exists and belongs to the organization
    const existingProduct = await Product.findOne({
      _id: id,
      organizationId,
    });
    
    if (!existingProduct) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    // If SKU is being changed, check if the new SKU is already taken
    if (existingProduct.sku !== sku) {
      const skuTaken = await Product.findOne({ organizationId, sku });
      if (skuTaken) {
        return NextResponse.json(
          { error: "Product with this SKU already exists" },
          { status: 409 }
        );
      }
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      {
        name,
        sku,
        description,
        quantity,
        costPrice,
        sellingPrice,
        lowStockThreshold,
      },
      { new: true, runValidators: true }
    );

    return NextResponse.json(updatedProduct, { status: 200 });
  } catch (error: any) {
    console.error("Update Product Error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to update product" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const organizationId = await requireOrganization();
    await dbConnect();

    const { id } = await params;

    const deletedProduct = await Product.findOneAndDelete({
      _id: id,
      organizationId,
    });

    if (!deletedProduct) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json(
      { message: "Product deleted successfully" },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Delete Product Error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to delete product" },
      { status: 500 }
    );
  }
}

