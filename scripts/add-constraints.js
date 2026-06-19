const { Pool } = require("pg");

const pool = new Pool({
  host:     process.env.PGHOST,
  port:     Number(process.env.PGPORT) || 5432,
  user:     process.env.PGUSER,
  password: process.env.PGPASSWORD,
  database: process.env.PGDATABASE || "lexsea",
  ssl:      { rejectUnauthorized: false },
});

const constraints = [
  {
    name: "uq_clause_doctype_jur_key",
    table: "clauses",
    sql: "ALTER TABLE clauses ADD CONSTRAINT uq_clause_doctype_jur_key UNIQUE (document_type_id, jurisdiction_id, clause_key)",
  },
  {
    name: "uq_qfield_doctype_jur_key",
    table: "questionnaire_fields",
    sql: "ALTER TABLE questionnaire_fields ADD CONSTRAINT uq_qfield_doctype_jur_key UNIQUE (document_type_id, jurisdiction_id, field_key)",
  },
  {
    name: "uq_condition_clause_key_val",
    table: "clause_conditions",
    sql: "ALTER TABLE clause_conditions ADD CONSTRAINT uq_condition_clause_key_val UNIQUE (clause_id, condition_key, condition_value)",
  },
];

(async () => {
  const client = await pool.connect();
  try {
    for (const c of constraints) {
      // Check if constraint already exists
      const exists = await client.query(
        `SELECT 1 FROM pg_constraint WHERE conname = $1`, [c.name]
      );
      if (exists.rowCount > 0) {
        console.log(`⏭  ${c.name} already exists — skipped`);
        continue;
      }
      await client.query(c.sql);
      console.log(`✅ Added constraint: ${c.name}`);
    }

    // Final counts
    const verify = await client.query(`
      SELECT
        (SELECT COUNT(*) FROM clauses) AS clauses,
        (SELECT COUNT(*) FROM questionnaire_fields) AS qfields,
        (SELECT COUNT(*) FROM clause_conditions) AS conditions
    `);
    const r = verify.rows[0];
    console.log(`\nCurrent counts — clauses: ${r.clauses}  fields: ${r.qfields}  conditions: ${r.conditions}`);
  } finally {
    client.release();
    await pool.end();
  }
})().catch(err => {
  console.error("❌", err.message);
  process.exit(1);
});
