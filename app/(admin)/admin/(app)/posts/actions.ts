"use server";

import "server-only";
import { revalidatePath, revalidateTag, updateTag } from "next/cache";
import { redirect } from "next/navigation";
import { eq, sql, gt, and, ne, inArray } from "drizzle-orm";
import readingTime from "reading-time";
import slugifier from "github-slugger";
import type { JSONContent } from "@tiptap/core";

import { db } from "@/db/client";
import { posts, postRevisions, redirects, media } from "@/db/schema";
import { requireUser } from "@/lib/auth/session";
import { saveDraftSchema, updateMetaSchema } from "@/lib/validation/post";
import { extractPlainText, renderPostHtml } from "@/lib/editor/render.server";
import { computePostScores, type PostScoreInput } from "@/lib/seo/score-post.server";
import { findDuplicateKeyword } from "@/lib/content/queries";

async function loadScoreInputs(p: typeof posts.$inferSelect): Promise<PostScoreInput> {
  // Resolve featured / og media so img-featured checks match what the editor sees.
  const mediaIds = [p.featuredImageId, p.ogImageId].filter(
    (id): id is number => typeof id === "number",
  );
  const mediaRows = mediaIds.length
    ? await db
        .select({ id: media.id, blobUrl: media.blobUrl, alt: media.alt, width: media.width, height: media.height })
        .from(media)
        .where(inArrayOrId(mediaIds))
    : [];
  const mediaById = new Map(mediaRows.map((m) => [m.id, m]));
  const featured = p.featuredImageId ? mediaById.get(p.featuredImageId) : null;
  const og = p.ogImageId ? mediaById.get(p.ogImageId) : null;

  // Cannibalization — same query the editor uses live.
  const cannibalization = p.focusKeyword
    ? await findDuplicateKeyword(p.focusKeyword, p.id)
    : [];

  return {
    ...p,
    featuredImage: featured
      ? { url: featured.blobUrl, alt: featured.alt ?? "", width: featured.width, height: featured.height }
      : null,
    ogImage: og
      ? { url: og.blobUrl, alt: og.alt ?? "", width: og.width, height: og.height }
      : null,
    cannibalization,
  };
}

// Tiny helper so the Promise.all can sit in one place and we don't import
// drizzle's inArray solely for this — and a single-element id stays simple.
function inArrayOrId(ids: number[]) {
  if (ids.length === 1) return eq(media.id, ids[0]);
  return inArray(media.id, ids);
}

async function persistScoresForPost(postId: number): Promise<void> {
  try {
    const rows = await db.select().from(posts).where(eq(posts.id, postId)).limit(1);
    const p = rows[0];
    if (!p) return;
    const input = await loadScoreInputs(p);
    const { seoScore, readabilityScore } = computePostScores(input);
    await db
      .update(posts)
      .set({ seoScore, readabilityScore })
      .where(eq(posts.id, postId));
  } catch (err) {
    console.warn("[score] persist failed (non-fatal)", err);
  }
}

const slugger = new slugifier();

function siteOrigin() {
  return process.env.SITE_URL ?? "https://example.com";
}

function emptyDoc(): JSONContent {
  return { type: "doc", content: [{ type: "paragraph" }] };
}

export type CreatePostResult = { id: number } | { error: string };

export async function createPostAction(): Promise<CreatePostResult> {
  const { user } = await requireUser();
  const baseSlug = `untitled-${Date.now().toString(36)}`;
  const [row] = await db
    .insert(posts)
    .values({
      slug: baseSlug,
      title: "",
      content: emptyDoc(),
      authorId: user.id,
    })
    .returning({ id: posts.id });
  return { id: row.id };
}

export type SaveDraftResult =
  | { ok: true; revision: number; wordCount: number; readingTimeMinutes: number; savedAt: string }
  | { ok: false; error: string; staleRevision?: number };

export async function saveDraftAction(input: unknown): Promise<SaveDraftResult> {
  try {
    await requireUser();
    const parsed = saveDraftSchema.safeParse(input);
    if (!parsed.success) {
      const issue = parsed.error.issues[0];
      const path = issue?.path?.join(".") || "input";
      const msg = `Invalid payload at ${path}: ${issue?.message ?? "unknown"}`;
      console.error("[saveDraft] zod failure", parsed.error.issues);
      return { ok: false, error: msg };
    }
    const { postId, revision, title } = parsed.data;
    const content = parsed.data.content as JSONContent;

    const current = await db
      .select({ revision: posts.revision, status: posts.status })
      .from(posts)
      .where(eq(posts.id, postId))
      .limit(1);
    if (!current[0]) return { ok: false, error: "Post not found" };
    if (revision <= current[0].revision) {
      return { ok: false, error: "Stale revision", staleRevision: current[0].revision };
    }

    const plain = extractPlainText(content);
    const rt = readingTime(plain);
    const wordCount = plain.trim() ? plain.trim().split(/\s+/).length : 0;
    const now = new Date();

    // neon-http doesn't support multi-statement transactions reliably; we run
    // these sequentially. Worst case (network drops between statements) leaves
    // a saved post without a matching revision row — recoverable on next save.
    await db
      .update(posts)
      .set({
        title,
        content,
        plainText: plain,
        wordCount,
        readingTimeMinutes: Math.max(1, Math.round(rt.minutes)),
        revision,
        updatedAt: now,
      })
      .where(eq(posts.id, postId));

    await db.insert(postRevisions).values({
      postId,
      revision,
      title,
      content,
    });

    // Prune to last 20 unlabeled revisions (kept best-effort; failure is non-fatal).
    try {
      const stale = await db
        .select({ id: postRevisions.id })
        .from(postRevisions)
        .where(and(eq(postRevisions.postId, postId), sql`${postRevisions.label} is null`))
        .orderBy(sql`${postRevisions.savedAt} desc`)
        .limit(1000)
        .offset(20);
      if (stale.length) {
        await db.delete(postRevisions).where(
          sql`${postRevisions.id} in (${sql.join(
            stale.map((r) => sql`${r.id}`),
            sql`, `,
          )})`,
        );
      }
    } catch (pruneErr) {
      console.warn("[saveDraft] prune failed (non-fatal)", pruneErr);
    }

    await persistScoresForPost(postId);

    return {
      ok: true,
      revision,
      wordCount,
      readingTimeMinutes: Math.max(1, Math.round(rt.minutes)),
      savedAt: now.toISOString(),
    };
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    console.error("[saveDraft] failed", e);
    return { ok: false, error: msg };
  }
}

export type UpdateMetaResult = { ok: true; slug: string } | { ok: false; error: string };

export async function updateMetaAction(input: unknown): Promise<UpdateMetaResult> {
  await requireUser();
  const parsed = updateMetaSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: "Invalid payload" };

  const current = await db
    .select({ slug: posts.slug, status: posts.status })
    .from(posts)
    .where(eq(posts.id, parsed.data.postId))
    .limit(1);
  if (!current[0]) return { ok: false, error: "Post not found" };

  let nextSlug = current[0].slug;
  if (parsed.data.slug && parsed.data.slug !== current[0].slug) {
    const normalized = slugger.slug(parsed.data.slug);
    if (!normalized) return { ok: false, error: "Slug cannot be empty" };
    const clash = await db
      .select({ id: posts.id })
      .from(posts)
      .where(and(eq(posts.slug, normalized), ne(posts.id, parsed.data.postId)))
      .limit(1);
    if (clash[0]) return { ok: false, error: "Slug already in use by another post" };
    nextSlug = normalized;

    if (current[0].status === "published") {
      await db
        .insert(redirects)
        .values({
          fromPath: `/blog/${current[0].slug}`,
          toPath: `/blog/${nextSlug}`,
          status: 301,
        })
        .onConflictDoUpdate({
          target: redirects.fromPath,
          set: { toPath: `/blog/${nextSlug}`, status: 301 },
        });
    }
  }

  const { postId, slug: _slug, ...rest } = parsed.data;
  void _slug;
  await db
    .update(posts)
    .set({
      ...rest,
      slug: nextSlug,
      updatedAt: new Date(),
    })
    .where(eq(posts.id, postId));

  await persistScoresForPost(postId);

  return { ok: true, slug: nextSlug };
}

export type PublishResult = { ok: true; slug: string } | { ok: false; error: string };

export async function publishAction(postId: number): Promise<PublishResult> {
  await requireUser();
  const rows = await db.select().from(posts).where(eq(posts.id, postId)).limit(1);
  const p = rows[0];
  if (!p) return { ok: false, error: "Post not found" };

  const html = renderPostHtml(p.content, siteOrigin());
  const now = new Date();
  const { seoScore, readabilityScore } = computePostScores(await loadScoreInputs(p));
  await db
    .update(posts)
    .set({
      status: "published",
      publishedAt: p.publishedAt ?? now,
      contentHtml: html,
      seoScore,
      readabilityScore,
      updatedAt: now,
    })
    .where(eq(posts.id, postId));

  updateTag(`post:${p.slug}`);
  updateTag("posts:index");
  revalidatePath(`/blog/${p.slug}`);
  revalidatePath("/blog");
  revalidatePath("/");
  revalidatePath("/sitemap.xml");
  return { ok: true, slug: p.slug };
}

export async function scheduleAction(postId: number, when: string): Promise<PublishResult> {
  await requireUser();
  const at = new Date(when);
  if (Number.isNaN(at.getTime())) return { ok: false, error: "Invalid date" };
  const rows = await db.select().from(posts).where(eq(posts.id, postId)).limit(1);
  const p = rows[0];
  if (!p) return { ok: false, error: "Post not found" };
  const html = renderPostHtml(p.content, siteOrigin());
  const { seoScore, readabilityScore } = computePostScores(await loadScoreInputs(p));
  await db
    .update(posts)
    .set({
      status: "scheduled",
      scheduledAt: at,
      contentHtml: html,
      seoScore,
      readabilityScore,
      updatedAt: new Date(),
    })
    .where(eq(posts.id, postId));
  return { ok: true, slug: p.slug };
}

export async function unpublishAction(postId: number): Promise<PublishResult> {
  await requireUser();
  const rows = await db.select({ slug: posts.slug }).from(posts).where(eq(posts.id, postId)).limit(1);
  const p = rows[0];
  if (!p) return { ok: false, error: "Post not found" };
  await db.update(posts).set({ status: "draft", updatedAt: new Date() }).where(eq(posts.id, postId));
  updateTag(`post:${p.slug}`);
  updateTag("posts:index");
  revalidatePath(`/blog/${p.slug}`);
  revalidatePath("/blog");
  revalidatePath("/");
  return { ok: true, slug: p.slug };
}

export async function deletePostAction(postId: number): Promise<{ ok: true } | { ok: false; error: string }> {
  await requireUser();
  const rows = await db.select({ slug: posts.slug }).from(posts).where(eq(posts.id, postId)).limit(1);
  const p = rows[0];
  if (!p) return { ok: false, error: "Not found" };
  await db.delete(posts).where(eq(posts.id, postId));
  updateTag(`post:${p.slug}`);
  updateTag("posts:index");
  revalidatePath(`/blog/${p.slug}`);
  revalidatePath("/blog");
  revalidatePath("/");
  redirect("/admin/posts");
}
