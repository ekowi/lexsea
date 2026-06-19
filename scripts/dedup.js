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
  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    const a = await client.query(`
      DELETE FROM clause_conditions WHERE id NOT IN (
        SELECT MIN(id) FROM clause_conditions GROUP BY clause_id, condition_key, condition_value
      )`);

    const b = await client.query(`
      DELETE FROM questionnaire_fields WHERE id NOT IN (
        SELECT MIN(id) FROM questionnaire_fields GROUP BY document_type_id, jurisdiction_id, field_key
      )`);

    const c = await client.query(`
      DELETE FROM clauses WHERE id NOT IN (
        SELECT MIN(id) FROM clauses GROUP BY document_type_id, jurisdiction_id, clause_key
      )`);

    await client.query("COMMIT");
    console.log(`✅ Dedup done — removed: conditions=${a.rowCount} fields=${b.rowCount} clauses=${c.rowCount}`);

    const v = await client.query(`
      SELECT (SELECT COUNT(*) FROM clauses) AS clauses,
             (SELECT COUNT(*) FROM questionnaire_fields) AS qfields,
             (SELECT COUNT(*) FROM clause_conditions) AS conditions`);
    const r = v.rows[0];
    console.log(`   Now: clauses=${r.clauses}  fields=${r.qfields}  conditions=${r.conditions}`);
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("❌", err.message);
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
})();
