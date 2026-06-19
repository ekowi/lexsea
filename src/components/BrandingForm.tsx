"use client";

import { useState } from "react";
import type { UserBranding } from "@/lib/auth";

interface Props {
  initialBranding: UserBranding;
}

const LETTERHEAD_STYLES: { value: UserBranding["letterheadStyle"]; label: string; desc: string }[] = [
  { value: "standard", label: "Standard",  desc: "Company name, address, and contacts" },
  { value: "minimal",  label: "Minimal",   desc: "Company name and tagline only" },
  { value: "none",     label: "None",      desc: "Clean document, no letterhead" },
];

export default function BrandingForm({ initialBranding }: Readonly<Props>) {
  const [b, setB]           = useState<UserBranding>(initialBranding);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved]   = useState(false);
  const [error, setError]   = useState("");

  function set<K extends keyof UserBranding>(key: K, value: UserBranding[K]) {
    setB((prev) => ({ ...prev, [key]: value }));
    setSaved(false);
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSaved(false);
    try {
      const res = await fetch("/api/user/branding", {
        method:  "PUT",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify(b),
      });
      if (!res.ok) {
        const data = await res.json() as { error?: string };
        setError(data.error ?? "Failed to save");
        return;
      }
      setSaved(true);
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  const today = new Date();
  const dateStr = `${today.getFullYear()}${String(today.getMonth() + 1).padStart(2, "0")}${String(today.getDate()).padStart(2, "0")}`;
  const previewRef = `${b.docIdPrefix || "ACME"}/NDA/ID/${dateStr}`;

  return (
    <form onSubmit={handleSave} className="space-y-8">

      {/* ── Letterhead ── */}
      <section>
        <SectionHeader
          label="Letterhead"
          desc="Appears at the top of every generated PDF document."
        />
        <div className="space-y-4">
          <Field label="Company name" required>
            <input
              value={b.companyName}
              onChange={(e) => set("companyName", e.target.value)}
              placeholder="PT Maju Bersama"
              className={inp}
            />
          </Field>
          <Field label="Tagline / division">
            <input
              value={b.companyTagline}
              onChange={(e) => set("companyTagline", e.target.value)}
              placeholder="Legal & Compliance Division"
              className={inp}
            />
          </Field>
          <Field label="Office address">
            <input
              value={b.companyAddress}
              onChange={(e) => set("companyAddress", e.target.value)}
              placeholder="Jl. Sudirman No. 1, Jakarta Pusat 10220"
              className={inp}
            />
          </Field>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Phone">
              <input
                value={b.companyPhone}
                onChange={(e) => set("companyPhone", e.target.value)}
                placeholder="+62 21 1234 5678"
                className={inp}
              />
            </Field>
            <Field label="Email">
              <input
                value={b.companyEmail}
                onChange={(e) => set("companyEmail", e.target.value)}
                placeholder="legal@company.com"
                className={inp}
              />
            </Field>
          </div>
        </div>
      </section>

      {/* ── Letterhead style ── */}
      <section>
        <SectionHeader label="Letterhead style" />
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {LETTERHEAD_STYLES.map(({ value, label, desc }) => (
            <button
              key={value}
              type="button"
              onClick={() => set("letterheadStyle", value)}
              className={`border p-3 text-left transition-colors ${
                b.letterheadStyle === value
                  ? "border-navy-900 bg-navy-50"
                  : "border-slate-200 hover:border-slate-400"
              }`}
            >
              <div className="text-sm font-semibold text-navy-900">{label}</div>
              <div className="text-xs text-slate-500 mt-0.5 leading-snug">{desc}</div>
            </button>
          ))}
        </div>
      </section>

      {/* ── Document Reference ── */}
      <section>
        <SectionHeader
          label="Document Reference"
          desc="Sets the prefix in the document reference number shown on the cover."
        />
        <Field label="Reference prefix">
          <input
            value={b.docIdPrefix}
            onChange={(e) => set("docIdPrefix", e.target.value.toUpperCase().replace(/[^A-Z0-9-]/g, ""))}
            placeholder="ACME"
            maxLength={10}
            className={inp}
          />
          <p className="text-xs text-slate-400 mt-1.5">
            Preview:{" "}
            <span className="font-mono text-navy-900 bg-slate-100 px-1.5 py-0.5">
              {previewRef}
            </span>
          </p>
        </Field>
      </section>

      {/* ── Footer ── */}
      <section>
        <SectionHeader
          label="Footer text"
          desc="Appears at the bottom of every page. Leave blank to use company name."
        />
        <Field label="Footer">
          <input
            value={b.footerText}
            onChange={(e) => set("footerText", e.target.value)}
            placeholder={`${b.companyName || "PT Maju Bersama"} · Confidential`}
            className={inp}
          />
        </Field>
      </section>

      {/* ── LexSEA Branding ── */}
      <section>
        <SectionHeader label="LexSEA branding" />
        <label className="flex items-start gap-3 cursor-pointer group">
          <input
            type="checkbox"
            checked={!b.showLexseaBrand}
            onChange={(e) => set("showLexseaBrand", !e.target.checked)}
            className="mt-0.5 accent-navy-900"
          />
          <div>
            <div className="text-sm font-medium text-navy-900 group-hover:text-navy-700">
              Remove LexSEA branding from documents
            </div>
            <div className="text-xs text-slate-500 mt-0.5 leading-relaxed">
              Hides &ldquo;LEXSEA&rdquo; from document headers and footers.
              Your company branding is shown instead.
            </div>
          </div>
        </label>
      </section>

      {/* ── Save ── */}
      <div className="flex items-center gap-4 pt-2 border-t border-slate-200">
        <button
          type="submit"
          disabled={saving}
          className="px-6 py-2.5 text-sm font-semibold text-white bg-navy-900 hover:bg-gold-500 hover:text-navy-900 transition-colors disabled:opacity-50"
        >
          {saving ? "Saving…" : "Save branding"}
        </button>
        {saved  && <span className="text-sm text-green-600 font-medium">Saved</span>}
        {error  && <span className="text-sm text-red-600">{error}</span>}
      </div>
    </form>
  );
}

// ── Internal helpers ──────────────────────────────────────────────────────────

const inp = "w-full border border-slate-300 px-3 py-2 text-sm text-navy-900 placeholder:text-slate-400 focus:outline-none focus:border-navy-900 bg-white transition-colors";

function SectionHeader({ label, desc }: { label: string; desc?: string }) {
  return (
    <div className="border-t border-slate-200 pt-5 mb-4">
      <div className="text-[11px] font-bold uppercase tracking-[0.2em] text-gold-600 mb-0.5">{label}</div>
      {desc && <p className="text-sm text-slate-500">{desc}</p>}
    </div>
  );
}

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-sm font-medium text-navy-900 mb-1.5">
        {label}
        {required && <span className="text-red-400 ml-0.5">*</span>}
      </label>
      {children}
    </div>
  );
}
