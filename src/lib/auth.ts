import { SignJWT, jwtVerify } from "jose";

// ── Types ─────────────────────────────────────────────────────────────────────

export interface SessionUser {
  id:    string;
  email: string;
  name:  string;
  plan:  "free" | "pro";
}

export interface UserBranding {
  companyName:     string;
  companyTagline:  string;
  companyAddress:  string;
  companyPhone:    string;
  companyEmail:    string;
  footerText:      string;
  docIdPrefix:     string;
  showLexseaBrand: boolean;
  letterheadStyle: "standard" | "minimal" | "none";
}

// ── JWT ───────────────────────────────────────────────────────────────────────

const COOKIE_NAME = "ls_session";

function secret(): Uint8Array {
  const s = process.env.JWT_SECRET;
  if (!s && process.env.NODE_ENV === "production") {
    throw new Error("JWT_SECRET is required in production");
  }
  return new TextEncoder().encode(s ?? "dev-secret-lexsea-change-in-prod!!");
}

export async function signToken(user: SessionUser): Promise<string> {
  return new SignJWT({ id: user.id, email: user.email, name: user.name, plan: user.plan })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("30d")
    .sign(secret());
}

export async function verifyToken(token: string): Promise<SessionUser | null> {
  try {
    const { payload } = await jwtVerify(token, secret());
    return {
      id:    payload.id    as string,
      email: payload.email as string,
      name:  payload.name  as string,
      plan:  payload.plan  as "free" | "pro",
    };
  } catch {
    return null;
  }
}

export const SESSION_COOKIE: {
  name:     string;
  httpOnly: true;
  sameSite: "lax";
  path:     string;
  maxAge:   number;
} = {
  name:     COOKIE_NAME,
  httpOnly: true,
  sameSite: "lax",
  path:     "/",
  maxAge:   60 * 60 * 24 * 30,
};
