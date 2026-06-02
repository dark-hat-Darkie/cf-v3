import type { MetadataRoute } from "next";
import { cacheTag, cacheLife } from "next/cache";
import { listPublishedSlugs } from "@/lib/content/queries";
import { CASE_STUDIES } from "@/lib/case-studies-data";
import { SERVICES } from "@/lib/services-data";

function siteUrl() {
  return (process.env.SITE_URL ?? "https://codeflee.com").replace(/\/$/, "");
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
    ...SERVICES.map((s) => ({
      url: `${base}/services/${s.slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
    ...CASE_STUDIES.map((c) => ({
      url: `${base}/case-studies/${c.slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
    ...slugs.map((s) => ({
      url: `${base}/blog/${s.slug}`,
      lastModified: s.updatedAt,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })),
    ...["privacy", "terms", "cookies"].map((p) => ({
      url: `${base}/${p}`,
      lastModified: now,
      changeFrequency: "yearly" as const,
      priority: 0.3,
    })),
  ];
}
