"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface ProductFormData {
  name: string;
  sku: string;
  description: string;
  quantity: number | "";
  costPrice: number | "";
  sellingPrice: number | "";
  lowStockThreshold: number | "";
}

interface ProductFormProps {
  initialData?: ProductFormData & { _id?: string };
  isEdit?: boolean;
}

export default function ProductForm({ initialData, isEdit }: ProductFormProps) {
  const router = useRouter();
  const [formData, setFormData] = useState<ProductFormData>({
    name: initialData?.name || "",
    sku: initialData?.sku || "",
    description: initialData?.description || "",
    quantity: initialData?.quantity ?? 0,
    costPrice: initialData?.costPrice ?? "",
    sellingPrice: initialData?.sellingPrice ?? "",
    lowStockThreshold: initialData?.lowStockThreshold ?? "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setIsLoading(true);

    try {
      const url = isEdit && initialData?._id
        ? `/api/products/${initialData._id}`
        : "/api/products";
        
      const method = isEdit ? "PUT" : "POST";

      // Transform empty strings to undefined for numbers 
      // (except for quantity which defaults to 0 mostly)
      const payload = {
        ...formData,
        quantity: formData.quantity === "" ? 0 : Number(formData.quantity),
        costPrice: formData.costPrice === "" ? 0 : Number(formData.costPrice),
        sellingPrice: formData.sellingPrice === "" ? 0 : Number(formData.sellingPrice),
        lowStockThreshold: formData.lowStockThreshold === "" ? undefined : Number(formData.lowStockThreshold),
      };

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to save product");
      }

      setSuccess(`Product ${isEdit ? "updated" : "created"} successfully!`);
      
      if (!isEdit) {
        // Reset form or navigate away
        router.push("/products");
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!initialData?._id || !confirm("Are you sure you want to delete this product?")) {
      return;
    }

    setIsDeleting(true);
    try {
      const res = await fetch(`/api/products/${initialData._id}`, {
        method: "DELETE",
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to delete product");

      router.push("/products");
    } catch (err: any) {
      setError(err.message);
      setIsDeleting(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <div className="max-w-2xl mx-auto">
      {error && (
        <div className="mb-4 bg-red-50 text-red-700 p-3 rounded-lg text-sm border border-red-100">
          {error}
        </div>
      )}
      {success && (
        <div className="mb-4 bg-green-50 text-green-700 p-3 rounded-lg text-sm border border-green-100">
          {success}
        </div>
      )}

      <form className="space-y-6 bg-white shadow-sm border border-gray-100 rounded-xl p-6 sm:p-8" onSubmit={handleSubmit}>
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Product Name *
              </label>
              <input
                type="text"
                name="name"
                id="name"
                required
                className="mt-1 block w-full rounded-lg border border-gray-200 px-3 py-2 text-gray-900 placeholder:text-gray-400 focus:border-gray-900 focus:outline-none focus:ring-gray-900 sm:text-sm transition-colors"
                placeholder="AirPods Pro 2nd Gen"
                value={formData.name}
                onChange={handleChange}
              />
            </div>
            <div>
              <label htmlFor="sku" className="block text-sm font-medium text-gray-700">
                SKU *
              </label>
              <input
                type="text"
                name="sku"
                id="sku"
                required
                className="mt-1 block w-full rounded-lg border border-gray-200 px-3 py-2 text-gray-900 placeholder:text-gray-400 focus:border-gray-900 focus:outline-none focus:ring-gray-900 sm:text-sm transition-colors"
                placeholder="AP-PRO-2"
                value={formData.sku}
                onChange={handleChange}
              />
            </div>
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              rows={3}
              className="mt-1 block w-full rounded-lg border border-gray-200 px-3 py-2 text-gray-900 placeholder:text-gray-400 focus:border-gray-900 focus:outline-none focus:ring-gray-900 sm:text-sm transition-colors"
              placeholder="Wireless noise-cancelling earbuds by Apple."
              value={formData.description}
              onChange={handleChange}
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div>
              <label htmlFor="quantity" className="block text-sm font-medium text-gray-700">
                Quantity *
              </label>
              <input
                type="number"
                name="quantity"
                id="quantity"
                required
                min="0"
                className="mt-1 block w-full rounded-lg border border-gray-200 px-3 py-2 text-gray-900 placeholder:text-gray-400 focus:border-gray-900 focus:outline-none focus:ring-gray-900 sm:text-sm transition-colors"
                placeholder="50"
                value={formData.quantity}
                onChange={handleChange}
              />
            </div>
            <div>
              <label htmlFor="costPrice" className="block text-sm font-medium text-gray-700">
                Cost Price *
              </label>
              <input
                type="number"
                name="costPrice"
                id="costPrice"
                required
                min="0"
                step="0.01"
                className="mt-1 block w-full rounded-lg border border-gray-200 px-3 py-2 text-gray-900 placeholder:text-gray-400 focus:border-gray-900 focus:outline-none focus:ring-gray-900 sm:text-sm transition-colors"
                placeholder="199.00"
                value={formData.costPrice}
                onChange={handleChange}
              />
            </div>
            <div>
              <label htmlFor="sellingPrice" className="block text-sm font-medium text-gray-700">
                Selling Price *
              </label>
              <input
                type="number"
                name="sellingPrice"
                id="sellingPrice"
                required
                min="0"
                step="0.01"
                className="mt-1 block w-full rounded-lg border border-gray-200 px-3 py-2 text-gray-900 placeholder:text-gray-400 focus:border-gray-900 focus:outline-none focus:ring-gray-900 sm:text-sm transition-colors"
                placeholder="249.00"
                value={formData.sellingPrice}
                onChange={handleChange}
              />
            </div>
          </div>

          <div>
            <label htmlFor="lowStockThreshold" className="block text-sm font-medium text-gray-700">
              Low Stock Threshold (Optional)
            </label>
            <p className="text-xs text-gray-500 mb-1">Leave empty to use the organization default.</p>
            <input
              type="number"
              name="lowStockThreshold"
              id="lowStockThreshold"
              min="0"
              className="block w-full sm:w-1/3 rounded-lg border border-gray-200 px-3 py-2 text-gray-900 placeholder:text-gray-400 focus:border-gray-900 focus:outline-none focus:ring-gray-900 sm:text-sm transition-colors"
              placeholder="10"
              value={formData.lowStockThreshold}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div>
            {isEdit && (
              <button
                type="button"
                onClick={handleDelete}
                disabled={isDeleting}
                className="text-sm font-medium text-red-600 hover:text-red-500 disabled:opacity-50"
              >
                {isDeleting ? "Deleting..." : "Delete product"}
              </button>
            )}
          </div>
          <div className="flex gap-3">
            <Link
              href="/products"
              className="rounded-lg px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 border border-gray-300"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={isLoading}
              className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-gray-800 disabled:opacity-50"
            >
              {isLoading ? "Saving..." : "Save Product"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
