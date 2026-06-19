import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";
import { jsonError, routeError } from "@/lib/api";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ docType: string }> }
) {
  const { docType } = await params;
  const jurisdiction = req.nextUrl.searchParams.get("jurisdiction");

  if (!jurisdiction) {
    return jsonError("Missing required query param: jurisdiction (ID or SG).", 400);
  }

  try {
    const result = await query<{
      field_key: string;
      question_text: string;
      field_type: string;
      options: unknown;
      sort_order: number;
      is_required: boolean;
    }>(
      `SELECT qf.field_key, qf.question_text, qf.field_type, qf.options, qf.sort_order, qf.is_required
       FROM questionnaire_fields qf
       JOIN document_types dt ON dt.id = qf.document_type_id
       JOIN jurisdictions   j  ON j.id  = qf.jurisdiction_id
       WHERE dt.slug = $1
         AND j.code  = $2
       ORDER BY qf.sort_order`,
      [docType, jurisdiction.toUpperCase()]
    );

    if (result.rows.length === 0) {
      return jsonError(
        `No questionnaire found for "${docType}" in ${jurisdiction.toUpperCase()}.`,
        404
      );
    }

    return NextResponse.json({ fields: result.rows });
  } catch (err) {
    return routeError(err, "questionnaire");
  }
}
