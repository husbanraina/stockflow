import ProductForm from "@/components/ProductForm";
import dbConnect from "@/lib/db";
import Product from "@/models/Product";
import { requireOrganization } from "@/lib/auth";
import { notFound } from "next/navigation";

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const organizationId = await requireOrganization();
  await dbConnect();

  let productStr = null;
  try {
    const product = await Product.findOne({ _id: id, organizationId });
    if (!product) {
      return notFound();
    }
    // Convert to plain object passing to client component
    productStr = JSON.stringify(product);
  } catch (err) {
    return notFound();
  }

  const initialData = JSON.parse(productStr);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Edit Product</h1>
        <p className="mt-1 text-sm text-gray-500">
          Update the details of your inventory item.
        </p>
      </div>

      <ProductForm initialData={initialData} isEdit={true} />
    </div>
  );
}
