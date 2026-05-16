"use server";

import "server-only";
import { and, desc, eq, ne, sql } from "drizzle-orm";
import { db, hasDatabase } from "@/db/client";
import { posts } from "@/db/schema";
import { requireUser } from "@/lib/auth/session";
import { stem } from "@/lib/seo/nlp/stem";

export type InternalLinkSuggestion = {
  id: number;
  slug: string;
  title: string;
  score: number;
};

/**
 * Suggest published posts that share the focus keyword (stem-aware) with the
 * current draft. Light TF-style scoring: prefer posts where the keyword
 * appears in title, then in focus_keyword field, then in plaintext.
 */
export async function suggestInternalLinksAction(
  excludePostId: number,
  keyword: string,
): Promise<InternalLinkSuggestion[]> {
  await requireUser();
  if (!hasDatabase()) return [];
  if (!keyword.trim()) return [];

  const kwStem = stem(keyword.toLowerCase().split(/\s+/)[0] ?? "");
  const ilikeKey = `%${keyword.toLowerCase()}%`;
  const stemKey = `%${kwStem}%`;

  const rows = await db
    .select({
      id: posts.id,
      slug: posts.slug,
      title: posts.title,
      focusKeyword: posts.focusKeyword,
      titleHit: sql<number>`case when lower(${posts.title}) like ${ilikeKey} then 1 else 0 end`,
      focusHit: sql<number>`case when lower(${posts.focusKeyword}) like ${ilikeKey} then 1 else 0 end`,
      bodyHit: sql<number>`case when lower(${posts.plainText}) like ${stemKey} then 1 else 0 end`,
    })
    .from(posts)
    .where(
      and(
        eq(posts.status, "published"),
        ne(posts.id, excludePostId),
        sql`(lower(${posts.title}) like ${ilikeKey}
          or lower(${posts.focusKeyword}) like ${ilikeKey}
          or lower(${posts.plainText}) like ${stemKey})`,
      ),
    )
    .orderBy(desc(posts.publishedAt))
    .limit(8);

  return rows
    .map((r) => ({
      id: r.id,
      slug: r.slug,
      title: r.title,
      score: r.titleHit * 4 + r.focusHit * 3 + r.bodyHit * 1,
    }))
    .sort((a, b) => b.score - a.score);
}
