import { cacheTag, cacheLife } from "next/cache";
import Blog, { type HomepageBlogPost } from "./Blog";
import { listPublishedPosts } from "@/lib/content/queries";

async function loadHomepagePosts(): Promise<HomepageBlogPost[]> {
  "use cache";
  cacheLife("days");
  cacheTag("posts:index");
  try {
    const rows = await listPublishedPosts({ limit: 3 });
    return rows.map((r) => ({
      slug: r.slug,
      title: r.title,
      publishedAt: r.publishedAt,
      focusKeyword: r.focusKeyword,
      featuredImage: r.featuredImage,
    }));
  } catch {
    // Fall back to placeholder cards if DB isn't reachable (e.g. local dev without env).
    return [];
  }
}

export default async function BlogHomepage() {
  const posts = await loadHomepagePosts();
  return <Blog posts={posts} />;
}
