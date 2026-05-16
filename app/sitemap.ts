import type { MetadataRoute } from "next";
import { cacheTag, cacheLife } from "next/cache";
import { listPublishedSlugs } from "@/lib/content/queries";

function siteUrl() {
  return (process.env.SITE_URL ?? "https://example.com").replace(/\/$/, "");
}

async function loadBlogSlugs() {
  "use cache";
  cacheLife("days");
  cacheTag("posts:index");
  return listPublishedSlugs();
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = siteUrl();
  const slugs = await loadBlogSlugs();
  const now = new Date();

  return [
    { url: `${base}/`, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${base}/blog`, lastModified: now, changeFrequency: "daily", priority: 0.8 },
    ...slugs.map((s) => ({
      url: `${base}/blog/${s.slug}`,
      lastModified: s.updatedAt,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })),
  ];
}
