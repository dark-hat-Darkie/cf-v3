import slugifier from "github-slugger";
import { STOP_WORDS_EN } from "./nlp/stop-words.en";

const slugger = new slugifier();

/**
 * Generate a meta description from the first paragraph: trim to ~158 chars but
 * stop at the last sentence boundary so the snippet reads cleanly.
 */
export function metaFromFirstParagraph(firstParagraph: string, limit = 158): string {
  if (!firstParagraph) return "";
  const cleaned = firstParagraph.trim().replace(/\s+/g, " ");
  if (cleaned.length <= limit) return cleaned;

  // Trim to limit, then back up to last sentence-ending punctuation if close
  const slice = cleaned.slice(0, limit + 1);
  const lastPunct = Math.max(
    slice.lastIndexOf("."),
    slice.lastIndexOf("!"),
    slice.lastIndexOf("?"),
  );
  if (lastPunct >= limit - 40) {
    return slice.slice(0, lastPunct + 1).trim();
  }
  // Otherwise back up to last word boundary
  const lastSpace = slice.lastIndexOf(" ");
  return (lastSpace > 0 ? slice.slice(0, lastSpace) : slice.slice(0, limit)).trim() + "…";
}

/**
 * Suggest alt text from a filename. Strips common prefixes/suffixes,
 * converts kebab/snake to spaces, removes hash suffixes.
 */
export function altTextFromFilename(urlOrName: string): string {
  let base = urlOrName.split("/").pop() ?? urlOrName;
  base = base.replace(/\.[a-z0-9]+$/i, "");
  // Strip Vercel Blob random suffix like -aB12XYz
  base = base.replace(/-[a-zA-Z0-9]{6,}$/g, "");
  // Strip ms-epoch prefix like "lzr92m-"
  base = base.replace(/^[a-z0-9]{6,8}-/i, "");
  // Strip "img/photo/pic" prefixes
  base = base.replace(/^(img|image|photo|pic|screen-?shot|sc|fig)[-_\s]*\d*[-_\s]*/i, "");
  // kebab/snake to spaces
  base = base.replace(/[-_]+/g, " ").replace(/\s+/g, " ").trim();
  if (!base) return "";
  // Sentence case
  return base.charAt(0).toUpperCase() + base.slice(1).toLowerCase();
}

/**
 * Generate a SEO-optimal slug from a title plus optional focus keyword.
 * - Strips stop words
 * - Ensures the focus keyphrase is present (prepends if missing)
 * - Caps to ~75 chars at a word boundary
 */
export function smartSlug(title: string, focusKeyword?: string, max = 70): string {
  const kw = focusKeyword?.trim() ?? "";
  const titleSlug = slugger.slug(title || kw || "untitled");
  if (!titleSlug) return "untitled";

  const tokens = titleSlug.split("-").filter((t) => t && !STOP_WORDS_EN.has(t));
  let core = tokens.join("-");
  if (!core) core = titleSlug;

  if (kw) {
    const kwSlug = slugger.slug(kw);
    if (kwSlug && !core.includes(kwSlug)) {
      core = `${kwSlug}-${core}`;
    }
  }

  // Cap length at word boundary
  if (core.length <= max) return core;
  const truncated = core.slice(0, max);
  const lastHyphen = truncated.lastIndexOf("-");
  return lastHyphen > max * 0.7 ? truncated.slice(0, lastHyphen) : truncated;
}

const TITLE_CASE_SMALL = new Set([
  "a","an","and","as","at","but","by","for","if","in","nor","of","on","or","per","so","the","to","up","via","yet",
]);
export function titleCase(s: string): string {
  const words = s.split(/\s+/);
  return words
    .map((w, i) => {
      const lower = w.toLowerCase();
      if (i !== 0 && i !== words.length - 1 && TITLE_CASE_SMALL.has(lower)) return lower;
      return w.charAt(0).toUpperCase() + w.slice(1).toLowerCase();
    })
    .join(" ");
}

export function sentenceCase(s: string): string {
  if (!s) return s;
  return s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();
}
