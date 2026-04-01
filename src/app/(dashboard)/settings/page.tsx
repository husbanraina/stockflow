"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function SettingsPage() {
  const router = useRouter();
  const [defaultThreshold, setDefaultThreshold] = useState<number | "">("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await fetch("/api/settings");
        if (!res.ok) throw new Error("Failed to load settings");
        const data = await res.json();
        
        setDefaultThreshold(data.defaultLowStockThreshold);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setSaving(true);

    try {
      const res = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          defaultLowStockThreshold: defaultThreshold === "" ? 0 : Number(defaultThreshold),
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to update settings");

      setSuccess("Settings updated successfully!");
      router.refresh(); // Refresh in case the dashboard layout relies on it
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <p className="text-sm text-gray-500">Loading settings...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-semibold leading-6 text-gray-900">Settings</h1>
        <p className="mt-2 text-sm text-gray-700">
          Manage your organization-wide preferences and defaults.
        </p>
      </div>

      {error && (
        <div className="rounded-md bg-red-50 p-4 border border-red-100">
          <p className="text-sm font-medium text-red-800">{error}</p>
        </div>
      )}

      {success && (
        <div className="rounded-md bg-green-50 p-4 border border-green-100">
          <p className="text-sm font-medium text-green-800">{success}</p>
        </div>
      )}

      <form className="bg-white shadow-sm border border-gray-100 rounded-xl p-6 sm:p-8" onSubmit={handleSubmit}>
        <div className="space-y-6">
          <div>
            <h2 className="text-base font-semibold text-gray-900">Inventory Defaults</h2>
            <p className="text-sm text-gray-500 mb-4">
              These settings apply globally unless overridden on specific products.
            </p>
            
            <div className="flex flex-col">
              <label htmlFor="defaultThreshold" className="block text-sm font-medium text-gray-700">
                Default Low Stock Threshold
              </label>
              <p className="text-xs text-gray-500 mb-2">
                When a product's quantity falls below or equal to this number, it will appear as low stock.
              </p>
              <input
                type="number"
                name="defaultThreshold"
                id="defaultThreshold"
                min="0"
                required
                className="mt-1 block max-w-sm rounded-lg border border-gray-300 px-3 py-2 text-gray-900 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                value={defaultThreshold}
                onChange={(e) => setDefaultThreshold(e.target.value === "" ? "" : Number(e.target.value))}
              />
            </div>
          </div>
        </div>

        <div className="mt-8 flex items-center justify-end pt-5 border-t border-gray-100">
          <button
            type="submit"
            disabled={saving}
            className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-gray-800 disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save Configuration"}
          </button>
        </div>
      </form>
    </div>
  );
}
