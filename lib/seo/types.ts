import type { JSONContent } from "@tiptap/core";

export type Severity = "good" | "warn" | "bad" | "neutral";

export type CheckCategory = "seo" | "readability" | "schema";

export type CheckResult = {
  id: string;
  category: CheckCategory;
  severity: Severity;
  /** weight in 0..100 for aggregate score; 0 = informational only */
  score: number;
  message: string;
  why?: string;
  fix?: { kind: "client"; label: string; intent: string };
};

export type AnalysisInput = {
  postId: number;
  title: string;
  slug: string;
  excerpt: string;
  metaTitle: string;
  metaDescription: string;
  focusKeyword: string;
  secondaryKeywords: string[];
  content: JSONContent;
  plainText: string;
  wordCount: number;
  ogTitle: string;
  ogDescription: string;
  ogImage?: { url: string; alt: string; width: number | null; height: number | null } | null;
  featuredImage?: { url: string; alt: string; width: number | null; height: number | null } | null;
  twitterCard: "summary" | "summary_large_image";
  canonical: string;
  robotsIndex: boolean;
  robotsFollow: boolean;
  schemaType: string;
  isCornerstone: boolean;
  /** Posts (other than this one) that already use this focus keyword */
  cannibalization: { id: number; slug: string; title: string }[];
  /** Pre-computed structural extracts (see context.ts) */
  structure: {
    headings: { level: number; text: string }[];
    paragraphs: string[]; // plain text per paragraph
    sentences: string[];
    links: { href: string; text: string; isExternal: boolean; rel: string | null }[];
    images: { src: string; alt: string }[];
    firstParagraphText: string;
  };
  siteOrigin: string;
};

export type CategoryScore = { category: CheckCategory; score: number; results: CheckResult[] };
export type AnalysisOutput = {
  seo: CategoryScore;
  readability: CategoryScore;
  schema: CategoryScore;
  overall: number;
};
