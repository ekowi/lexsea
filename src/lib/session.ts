import { cookies } from "next/headers";
import { verifyToken, type SessionUser } from "./auth";

const COOKIE_NAME = "ls_session";

export async function getSession(): Promise<SessionUser | null> {
  const store = await cookies();
  const token = store.get(COOKIE_NAME)?.value;
  if (!token) return null;
  return verifyToken(token);
}
