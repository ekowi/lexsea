import { Pool, QueryResult, QueryResultRow } from "pg";

const pool = new Pool({
  host:     process.env.PGHOST,
  port:     Number(process.env.PGPORT) || 5432,
  user:     process.env.PGUSER,
  password: process.env.PGPASSWORD,
  database: process.env.PGDATABASE || "lexsea",
  ssl:      { rejectUnauthorized: false },
  max:      10,
  idleTimeoutMillis:    30000,
  connectionTimeoutMillis: 5000,
});

export async function query<T extends QueryResultRow = QueryResultRow>(
  sql: string,
  args: unknown[] = []
): Promise<QueryResult<T>> {
  return pool.query<T>(sql, args);
}

export async function testConnection(): Promise<void> {
  const res = await query<{ now: string }>("SELECT NOW() AS now");
  console.log("Aurora connection OK:", res.rows[0].now);
}
