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

    // 1. Deduplicate clause_conditions (keep min id per unique combo)
    const condResult = await client.query(`
      DELETE FROM clause_conditions
      WHERE id NOT IN (
        SELECT MIN(id)
        FROM clause_conditions
        GROUP BY clause_id, condition_key, condition_value
      )
    `);
    console.log(`Removed ${condResult.rowCount} duplicate clause_conditions`);

    // 2. Deduplicate questionnaire_fields (keep min id per unique combo)
    const fieldResult = await client.query(`
      DELETE FROM questionnaire_fields
      WHERE id NOT IN (
        SELECT MIN(id)
        FROM questionnaire_fields
        GROUP BY document_type_id, jurisdiction_id, field_key
      )
    `);
    console.log(`Removed ${fieldResult.rowCount} duplicate questionnaire_fields`);

    // 3. Deduplicate clauses — must remove clause_conditions that ref deleted clauses first
    //    (already done above, but conditions ref specific clause IDs which we keep)
    const clauseResult = await client.query(`
      DELETE FROM clauses
      WHERE id NOT IN (
        SELECT MIN(id)
        FROM clauses
        GROUP BY document_type_id, jurisdiction_id, clause_key
      )
    `);
    console.log(`Removed ${clauseResult.rowCount} duplicate clauses`);

    // 4. Add unique constraints to prevent future duplicates
    await client.query(`
      ALTER TABLE clauses
        ADD CONSTRAINT IF NOT EXISTS uq_clause_doctype_jur_key
        UNIQUE (document_type_id, jurisdiction_id, clause_key)
    `);

    await client.query(`
      ALTER TABLE questionnaire_fields
        ADD CONSTRAINT IF NOT EXISTS uq_qfield_doctype_jur_key
        UNIQUE (document_type_id, jurisdiction_id, field_key)
    `);

    await client.query(`
      ALTER TABLE clause_conditions
        ADD CONSTRAINT IF NOT EXISTS uq_condition_clause_key_val
        UNIQUE (clause_id, condition_key, condition_value)
    `);

    await client.query("COMMIT");
    console.log("✅ Deduplication complete + unique constraints added");

    // Verify
    const verify = await client.query(`
      SELECT
        (SELECT COUNT(*) FROM clauses) AS clauses,
        (SELECT COUNT(*) FROM questionnaire_fields) AS qfields,
        (SELECT COUNT(*) FROM clause_conditions) AS conditions
    `);
    const r = verify.rows[0];
    console.log(`   clauses=${r.clauses}  questionnaire_fields=${r.qfields}  conditions=${r.conditions}`);

  } catch (err) {
    await client.query("ROLLBACK");
    console.error("❌ Failed:", err.message);
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
})();
