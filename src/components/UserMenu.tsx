"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface Props {
  name:  string;
  email: string;
  plan:  "free" | "pro";
}

export default function UserMenu({ name, email, plan }: Readonly<Props>) {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  async function handleLogout() {
    setOpen(false);
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/");
    router.refresh();
  }

  const initial = name.trim()[0]?.toUpperCase() ?? "?";

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 text-sm text-slate-700 hover:text-navy-900 transition-colors"
        aria-label="User menu"
      >
        <span className="flex items-center justify-center w-7 h-7 bg-navy-900 text-white text-xs font-bold select-none">
          {initial}
        </span>
        <span className="hidden sm:inline font-medium text-navy-900">{name}</span>
        {plan === "pro" && (
          <span className="hidden sm:inline text-[10px] font-bold uppercase tracking-wider text-gold-600 border border-gold-400 px-1.5 py-0.5">
            PRO
          </span>
        )}
      </button>

      {open && (
        <>
          {/* Backdrop */}
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />

          <div className="absolute right-0 top-full mt-2 w-60 bg-white border border-slate-200 shadow-lg z-50">
            {/* User info */}
            <div className="px-4 py-3 border-b border-slate-100">
              <p className="text-sm font-semibold text-navy-900 truncate">{name}</p>
              <p className="text-xs text-slate-500 truncate">{email}</p>
              <span className={`inline-block mt-1.5 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 ${
                plan === "pro"
                  ? "bg-gold-500 text-navy-900"
                  : "bg-slate-100 text-slate-500"
              }`}>
                {plan === "pro" ? "Pro Plan" : "Free Plan"}
              </span>
            </div>

            {/* Actions */}
            <div className="py-1">
              <Link
                href="/account"
                onClick={() => setOpen(false)}
                className="block px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 hover:text-navy-900 transition-colors"
              >
                {plan === "pro" ? "Account & Branding" : "Account"}
              </Link>
              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 hover:text-navy-900 transition-colors"
              >
                Sign out
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
