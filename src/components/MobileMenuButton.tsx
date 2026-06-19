"use client";

import { useState } from "react";
import Link from "next/link";

export default function MobileMenuButton() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        className="md:hidden p-2 text-slate-600 hover:text-navy-900"
        onClick={() => setOpen((v) => !v)}
        aria-label="Toggle menu"
      >
        {open ? (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        )}
      </button>

      {open && (
        <div className="md:hidden absolute top-16 left-0 right-0 border-t border-slate-100 bg-white px-4 py-4 flex flex-col gap-4 shadow-md z-50">
          <Link href="/#documents"   className="text-sm font-medium text-slate-700 hover:text-navy-900" onClick={() => setOpen(false)}>Documents</Link>
          <Link href="/#how-it-works" className="text-sm font-medium text-slate-700 hover:text-navy-900" onClick={() => setOpen(false)}>How It Works</Link>
          <Link href="/#pricing"     className="text-sm font-medium text-slate-700 hover:text-navy-900" onClick={() => setOpen(false)}>Pricing</Link>
          <Link href="/auth/register" className="text-sm font-semibold text-white bg-navy-900 px-4 py-2 text-center hover:bg-gold-500 hover:text-navy-900 transition-colors" onClick={() => setOpen(false)}>
            Sign up free
          </Link>
        </div>
      )}
    </>
  );
}
