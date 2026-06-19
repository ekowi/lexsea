import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { query } from "@/lib/db";
import { signToken, SESSION_COOKIE, type SessionUser } from "@/lib/auth";
import { readJson, jsonError, routeError } from "@/lib/api";

interface UserRow extends SessionUser {
  password_hash: string;
}

export async function POST(req: NextRequest) {
  const body = await readJson<{ email: string; name: string; password: string }>(req);
  if (!body) return jsonError("Invalid request body — expected JSON.", 400);

  const { email, name, password } = body;
  if (!email?.trim() || !name?.trim() || !password) {
    return jsonError("All fields are required.", 400);
  }
  if (password.length < 8) {
    return jsonError("Password must be at least 8 characters.", 400);
  }

  try {
    const existing = await query<{ id: string }>(
      "SELECT id FROM users WHERE email = $1",
      [email.toLowerCase().trim()]
    );
    if (existing.rows.length > 0) {
      return jsonError("Email already registered.", 409);
    }

    const passwordHash = await bcrypt.hash(password, 12);

    const result = await query<UserRow>(
      `INSERT INTO users (email, name, password_hash, plan)
       VALUES ($1, $2, $3, 'free')
       RETURNING id, email, name, plan`,
      [email.toLowerCase().trim(), name.trim(), passwordHash]
    );

    const user = result.rows[0];
    const token = await signToken(user);

    const res = NextResponse.json({ user }, { status: 201 });
    res.cookies.set({ ...SESSION_COOKIE, value: token, secure: process.env.NODE_ENV === "production" });
    return res;
  } catch (err) {
    return routeError(err, "auth/register");
  }
}
