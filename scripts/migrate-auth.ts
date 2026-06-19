/**
 * Run once: creates users + user_branding tables for the auth/RBAC system.
 * Usage: npx tsx scripts/migrate-auth.ts
 */
import "dotenv/config";
import { Pool } from "pg";

const pool = new Pool({
  host:     process.env.PGHOST,
  port:     Number(process.env.PGPORT ?? 5432),
  user:     process.env.PGUSER,
  password: process.env.PGPASSWORD,
  database: process.env.PGDATABASE ?? "lexsea",
  ssl:      { rejectUnauthorized: false },
});

async function migrate() {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id            UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
        email         TEXT         UNIQUE NOT NULL,
        name          TEXT         NOT NULL,
        password_hash TEXT         NOT NULL,
        plan          TEXT         NOT NULL DEFAULT 'free'
                      CHECK (plan IN ('free', 'pro')),
        created_at    TIMESTAMPTZ  DEFAULT NOW(),
        updated_at    TIMESTAMPTZ  DEFAULT NOW()
      )
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS user_branding (
        user_id           UUID    PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
        company_name      TEXT    NOT NULL DEFAULT '',
        company_tagline   TEXT    NOT NULL DEFAULT '',
        company_address   TEXT    NOT NULL DEFAULT '',
        company_phone     TEXT    NOT NULL DEFAULT '',
        company_email     TEXT    NOT NULL DEFAULT '',
        footer_text       TEXT    NOT NULL DEFAULT '',
        doc_id_prefix     TEXT    NOT NULL DEFAULT '',
        show_lexsea_brand BOOLEAN NOT NULL DEFAULT false,
        letterhead_style  TEXT    NOT NULL DEFAULT 'standard'
                          CHECK (letterhead_style IN ('standard', 'minimal', 'none')),
        updated_at        TIMESTAMPTZ DEFAULT NOW()
      )
    `);

    await client.query("COMMIT");
    console.log("✅  users + user_branding tables created");
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("❌  Migration failed:", err);
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
}

migrate();
