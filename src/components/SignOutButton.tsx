"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function SignOutButton() {
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleSignOut = async () => {
    setIsLoggingOut(true);
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
      });
      router.push("/login");
      router.refresh(); // Refresh state to pick up the cleared cookie in server components
    } catch (error) {
      console.error("Failed to sign out", error);
      setIsLoggingOut(false);
    }
  };

  return (
    <button
      onClick={handleSignOut}
      disabled={isLoggingOut}
      className="text-xs font-medium text-gray-500 hover:text-gray-700 text-left disabled:opacity-50"
    >
      <span className="block hover:underline">{isLoggingOut ? "Signing Out..." : "Sign Out"}</span>
    </button>
  );
}
