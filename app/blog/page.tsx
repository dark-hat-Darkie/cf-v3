import type { Metadata } from "next";
import Link from "next/link";
import { cacheTag, cacheLife } from "next/cache";
import {
  listPublishedPosts,
  countPublishedPosts,
  listPublishedTags,
} from "@/lib/content/queries";
import { PostCard } from "@/components/blog/PostCard";
import { FeaturedPostHero } from "@/components/blog/FeaturedPostHero";
import { TagFilterChips } from "@/components/blog/TagFilterChips";
import { Pagination } from "@/components/blog/Pagination";
import { BlogHeader } from "@/components/blog/BlogHeader";
import { BlogFooter } from "@/components/blog/BlogFooter";
import { NewsletterSignup } from "@/components/blog/NewsletterSignup";
import { blogIndexJsonLd, breadcrumbJsonLd } from "@/lib/seo/schema/jsonld";

const PAGE_SIZE = 12;

function siteUrl() {
  return (process.env.SITE_URL ?? "https://example.com").replace(/\/$/, "");
}

function siteName() {
  return process.env.SITE_NAME ?? "Codeflee";
}

async function loadIndex(tag: string | undefined, offset: number, limit: number) {
  "use cache";
  cacheLife("days");
  cacheTag("posts:index");
  return listPublishedPosts({ tag, offset, limit });
}

async function loadCount(tag: string | undefined) {
  "use cache";
  cacheLife("days");
  cacheTag("posts:index");
  return countPublishedPosts({ tag });
}

async function loadTags() {
  "use cache";
  cacheLife("days");
  cacheTag("posts:index");
  return listPublishedTags();
}

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ tag?: string; page?: string }>;
}): Promise<Metadata> {
  const { tag } = await searchParams;
  const base = `${siteUrl()}/blog`;
  const baseTitle = `Blog | CodeFlee`;
  const rssTypes = { "application/rss+xml": `${siteUrl()}/blog/feed.xml` };

  if (tag) {
    const tags = await loadTags();
    const match = tags.find((t) => t.slug === tag);
    const tagName = match?.name ?? tag;
    const title = `${tagName} · Blog | CodeFlee`;
    const description = `Posts tagged ${tagName} — engineering, design, and craft from the ${siteName()} team.`;
    const canonical = `${base}?tag=${encodeURIComponent(tag)}`;
    return {
      title,
      description,
      keywords: [tagName, "engineering", "design", "software", siteName()].filter(Boolean),
      alternates: { canonical, types: rssTypes },
      openGraph: {
        title,
        description,
        type: "website",
        url: canonical,
        siteName: siteName(),
        locale: "en_US",
      },
      twitter: { card: "summary_large_image", title, description },
    };
  }

  const description =
    "Thinking out loud on engineering craft, design systems, content strategy, and what we ship.";

  return {
    title: baseTitle,
    description,
    keywords: ["engineering blog", "design systems", "software studio", "Dhaka", siteName()],
    alternates: { canonical: base, types: rssTypes },
    openGraph: {
      title: baseTitle,
      description,
      type: "website",
      url: base,
      siteName: siteName(),
      locale: "en_US",
    },
    twitter: { card: "summary_large_image", title: baseTitle, description },
  };
}

export default async function BlogIndex({
  searchParams,
}: {
  searchParams: Promise<{ tag?: string; page?: string }>;
}) {
  const sp = await searchParams;
  const tag = sp.tag?.trim() || undefined;
  const pageNum = Math.max(1, Number.parseInt(sp.page ?? "1", 10) || 1);
  const offset = (pageNum - 1) * PAGE_SIZE;

  const [posts, total, tags] = await Promise.all([
    loadIndex(tag, offset, PAGE_SIZE),
    loadCount(tag),
    loadTags(),
  ]);

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const showFeatured = pageNum === 1 && !tag && posts.length > 0;
  const featured = showFeatured ? posts[0] : null;
  const rest = featured ? posts.slice(1) : posts;

  const matchedTag = tag ? tags.find((t) => t.slug === tag) : null;

  const blogSchema = blogIndexJsonLd({
    url: `${siteUrl()}/blog`,
    name: matchedTag ? `${matchedTag.name} · Blog — ${siteName()}` : `Blog — ${siteName()}`,
    description: matchedTag
      ? `Posts tagged ${matchedTag.name} from the ${siteName()} team.`
      : "Engineering, design, and craft from the studio.",
    publisherName: siteName(),
    posts: posts.slice(0, 10).map((p) => ({
      slug: p.slug,
      title: p.title,
      excerpt: p.excerpt ?? "",
      publishedAt: p.publishedAt,
      imageUrl: p.featuredImage?.url ?? null,
    })),
  });

  const breadcrumbSchema = breadcrumbJsonLd([
    { name: "Home", url: siteUrl() },
    { name: "Blog", url: `${siteUrl()}/blog` },
    ...(matchedTag ? [{ name: matchedTag.name, url: `${siteUrl()}/blog?tag=${matchedTag.slug}` }] : []),
  ]);

  return (
    <div className="cf-blog-shell cf-blog-shell-with-header">
      <BlogHeader />
      <div className="cf-blog-container">
        <header className="cf-blog-hero">
          <p className="cf-blog-hero-eyebrow">
            {matchedTag ? `Tagged · ${matchedTag.name}` : `${siteName()} · Studio Notes`}
          </p>
          <h1 className="cf-blog-hero-title">
            {matchedTag ? matchedTag.name : "The Blog."}
          </h1>
          <p className="cf-blog-hero-sub">
            {matchedTag
              ? `Every published post tagged “${matchedTag.name}.”`
              : "Field notes on shipping software well — content strategy, design systems, performance, and what we learned the hard way."}
          </p>
          <div className="cf-blog-hero-actions">
            <Link href="/#contact" className="cf-btn-primary" data-cursor="Get in touch">
              Book a discovery call <span aria-hidden>→</span>
            </Link>
            <Link href="/blog/feed.xml" className="cf-btn-ghost" data-cursor="Subscribe">
              Subscribe via RSS
            </Link>
          </div>
        </header>

        <TagFilterChips tags={tags} current={tag ?? null} />

        {posts.length === 0 ? (
          <div className="cf-empty-state">
            {tag
              ? `No posts tagged “${matchedTag?.name ?? tag}” yet.`
              : "No posts yet. Check back soon."}
          </div>
        ) : (
          <>
            {featured ? <FeaturedPostHero post={featured} /> : null}

            {rest.length > 0 ? (
              <section className="cf-blog-grid">
                {rest.map((p) => (
                  <PostCard
                    key={p.id}
                    slug={p.slug}
                    title={p.title}
                    excerpt={p.excerpt}
                    publishedAt={p.publishedAt}
                    readingTime={p.readingTimeMinutes}
                    featuredImage={p.featuredImage}
                  />
                ))}
              </section>
            ) : null}

            <Pagination
              page={pageNum}
              totalPages={totalPages}
              basePath="/blog"
              query={tag ? { tag } : {}}
            />
          </>
        )}

        <NewsletterSignup variant="wide" />
      </div>
      <BlogFooter />

      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogSchema) }}
      />
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
    </div>
  );
}
