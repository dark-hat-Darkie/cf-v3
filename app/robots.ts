import type { MetadataRoute } from "next";

function siteUrl() {
  return (process.env.SITE_URL ?? "https://codeflee.com").replace(/\/$/, "");
}

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin", "/api", "/preview"],
      },
    ],
    sitemap: `${siteUrl()}/sitemap.xml`,
  };
}
