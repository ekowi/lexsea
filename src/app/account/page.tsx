import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import { query } from "@/lib/db";
import type { UserBranding } from "@/lib/auth";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BrandingForm from "@/components/BrandingForm";
import UpgradeBanner from "@/components/UpgradeBanner";

export const metadata = {
  title: "Account | LexSEA",
};

const EMPTY_BRANDING: UserBranding = {
  companyName:     "",
  companyTagline:  "",
  companyAddress:  "",
  companyPhone:    "",
  companyEmail:    "",
  footerText:      "",
  docIdPrefix:     "",
  showLexseaBrand: false,
  letterheadStyle: "standard",
};

export default async function AccountPage() {
  const session = await getSession();
  if (!session) redirect("/auth/login?from=/account");

  let branding: UserBranding | null = null;
  if (session.plan === "pro") {
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
        [session.id]
      );
      branding = result.rows[0] ?? EMPTY_BRANDING;
    } catch (err) {
      console.error("[account] branding fetch failed (non-fatal):", err);
      branding = EMPTY_BRANDING;
    }
  }

  return (
    <>
      <Header />
      <main className="flex-1 bg-parchment py-10 px-4 sm:px-6">
        <div className="max-w-2xl mx-auto">

          {/* Profile header */}
          <div className="mb-8">
            <div className="text-[11px] font-bold uppercase tracking-[0.2em] text-gold-600 mb-2">
              Account
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center justify-center w-12 h-12 bg-navy-900 text-white text-lg font-bold select-none">
                {session.name.trim()[0]?.toUpperCase()}
              </div>
              <div>
                <h1 className="font-serif text-2xl font-bold text-navy-900">{session.name}</h1>
                <p className="text-slate-500 text-sm">{session.email}</p>
              </div>
            </div>
            <div className="mt-4 flex items-center gap-3">
              <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 ${
                session.plan === "pro"
                  ? "bg-gold-500 text-navy-900"
                  : "bg-slate-200 text-slate-600"
              }`}>
                {session.plan === "pro" ? "Pro Plan" : "Free Plan"}
              </span>
              {session.plan === "free" && (
                <span className="text-xs text-slate-400">
                  Upgrade to add custom branding to your documents
                </span>
              )}
            </div>
          </div>

          {/* Plan content */}
          {session.plan === "free" && <UpgradeBanner />}
          {session.plan === "pro" && branding && (
            <BrandingForm initialBranding={branding} />
          )}

        </div>
      </main>
      <Footer />
    </>
  );
}
