import { query } from "./db";

export interface Answers {
  [key: string]: string | boolean;
}

export interface Clause {
  clause_key: string;
  content:    string;
  article_ref: string | null;
  sort_order:  number;
}

/**
 * Selects all applicable clauses for a given document type + jurisdiction
 * based on user answers.
 *
 * Strategy:
 * 1. Always include clauses with is_required = true that have NO conditions.
 * 2. Include conditional clauses where ALL conditions match the user's answers.
 */
export async function selectClauses(
  documentTypeSlug: string,
  jurisdictionCode: string,
  answers: Answers
): Promise<Clause[]> {
  // Required clauses (unconditional)
  const requiredRes = await query<Clause>(
    `SELECT c.clause_key, c.content, c.article_ref, c.sort_order
     FROM clauses c
     JOIN document_types dt ON dt.id = c.document_type_id
     JOIN jurisdictions  j  ON j.id  = c.jurisdiction_id
     WHERE dt.slug = $1
       AND j.code  = $2
       AND c.is_required = true
       AND NOT EXISTS (
         SELECT 1 FROM clause_conditions cc WHERE cc.clause_id = c.id
       )
     ORDER BY c.sort_order`,
    [documentTypeSlug, jurisdictionCode]
  );

  // Conditional clauses — fetch all candidates then filter in JS
  const conditionalRes = await query<Clause & { clause_id: number; condition_key: string; condition_value: string }>(
    `SELECT c.id AS clause_id, c.clause_key, c.content, c.article_ref, c.sort_order,
            cc.condition_key, cc.condition_value
     FROM clauses c
     JOIN document_types dt ON dt.id = c.document_type_id
     JOIN jurisdictions  j  ON j.id  = c.jurisdiction_id
     JOIN clause_conditions cc ON cc.clause_id = c.id
     WHERE dt.slug = $1
       AND j.code  = $2
     ORDER BY c.sort_order`,
    [documentTypeSlug, jurisdictionCode]
  );

  // Group conditions by clause_id
  const clauseMap = new Map<number, { clause: Clause; conditions: { key: string; value: string }[] }>();
  for (const row of conditionalRes.rows) {
    if (!clauseMap.has(row.clause_id)) {
      clauseMap.set(row.clause_id, {
        clause: { clause_key: row.clause_key, content: row.content, article_ref: row.article_ref, sort_order: row.sort_order },
        conditions: [],
      });
    }
    clauseMap.get(row.clause_id)!.conditions.push({ key: row.condition_key, value: row.condition_value });
  }

  const matched: Clause[] = [];
  for (const { clause, conditions } of clauseMap.values()) {
    const allMatch = conditions.every(
      (c) => String(answers[c.key]) === c.value
    );
    if (allMatch) matched.push(clause);
  }

  const allClauses = [...requiredRes.rows, ...matched];
  allClauses.sort((a, b) => a.sort_order - b.sort_order);
  return allClauses;
}

/**
 * Replaces {{placeholder}} tokens in clause content with answer values.
 */
export function interpolate(content: string, answers: Answers): string {
  return content.replace(/\{\{(\w+)\}\}/g, (_, key) =>
    answers[key] === undefined ? `[${key}]` : String(answers[key])
  );
}

/** Removes any leftover [§] advisory-annotation lines — these are internal
 *  guidance notes and must never appear in an executed legal document. */
function stripAnnotations(content: string): string {
  return content
    .split("\n")
    .filter((l) => !/^\s*\[§\]/.test(l))
    .join("\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

export function assembleDocument(clauses: Clause[], answers: Answers): string {
  return clauses
    .map((c) => stripAnnotations(interpolate(c.content, answers)))
    .join("\n\n");
}
