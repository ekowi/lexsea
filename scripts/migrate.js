const { Pool } = require("pg");
const fs   = require("node:fs");
const path = require("node:path");

const pool = new Pool({
  host:     process.env.PGHOST,
  port:     Number(process.env.PGPORT) || 5432,
  user:     process.env.PGUSER,
  password: process.env.PGPASSWORD,
  database: process.env.PGDATABASE || "lexsea",
  ssl:      { rejectUnauthorized: false },
});

const migrationsDir = path.join(__dirname, "..", "migrations");

(async () => {
  const files = fs.readdirSync(migrationsDir)
    .filter(f => f.endsWith(".sql") && !f.includes("seed"))
    .sort((a, b) => a.localeCompare(b));

  for (const file of files) {
    const sql = fs.readFileSync(path.join(migrationsDir, file), "utf8");
    console.log(`Running ${file}...`);
    await pool.query(sql);
    console.log(`✅ ${file} done`);
  }

  await pool.end();
  console.log("Migration complete.");
})().catch(err => {
  console.error("❌ Migration failed:", err.message);
  process.exit(1);
});
