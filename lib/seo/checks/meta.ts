import type { AnalysisInput, CheckResult } from "../types";
import { STOP_WORDS_EN } from "../nlp/stop-words.en";

function r(id: string, severity: CheckResult["severity"], score: number, message: string, why?: string, fix?: CheckResult["fix"]): CheckResult {
  return { id, category: "seo", severity, score, message, why, fix };
}

export function checkTitleLength(input: AnalysisInput): CheckResult {
  const title = input.metaTitle || input.title;
  const len = title.length;
  if (len === 0) return r("title-length", "bad", 0, "SEO title is empty.", "A descriptive title is the single most important on-page SEO signal.");
  if (len < 30) return r("title-length", "warn", 30, `Title is short (${len} chars).`, "Aim for 50–60 chars to better fill the SERP listing.");
  if (len <= 60) return r("title-length", "good", 100, `Title length is ${len} — looks great.`);
  if (len <= 70) return r("title-length", "warn", 60, `Title is long (${len} chars). Google may truncate above ~60.`);
  return r("title-length", "bad", 20, `Title is too long (${len} chars). Google will truncate.`);
}

export function checkMetaDescLength(input: AnalysisInput): CheckResult {
  const len = input.metaDescription.length;
  if (len === 0) return r("meta-length", "bad", 0, "Meta description is empty.", "Write a compelling description (120–158 chars) — it influences click-through rate.");
  if (len < 120) return r("meta-length", "warn", 50, `Meta description is short (${len} chars).`, "Use closer to 150 chars to use the available space.");
  if (len <= 158) return r("meta-length", "good", 100, `Meta description length is ${len} — looks great.`);
  if (len <= 175) return r("meta-length", "warn", 60, `Meta description is long (${len} chars) — may truncate.`);
  return r("meta-length", "bad", 20, `Meta description is too long (${len} chars).`);
}

export function checkSlugLength(input: AnalysisInput): CheckResult {
  const len = input.slug.length;
  if (len < 3) return r("slug-length", "bad", 0, "Slug is too short.");
  if (len > 75) return r("slug-length", "warn", 40, `Slug is long (${len} chars). Aim for under 75.`);
  return r("slug-length", "good", 100, `Slug length is ${len} — good.`);
}

export function checkSlugFormat(input: AnalysisInput): CheckResult {
  if (!/^[a-z0-9-]+$/.test(input.slug))
    return r("slug-format", "bad", 0, "Slug contains characters other than lowercase letters, numbers, and hyphens.");
  if (/--/.test(input.slug)) return r("slug-format", "warn", 60, "Slug has consecutive hyphens.");
  if (/^-|-$/.test(input.slug)) return r("slug-format", "bad", 0, "Slug starts or ends with a hyphen.");
  return r("slug-format", "good", 100, "Slug format is clean.");
}

export function checkSlugStopWords(input: AnalysisInput): CheckResult {
  const tokens = input.slug.split("-").filter(Boolean);
  const stops = tokens.filter((t) => STOP_WORDS_EN.has(t));
  if (stops.length === 0) return r("slug-stop", "good", 100, "No stop-words in the slug.");
  return r("slug-stop", "warn", 60, `Slug contains stop-words: ${stops.join(", ")}.`, "Remove stop-words like “the”, “and”, “of” to keep slugs lean.");
}

export function checkMetaTitleVsTitle(input: AnalysisInput): CheckResult {
  if (!input.title) return r("meta-title-fallback", "neutral", 0, "Skipped — no post title.");
  if (input.metaTitle) return r("meta-title-fallback", "good", 100, "SEO title is explicitly set.");
  return r("meta-title-fallback", "warn", 50, "No SEO title set — falling back to the post title.", "Write a separate SEO title that's optimized for SERPs even if your post title is decorative.");
}

export function metaChecks(input: AnalysisInput): CheckResult[] {
  return [
    checkTitleLength(input),
    checkMetaDescLength(input),
    checkSlugLength(input),
    checkSlugFormat(input),
    checkSlugStopWords(input),
    checkMetaTitleVsTitle(input),
  ];
}
