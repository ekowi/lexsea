import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { query } from "@/lib/db";
import { signToken, SESSION_COOKIE, type SessionUser } from "@/lib/auth";
import { readJson, jsonError, routeError } from "@/lib/api";

interface UserRow extends SessionUser {
  password_hash: string;
}

export async function POST(req: NextRequest) {
  const body = await readJson<{ email: string; password: string }>(req);
  if (!body) return jsonError("Invalid request body — expected JSON.", 400);

  const { email, password } = body;
  if (!email?.trim() || !password) {
    return jsonError("Email and password are required.", 400);
  }

  try {
    const result = await query<UserRow>(
      "SELECT id, email, name, plan, password_hash FROM users WHERE email = $1",
      [email.toLowerCase().trim()]
    );

    const user = result.rows[0];
    // Use constant-time compare even when user not found to prevent timing attacks
    const dummyHash = "$2b$12$invalidhashfortimingnnnnnnnnnnnnnnnnnnnnnnnnnnn";
    const valid = user
      ? await bcrypt.compare(password, user.password_hash)
      : await bcrypt.compare(password, dummyHash).then(() => false);

    if (!user || !valid) {
      return jsonError("Invalid email or password.", 401);
    }

    const sessionUser: SessionUser = {
      id: user.id, email: user.email, name: user.name, plan: user.plan,
    };
    const token = await signToken(sessionUser);

    const res = NextResponse.json({ user: sessionUser });
    res.cookies.set({ ...SESSION_COOKIE, value: token, secure: process.env.NODE_ENV === "production" });
    return res;
  } catch (err) {
    return routeError(err, "auth/login");
  }
}
