import { Suspense } from "react";
import Link from "next/link";
import UserNav from "./UserNav";
import MobileMenuButton from "./MobileMenuButton";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-slate-200 shadow-sm">
      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5">
          <span className="flex items-center justify-center w-7 h-7 bg-navy-900 text-white text-xs font-bold tracking-tight">
            Lx
          </span>
          <span className="font-serif font-bold text-navy-900 text-xl tracking-tight">
            Lex<span className="text-gold-500">SEA</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-8">
          <Link href="/#documents"    className="text-sm text-slate-600 hover:text-navy-900 transition-colors font-medium">Documents</Link>
          <Link href="/#how-it-works" className="text-sm text-slate-600 hover:text-navy-900 transition-colors font-medium">How It Works</Link>
          <Link href="/#pricing"      className="text-sm text-slate-600 hover:text-navy-900 transition-colors font-medium">Pricing</Link>
        </nav>

        {/* Auth area — server reads session, UserMenu handles dropdown */}
        <div className="hidden md:flex items-center">
          <Suspense fallback={
            <div className="w-28 h-8 bg-slate-100 animate-pulse" />
          }>
            <UserNav />
          </Suspense>
        </div>

        {/* Mobile */}
        <MobileMenuButton />
      </div>
    </header>
  );
}
