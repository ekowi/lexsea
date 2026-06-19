import { NextRequest, NextResponse } from "next/server";
import { verifyToken, signToken, SESSION_COOKIE } from "@/lib/auth";
import { query } from "@/lib/db";
import { cookies } from "next/headers";
import { readJson, jsonError, routeError } from "@/lib/api";

const PROMO_CODE = "HACKPRO2026";

export async function POST(req: NextRequest) {
  const store = await cookies();
  const token = store.get("ls_session")?.value;
  if (!token) return jsonError("Unauthorized", 401);

  const session = await verifyToken(token);
  if (!session) return jsonError("Unauthorized", 401);

  if (session.plan === "pro") {
    return jsonError("You are already on the Pro plan.", 400);
  }

  const body = await readJson<{ code: string }>(req);
  if (body?.code?.trim().toUpperCase() !== PROMO_CODE) {
    return jsonError("Invalid promotion code.", 400);
  }

  try {
    await query("UPDATE users SET plan = 'pro', updated_at = NOW() WHERE id = $1", [session.id]);

    const upgraded = { ...session, plan: "pro" as const };
    const newToken = await signToken(upgraded);

    const res = NextResponse.json({ user: upgraded });
    res.cookies.set({ ...SESSION_COOKIE, value: newToken, secure: process.env.NODE_ENV === "production" });
    return res;
  } catch (err) {
    return routeError(err, "user/upgrade");
  }
}
