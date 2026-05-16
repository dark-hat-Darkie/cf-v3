import type { Metadata } from "next";
import { notFound, redirect, permanentRedirect } from "next/navigation";
import { cacheTag, cacheLife } from "next/cache";
import { findRedirect, getPostFull, listRelatedPosts, getAdjacentPosts, listPublishedSlugs } from "@/lib/content/queries";
import { BlogPostView } from "@/components/blog/BlogPostView";
import { extractToc } from "@/lib/editor/toc";
import { blurhashToDataUrl } from "@/lib/media/blur-data-url";
import { articleJsonLd, breadcrumbJsonLd } from "@/lib/seo/schema/jsonld";

function siteUrl() {
  return (process.env.SITE_URL ?? "https://example.com").replace(/\/$/, "");
}

function siteName() {
  return process.env.SITE_NAME ?? "Codeflee";
}

async function loadPost(slug: string) {
  "use cache";
  cacheLife("days");
  cacheTag(`post:${slug}`);
  return getPostFull(slug);
}

async function loadAdjacent(publishedAt: Date, id: number) {
  "use cache";
  cacheLife("days");
  cacheTag("posts:index");
  return getAdjacentPosts(publishedAt, id);
}

async function loadRelated(id: number) {
  "use cache";
  cacheLife("days");
  cacheTag("posts:index");
  return listRelatedPosts(id, 3);
}

// Pre-render every published slug at build time. New posts published after
// deploy still render on-demand and are cached for 24h via cacheLife above.
export async function generateStaticParams() {
  const rows = await listPublishedSlugs();
  return rows.map((r) => ({ slug: r.slug }));
}

function formatDate(d: Date) {
  return d.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const row = await loadPost(slug);
  if (!row) return { title: "Not found" };
  const p = row.post;
  const url = `${siteUrl()}/blog/${p.slug}`;
  const title = p.metaTitle || p.title;
  const description = p.metaDescription || p.excerpt || "";
  const ogImage = row.featured?.url ?? null;
  const keywords = [p.focusKeyword, ...(p.secondaryKeywords ?? []), ...row.tags.map((t) => t.name)]
    .filter(Boolean)
    .filter((v, i, a) => a.indexOf(v) === i);
  return {
    title: `${title} | CodeFlee`,
    description,
    keywords: keywords.length ? keywords : undefined,
    authors: row.author ? [{ name: row.author.name }] : undefined,
    alternates: {
      canonical: p.canonical || url,
      types: { "application/rss+xml": `${siteUrl()}/blog/feed.xml` },
    },
    robots: {
      index: p.robotsIndex,
      follow: p.robotsFollow,
    },
    openGraph: {
      title: p.ogTitle || title,
      description: p.ogDescription || description,
      type: "article",
      url,
      siteName: siteName(),
      locale: "en_US",
      publishedTime: p.publishedAt?.toISOString(),
      modifiedTime: p.updatedAt.toISOString(),
      authors: row.author ? [row.author.name] : undefined,
      tags: row.tags.map((t) => t.name),
      ...(ogImage
        ? {
            images: [
              {
                url: ogImage,
                width: row.featured?.width ?? undefined,
                height: row.featured?.height ?? undefined,
                alt: row.featured?.alt ?? title,
              },
            ],
          }
        : {}),
    },
    twitter: {
      card: p.twitterCard,
      title: p.ogTitle || title,
      description: p.ogDescription || description,
      ...(ogImage ? { images: [ogImage] } : {}),
    },
  };
}

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const row = await loadPost(slug);
  if (!row) {
    const r = await findRedirect(`/blog/${slug}`);
    if (r) {
      if (r.status === 301) permanentRedirect(r.toPath);
      redirect(r.toPath);
    }
    notFound();
  }

  const p = row.post;
  const author = row.author;
  const featured = row.featured;
  const url = `${siteUrl()}/blog/${p.slug}`;
  const publishedAt = p.publishedAt ?? p.createdAt;

  const [adjacency, related, heroBlur, avatarBlur] = await Promise.all([
    loadAdjacent(publishedAt, p.id),
    loadRelated(p.id),
    blurhashToDataUrl(featured?.blurhash),
    blurhashToDataUrl(author?.avatar?.blurhash),
  ]);

  const toc = extractToc(p.content);

  const articleSchema = articleJsonLd({
    url: p.canonical || url,
    type: p.schemaType,
    headline: p.metaTitle || p.title,
    description: p.metaDescription || p.excerpt || "",
    imageUrl: featured?.url ?? null,
    author: { name: author?.name ?? siteName() },
    publisher: { name: siteName() },
    datePublished: p.publishedAt ?? p.createdAt,
    dateModified: p.updatedAt,
    keywords: [p.focusKeyword, ...(p.secondaryKeywords ?? [])].filter(Boolean),
    wordCount: p.wordCount,
  });

  const breadcrumbSchema = breadcrumbJsonLd([
    { name: "Home", url: siteUrl() },
    { name: "Blog", url: `${siteUrl()}/blog` },
    { name: p.title, url },
  ]);

  return (
    <BlogPostView
      siteName={siteName()}
      url={url}
      title={p.title}
      contentHtml={p.contentHtml}
      publishedDateLabel={p.publishedAt ? formatDate(p.publishedAt) : null}
      readingTimeMinutes={p.readingTimeMinutes}
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
      jsonLd={{ article: articleSchema, breadcrumb: breadcrumbSchema }}
    />
  );
}
