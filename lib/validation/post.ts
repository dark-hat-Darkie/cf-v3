import { z } from "zod";

/**
 * ProseMirror documents have a deeply nested, dynamic shape that's a bad fit
 * for strict Zod validation. The editor (TipTap with our shared schema)
 * already produces valid docs, and the server-side renderer (`@tiptap/html`)
 * validates against the same schema before generating HTML. So here we only
 * sanity-check the outer shape and bound the size — full structural
 * validation happens at render time.
 */
const MAX_DOC_BYTES = 2 * 1024 * 1024; // 2 MB

export const proseMirrorDoc = z
  .unknown()
  .refine((v): v is { type: "doc" } => {
    return (
      typeof v === "object" &&
      v !== null &&
      // @ts-expect-error narrow at runtime
      v.type === "doc"
    );
  }, { message: "Document must have type 'doc'" })
  .refine((v) => {
    try {
      const size = JSON.stringify(v).length;
      return size <= MAX_DOC_BYTES;
    } catch {
      return false;
    }
  }, { message: `Document exceeds ${MAX_DOC_BYTES} bytes` });

export type ProseMirrorDoc = { type: "doc"; content?: unknown[] };

export const saveDraftSchema = z.object({
  postId: z.number().int().positive(),
  revision: z.number().int().nonnegative(),
  title: z.string().max(500),
  content: proseMirrorDoc,
});

export const updateMetaSchema = z.object({
  postId: z.number().int().positive(),
  slug: z.string().min(1).max(200).optional(),
  excerpt: z.string().max(600).optional(),
  focusKeyword: z.string().max(120).optional(),
  metaTitle: z.string().max(200).optional(),
  metaDescription: z.string().max(400).optional(),
  ogTitle: z.string().max(200).optional(),
  ogDescription: z.string().max(400).optional(),
  ogImageId: z.number().int().positive().nullable().optional(),
  twitterCard: z.enum(["summary", "summary_large_image"]).optional(),
  canonical: z.string().max(500).optional(),
  robotsIndex: z.boolean().optional(),
  robotsFollow: z.boolean().optional(),
  schemaType: z.enum(["BlogPosting", "Article", "NewsArticle", "HowTo"]).optional(),
  featuredImageId: z.number().int().positive().nullable().optional(),
  isCornerstone: z.boolean().optional(),
});
