import Link from "next/link";
import { UserCircleIcon, HomeIcon, CubeIcon, Cog6ToothIcon } from "@heroicons/react/24/outline";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex h-screen bg-gray-50/50">
      {/* Sidebar */}
      <div className="hidden w-64 flex-col border-r border-gray-200 bg-white md:flex">
        <div className="flex h-16 items-center px-6">
          <span className="text-xl font-bold tracking-tight text-gray-900">
            StockFlow
          </span>
        </div>
        <nav className="flex-1 space-y-1 px-4 py-4">
          <Link
            href="/dashboard"
            className="group flex items-center rounded-lg px-2 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900"
          >
            <HomeIcon className="mr-3 h-5 w-5 flex-shrink-0 text-gray-400 group-hover:text-gray-500" />
            Dashboard
          </Link>
          <Link
            href="/products"
            className="group flex items-center rounded-lg px-2 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900"
          >
            <CubeIcon className="mr-3 h-5 w-5 flex-shrink-0 text-gray-400 group-hover:text-gray-500" />
            Products
          </Link>
          <Link
            href="/settings"
            className="group flex items-center rounded-lg px-2 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900"
          >
            <Cog6ToothIcon className="mr-3 h-5 w-5 flex-shrink-0 text-gray-400 group-hover:text-gray-500" />
            Settings
          </Link>
        </nav>
        
        {/* User profile section at the bottom */}
        <div className="border-t border-gray-200 p-4 shrink-0">
          <div className="group block w-full flex-shrink-0">
            <div className="flex items-center">
              <div>
                <UserCircleIcon className="inline-block h-9 w-9 rounded-full text-gray-400 bg-gray-100 p-1" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-700 group-hover:text-gray-900">
                  Account
                </p>
                <Link
                  href="/login"
                  className="text-xs font-medium text-gray-500 hover:text-gray-700"
                >
                  <span className="block hover:underline">Sign Out</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <main className="flex-1 overflow-y-auto w-full p-4 md:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
