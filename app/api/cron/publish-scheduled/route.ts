import { NextResponse, type NextRequest } from "next/server";
import { revalidatePath, revalidateTag } from "next/cache";
import { and, eq, lte } from "drizzle-orm";
import { db } from "@/db/client";
import { posts } from "@/db/schema";
import { renderPostHtml } from "@/lib/editor/render.server";

function siteOrigin() {
  return process.env.SITE_URL ?? "https://example.com";
}

function isAuthorized(req: NextRequest): boolean {
  // Vercel Cron sets this header; for self-hosted, accept a shared secret.
  if (req.headers.get("x-vercel-cron")) return true;
  const secret = process.env.CRON_SECRET;
  if (!secret) return false;
  const provided = req.headers.get("authorization");
  return provided === `Bearer ${secret}`;
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
