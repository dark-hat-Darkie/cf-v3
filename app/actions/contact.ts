"use server";

import "server-only";
import { contactSchema } from "@/lib/validation/contact";
import { sendEmail } from "@/lib/email/send.server";

/**
 * Where contact-form briefs are delivered. Configurable via CONTACT_TO_EMAIL;
 * falls back to the studio owner's inbox so the form works without extra setup
 * once RESEND_API_KEY is present.
 */
const DEFAULT_TO = "shakil.cse19@gmail.com";

export type ContactResult = { ok: true } | { ok: false; error: string };

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

/**
 * Submits the public "Send brief" form. The optional `company` field is a
 * honeypot — real users never see it, so any value means a bot. We pretend
 * success in that case to avoid giving scrapers a signal.
 */
export async function submitContactAction(input: unknown): Promise<ContactResult> {
  const honeypot = (input as { company?: unknown } | null)?.company;
  if (typeof honeypot === "string" && honeypot.trim() !== "") {
    return { ok: true };
  }

  const parsed = contactSchema.safeParse(input);
  if (!parsed.success) {
    const issue = parsed.error.issues[0];
    return { ok: false, error: issue?.message ?? "Please check the form and try again." };
  }

  const { name, email, message, project, budget } = parsed.data;
  const to = process.env.CONTACT_TO_EMAIL?.trim() || DEFAULT_TO;

  const rows: Array<[string, string]> = [
    ["Name", name],
    ["Email", email],
    ["Project", project || "—"],
    ["Budget", budget || "—"],
  ];

  const html = `
    <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;max-width:560px;margin:0 auto;color:#0b0b0b">
      <h2 style="margin:0 0 4px">New project brief</h2>
      <p style="margin:0 0 20px;color:#666">Submitted from the CodeFlee contact form.</p>
      <table style="width:100%;border-collapse:collapse;margin-bottom:20px">
        ${rows
          .map(
            ([k, v]) => `
          <tr>
            <td style="padding:8px 12px;background:#f5f2ec;font-weight:600;width:120px;vertical-align:top;border-bottom:1px solid #fff">${esc(
              k,
            )}</td>
            <td style="padding:8px 12px;background:#faf8f4;border-bottom:1px solid #fff">${esc(v)}</td>
          </tr>`,
          )
          .join("")}
      </table>
      <div style="padding:12px 16px;background:#0b0b0b;color:#fff;border-radius:10px">
        <div style="font-size:12px;letter-spacing:.08em;text-transform:uppercase;opacity:.6;margin-bottom:8px">Message</div>
        <div style="white-space:pre-wrap;line-height:1.6">${esc(message)}</div>
      </div>
      <p style="margin:20px 0 0;color:#999;font-size:13px">Reply directly to this email to reach ${esc(
        name,
      )}.</p>
    </div>`;

  const text = [
    "New project brief — CodeFlee contact form",
    "",
    ...rows.map(([k, v]) => `${k}: ${v}`),
    "",
    "Message:",
    message,
  ].join("\n");

  const result = await sendEmail({
    to,
    subject: `New project brief — ${name}`,
    html,
    text,
    replyTo: email,
  });

  if (!result.ok) {
    console.error("[contact] email send failed:", result.error);
    return {
      ok: false,
      error:
        "Something went wrong sending your message. Please email hello@codeflee.com directly.",
    };
  }

  return { ok: true };
}
