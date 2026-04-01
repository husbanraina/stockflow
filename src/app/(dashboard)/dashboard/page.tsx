"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArchiveBoxIcon,
  ExclamationTriangleIcon,
  RectangleStackIcon,
  ArrowRightIcon,
} from "@heroicons/react/24/outline";

interface DashboardData {
  totalProducts: number;
  totalQuantity: number;
  lowStockCount: number;
  lowStockItems: Array<{
    _id: string;
    name: string;
    sku: string;
    quantity: number;
  }>;
}

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await fetch("/api/dashboard");
        if (!res.ok) throw new Error("Failed to load dashboard data");
        const json = await res.json();
        setData(json);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <p className="text-sm text-gray-500">Loading dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-md bg-red-50 p-4">
        <div className="flex">
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">Error loading dashboard</h3>
            <div className="mt-2 text-sm text-red-700">
              <p>{error}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold leading-6 text-gray-900">Dashboard</h1>
        <p className="mt-2 text-sm text-gray-700">
          An overview of your inventory status and low stock alerts.
        </p>
      </div>

      <dl className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {/* Total Products Card */}
        <div className="relative overflow-hidden rounded-lg bg-white px-4 pb-12 pt-5 shadow-sm border border-gray-100 sm:px-6 sm:pt-6">
          <dt>
            <div className="absolute rounded-md bg-indigo-50 p-3">
              <ArchiveBoxIcon className="h-6 w-6 text-indigo-600" aria-hidden="true" />
            </div>
            <p className="ml-16 truncate text-sm font-medium text-gray-500">
              Total Products
            </p>
          </dt>
          <dd className="ml-16 flex items-baseline pb-6 sm:pb-7">
            <p className="text-2xl font-semibold text-gray-900">
              {data?.totalProducts || 0}
            </p>
            <div className="absolute inset-x-0 bottom-0 bg-gray-50 px-4 py-4 sm:px-6">
              <div className="text-sm">
                <Link href="/products" className="font-medium text-indigo-600 hover:text-indigo-500">
                  View all<span className="sr-only"> Total Products</span>
                </Link>
              </div>
            </div>
          </dd>
        </div>

        {/* Total Quantity Card */}
        <div className="relative overflow-hidden rounded-lg bg-white px-4 pb-12 pt-5 shadow-sm border border-gray-100 sm:px-6 sm:pt-6">
          <dt>
            <div className="absolute rounded-md bg-green-50 p-3">
              <RectangleStackIcon className="h-6 w-6 text-green-600" aria-hidden="true" />
            </div>
            <p className="ml-16 truncate text-sm font-medium text-gray-500">
              Total Units (Quantity)
            </p>
          </dt>
          <dd className="ml-16 flex items-baseline pb-6 sm:pb-7">
            <p className="text-2xl font-semibold text-gray-900">
              {data?.totalQuantity || 0}
            </p>
            <div className="absolute inset-x-0 bottom-0 bg-gray-50 px-4 py-4 sm:px-6">
              <div className="text-sm flex justify-between">
                <span className="font-medium text-gray-500">Physical Stock</span>
              </div>
            </div>
          </dd>
        </div>

        {/* Low Stock Alerts Card */}
        <div className="relative overflow-hidden rounded-lg bg-white px-4 pb-12 pt-5 shadow-sm border border-gray-100 sm:px-6 sm:pt-6">
          <dt>
            <div className="absolute rounded-md bg-red-50 p-3">
              <ExclamationTriangleIcon className="h-6 w-6 text-red-600" aria-hidden="true" />
            </div>
            <p className="ml-16 truncate text-sm font-medium text-gray-500">
              Low Stock Alerts
            </p>
          </dt>
          <dd className="ml-16 flex items-baseline pb-6 sm:pb-7">
            <p className="text-2xl font-semibold text-gray-900">
              {data?.lowStockCount || 0}
            </p>
            <div className="absolute inset-x-0 bottom-0 bg-gray-50 px-4 py-4 sm:px-6">
              <div className="text-sm">
                <span className="font-medium text-red-600">Requires attention</span>
              </div>
            </div>
          </dd>
        </div>
      </dl>

      {/* Details Table: Low Stock Items */}
      <h2 className="mx-auto max-w-6xl mt-8 text-lg font-medium leading-6 text-gray-900">
        Low Stock Items
      </h2>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mt-4">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                  Name
                </th>
                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                  SKU
                </th>
                <th scope="col" className="px-3 py-3.5 text-right text-sm font-semibold text-gray-900">
                  Stock
                </th>
                <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                  <span className="sr-only">Action</span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {!data?.lowStockItems || data.lowStockItems.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-10 text-center text-sm text-gray-500">
                    No items are currently low on stock! 
                  </td>
                </tr>
              ) : (
                data.lowStockItems.map((item) => (
                  <tr key={item._id} className="hover:bg-gray-50">
                    <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                      {item.name}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                      {item.sku}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-right">
                      <span className="inline-flex items-center rounded-md bg-red-50 px-2 py-1 text-xs font-medium text-red-700 ring-1 ring-inset ring-red-600/10">
                        {item.quantity} remaining
                      </span>
                    </td>
                    <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                      <Link
                        href={`/products/${item._id}`}
                        className="text-indigo-600 hover:text-indigo-900 inline-flex items-center"
                      >
                        Restock <ArrowRightIcon className="ml-1 h-3 w-3" />
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
