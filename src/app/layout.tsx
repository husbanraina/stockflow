import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "StockFlow — Inventory Management",
  description:
    "Simple, powerful inventory management for modern businesses. Track products, monitor stock levels, and stay organized.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} h-full`}>
      <body className="min-h-full bg-white text-gray-900 antialiased font-sans">
        {children}
      </body>
    </html>
  );
}
