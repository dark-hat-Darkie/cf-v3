import "server-only";

/**
 * Minimal Resend transport over their REST API — no SDK dependency.
 * Configure with env vars:
 *   RESEND_API_KEY      (required to actually send)
 *   CONTACT_FROM_EMAIL  (optional; defaults to Resend's shared onboarding sender)
 *
 * The default `from` (onboarding@resend.dev) works out of the box in Resend's
 * test mode but only delivers to the address that owns the Resend account.
 * For production, verify your domain in Resend and set
 * CONTACT_FROM_EMAIL="CodeFlee <hello@codeflee.com>".
 */

const RESEND_ENDPOINT = "https://api.resend.com/emails";
const DEFAULT_FROM = "CodeFlee <onboarding@resend.dev>";

export type SendEmailInput = {
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
  replyTo?: string;
  from?: string;
};

export type SendResult = { ok: true; id: string } | { ok: false; error: string };

/** Whether email sending is configured (an API key is present). */
export function emailConfigured(): boolean {
  return Boolean(process.env.RESEND_API_KEY);
}

export async function sendEmail(input: SendEmailInput): Promise<SendResult> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return { ok: false, error: "RESEND_API_KEY is not set" };
  }

  const from = input.from ?? process.env.CONTACT_FROM_EMAIL ?? DEFAULT_FROM;

  try {
    const res = await fetch(RESEND_ENDPOINT, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: Array.isArray(input.to) ? input.to : [input.to],
        subject: input.subject,
        html: input.html,
        ...(input.text ? { text: input.text } : {}),
        ...(input.replyTo ? { reply_to: input.replyTo } : {}),
      }),
      cache: "no-store",
    });

    if (!res.ok) {
      const detail = await res.text().catch(() => "");
      return { ok: false, error: `Resend responded ${res.status}: ${detail.slice(0, 300)}` };
    }

    const data = (await res.json().catch(() => ({}))) as { id?: string };
    return { ok: true, id: data.id ?? "" };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : String(err) };
  }
}
