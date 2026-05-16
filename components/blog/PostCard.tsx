import Link from "next/link";
import Image from "next/image";

type Props = {
  slug: string;
  title: string;
  excerpt: string;
  publishedAt: Date | null;
  readingTime: number;
  featuredImage: { url: string; alt: string; width: number | null; height: number | null } | null;
};

function formatDate(d: Date | null) {
  if (!d) return "";
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export function PostCard({ slug, title, excerpt, publishedAt, readingTime, featuredImage }: Props) {
  return (
    <Link href={`/blog/${slug}`} className="cf-blog-card">
      <div className="cf-blog-card-img">
        {featuredImage ? (
          <Image
            src={featuredImage.url}
            alt={featuredImage.alt || title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 980px) 50vw, 380px"
            style={{ objectFit: "cover" }}
          />
        ) : null}
      </div>
      <div className="cf-blog-card-body">
        <div className="cf-blog-card-meta">{formatDate(publishedAt)} · {readingTime} min read</div>
        <h3 className="cf-blog-card-title">{title || "Untitled"}</h3>
        {excerpt ? <p className="cf-blog-card-excerpt">{excerpt}</p> : null}
        <div className="cf-blog-card-foot">
          <span>Read article</span>
          <span aria-hidden>→</span>
        </div>
      </div>
    </Link>
  );
}
