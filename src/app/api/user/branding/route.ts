import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { query } from "@/lib/db";
import type { UserBranding } from "@/lib/auth";
import { readJson, jsonError, routeError } from "@/lib/api";

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

const SELECT_BRANDING = `
  SELECT
    company_name      AS "companyName",
    company_tagline   AS "companyTagline",
    company_address   AS "companyAddress",
    company_phone     AS "companyPhone",
    company_email     AS "companyEmail",
    footer_text       AS "footerText",
    doc_id_prefix     AS "docIdPrefix",
    show_lexsea_brand AS "showLexseaBrand",
    letterhead_style  AS "letterheadStyle"
  FROM user_branding WHERE user_id = $1
`;

export async function GET() {
  const session = await getSession();
  if (!session) return jsonError("Unauthorized", 401);
  if (session.plan !== "pro") return jsonError("Pro plan required.", 403);

  try {
    const result = await query<UserBranding>(SELECT_BRANDING, [session.id]);
    return NextResponse.json(result.rows[0] ?? EMPTY_BRANDING);
  } catch (err) {
    return routeError(err, "user/branding");
  }
}

export async function PUT(req: NextRequest) {
  const session = await getSession();
  if (!session) return jsonError("Unauthorized", 401);
  if (session.plan !== "pro") return jsonError("Pro plan required.", 403);

  const body = await readJson<Partial<UserBranding>>(req);
  if (!body) return jsonError("Invalid request body — expected JSON.", 400);

  try {
    await query(
    `INSERT INTO user_branding
       (user_id, company_name, company_tagline, company_address, company_phone,
        company_email, footer_text, doc_id_prefix, show_lexsea_brand, letterhead_style)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
     ON CONFLICT (user_id) DO UPDATE SET
       company_name      = EXCLUDED.company_name,
       company_tagline   = EXCLUDED.company_tagline,
       company_address   = EXCLUDED.company_address,
       company_phone     = EXCLUDED.company_phone,
       company_email     = EXCLUDED.company_email,
       footer_text       = EXCLUDED.footer_text,
       doc_id_prefix     = EXCLUDED.doc_id_prefix,
       show_lexsea_brand = EXCLUDED.show_lexsea_brand,
       letterhead_style  = EXCLUDED.letterhead_style,
       updated_at        = NOW()`,
    [
      session.id,
      body.companyName     ?? "",
      body.companyTagline  ?? "",
      body.companyAddress  ?? "",
      body.companyPhone    ?? "",
      body.companyEmail    ?? "",
      body.footerText      ?? "",
      body.docIdPrefix     ?? "",
      body.showLexseaBrand ?? false,
      body.letterheadStyle ?? "standard",
    ]
    );

    return NextResponse.json({ ok: true });
  } catch (err) {
    return routeError(err, "user/branding");
  }
}
