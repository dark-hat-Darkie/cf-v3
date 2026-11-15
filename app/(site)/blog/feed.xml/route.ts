import { listPublishedPosts } from "@/lib/content/queries";

function siteUrl() {
  return (process.env.SITE_URL ?? "https://codeflee.com").replace(/\/$/, "");
}
function siteName() {
  return process.env.SITE_NAME ?? "CodeFlee";
}

function escape(s: string) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

export async function GET() {
  const base = siteUrl();
  const items = await listPublishedPosts({ limit: 30 });
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escape(siteName())}</title>
    <link>${base}/blog</link>
    <description>${escape(siteName())} — articles and field notes.</description>
    <language>en-us</language>
    <atom:link href="${base}/blog/feed.xml" rel="self" type="application/rss+xml" />
    ${items
      .map(
        (p) => `<item>
      <title>${escape(p.title)}</title>
      <link>${base}/blog/${p.slug}</link>
      <guid isPermaLink="true">${base}/blog/${p.slug}</guid>
      ${p.publishedAt ? `<pubDate>${p.publishedAt.toUTCString()}</pubDate>` : ""}
      <description>${escape(p.excerpt || "")}</description>
    </item>`,
      )
      .join("\n    ")}
  </channel>
</rss>`;
  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, max-age=600, stale-while-revalidate=3600",
    },
  });
}
