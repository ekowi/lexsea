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

const seedFiles = [
  "002_seed.sql",
  "003_seed_pkwt.sql",
  "004_seed_service_agreement.sql",
];

(async () => {
  for (const file of seedFiles) {
    const seedPath = path.join(__dirname, "..", "migrations", file);
    const sql = fs.readFileSync(seedPath, "utf8");
    console.log(`Running ${file}...`);
    await pool.query(sql);
    console.log(`✅ ${file} done`);
  }
  await pool.end();
})().catch(err => {
  console.error("❌ Seed failed:", err.message);
  process.exit(1);
});
