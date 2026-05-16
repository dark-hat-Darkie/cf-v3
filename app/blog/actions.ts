"use server";

import { z } from "zod";
import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import { encodeHexLowerCase } from "@oslojs/encoding";
import { sha256 } from "@oslojs/crypto/sha2";
import { db, hasDatabase } from "@/db/client";
import { newsletterSubscribers } from "@/db/schema";

const schema = z.object({
  email: z.string().email("Please enter a valid email").max(254),
  source: z.string().max(120).optional(),
});

export type NewsletterResult =
  | { ok: true; email: string; status: "new" | "resubscribed" | "already" }
  | { ok: false; error: string };

function generateToken(): string {
  const bytes = new Uint8Array(24);
  crypto.getRandomValues(bytes);
  return encodeHexLowerCase(bytes);
}

function hashIp(ip: string): string {
  if (!ip) return "";
  return encodeHexLowerCase(sha256(new TextEncoder().encode(ip))).slice(0, 32);
}

export async function subscribeNewsletterAction(input: unknown): Promise<NewsletterResult> {
  const parsed = schema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid email" };
  }
  const email = parsed.data.email.trim().toLowerCase();
  const source = (parsed.data.source ?? "blog").slice(0, 120);

  if (!hasDatabase()) {
    return { ok: false, error: "Newsletter is temporarily unavailable. Please try again later." };
  }

  let ipHash = "";
  let userAgent = "";
  try {
    const h = await headers();
    const fwd = h.get("x-forwarded-for") ?? "";
    const ip = fwd.split(",")[0]?.trim() ?? h.get("x-real-ip") ?? "";
    ipHash = hashIp(ip);
    userAgent = (h.get("user-agent") ?? "").slice(0, 500);
  } catch {}

  try {
    const existing = await db
      .select({
        id: newsletterSubscribers.id,
        status: newsletterSubscribers.status,
      })
      .from(newsletterSubscribers)
      .where(eq(newsletterSubscribers.email, email))
      .limit(1);

    if (existing[0]) {
      if (existing[0].status === "active") {
        return { ok: true, email, status: "already" };
      }
      await db
        .update(newsletterSubscribers)
        .set({
          status: "active",
          subscribedAt: new Date(),
          unsubscribedAt: null,
          source,
          ipHash,
          userAgent,
        })
        .where(eq(newsletterSubscribers.id, existing[0].id));
      return { ok: true, email, status: "resubscribed" };
    }

    await db.insert(newsletterSubscribers).values({
      email,
      token: generateToken(),
      source,
      ipHash,
      userAgent,
    });
    return { ok: true, email, status: "new" };
  } catch (err) {
    console.error("[newsletter] subscribe failed", err);
    return { ok: false, error: "Something went wrong on our end. Please try again." };
  }
}
