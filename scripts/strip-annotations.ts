import "dotenv/config";
import { Pool } from "pg";

const DRY_RUN = process.argv.includes("--apply") ? false : true;

const pool = new Pool({
  host: process.env.PGHOST, port: Number(process.env.PGPORT ?? 5432),
  user: process.env.PGUSER, password: process.env.PGPASSWORD,
  database: process.env.PGDATABASE ?? "lexsea", ssl: { rejectUnauthorized: false },
});

/** Remove [§] annotation lines and collapse the blank lines they leave behind. */
function stripAnnotations(content: string): string {
  const lines = content.split("\n");
  const kept = lines.filter((l) => !/^\s*\[§\]/.test(l));
  // collapse 3+ consecutive blank lines into max 1 (annotations sat between list items)
  return kept.join("\n").replace(/\n{3,}/g, "\n\n").trim() + "\n";
}

(async () => {
  const r = await pool.query<{ id: number; clause_key: string; content: string }>(
    "SELECT id, clause_key, content FROM clauses ORDER BY id"
  );

  let changed = 0;
  for (const row of r.rows) {
    if (!/\[§\]/.test(row.content)) continue;
    const cleaned = stripAnnotations(row.content);
    changed++;
    const removedLines = row.content.split("\n").filter((l) => /^\s*\[§\]/.test(l)).length;
    console.log(`\n### ${row.clause_key}  (removing ${removedLines} annotation line(s))`);
    if (DRY_RUN) {
      console.log("--- AFTER ---");
      console.log(cleaned);
    } else {
      await pool.query("UPDATE clauses SET content = $1 WHERE id = $2", [cleaned, row.id]);
    }
  }

  console.log(`\n${DRY_RUN ? "[DRY RUN]" : "[APPLIED]"} ${changed} clause(s) ${DRY_RUN ? "would be" : "were"} cleaned.`);
  await pool.end();
})();
