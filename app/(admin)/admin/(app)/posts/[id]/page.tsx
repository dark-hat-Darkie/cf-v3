import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { connection } from "next/server";
import { getMediaById, getPostById } from "@/lib/content/queries";
import { PostEditor } from "@/components/admin/PostEditor";

async function resolveSiteOrigin(): Promise<string> {
  const envUrl = process.env.SITE_URL;
  if (envUrl) return envUrl.replace(/\/$/, "");
  const h = await headers();
  const host = h.get("x-forwarded-host") ?? h.get("host");
  const proto = h.get("x-forwarded-proto") ?? "http";
  if (host) return `${proto}://${host}`;
  return "http://localhost:4020";
}

export default async function EditorPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await connection();
  const { id } = await params;
  const postId = Number(id);
  if (!Number.isFinite(postId)) notFound();
  const post = await getPostById(postId);
  if (!post) notFound();

  const [featured, og, siteOrigin] = await Promise.all([
    post.featuredImageId ? getMediaById(post.featuredImageId) : null,
    post.ogImageId ? getMediaById(post.ogImageId) : null,
    resolveSiteOrigin(),
  ]);

  return (
    <PostEditor
      siteOrigin={siteOrigin}
      post={{
        id: post.id,
        slug: post.slug,
        title: post.title,
        content: post.content,
        excerpt: post.excerpt,
        revision: post.revision,
        status: post.status,
        publishedAt: post.publishedAt?.toISOString() ?? null,
        scheduledAt: post.scheduledAt?.toISOString() ?? null,
        focusKeyword: post.focusKeyword,
        metaTitle: post.metaTitle,
        metaDescription: post.metaDescription,
        ogTitle: post.ogTitle,
        ogDescription: post.ogDescription,
        twitterCard: post.twitterCard,
        canonical: post.canonical,
        robotsIndex: post.robotsIndex,
        robotsFollow: post.robotsFollow,
        schemaType: post.schemaType,
        readingTimeMinutes: post.readingTimeMinutes,
        wordCount: post.wordCount,
        seoScore: post.seoScore,
        readabilityScore: post.readabilityScore,
        isCornerstone: post.isCornerstone,
        featuredImage: featured
          ? { id: featured.id, url: featured.blobUrl, alt: featured.alt, width: featured.width, height: featured.height }
          : null,
        ogImage: og
          ? { id: og.id, url: og.blobUrl, alt: og.alt, width: og.width, height: og.height }
          : null,
      }}
    />
  );
}
