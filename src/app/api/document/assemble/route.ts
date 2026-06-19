import { NextRequest, NextResponse } from "next/server";
import { selectClauses, assembleDocument, Answers, type Clause } from "@/lib/assembler";
import { query } from "@/lib/db";
import { generateRecital } from "@/lib/recital";
import { readJson, jsonError, routeError } from "@/lib/api";

// Party A / Party B answer keys per document (for the recital context)
const PARTY_KEYS: Record<string, { aName: string; bName: string }> = {
  nda:                 { aName: "party_a_name",  bName: "party_b_name" },
  pkwt:                { aName: "employer_name", bName: "employee_name" },
  "service-agreement": { aName: "client_name",   bName: "provider_name" },
};

interface AssembleBody {
  docType:      string;
  jurisdiction: string;
  answers:      Answers;
  sessionId?:   string;
}

/** Best-effort audit log — never fail the request if logging fails. */
async function logGeneration(docType: string, jur: string, answers: Answers, sessionId?: string) {
  try {
    await query(
      `INSERT INTO generated_documents (document_type_id, jurisdiction_id, answers, session_id)
       SELECT dt.id, j.id, $3::jsonb, $4
       FROM document_types dt, jurisdictions j
       WHERE dt.slug = $1 AND j.code = $2`,
      [docType, jur, JSON.stringify(answers), sessionId ?? null]
    );
  } catch (err) {
    console.error("[assemble] audit log failed (non-fatal):", err);
  }
}

export async function POST(req: NextRequest) {
  const body = await readJson<AssembleBody>(req);
  if (!body) return jsonError("Invalid request body — expected JSON.", 400);

  const { docType, jurisdiction, answers, sessionId } = body;
  if (!docType || !jurisdiction || !answers || typeof answers !== "object") {
    return jsonError("Body must include: docType, jurisdiction, answers.", 400);
  }

  // Guard against generating a document from an empty questionnaire
  const hasAnswers = Object.values(answers).some((v) => String(v ?? "").trim() !== "");
  if (!hasAnswers) {
    return jsonError("Please answer the questionnaire before generating a document.", 400);
  }

  const jur = jurisdiction.toUpperCase();

  try {
    const clauses = await selectClauses(docType, jur, answers);
    if (clauses.length === 0) {
      return jsonError(`No clauses found for "${docType}" in ${jur}.`, 404);
    }

    // Optional AI background recital (non-binding). generateRecital is internally
    // fail-safe (returns null on any error), so the document always assembles.
    const keys = PARTY_KEYS[docType];
    const recital = await generateRecital({
      docType,
      jurisdiction: jur,
      context:      String(answers.agreement_context ?? ""),
      partyAName:   keys ? String(answers[keys.aName] ?? "") : "",
      partyAType:   String(answers.party_a_type ?? ""),
      partyBName:   keys ? String(answers[keys.bName] ?? "") : "",
      partyBType:   String(answers.party_b_type ?? ""),
    });

    const finalClauses: Clause[] = [...clauses];
    if (recital) {
      const heading = jur === "ID" ? "LATAR BELAKANG" : "RECITALS";
      finalClauses.splice(1, 0, {
        clause_key:  "ai_recital",
        content:     `${heading}\n\n${recital}`,
        article_ref: null,
        sort_order:  clauses[0].sort_order + 1,
      });
    }

    const text = assembleDocument(finalClauses, answers);

    await logGeneration(docType, jur, answers, sessionId);

    return NextResponse.json({
      document:    text,
      clauseCount: clauses.length,
      meta: { docType, jurisdiction: jur, generatedAt: new Date().toISOString() },
    });
  } catch (err) {
    return routeError(err, "assemble");
  }
}
