/**
 * Adds three optional "context" questionnaire fields to every document type +
 * jurisdiction: agreement_context, party_a_type, party_b_type.
 *
 * These feed the (optional) AI-generated background recital and give the
 * questionnaire room to capture *what* each party is and *why* the agreement
 * exists — without blocking the existing required-field flow (all optional).
 *
 * Idempotent: deletes any existing rows with these keys first, then re-inserts.
 * Usage: npx tsx scripts/add-context-fields.ts
 */
import "dotenv/config";
import { Pool } from "pg";

const pool = new Pool({
  host: process.env.PGHOST, port: Number(process.env.PGPORT ?? 5432),
  user: process.env.PGUSER, password: process.env.PGPASSWORD,
  database: process.env.PGDATABASE ?? "lexsea", ssl: { rejectUnauthorized: false },
});

interface FieldDef {
  key: string;
  question: string;
  sort: number;
}

// Per doc-type + jurisdiction question wording. party_a/party_b map to the
// real party roles of each document (NDA: parties, PKWT: employer/employee,
// SA: client/provider).
const FIELDS: Record<string, Record<"ID" | "SG", FieldDef[]>> = {
  nda: {
    ID: [
      { key: "agreement_context", question: "Konteks / latar belakang kerja sama (mis. penjajakan kerja sama kampanye iklan Q1 2026)", sort: 1 },
      { key: "party_a_type",      question: "Pihak A bergerak di bidang apa? (mis. perusahaan penyedia jasa periklanan)", sort: 2 },
      { key: "party_b_type",      question: "Pihak B bergerak di bidang apa? (mis. agensi kreatif / freelancer)", sort: 3 },
    ],
    SG: [
      { key: "agreement_context", question: "Context / background of the discussion (e.g. exploring a Q1 2026 ad campaign partnership)", sort: 1 },
      { key: "party_a_type",      question: "What does Party A do? (e.g. advertising services company)", sort: 2 },
      { key: "party_b_type",      question: "What does Party B do? (e.g. creative agency / freelancer)", sort: 3 },
    ],
  },
  pkwt: {
    ID: [
      { key: "agreement_context", question: "Konteks / latar belakang perekrutan (mis. penambahan tim desain untuk proyek 6 bulan)", sort: 1 },
      { key: "party_a_type",      question: "Bidang usaha Perusahaan (mis. agensi periklanan digital)", sort: 2 },
      { key: "party_b_type",      question: "Latar belakang / keahlian Karyawan (mis. desainer grafis berpengalaman 3 tahun)", sort: 3 },
    ],
    SG: [
      { key: "agreement_context", question: "Context / background of the hire (e.g. adding design capacity for a 6-month project)", sort: 1 },
      { key: "party_a_type",      question: "Employer's line of business (e.g. digital advertising agency)", sort: 2 },
      { key: "party_b_type",      question: "Employee's background / expertise (e.g. graphic designer, 3 years' experience)", sort: 3 },
    ],
  },
  "service-agreement": {
    ID: [
      { key: "agreement_context", question: "Konteks / latar belakang penugasan (mis. pembuatan materi iklan untuk peluncuran produk)", sort: 1 },
      { key: "party_a_type",      question: "Klien bergerak di bidang apa? (mis. perusahaan FMCG)", sort: 2 },
      { key: "party_b_type",      question: "Penyedia Jasa bergerak di bidang apa? (mis. freelancer desain grafis)", sort: 3 },
    ],
    SG: [
      { key: "agreement_context", question: "Context / background of the engagement (e.g. producing ad creative for a product launch)", sort: 1 },
      { key: "party_a_type",      question: "What does the Client do? (e.g. FMCG company)", sort: 2 },
      { key: "party_b_type",      question: "What does the Service Provider do? (e.g. freelance graphic designer)", sort: 3 },
    ],
  },
};

async function run() {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    let inserted = 0;

    for (const [slug, byJur] of Object.entries(FIELDS)) {
      for (const [code, defs] of Object.entries(byJur) as ["ID" | "SG", FieldDef[]][]) {
        const ids = await client.query<{ doc_id: number; jur_id: number }>(
          `SELECT dt.id AS doc_id, j.id AS jur_id
           FROM document_types dt, jurisdictions j
           WHERE dt.slug = $1 AND j.code = $2`,
          [slug, code]
        );
        if (ids.rows.length === 0) { console.warn(`!! missing ${slug}/${code}`); continue; }
        const { doc_id, jur_id } = ids.rows[0];

        for (const f of defs) {
          // idempotent: remove any prior copy of this field
          await client.query(
            `DELETE FROM questionnaire_fields
             WHERE document_type_id = $1 AND jurisdiction_id = $2 AND field_key = $3`,
            [doc_id, jur_id, f.key]
          );
          await client.query(
            `INSERT INTO questionnaire_fields
               (document_type_id, jurisdiction_id, field_key, question_text, field_type, options, sort_order, is_required)
             VALUES ($1, $2, $3, $4, 'text', NULL, $5, false)`,
            [doc_id, jur_id, f.key, f.question, f.sort]
          );
          inserted++;
        }
      }
    }

    await client.query("COMMIT");
    console.log(`✅  ${inserted} context fields inserted (3 per doc/jurisdiction).`);
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("❌  Failed:", err);
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
}

run();
