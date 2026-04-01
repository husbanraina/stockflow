import Link from "next/link";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50/50">
      <div className="text-center bg-white p-12 rounded-3xl shadow-sm border border-gray-100 max-w-lg w-full shrink-0">
        <h1 className="text-5xl font-bold tracking-tight text-gray-900 mb-6">
          StockFlow
        </h1>
        <p className="text-lg text-gray-500 mb-10">
          Inventory management, simplified and secured per organization.
        </p>
        <div className="flex items-center justify-center gap-4 flex-col sm:flex-row">
          <Link
            href="/signup"
            className="w-full sm:w-auto flex justify-center rounded-lg bg-gray-900 px-8 py-3 text-sm font-semibold text-white shadow-sm hover:bg-gray-800"
          >
            Get started
          </Link>
          <Link
            href="/login"
            className="w-full sm:w-auto flex justify-center rounded-lg bg-gray-50 px-8 py-3 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-100"
          >
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}
