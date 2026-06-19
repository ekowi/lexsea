import { NextRequest, NextResponse } from "next/server";
import { selectClauses, Answers } from "@/lib/assembler";
import { readJson, jsonError, routeError } from "@/lib/api";

interface SelectBody {
  docType:      string;
  jurisdiction: string;
  answers:      Answers;
}

export async function POST(req: NextRequest) {
  const body = await readJson<SelectBody>(req);
  if (!body) return jsonError("Invalid request body — expected JSON.", 400);

  const { docType, jurisdiction, answers } = body;
  if (!docType || !jurisdiction || !answers || typeof answers !== "object") {
    return jsonError("Body must include: docType, jurisdiction, answers.", 400);
  }

  try {
    const clauses = await selectClauses(docType, jurisdiction.toUpperCase(), answers);
    if (clauses.length === 0) {
      return jsonError(
        `No clauses found for "${docType}" in ${jurisdiction.toUpperCase()}.`,
        404
      );
    }
    return NextResponse.json({ clauses });
  } catch (err) {
    return routeError(err, "clauses/select");
  }
}
