import { NextResponse, type NextRequest } from "next/server";
import { revalidatePath, revalidateTag } from "next/cache";
import { and, eq, lte } from "drizzle-orm";
import { db } from "@/db/client";
import { posts } from "@/db/schema";
import { renderPostHtml } from "@/lib/editor/render.server";

function siteOrigin() {
  return process.env.SITE_URL ?? "https://codeflee.com";
}

function isAuthorized(req: NextRequest): boolean {
  const secret = process.env.CRON_SECRET;
  // When a secret is configured, require it. Vercel automatically sends
  // `Authorization: Bearer $CRON_SECRET` on scheduled invocations, so this is
  // the secure path — we do NOT trust `x-vercel-cron` alone, since external
  // clients can forge that header.
  if (secret) {
    return req.headers.get("authorization") === `Bearer ${secret}`;
  }
  // No secret configured (local/dev only): fall back to the Vercel cron header.
  return Boolean(req.headers.get("x-vercel-cron"));
}

export async function GET(req: NextRequest) {
  if (!isAuthorized(req)) return new NextResponse("Unauthorized", { status: 401 });

  const now = new Date();
  const due = await db
    .select()
    .from(posts)
    .where(and(eq(posts.status, "scheduled"), lte(posts.scheduledAt, now)));

  const flipped: string[] = [];
  for (const p of due) {
    const html = p.contentHtml || renderPostHtml(p.content, siteOrigin());
    await db
      .update(posts)
      .set({
        status: "published",
        publishedAt: p.scheduledAt ?? now,
        contentHtml: html,
        updatedAt: now,
      })
      .where(eq(posts.id, p.id));
    revalidateTag(`post:${p.slug}`, "max");
    revalidatePath(`/blog/${p.slug}`);
    flipped.push(p.slug);
  }

  if (flipped.length) {
    revalidateTag("posts:index", "max");
    revalidatePath("/blog");
    revalidatePath("/");
    revalidatePath("/sitemap.xml");
  }

  return NextResponse.json({ now: now.toISOString(), flipped });
}
