import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/** Standard JSON error response. */
export function jsonError(message: string, status: number) {
  return NextResponse.json({ error: message }, { status });
}

/** Safely parse a JSON request body. Returns null on malformed/empty body. */
export async function readJson<T>(req: NextRequest): Promise<T | null> {
  try {
    return (await req.json()) as T;
  } catch {
    return null;
  }
}

/** Detects PostgreSQL connection / availability failures (vs. logic errors). */
export function isDbUnavailable(err: unknown): boolean {
  const e = err as { code?: string; message?: string };
  const code = e?.code ?? "";
  const msg = (e?.message ?? "").toLowerCase();
  const connCodes = [
    "ECONNREFUSED", "ETIMEDOUT", "ENOTFOUND", "EHOSTUNREACH", "ECONNRESET",
    "57P01", "57P03", "08006", "08001", "08003", "08004", "53300",
  ];
  return (
    connCodes.includes(code) ||
    msg.includes("connection terminated") ||
    msg.includes("connection timeout") ||
    msg.includes("timeout exceeded") ||
    msg.includes("too many clients")
  );
}

/**
 * Maps an unexpected route error to a friendly response:
 *  - DB unavailable / timeout → 503 (transient, "try again")
 *  - anything else            → 500
 * Always logs the underlying error server-side for debugging.
 */
export function routeError(err: unknown, context = "api") {
  console.error(`[${context}]`, err);
  if (isDbUnavailable(err)) {
    return jsonError(
      "The service is temporarily unavailable. Please try again in a moment.",
      503
    );
  }
  return jsonError(
    "Something went wrong while processing your request. Please try again.",
    500
  );
}
