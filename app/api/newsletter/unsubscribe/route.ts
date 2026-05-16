import { NextResponse, type NextRequest } from "next/server";
import { eq } from "drizzle-orm";
import { db, hasDatabase } from "@/db/client";
import { newsletterSubscribers } from "@/db/schema";

function siteUrl(path: string): string {
  const base = process.env.SITE_URL ?? "";
  if (!base) return path;
  return `${base.replace(/\/+$/, "")}${path}`;
}

async function handle(token: string | null): Promise<NextResponse> {
  if (!token || !/^[a-f0-9]{32,64}$/.test(token)) {
    return NextResponse.redirect(siteUrl("/newsletter/unsubscribed?status=invalid"), 303);
  }
  if (!hasDatabase()) {
    return NextResponse.redirect(siteUrl("/newsletter/unsubscribed?status=error"), 303);
  }

  try {
    const row = await db
      .select({
        id: newsletterSubscribers.id,
        status: newsletterSubscribers.status,
      })
      .from(newsletterSubscribers)
      .where(eq(newsletterSubscribers.token, token))
      .limit(1);

    if (!row[0]) {
      return NextResponse.redirect(siteUrl("/newsletter/unsubscribed?status=notfound"), 303);
    }
    if (row[0].status === "unsubscribed") {
      return NextResponse.redirect(siteUrl("/newsletter/unsubscribed?status=already"), 303);
    }
    await db
      .update(newsletterSubscribers)
      .set({ status: "unsubscribed", unsubscribedAt: new Date() })
      .where(eq(newsletterSubscribers.id, row[0].id));
    return NextResponse.redirect(siteUrl("/newsletter/unsubscribed?status=ok"), 303);
  } catch (err) {
    console.error("[newsletter] unsubscribe failed", err);
    return NextResponse.redirect(siteUrl("/newsletter/unsubscribed?status=error"), 303);
  }
}

export async function GET(req: NextRequest) {
  return handle(new URL(req.url).searchParams.get("token"));
}

export async function POST(req: NextRequest) {
  const url = new URL(req.url);
  let token = url.searchParams.get("token");
  if (!token) {
    try {
      const body = (await req.json().catch(() => null)) as { token?: string } | null;
      token = body?.token ?? null;
    } catch {}
  }
  return handle(token);
}
