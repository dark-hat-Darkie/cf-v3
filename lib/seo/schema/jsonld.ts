import "server-only";

export type ArticleSchemaInput = {
  url: string;
  type: "BlogPosting" | "Article" | "NewsArticle" | "HowTo";
  headline: string;
  description: string;
  imageUrl: string | null;
  author: { name: string; url?: string };
  publisher: { name: string; logoUrl?: string };
  datePublished: Date;
  dateModified: Date;
  keywords?: string[];
  wordCount: number;
};

export function articleJsonLd(input: ArticleSchemaInput): Record<string, unknown> {
  const base: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": input.type,
    mainEntityOfPage: { "@type": "WebPage", "@id": input.url },
    headline: input.headline.slice(0, 110),
    description: input.description,
    url: input.url,
    datePublished: input.datePublished.toISOString(),
    dateModified: input.dateModified.toISOString(),
    author: { "@type": "Person", name: input.author.name, ...(input.author.url ? { url: input.author.url } : {}) },
    publisher: {
      "@type": "Organization",
      name: input.publisher.name,
      ...(input.publisher.logoUrl
        ? { logo: { "@type": "ImageObject", url: input.publisher.logoUrl } }
        : {}),
    },
    wordCount: input.wordCount,
  };
  if (input.imageUrl) base.image = [input.imageUrl];
  if (input.keywords?.length) base.keywords = input.keywords.join(", ");
  return base;
}

export function breadcrumbJsonLd(
  parts: { name: string; url: string }[],
): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: parts.map((p, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: p.name,
      item: p.url,
    })),
  };
}

export type BlogIndexSchemaInput = {
  url: string;
  name: string;
  description: string;
  publisherName: string;
  posts: {
    slug: string;
    title: string;
    excerpt: string;
    publishedAt: Date | null;
    imageUrl: string | null;
  }[];
};

export function blogIndexJsonLd(input: BlogIndexSchemaInput): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "Blog",
    "@id": input.url,
    name: input.name,
    description: input.description,
    url: input.url,
    publisher: { "@type": "Organization", name: input.publisherName },
    blogPost: input.posts.map((p) => ({
      "@type": "BlogPosting",
      headline: p.title.slice(0, 110),
      description: p.excerpt,
      url: `${input.url}/${p.slug}`.replace(/\/+/g, "/").replace(":/", "://"),
      ...(p.publishedAt ? { datePublished: p.publishedAt.toISOString() } : {}),
      ...(p.imageUrl ? { image: [p.imageUrl] } : {}),
    })),
  };
}
