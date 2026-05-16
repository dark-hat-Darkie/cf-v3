import Link from "next/link";
import Image from "next/image";
import type { PublishedPostRow } from "@/lib/content/queries";

type Props = {
  post: PublishedPostRow;
};

function formatDate(d: Date | null) {
  if (!d) return "";
  return d.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
}

export function FeaturedPostHero({ post }: Props) {
  return (
    <Link href={`/blog/${post.slug}`} className="cf-blog-feature-hero" data-cursor="Read">
      <div className="cf-blog-feature-hero-img">
        {post.featuredImage ? (
          <Image
            src={post.featuredImage.url}
            alt={post.featuredImage.alt || post.title}
            fill
            sizes="(max-width: 980px) 100vw, 720px"
            style={{ objectFit: "cover" }}
            priority
          />
        ) : null}
      </div>
      <div className="cf-blog-feature-hero-body">
        <div className="cf-blog-feature-hero-eyebrow">Featured</div>
        <h2 className="cf-blog-feature-hero-title">{post.title || "Untitled"}</h2>
        {post.excerpt ? <p className="cf-blog-feature-hero-excerpt">{post.excerpt}</p> : null}
        <div className="cf-blog-feature-hero-meta">
          <span>{formatDate(post.publishedAt)}</span>
          {post.readingTimeMinutes ? (
            <>
              <span aria-hidden>·</span>
              <span>{post.readingTimeMinutes} min read</span>
            </>
          ) : null}
        </div>
        <span className="cf-blog-feature-hero-cta">
          Read the article <span aria-hidden>→</span>
        </span>
      </div>
    </Link>
  );
}
