import "server-only";
import type { Post } from "@/db/schema";
import { extractPlainText } from "@/lib/editor/render.server";
import { buildStructure } from "./context";
import { analyze } from "./analyzer";
import type { AnalysisInput } from "./types";

type ImageRef = { url: string; alt: string; width: number | null; height: number | null } | null;

export type PostScoreInput = Pick<
  Post,
  | "id"
  | "title"
  | "slug"
  | "excerpt"
  | "content"
  | "plainText"
  | "wordCount"
  | "focusKeyword"
  | "secondaryKeywords"
  | "metaTitle"
  | "metaDescription"
  | "ogTitle"
  | "ogDescription"
  | "twitterCard"
  | "canonical"
  | "robotsIndex"
  | "robotsFollow"
  | "schemaType"
  | "isCornerstone"
> & {
  featuredImage?: ImageRef;
  ogImage?: ImageRef;
  /** Other posts (excluding this one) that share this focus keyword. Optional;
   *  list-view callers may pass [] to skip an extra DB roundtrip per row. */
  cannibalization?: { id: number; slug: string; title: string }[];
  siteOrigin?: string;
};

function siteOrigin(input: PostScoreInput): string {
  return input.siteOrigin ?? process.env.SITE_URL ?? "https://example.com";
}

export function computePostScores(input: PostScoreInput): {
  seoScore: number;
  readabilityScore: number;
} {
  const origin = siteOrigin(input);

  // Trust persisted plainText/wordCount when present, fall back to recomputing.
  const plainText = input.plainText && input.plainText.length > 0
    ? input.plainText
    : extractPlainText(input.content);
  const wordCount =
    typeof input.wordCount === "number" && input.wordCount > 0
      ? input.wordCount
      : plainText.trim()
        ? plainText.trim().split(/\s+/).length
        : 0;

  const structure = buildStructure(input.content, plainText, origin);

  const analysisInput: AnalysisInput = {
    postId: input.id,
    title: input.title,
    slug: input.slug,
    excerpt: input.excerpt,
    metaTitle: input.metaTitle,
    metaDescription: input.metaDescription,
    focusKeyword: input.focusKeyword,
    secondaryKeywords: input.secondaryKeywords,
    content: input.content,
    plainText,
    wordCount,
    ogTitle: input.ogTitle,
    ogDescription: input.ogDescription,
    ogImage: input.ogImage ?? null,
    featuredImage: input.featuredImage ?? null,
    twitterCard: input.twitterCard,
    canonical: input.canonical,
    robotsIndex: input.robotsIndex,
    robotsFollow: input.robotsFollow,
    schemaType: input.schemaType,
    isCornerstone: input.isCornerstone,
    cannibalization: input.cannibalization ?? [],
    structure,
    siteOrigin: origin,
  };

  const result = analyze(analysisInput);
  return {
    seoScore: result.seo.score,
    readabilityScore: result.readability.score,
  };
}
