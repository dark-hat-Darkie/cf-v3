import { Suspense } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { headers } from "next/headers";
import { notFound, redirect } from "next/navigation";
import { connection } from "next/server";
import { getCurrentSession } from "@/lib/auth/session";
import { getPostFullById, getAdjacentPosts, listRelatedPosts } from "@/lib/content/queries";
import { BlogPostView } from "@/components/blog/BlogPostView";
import { extractToc, extractTocFromHtml } from "@/lib/editor/toc";
import { blurhashToDataUrl } from "@/lib/media/blur-data-url";
import { renderPostHtml } from "@/lib/editor/render.server";

export const metadata: Metadata = {
  title: "Preview — CodeFlee Admin",
  robots: { index: false, follow: false, noarchive: true },
};

function siteName() {
  return process.env.SITE_NAME ?? "CodeFlee";
}

async function resolveSiteOrigin(): Promise<string> {
  const envUrl = process.env.SITE_URL;
  if (envUrl) return envUrl.replace(/\/$/, "");
  const h = await headers();
  const host = h.get("x-forwarded-host") ?? h.get("host");
  const proto = h.get("x-forwarded-proto") ?? "http";
  if (host) return `${proto}://${host}`;
  return "http://localhost:4020";
}

function formatDate(d: Date) {
  return d.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
}

async function PreviewContent({ params }: { params: Promise<{ id: string }> }) {
  await connection();

  const sess = await getCurrentSession();
  if (!sess) redirect("/admin/login");

  const { id } = await params;
  const postId = Number(id);
  if (!Number.isFinite(postId)) notFound();

  const row = await getPostFullById(postId);
  if (!row) notFound();

  const p = row.post;
  const author = row.author;
  const featured = row.featured;
  const origin = await resolveSiteOrigin();
  const url = `${origin}/blog/${p.slug || "preview"}`;
  const contentHtml = renderPostHtml(p.content, origin);

  const [related, heroBlur, avatarBlur, adjacency] = await Promise.all([
    listRelatedPosts(p.id, 3),
    blurhashToDataUrl(featured?.blurhash),
    blurhashToDataUrl(author?.avatar?.blurhash),
    p.publishedAt
      ? getAdjacentPosts(p.publishedAt, p.id)
      : Promise.resolve({ prev: null, next: null }),
  ]);

  // Derive from the freshly rendered HTML so TOC anchors match the page; fall
  // back to the ProseMirror walk if the HTML has no heading IDs.
  const tocFromHtml = extractTocFromHtml(contentHtml);
  const toc = tocFromHtml.length > 0 ? tocFromHtml : extractToc(p.content);
  const publishedDateLabel = p.publishedAt
    ? formatDate(p.publishedAt)
    : formatDate(p.updatedAt);

  return (
    <>
      <div className="cf-preview-banner" role="status">
        <span className="cf-preview-banner-dot" />
        <strong>Preview</strong>
        <span className="cf-preview-banner-sep" />
        <span className={`cf-preview-banner-status cf-preview-banner-status-${p.status}`}>
          {p.status}
        </span>
        <span className="cf-preview-banner-sep" />
        <span className="cf-preview-banner-meta">
          Rev {p.revision} · last saved {p.updatedAt.toLocaleString()}
        </span>
        <span className="cf-preview-banner-spacer" />
        <Link href={`/admin/posts/${p.id}`} className="cf-preview-banner-btn">
          ← Back to editor
        </Link>
        {p.status === "published" && p.slug ? (
          <Link
            href={`/blog/${p.slug}`}
            target="_blank"
            rel="noopener"
            className="cf-preview-banner-btn"
          >
            Open live →
          </Link>
        ) : null}
      </div>

      <BlogPostView
        siteName={siteName()}
        url={url}
        title={p.title || "Untitled draft"}
        contentHtml={contentHtml}
        publishedDateLabel={publishedDateLabel}
        readingTimeMinutes={p.readingTimeMinutes || 1}
        featured={
          featured
            ? {
                url: featured.url,
                alt: featured.alt,
                width: featured.width,
                height: featured.height,
                blurDataURL: heroBlur,
              }
            : null
        }
        author={
          author
            ? {
                name: author.name,
                role: author.role,
                bio: author.bio,
                avatar: author.avatar
                  ? {
                      url: author.avatar.url,
                      alt: author.avatar.alt,
                      width: author.avatar.width,
                      height: author.avatar.height,
                      blurDataURL: avatarBlur,
                    }
                  : null,
              }
            : null
        }
        tags={row.tags}
        toc={toc}
        related={related}
        adjacency={adjacency}
      />
    </>
  );
}

function PreviewFallback() {
  return (
    <div className="cf-preview-banner" role="status" aria-busy="true">
      <span className="cf-preview-banner-dot" />
      <strong>Preview</strong>
      <span className="cf-preview-banner-sep" />
      <span className="cf-preview-banner-meta">Loading latest draft…</span>
    </div>
  );
}

export default function PostPreviewPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return (
    <Suspense fallback={<PreviewFallback />}>
      <PreviewContent params={params} />
    </Suspense>
  );
}
