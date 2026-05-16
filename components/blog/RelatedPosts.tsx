import { PostCard } from "@/components/blog/PostCard";
import type { PublishedPostRow } from "@/lib/content/queries";

type Props = {
  posts: PublishedPostRow[];
};

export function RelatedPosts({ posts }: Props) {
  if (!posts || posts.length === 0) return null;

  return (
    <section className="cf-related" aria-label="Related posts">
      <h2 className="cf-related-title">Keep reading</h2>
      <div className="cf-blog-grid">
        {posts.map((p) => (
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
      </div>
    </section>
  );
}
