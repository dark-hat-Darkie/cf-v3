import "server-only";
import { and, eq, gt, sql } from "drizzle-orm";
import { db } from "@/db/client";
import { loginAttempts } from "@/db/schema";

const WINDOW_MS = 1000 * 60 * 15; // 15 min
const MAX_ATTEMPTS = 5;

export async function checkLoginRateLimit(key: string): Promise<{ ok: boolean; remaining: number }> {
  const since = new Date(Date.now() - WINDOW_MS);
  const rows = await db
    .select({ n: sql<number>`count(*)::int` })
    .from(loginAttempts)
    .where(and(eq(loginAttempts.key, key), gt(loginAttempts.attemptedAt, since)));
  const count = rows[0]?.n ?? 0;
  return { ok: count < MAX_ATTEMPTS, remaining: Math.max(0, MAX_ATTEMPTS - count) };
}

export async function recordLoginAttempt(key: string): Promise<void> {
  await db.insert(loginAttempts).values({ key });
}

export async function clearLoginAttempts(key: string): Promise<void> {
  await db.delete(loginAttempts).where(eq(loginAttempts.key, key));
}
