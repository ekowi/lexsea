"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function UpgradeBanner() {
  const [code, setCode]       = useState("");
  const [error, setError]     = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleUpgrade(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/user/upgrade", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ code: code.trim() }),
      });
      const data = await res.json() as { error?: string };
      if (!res.ok) {
        setError(data.error ?? "Invalid code");
        return;
      }
      router.refresh();
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  const features = [
    "Remove LexSEA branding from all generated documents",
    "Custom letterhead — company name, address, and contact info",
    "Custom document reference number (e.g. ACME/NDA/ID/2026-001)",
    "Customizable footer text on every page",
    "Letterhead style: corporate, minimal, or none",
  ];

  return (
    <div className="border border-gold-300 bg-gold-50 p-6 mb-8">
      <div className="text-[11px] font-bold uppercase tracking-[0.2em] text-gold-600 mb-2">
        Pro Plan
      </div>
      <h2 className="font-serif text-xl font-bold text-navy-900 mb-1">
        Custom branding for your documents
      </h2>
      <p className="text-sm text-slate-500 mb-5">
        Make every document reflect your firm or company — not ours.
      </p>

      <ul className="space-y-1.5 mb-6">
        {features.map((f) => (
          <li key={f} className="flex items-start gap-2 text-sm text-slate-700">
            <span className="text-gold-500 mt-0.5 shrink-0">—</span>
            {f}
          </li>
        ))}
      </ul>

      <form onSubmit={handleUpgrade} className="flex gap-2 max-w-sm">
        <input
          type="text"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="Enter promo code"
          className="flex-1 border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:border-navy-900 bg-white"
        />
        <button
          type="submit"
          disabled={loading || !code.trim()}
          className="px-4 py-2 text-sm font-semibold bg-navy-900 text-white hover:bg-gold-500 hover:text-navy-900 transition-colors disabled:opacity-50"
        >
          {loading ? "…" : "Upgrade"}
        </button>
      </form>

      {error && <p className="text-sm text-red-600 mt-2">{error}</p>}

      <p className="text-xs text-slate-400 mt-3">
        Demo: use code <strong className="text-slate-500">HACKPRO2026</strong> to unlock Pro.
      </p>
    </div>
  );
}
