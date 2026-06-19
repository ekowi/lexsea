const { Pool } = require("pg");

const pool = new Pool({
  host:     process.env.PGHOST,
  port:     Number(process.env.PGPORT) || 5432,
  user:     process.env.PGUSER,
  password: process.env.PGPASSWORD,
  database: process.env.PGDATABASE || "lexsea",
  ssl:      { rejectUnauthorized: false },
});

(async () => {
  const c = await pool.query(
    `SELECT dt.slug, j.code, COUNT(*) AS clauses
     FROM clauses cl
     JOIN document_types dt ON dt.id = cl.document_type_id
     JOIN jurisdictions   j  ON j.id  = cl.jurisdiction_id
     GROUP BY dt.slug, j.code ORDER BY dt.slug, j.code`
  );
  const q = await pool.query(
    `SELECT dt.slug, j.code, COUNT(*) AS fields
     FROM questionnaire_fields qf
     JOIN document_types dt ON dt.id = qf.document_type_id
     JOIN jurisdictions   j  ON j.id  = qf.jurisdiction_id
     GROUP BY dt.slug, j.code ORDER BY dt.slug, j.code`
  );

  console.log("CLAUSES:");
  c.rows.forEach((r) => console.log(`  ${r.slug}/${r.code}: ${r.clauses} clauses`));
  console.log("\nQUESTIONNAIRE FIELDS:");
  q.rows.forEach((r) => console.log(`  ${r.slug}/${r.code}: ${r.fields} fields`));

  await pool.end();
})().catch((err) => {
  console.error("Error:", err.message);
  process.exit(1);
});
