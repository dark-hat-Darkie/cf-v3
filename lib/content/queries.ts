import "server-only";
import { alias } from "drizzle-orm/pg-core";
import { and, desc, asc, eq, ne, lt, gt, lte, count, inArray } from "drizzle-orm";
import { db, hasDatabase } from "@/db/client";
import { posts, media, redirects, tags, postTags, users } from "@/db/schema";
import { computePostScores } from "@/lib/seo/score-post.server";


export async function listPostsAdmin(opts: { limit?: number; offset?: number; status?: typeof posts.$inferSelect.status } = {}) {
  const { limit = 50, offset = 0, status } = opts;

  // Aliases so we can left-join the same media table twice (featured + og).
  const featuredMedia = alias(media, "featured_media");
  const ogMedia = alias(media, "og_media");

  const baseSelect = {
    id: posts.id,
    slug: posts.slug,
    title: posts.title,
    excerpt: posts.excerpt,
    content: posts.content,
    plainText: posts.plainText,
    status: posts.status,
    publishedAt: posts.publishedAt,
    scheduledAt: posts.scheduledAt,
    updatedAt: posts.updatedAt,
    wordCount: posts.wordCount,
    focusKeyword: posts.focusKeyword,
    secondaryKeywords: posts.secondaryKeywords,
    metaTitle: posts.metaTitle,
    metaDescription: posts.metaDescription,
    ogTitle: posts.ogTitle,
    ogDescription: posts.ogDescription,
    twitterCard: posts.twitterCard,
    canonical: posts.canonical,
    robotsIndex: posts.robotsIndex,
    robotsFollow: posts.robotsFollow,
    schemaType: posts.schemaType,
    isCornerstone: posts.isCornerstone,
    seoScore: posts.seoScore,
    readabilityScore: posts.readabilityScore,
    featuredUrl: featuredMedia.blobUrl,
    featuredAlt: featuredMedia.alt,
    featuredWidth: featuredMedia.width,
    featuredHeight: featuredMedia.height,
    ogUrl: ogMedia.blobUrl,
    ogAlt: ogMedia.alt,
    ogWidth: ogMedia.width,
    ogHeight: ogMedia.height,
  };

  const q = db
    .select(baseSelect)
    .from(posts)
    .leftJoin(featuredMedia, eq(posts.featuredImageId, featuredMedia.id))
    .leftJoin(ogMedia, eq(posts.ogImageId, ogMedia.id))
    .orderBy(desc(posts.updatedAt))
    .limit(limit)
    .offset(offset);
  const rows = await (status ? q.where(eq(posts.status, status)) : q);

  // Batch-load cannibalization in one query: find every published post that
  // shares a focus keyword with anything in the list, then bucket per keyword.
  // This matches what the editor sees via findCannibalizationAction.
  const keywords = Array.from(
    new Set(rows.map((r) => r.focusKeyword).filter((k): k is string => Boolean(k))),
  );
  const cannibalByKw = new Map<string, { id: number; slug: string; title: string }[]>();
  if (keywords.length > 0) {
    const dupes = await db
      .select({
        id: posts.id,
        slug: posts.slug,
        title: posts.title,
        focusKeyword: posts.focusKeyword,
      })
      .from(posts)
      .where(and(eq(posts.status, "published"), inArray(posts.focusKeyword, keywords)));
    for (const d of dupes) {
      if (!cannibalByKw.has(d.focusKeyword)) cannibalByKw.set(d.focusKeyword, []);
      cannibalByKw.get(d.focusKeyword)!.push({ id: d.id, slug: d.slug, title: d.title });
    }
  }

  return rows.map((r) => {
    const featuredImage = r.featuredUrl
      ? { url: r.featuredUrl, alt: r.featuredAlt ?? "", width: r.featuredWidth, height: r.featuredHeight }
      : null;
    const ogImage = r.ogUrl
      ? { url: r.ogUrl, alt: r.ogAlt ?? "", width: r.ogWidth, height: r.ogHeight }
      : null;
    const cannibalization = (cannibalByKw.get(r.focusKeyword) ?? []).filter((c) => c.id !== r.id);
    const scores = computePostScores({ ...r, featuredImage, ogImage, cannibalization });
    return {
      ...r,
      seoScore: scores.seoScore,
      readabilityScore: scores.readabilityScore,
    };
  });
}

export async function countPostsByStatus() {
  const rows = await db
    .select({ status: posts.status, n: count() })
    .from(posts)
    .groupBy(posts.status);
  const out = { draft: 0, scheduled: 0, published: 0, archived: 0 } as Record<string, number>;
  for (const r of rows) out[r.status] = Number(r.n);
  return out;
}

export async function getPostById(id: number) {
  const rows = await db.select().from(posts).where(eq(posts.id, id)).limit(1);
  return rows[0] ?? null;
}

export async function getPostBySlug(slug: string) {
  const rows = await db.select().from(posts).where(eq(posts.slug, slug)).limit(1);
  return rows[0] ?? null;
}

export async function getPublishedPostBySlug(slug: string) {
  const rows = await db
    .select()
    .from(posts)
    .where(and(eq(posts.slug, slug), eq(posts.status, "published")))
    .limit(1);
  return rows[0] ?? null;
}

export async function getMediaById(id: number) {
  const rows = await db.select().from(media).where(eq(media.id, id)).limit(1);
  return rows[0] ?? null;
}

export async function listMedia(limit = 60) {
  return db.select().from(media).orderBy(desc(media.createdAt)).limit(limit);
}

export async function listPublishedPosts(opts: { limit?: number; offset?: number; tag?: string } = {}) {
  const { limit = 12, offset = 0, tag } = opts;
  if (!hasDatabase()) return [];

  const baseWhere = and(eq(posts.status, "published"), lte(posts.publishedAt, new Date()));

  // When a tag filter is set, restrict to posts joined to that tag slug.
  let postIds: number[] | null = null;
  if (tag) {
    const tagRows = await db
      .select({ id: postTags.postId })
      .from(postTags)
      .innerJoin(tags, eq(postTags.tagId, tags.id))
      .where(eq(tags.slug, tag));
    postIds = tagRows.map((r) => r.id);
    if (postIds.length === 0) return [];
  }

  const where = postIds ? and(baseWhere, inArray(posts.id, postIds)) : baseWhere;

  const rows = await db
    .select({
      id: posts.id,
      slug: posts.slug,
      title: posts.title,
      excerpt: posts.excerpt,
      metaDescription: posts.metaDescription,
      publishedAt: posts.publishedAt,
      readingTimeMinutes: posts.readingTimeMinutes,
      featuredImageId: posts.featuredImageId,
      focusKeyword: posts.focusKeyword,
      mediaUrl: media.blobUrl,
      mediaAlt: media.alt,
      mediaWidth: media.width,
      mediaHeight: media.height,
    })
    .from(posts)
    .leftJoin(media, eq(posts.featuredImageId, media.id))
    .where(where)
    .orderBy(desc(posts.publishedAt))
    .limit(limit)
    .offset(offset);

  return rows.map((r) => ({
    id: r.id,
    slug: r.slug,
    title: r.title,
    excerpt: r.excerpt || r.metaDescription,
    publishedAt: r.publishedAt,
    readingTimeMinutes: r.readingTimeMinutes,
    focusKeyword: r.focusKeyword,
    featuredImage: r.mediaUrl ? { url: r.mediaUrl, alt: r.mediaAlt ?? "", width: r.mediaWidth, height: r.mediaHeight } : null,
  }));
}

export async function countPublishedPosts(opts: { tag?: string } = {}): Promise<number> {
  if (!hasDatabase()) return 0;
  const { tag } = opts;
  const baseWhere = and(eq(posts.status, "published"), lte(posts.publishedAt, new Date()));

  if (tag) {
    const rows = await db
      .select({ n: count() })
      .from(posts)
      .innerJoin(postTags, eq(postTags.postId, posts.id))
      .innerJoin(tags, eq(postTags.tagId, tags.id))
      .where(and(baseWhere, eq(tags.slug, tag)));
    return Number(rows[0]?.n ?? 0);
  }

  const rows = await db.select({ n: count() }).from(posts).where(baseWhere);
  return Number(rows[0]?.n ?? 0);
}

export async function listPublishedTags(): Promise<{ slug: string; name: string; count: number }[]> {
  if (!hasDatabase()) return [];
  const rows = await db
    .select({
      slug: tags.slug,
      name: tags.name,
      n: count(posts.id),
    })
    .from(tags)
    .innerJoin(postTags, eq(postTags.tagId, tags.id))
    .innerJoin(posts, eq(posts.id, postTags.postId))
    .where(and(eq(posts.status, "published"), lte(posts.publishedAt, new Date())))
    .groupBy(tags.id, tags.slug, tags.name)
    .orderBy(desc(count(posts.id)), asc(tags.name));
  return rows.map((r) => ({ slug: r.slug, name: r.name, count: Number(r.n) }));
}

export async function listRelatedPosts(postId: number, limit = 3) {
  if (!hasDatabase()) return [];

  // Tags shared with the source post.
  const tagIdsRows = await db
    .select({ tagId: postTags.tagId })
    .from(postTags)
    .where(eq(postTags.postId, postId));
  const tagIds = tagIdsRows.map((r) => r.tagId);

  const baseWhere = and(
    eq(posts.status, "published"),
    lte(posts.publishedAt, new Date()),
    ne(posts.id, postId),
  );

  // If the post has no tags, fall back to recency-only.
  if (tagIds.length === 0) {
    const rows = await db
      .select({
        id: posts.id,
        slug: posts.slug,
        title: posts.title,
        excerpt: posts.excerpt,
        metaDescription: posts.metaDescription,
        publishedAt: posts.publishedAt,
        readingTimeMinutes: posts.readingTimeMinutes,
        focusKeyword: posts.focusKeyword,
        mediaUrl: media.blobUrl,
        mediaAlt: media.alt,
        mediaWidth: media.width,
        mediaHeight: media.height,
      })
      .from(posts)
      .leftJoin(media, eq(posts.featuredImageId, media.id))
      .where(baseWhere)
      .orderBy(desc(posts.publishedAt))
      .limit(limit);
    return rows.map(shapeListedPost);
  }

  // Find candidate post ids sharing at least one tag, ranked by shared-tag count.
  const candidateRows = await db
    .select({
      id: postTags.postId,
      shared: count(),
    })
    .from(postTags)
    .where(and(inArray(postTags.tagId, tagIds), ne(postTags.postId, postId)))
    .groupBy(postTags.postId)
    .orderBy(desc(count()))
    .limit(limit * 4);

  const candidateIds = candidateRows.map((r) => r.id);
  if (candidateIds.length === 0) return [];

  const rows = await db
    .select({
      id: posts.id,
      slug: posts.slug,
      title: posts.title,
      excerpt: posts.excerpt,
      metaDescription: posts.metaDescription,
      publishedAt: posts.publishedAt,
      readingTimeMinutes: posts.readingTimeMinutes,
      focusKeyword: posts.focusKeyword,
      mediaUrl: media.blobUrl,
      mediaAlt: media.alt,
      mediaWidth: media.width,
      mediaHeight: media.height,
    })
    .from(posts)
    .leftJoin(media, eq(posts.featuredImageId, media.id))
    .where(and(baseWhere, inArray(posts.id, candidateIds)))
    .orderBy(desc(posts.publishedAt))
    .limit(limit);

  return rows.map(shapeListedPost);
}

function shapeListedPost(r: {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  metaDescription: string;
  publishedAt: Date | null;
  readingTimeMinutes: number;
  focusKeyword: string;
  mediaUrl: string | null;
  mediaAlt: string | null;
  mediaWidth: number | null;
  mediaHeight: number | null;
}) {
  return {
    id: r.id,
    slug: r.slug,
    title: r.title,
    excerpt: r.excerpt || r.metaDescription,
    publishedAt: r.publishedAt,
    readingTimeMinutes: r.readingTimeMinutes,
    focusKeyword: r.focusKeyword,
    featuredImage: r.mediaUrl
      ? { url: r.mediaUrl, alt: r.mediaAlt ?? "", width: r.mediaWidth, height: r.mediaHeight }
      : null,
  };
}

export async function getAdjacentPosts(
  publishedAt: Date,
  currentId: number,
): Promise<{
  prev: { slug: string; title: string } | null;
  next: { slug: string; title: string } | null;
}> {
  if (!hasDatabase()) return { prev: null, next: null };

  const baseWhere = and(eq(posts.status, "published"), lte(posts.publishedAt, new Date()), ne(posts.id, currentId));

  const [prevRows, nextRows] = await Promise.all([
    db
      .select({ slug: posts.slug, title: posts.title })
      .from(posts)
      .where(and(baseWhere, lt(posts.publishedAt, publishedAt)))
      .orderBy(desc(posts.publishedAt), desc(posts.id))
      .limit(1),
    db
      .select({ slug: posts.slug, title: posts.title })
      .from(posts)
      .where(and(baseWhere, gt(posts.publishedAt, publishedAt)))
      .orderBy(asc(posts.publishedAt), asc(posts.id))
      .limit(1),
  ]);

  return {
    prev: prevRows[0] ?? null,
    next: nextRows[0] ?? null,
  };
}

export type FullPost = NonNullable<Awaited<ReturnType<typeof getPostFull>>>;

export async function getPostFull(slug: string) {
  if (!hasDatabase()) return null;

  const rows = await db
    .select({
      post: posts,
      featured: media,
      author: {
        name: users.name,
        bio: users.bio,
        role: users.role,
        avatarMediaId: users.avatarMediaId,
      },
    })
    .from(posts)
    .leftJoin(media, eq(posts.featuredImageId, media.id))
    .leftJoin(users, eq(posts.authorId, users.id))
    .where(eq(posts.slug, slug))
    .limit(1);

  const row = rows[0];
  if (!row) return null;
  if (row.post.status !== "published") return null;
  if (row.post.publishedAt && row.post.publishedAt.getTime() > Date.now()) return null;

  // Avatar media (optional second join — keep separate to avoid duplicate media alias).
  let avatar: { url: string; alt: string; width: number | null; height: number | null; blurhash: string | null } | null = null;
  if (row.author?.avatarMediaId) {
    const avatarRows = await db
      .select({
        url: media.blobUrl,
        alt: media.alt,
        width: media.width,
        height: media.height,
        blurhash: media.blurhash,
      })
      .from(media)
      .where(eq(media.id, row.author.avatarMediaId))
      .limit(1);
    if (avatarRows[0]) avatar = avatarRows[0];
  }

  // Tags for this post.
  const tagRows = await db
    .select({ slug: tags.slug, name: tags.name })
    .from(postTags)
    .innerJoin(tags, eq(postTags.tagId, tags.id))
    .where(eq(postTags.postId, row.post.id));

  return {
    post: row.post,
    featured: row.featured
      ? {
          url: row.featured.blobUrl,
          alt: row.featured.alt,
          width: row.featured.width,
          height: row.featured.height,
          blurhash: row.featured.blurhash,
        }
      : null,
    author: row.author
      ? {
          name: row.author.name,
          bio: row.author.bio,
          role: row.author.role,
          avatar,
        }
      : null,
    tags: tagRows,
  };
}

/**
 * Like getPostFull but loads by id and does not filter on publish status.
 * Intended for admin-only preview rendering — callers must enforce auth.
 */
export async function getPostFullById(id: number) {
  if (!hasDatabase()) return null;

  const rows = await db
    .select({
      post: posts,
      featured: media,
      author: {
        name: users.name,
        bio: users.bio,
        role: users.role,
        avatarMediaId: users.avatarMediaId,
      },
    })
    .from(posts)
    .leftJoin(media, eq(posts.featuredImageId, media.id))
    .leftJoin(users, eq(posts.authorId, users.id))
    .where(eq(posts.id, id))
    .limit(1);

  const row = rows[0];
  if (!row) return null;

  let avatar: { url: string; alt: string; width: number | null; height: number | null; blurhash: string | null } | null = null;
  if (row.author?.avatarMediaId) {
    const avatarRows = await db
      .select({
        url: media.blobUrl,
        alt: media.alt,
        width: media.width,
        height: media.height,
        blurhash: media.blurhash,
      })
      .from(media)
      .where(eq(media.id, row.author.avatarMediaId))
      .limit(1);
    if (avatarRows[0]) avatar = avatarRows[0];
  }

  const tagRows = await db
    .select({ slug: tags.slug, name: tags.name })
    .from(postTags)
    .innerJoin(tags, eq(postTags.tagId, tags.id))
    .where(eq(postTags.postId, row.post.id));

  return {
    post: row.post,
    featured: row.featured
      ? {
          url: row.featured.blobUrl,
          alt: row.featured.alt,
          width: row.featured.width,
          height: row.featured.height,
          blurhash: row.featured.blurhash,
        }
      : null,
    author: row.author
      ? {
          name: row.author.name,
          bio: row.author.bio,
          role: row.author.role,
          avatar,
        }
      : null,
    tags: tagRows,
  };
}

export async function listPublishedSlugs() {
  if (!hasDatabase()) return [] as { slug: string; updatedAt: Date }[];
  return db
    .select({ slug: posts.slug, updatedAt: posts.updatedAt })
    .from(posts)
    .where(eq(posts.status, "published"));
}

export async function findDuplicateKeyword(keyword: string, excludeId: number) {
  if (!keyword.trim()) return [] as { id: number; slug: string; title: string }[];
  return db
    .select({ id: posts.id, slug: posts.slug, title: posts.title })
    .from(posts)
    .where(
      and(
        eq(posts.focusKeyword, keyword),
        eq(posts.status, "published"),
        ne(posts.id, excludeId),
      ),
    );
}

export async function findRedirect(fromPath: string) {
  "use cache";
  const { cacheTag } = await import("next/cache");
  cacheTag(`redirect:${fromPath}`);
  if (!hasDatabase()) return null;
  const rows = await db.select().from(redirects).where(eq(redirects.fromPath, fromPath)).limit(1);
  return rows[0] ?? null;
}

export async function listRedirects() {
  return db.select().from(redirects).orderBy(desc(redirects.createdAt));
}

export async function lookupRedirectsMap() {
  const rows = await db.select({ from: redirects.fromPath, to: redirects.toPath, status: redirects.status }).from(redirects);
  return new Map(rows.map((r) => [r.from, { to: r.to, status: r.status }] as const));
}

export type AdminPostRow = Awaited<ReturnType<typeof listPostsAdmin>>[number];
export type PublishedPostRow = Awaited<ReturnType<typeof listPublishedPosts>>[number];
