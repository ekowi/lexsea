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
  try {
    const res = await pool.query("SELECT NOW() AS now, version() AS version");
    console.log("✅ Aurora connection OK");
    console.log("   Time:   ", res.rows[0].now);
    console.log("   Engine: ", res.rows[0].version.split(" ").slice(0, 2).join(" "));
  } catch (err) {
    console.error("❌ Connection failed:", err.message);
    process.exit(1);
  } finally {
    await pool.end();
  }
})();
