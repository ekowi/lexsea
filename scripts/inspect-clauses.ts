import "dotenv/config";
import { Pool } from "pg";
const pool = new Pool({
  host: process.env.PGHOST, port: Number(process.env.PGPORT ?? 5432),
  user: process.env.PGUSER, password: process.env.PGPASSWORD,
  database: process.env.PGDATABASE ?? "lexsea", ssl: { rejectUnauthorized: false },
});
(async () => {
  const r = await pool.query(`
    SELECT dt.slug, j.code, c.clause_key, c.article_ref, c.sort_order, c.content
    FROM clauses c
    JOIN document_types dt ON dt.id = c.document_type_id
    JOIN jurisdictions j ON j.id = c.jurisdiction_id
    ORDER BY dt.slug, j.code, c.sort_order
  `);
  console.log("TOTAL CLAUSES:", r.rows.length);
  for (const row of r.rows) {
    console.log("\n========================================");
    console.log(`[${row.slug} / ${row.code}] ${row.clause_key}  (sort=${row.sort_order}, ref=${row.article_ref ?? "-"})`);
    console.log("----------------------------------------");
    console.log(row.content);
  }
  await pool.end();
})();
