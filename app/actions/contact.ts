"use server";

import "server-only";
import { and, eq, gt, sql } from "drizzle-orm";
import { headers } from "next/headers";
import { encodeHexLowerCase } from "@oslojs/encoding";
import { sha256 } from "@oslojs/crypto/sha2";
import { db, hasDatabase } from "@/db/client";
import { inquiries } from "@/db/schema";
import { sendEmail } from "@/lib/email/send.server";
import { site } from "@/lib/site";
import {
  contactSchema,
  type ContactField,
  type ContactInput,
  type ContactState,
} from "@/lib/validation/contact";

/**
 * Where contact-form briefs are delivered. Configurable via CONTACT_TO_EMAIL;
 * falls back to the studio owner's inbox so the form works without extra setup
 * once RESEND_API_KEY is present.
 */
const DEFAULT_TO = "shakil.cse19@gmail.com";

/** At most this many briefs per visitor (hashed IP) per hour. */
const RATE_LIMIT_MAX = 5;
const RATE_LIMIT_WINDOW_MS = 1000 * 60 * 60;

const FALLBACK_ERROR = `Something went wrong sending your message. Please email ${site.email} or message us on WhatsApp — we'd hate to miss it.`;

const ESCAPE: Record<string, string> = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;",
};

function esc(value: string): string {
  return value.replace(/[&<>"']/g, (c) => ESCAPE[c]);
}

function field(formData: FormData, key: string): string {
  const v = formData.get(key);
  return typeof v === "string" ? v : "";
}

async function requestFingerprint(): Promise<{ ipHash: string; userAgent: string }> {
  try {
    const h = await headers();
    const fwd = h.get("x-forwarded-for") ?? "";
    const ip = fwd.split(",")[0]?.trim() || h.get("x-real-ip") || "";
    const ipHash = ip
      ? encodeHexLowerCase(sha256(new TextEncoder().encode(ip))).slice(0, 32)
      : "";
    return { ipHash, userAgent: (h.get("user-agent") ?? "").slice(0, 500) };
  } catch {
    return { ipHash: "", userAgent: "" };
  }
}

function buildEmail(data: ContactInput) {
  const { name, email, message, project, budget, source } = data;
  const rows: Array<[string, string]> = [
    ["Name", name],
    ["Email", email],
    ["Project", project || "—"],
    ["Budget", budget || "—"],
    ["Sent from", source || "—"],
  ];

  const html = `
    <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;max-width:560px;margin:0 auto;color:#1a1428">
      <h2 style="margin:0 0 4px">New project brief</h2>
      <p style="margin:0 0 20px;color:#524a66">Submitted from the ${esc(site.name)} contact form.</p>
      <table style="width:100%;border-collapse:collapse;margin-bottom:20px">
        ${rows
          .map(
            ([k, v]) => `
          <tr>
            <td style="padding:8px 12px;background:#efe7da;font-weight:600;width:120px;vertical-align:top;border-bottom:1px solid #fff">${esc(k)}</td>
            <td style="padding:8px 12px;background:#f8f4ee;border-bottom:1px solid #fff">${esc(v)}</td>
          </tr>`,
          )
          .join("")}
      </table>
      <div style="padding:12px 16px;background:#24133f;color:#fff;border-radius:10px">
        <div style="font-size:12px;letter-spacing:.08em;text-transform:uppercase;opacity:.6;margin-bottom:8px">Message</div>
        <div style="white-space:pre-wrap;line-height:1.6">${esc(message)}</div>
      </div>
      <p style="margin:20px 0 0;color:#524a66;font-size:13px">Reply directly to this email to reach ${esc(name)}.</p>
    </div>`;

  const text = [
    `New project brief — ${site.name} contact form`,
    "",
    ...rows.map(([k, v]) => `${k}: ${v}`),
    "",
    "Message:",
    message,
  ].join("\n");

  return { subject: `New project brief — ${name}`, html, text };
}

/**
 * Handles the public contact form.
 *
 * Order matters: the brief is saved to the database first and emailed second,
 * so a failed or unconfigured email never loses a lead. The visitor only sees
 * an error when the brief could be neither saved nor emailed.
 *
 * The `company` field is a honeypot — real users never see it, so any value
 * means a bot. We pretend success to avoid giving scrapers a signal.
 */
export async function submitContactAction(formData: FormData): Promise<ContactState> {
  if (field(formData, "company").trim() !== "") {
    return { status: "success" };
  }

  const values = {
    name: field(formData, "name"),
    email: field(formData, "email"),
    message: field(formData, "message"),
    project: field(formData, "project"),
    budget: field(formData, "budget"),
  };

  const parsed = contactSchema.safeParse({ ...values, source: field(formData, "source") });
  if (!parsed.success) {
    const fieldErrors: Partial<Record<ContactField, string>> = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path[0];
      if ((key === "name" || key === "email" || key === "message") && !fieldErrors[key]) {
        fieldErrors[key] = issue.message;
      }
    }
    return {
      status: "error",
      message: "Please check the highlighted fields and try again.",
      fieldErrors,
      values,
    };
  }

  const data = parsed.data;
  const { ipHash, userAgent } = await requestFingerprint();

  let savedId: number | null = null;
  if (hasDatabase()) {
    try {
      if (ipHash) {
        const since = new Date(Date.now() - RATE_LIMIT_WINDOW_MS);
        const recent = await db
          .select({ n: sql<number>`count(*)::int` })
          .from(inquiries)
          .where(and(eq(inquiries.ipHash, ipHash), gt(inquiries.createdAt, since)));
        if ((recent[0]?.n ?? 0) >= RATE_LIMIT_MAX) {
          return {
            status: "error",
            message: `You've sent several messages in a short time. Please wait a little, or email ${site.email} directly.`,
            values,
          };
        }
      }
      const inserted = await db
        .insert(inquiries)
        .values({
          name: data.name,
          email: data.email.toLowerCase(),
          message: data.message,
          project: data.project,
          budget: data.budget,
          source: data.source,
          ipHash,
          userAgent,
        })
        .returning({ id: inquiries.id });
      savedId = inserted[0]?.id ?? null;
    } catch (e) {
      console.error("[contact] could not save inquiry:", e);
    }
  }

  const to = process.env.CONTACT_TO_EMAIL?.trim() || DEFAULT_TO;
  const sent = await sendEmail({ to, replyTo: data.email, ...buildEmail(data) });

  if (sent.ok && savedId !== null) {
    try {
      await db.update(inquiries).set({ emailSent: true }).where(eq(inquiries.id, savedId));
    } catch (e) {
      console.error("[contact] could not mark inquiry as emailed:", e);
    }
  }
  if (!sent.ok) {
    console.error("[contact] email send failed:", sent.error);
    if (savedId === null) {
      return { status: "error", message: FALLBACK_ERROR, values };
    }
  }

  return { status: "success" };
}
