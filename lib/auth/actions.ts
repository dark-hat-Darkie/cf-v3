"use server";

import "server-only";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { eq, sql } from "drizzle-orm";
import { db } from "@/db/client";
import { users } from "@/db/schema";
import { hashPassword, verifyPassword } from "./password";
import {
  clearSessionCookie,
  createSession,
  generateSessionToken,
  getCurrentSession,
  invalidateSession,
  setSessionCookie,
} from "./session";
import { loginSchema, bootstrapAdminSchema } from "@/lib/validation/login";
import {
  checkLoginRateLimit,
  clearLoginAttempts,
  recordLoginAttempt,
} from "./rate-limit";

export type AuthState = { error?: string } | undefined;

async function getClientKey(email: string): Promise<string> {
  const h = await headers();
  const ip = h.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  return `${ip}:${email.toLowerCase()}`;
}

export async function loginAction(
  _prev: AuthState,
  formData: FormData,
): Promise<AuthState> {
  const parsed = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });
  if (!parsed.success) return { error: "Enter a valid email and password (8+ characters)." };

  const key = await getClientKey(parsed.data.email);
  const limit = await checkLoginRateLimit(key);
  if (!limit.ok) return { error: "Too many attempts. Try again in 15 minutes." };

  const row = await db
    .select()
    .from(users)
    .where(eq(users.email, parsed.data.email.toLowerCase()))
    .limit(1);
  const user = row[0];

  // Always do password verification to equalize timing
  const ok = user
    ? await verifyPassword(user.passwordHash, parsed.data.password)
    : await verifyPassword(
        "$argon2id$v=19$m=19456,t=2,p=1$ZmFrZXNhbHRiYXNlNjQ$ZmFrZWhhc2hiYXNlNjQ",
        parsed.data.password,
      ).then(() => false);

  if (!user || !ok) {
    await recordLoginAttempt(key);
    return { error: "Invalid email or password." };
  }

  await clearLoginAttempts(key);
  const token = generateSessionToken();
  const session = await createSession(user.id, token);
  await setSessionCookie(token, session.expiresAt);

  const fromRaw = formData.get("from");
  const from = typeof fromRaw === "string" && fromRaw.startsWith("/admin") ? fromRaw : "/admin";
  redirect(from);
}

export async function logoutAction() {
  const res = await getCurrentSession();
  if (res) {
    await invalidateSession(res.session.id);
  }
  await clearSessionCookie();
  redirect("/admin/login");
}

/** Bootstrap the first admin if the users table is empty. */
export async function bootstrapAdminAction(
  _prev: AuthState,
  formData: FormData,
): Promise<AuthState> {
  const parsed = bootstrapAdminSchema.safeParse({
    email: formData.get("email"),
    name: formData.get("name"),
    password: formData.get("password"),
  });
  if (!parsed.success) return { error: "Enter a name, email and password (8+ characters)." };

  const existing = await db
    .select({ n: sql<number>`count(*)::int` })
    .from(users);
  const count = existing[0]?.n ?? 0;
  if (count > 0) return { error: "Admin already exists. Please log in." };

  const passwordHash = await hashPassword(parsed.data.password);
  const [user] = await db
    .insert(users)
    .values({
      email: parsed.data.email.toLowerCase(),
      name: parsed.data.name,
      passwordHash,
    })
    .returning();

  const token = generateSessionToken();
  const session = await createSession(user.id, token);
  await setSessionCookie(token, session.expiresAt);
  redirect("/admin");
}
