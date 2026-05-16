import "server-only";
import { eq } from "drizzle-orm";
import { encodeHexLowerCase } from "@oslojs/encoding";
import { sha256 } from "@oslojs/crypto/sha2";
import { cookies } from "next/headers";
import { cache } from "react";
import { db } from "@/db/client";
import { sessions, users, type Session, type User } from "@/db/schema";

export const SESSION_COOKIE_NAME = "cf_session";
const SESSION_TTL_MS = 1000 * 60 * 60 * 24 * 30; // 30 days
const SESSION_REFRESH_THRESHOLD_MS = 1000 * 60 * 60 * 24 * 15; // refresh if <15 days left

function tokenToId(token: string): string {
  return encodeHexLowerCase(sha256(new TextEncoder().encode(token)));
}

export function generateSessionToken(): string {
  const bytes = new Uint8Array(24);
  crypto.getRandomValues(bytes);
  return encodeHexLowerCase(bytes);
}

export async function createSession(userId: number, token: string): Promise<Session> {
  const id = tokenToId(token);
  const expiresAt = new Date(Date.now() + SESSION_TTL_MS);
  const [row] = await db
    .insert(sessions)
    .values({ id, userId, expiresAt })
    .returning();
  return row;
}

export async function validateSessionToken(
  token: string,
): Promise<{ session: Session; user: User } | null> {
  const id = tokenToId(token);
  const rows = await db
    .select({ session: sessions, user: users })
    .from(sessions)
    .innerJoin(users, eq(sessions.userId, users.id))
    .where(eq(sessions.id, id))
    .limit(1);
  const row = rows[0];
  if (!row) return null;

  const now = Date.now();
  if (row.session.expiresAt.getTime() <= now) {
    await db.delete(sessions).where(eq(sessions.id, id));
    return null;
  }
  if (row.session.expiresAt.getTime() - now < SESSION_REFRESH_THRESHOLD_MS) {
    const next = new Date(now + SESSION_TTL_MS);
    await db.update(sessions).set({ expiresAt: next }).where(eq(sessions.id, id));
    row.session.expiresAt = next;
  }
  return row;
}

export async function invalidateSession(id: string): Promise<void> {
  await db.delete(sessions).where(eq(sessions.id, id));
}

export async function invalidateUserSessions(userId: number): Promise<void> {
  await db.delete(sessions).where(eq(sessions.userId, userId));
}

export async function setSessionCookie(token: string, expiresAt: Date): Promise<void> {
  const jar = await cookies();
  jar.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    expires: expiresAt,
  });
}

export async function clearSessionCookie(): Promise<void> {
  const jar = await cookies();
  jar.set(SESSION_COOKIE_NAME, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
}

export const getCurrentSession = cache(
  async (): Promise<{ session: Session; user: User } | null> => {
    const jar = await cookies();
    const token = jar.get(SESSION_COOKIE_NAME)?.value;
    if (!token) return null;
    return validateSessionToken(token);
  },
);

export async function requireUser(): Promise<{ session: Session; user: User }> {
  const res = await getCurrentSession();
  if (!res) {
    throw new Error("UNAUTHORIZED");
  }
  return res;
}
