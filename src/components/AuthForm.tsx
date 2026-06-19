"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface Props {
  mode:       "login" | "register";
  redirectTo: string;
}

export default function AuthForm({ mode, redirectTo }: Readonly<Props>) {
  const router = useRouter();
  const [name, setName]         = useState("");
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [error, setError]       = useState("");
  const [loading, setLoading]   = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const body = mode === "login"
        ? { email, password }
        : { email, password, name };

      const res = await fetch(`/api/auth/${mode}`, {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify(body),
      });

      const data = await res.json() as { error?: string };
      if (!res.ok) {
        setError(data.error ?? "Something went wrong. Please try again.");
        return;
      }

      router.push(redirectTo);
      router.refresh();
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full max-w-md">
      <div className="mb-8">
        <div className="text-[11px] font-bold uppercase tracking-[0.2em] text-gold-600 mb-2">
          {mode === "login" ? "Welcome back" : "Get started — free"}
        </div>
        <h1 className="font-serif text-3xl font-bold text-navy-900">
          {mode === "login" ? "Sign in to LexSEA" : "Create your account"}
        </h1>
        <p className="text-slate-500 text-sm mt-2 leading-relaxed">
          {mode === "login"
            ? "Generate professional legal documents for Indonesia and Singapore."
            : "Start generating legal documents for free. Upgrade anytime for custom branding."}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {mode === "register" && (
          <div>
            <label className="block text-sm font-medium text-navy-900 mb-1.5">Full name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ahmad Santoso"
              required
              autoComplete="name"
              className="w-full border border-slate-300 px-3 py-2.5 text-sm text-navy-900 placeholder:text-slate-400 focus:outline-none focus:border-navy-900 bg-white transition-colors"
            />
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-navy-900 mb-1.5">Email address</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@company.com"
            required
            autoComplete="email"
            className="w-full border border-slate-300 px-3 py-2.5 text-sm text-navy-900 placeholder:text-slate-400 focus:outline-none focus:border-navy-900 bg-white transition-colors"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-navy-900 mb-1.5">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder={mode === "register" ? "Minimum 8 characters" : ""}
            required
            autoComplete={mode === "login" ? "current-password" : "new-password"}
            className="w-full border border-slate-300 px-3 py-2.5 text-sm text-navy-900 placeholder:text-slate-400 focus:outline-none focus:border-navy-900 bg-white transition-colors"
          />
        </div>

        {error && (
          <p className="text-sm text-red-700 bg-red-50 border border-red-200 px-3 py-2.5">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full py-2.5 bg-navy-900 text-white text-sm font-semibold hover:bg-gold-500 hover:text-navy-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading
            ? "Please wait…"
            : mode === "login" ? "Sign in" : "Create free account"}
        </button>
      </form>

      <p className="text-sm text-slate-500 mt-6 text-center">
        {mode === "login" ? (
          <>
            Don&apos;t have an account?{" "}
            <Link href="/auth/register" className="text-navy-900 font-semibold hover:text-gold-600 transition-colors">
              Sign up free
            </Link>
          </>
        ) : (
          <>
            Already have an account?{" "}
            <Link href="/auth/login" className="text-navy-900 font-semibold hover:text-gold-600 transition-colors">
              Sign in
            </Link>
          </>
        )}
      </p>
    </div>
  );
}
