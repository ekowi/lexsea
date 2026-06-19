import type { ReactNode } from "react";
import { notFound } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import DisclaimerBanner from "@/components/DisclaimerBanner";
import GenerateClient from "@/components/GenerateClient";
import { getSession } from "@/lib/session";
import { type UserBranding } from "@/lib/auth";
import { query } from "@/lib/db";

// ── Document metadata ─────────────────────────────────────────────────────────

const DOC_ICONS: Record<string, ReactNode> = {
  nda: (
    <svg className="w-5 h-5 text-gold-600" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
    </svg>
  ),
  pkwt: (
    <svg className="w-5 h-5 text-gold-600" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
    </svg>
  ),
  "service-agreement": (
    <svg className="w-5 h-5 text-gold-600" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
    </svg>
  ),
};

const DOC_META: Record<string, { title: string; subtitle: string }> = {
  nda:                { title: "Non-Disclosure Agreement", subtitle: "Mutual NDA — Indonesia & Singapore" },
  pkwt:               { title: "Employment Agreement",     subtitle: "PKWT / Fixed-Term — Indonesia & Singapore" },
  "service-agreement":{ title: "Service Agreement",        subtitle: "Freelance / Agency — Indonesia & Singapore" },
};

// ── Branding fetch ────────────────────────────────────────────────────────────

async function fetchBranding(userId: string): Promise<UserBranding | null> {
  // Non-fatal: if branding can't be loaded (e.g. DB hiccup), the questionnaire
  // still renders — the document is simply generated without custom branding.
  try {
    const result = await query<UserBranding>(
      `SELECT
         company_name      AS "companyName",
         company_tagline   AS "companyTagline",
         company_address   AS "companyAddress",
         company_phone     AS "companyPhone",
         company_email     AS "companyEmail",
         footer_text       AS "footerText",
         doc_id_prefix     AS "docIdPrefix",
         show_lexsea_brand AS "showLexseaBrand",
         letterhead_style  AS "letterheadStyle"
       FROM user_branding WHERE user_id = $1`,
      [userId]
    );
    return result.rows[0] ?? null;
  } catch (err) {
    console.error("[generate] branding fetch failed (non-fatal):", err);
    return null;
  }
}

// ── Page ──────────────────────────────────────────────────────────────────────

export async function generateStaticParams() {
  return Object.keys(DOC_META).map((docType) => ({ docType }));
}

export async function generateMetadata({ params }: Readonly<{ params: Promise<{ docType: string }> }>) {
  const { docType } = await params;
  const meta = DOC_META[docType];
  if (!meta) return {};
  return {
    title:       `Generate ${meta.title} | LexSEA`,
    description: `Generate a ${meta.title} for Indonesia or Singapore in minutes.`,
  };
}

export default async function GeneratePage({ params }: Readonly<{ params: Promise<{ docType: string }> }>) {
  const { docType } = await params;
  const meta = DOC_META[docType];
  if (!meta) notFound();

  // Fetch branding for Pro users — null for free/unauthenticated
  const session = await getSession();
  const branding = session?.plan === "pro" ? await fetchBranding(session.id) : null;

  return (
    <>
      <Header />
      <DisclaimerBanner />
      <main className="flex-1 bg-parchment py-10 px-4 sm:px-6">
        <div className="max-w-3xl mx-auto">
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-1">
              <span className="shrink-0">{DOC_ICONS[docType]}</span>
              <h1 className="font-serif text-2xl font-bold text-navy-900">{meta.title}</h1>
            </div>
            <p className="text-slate-500 text-sm ml-8">{meta.subtitle}</p>
          </div>

          <GenerateClient docType={docType} branding={branding} />
        </div>
      </main>
      <Footer />
    </>
  );
}
