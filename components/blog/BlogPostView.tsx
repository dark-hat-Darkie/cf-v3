import Link from "next/link";
import { PostBody } from "@/components/blog/PostBody";
import { PostHero } from "@/components/blog/PostHero";
import { ReadingProgressBar } from "@/components/blog/ReadingProgressBar";
import { TableOfContents } from "@/components/blog/TableOfContents";
import { ShareButtons } from "@/components/blog/ShareButtons";
import { AuthorBio } from "@/components/blog/AuthorBio";
import { RelatedPosts } from "@/components/blog/RelatedPosts";
import { PostNavigation } from "@/components/blog/PostNavigation";
import { CodeCopyEnhancer } from "@/components/blog/CodeCopyEnhancer";
import { BlogHeader } from "@/components/blog/BlogHeader";
import { BlogFooter } from "@/components/blog/BlogFooter";
import { NewsletterSignup } from "@/components/blog/NewsletterSignup";
import { EndOfPostCTA } from "@/components/blog/EndOfPostCTA";
import type { TocHeading } from "@/lib/editor/toc";

export type BlogPostViewProps = {
  siteName: string;
  url: string;
  title: string;
  contentHtml: string;
  publishedDateLabel: string | null;
  readingTimeMinutes: number;
  featured: {
    url: string;
    alt: string;
    width: number | null;
    height: number | null;
    blurDataURL: string | null | undefined;
  } | null;
  author: {
    name: string;
    role: string;
    bio: string;
    avatar: {
      url: string;
      alt: string;
      width: number | null;
      height: number | null;
      blurDataURL: string | null | undefined;
    } | null;
  } | null;
  tags: { slug: string; name: string }[];
  toc: TocHeading[];
  related: React.ComponentProps<typeof RelatedPosts>["posts"];
  adjacency: React.ComponentProps<typeof PostNavigation>;
  jsonLd?: { article: unknown; breadcrumb: unknown };
};

export function BlogPostView(props: BlogPostViewProps) {
  const {
    siteName,
    url,
    title,
    contentHtml,
    publishedDateLabel,
    readingTimeMinutes,
    featured,
    author,
    tags,
    toc,
    related,
    adjacency,
    jsonLd,
  } = props;

  return (
    <div className="cf-blog-shell cf-blog-shell-with-header">
      <ReadingProgressBar />
      <BlogHeader />
      <div className="cf-blog-container">
        <nav className="cf-blog-nav">
          <Link href="/blog" className="cf-blog-back">← All posts</Link>
          <Link href="/" className="cf-blog-back">{siteName}</Link>
        </nav>

        <header className="cf-post-hero">
          <div className="cf-post-breadcrumb">
            <Link href="/">Home</Link> · <Link href="/blog">Blog</Link>
          </div>
          <h1 className="cf-post-title">{title}</h1>
          <div className="cf-post-meta">
            <span>{author?.name ?? siteName}</span>
            <span className="cf-post-meta-dot" />
            <span>{publishedDateLabel ?? ""}</span>
            <span className="cf-post-meta-dot" />
            <span>{readingTimeMinutes} min read</span>
          </div>
        </header>

        {featured ? (
          <PostHero
            src={featured.url}
            alt={featured.alt || title}
            width={featured.width ?? 1600}
            height={featured.height ?? 900}
            blurDataURL={featured.blurDataURL ?? undefined}
          />
        ) : null}

        <div className="cf-post-grid">
          <aside className="cf-post-aside-left" aria-hidden={toc.length === 0}>
            {toc.length > 0 ? (
              <div className="cf-post-sticky">
                <TableOfContents headings={toc} />
              </div>
            ) : null}
          </aside>

          <div className="cf-post-main">
            <PostBody html={contentHtml} />
            <CodeCopyEnhancer />

            <div className="cf-post-share-mobile">
              <ShareButtons url={url} title={title} variant="inline" />
            </div>

            {tags.length > 0 ? (
              <div className="cf-post-tags">
                {tags.map((t) => (
                  <Link
                    key={t.slug}
                    href={`/blog?tag=${encodeURIComponent(t.slug)}`}
                    className="cf-post-tag"
                  >
                    #{t.name}
                  </Link>
                ))}
              </div>
            ) : null}

            {author ? (
              <AuthorBio
                name={author.name}
                role={author.role}
                bio={author.bio}
                avatar={
                  author.avatar
                    ? {
                        url: author.avatar.url,
                        alt: author.avatar.alt,
                        width: author.avatar.width,
                        height: author.avatar.height,
                        blurDataURL: author.avatar.blurDataURL ?? undefined,
                      }
                    : null
                }
              />
            ) : null}
          </div>

          <aside className="cf-post-aside-right">
            <div className="cf-post-sticky">
              <ShareButtons url={url} title={title} variant="rail" />
            </div>
          </aside>
        </div>

        <EndOfPostCTA />

        <PostNavigation prev={adjacency.prev} next={adjacency.next} />
        <RelatedPosts posts={related} />

        <NewsletterSignup variant="wide" />

        <footer className="cf-post-footer">
          <Link href="/blog" className="cf-blog-back">← More from the blog</Link>
        </footer>
      </div>
      <BlogFooter />

      {jsonLd ? (
        <>
          <script
            type="application/ld+json"
            suppressHydrationWarning
            dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd.article) }}
          />
          <script
            type="application/ld+json"
            suppressHydrationWarning
            dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd.breadcrumb) }}
          />
        </>
      ) : null}
    </div>
  );
}
