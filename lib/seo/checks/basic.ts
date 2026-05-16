import type { AnalysisInput, CheckResult } from "../types";
import { countKeyphraseStem, findKeyphraseRanges } from "../nlp/stem";

function r(id: string, severity: CheckResult["severity"], score: number, message: string, why?: string, fix?: CheckResult["fix"]): CheckResult {
  return { id, category: "seo", severity, score, message, why, fix };
}

export function checkFocusKeywordSet(input: AnalysisInput): CheckResult {
  if (!input.focusKeyword.trim()) {
    return r("kw-set", "bad", 0, "No focus keyphrase set.", "Set the keyphrase you want this post to rank for.");
  }
  return r("kw-set", "good", 100, "Focus keyphrase is set.");
}

export function checkKeywordInTitle(input: AnalysisInput): CheckResult {
  if (!input.focusKeyword) return r("kw-in-title", "neutral", 0, "Skipped — no focus keyphrase.");
  const title = input.metaTitle || input.title;
  const has = countKeyphraseStem(title, input.focusKeyword) > 0;
  return has
    ? r("kw-in-title", "good", 100, "Focus keyphrase appears in the SEO title.")
    : r("kw-in-title", "bad", 0, "Focus keyphrase is not in the SEO title.", "Add the focus keyphrase to the SEO title — ideally near the start.");
}

export function checkKeywordEarlyInTitle(input: AnalysisInput): CheckResult {
  if (!input.focusKeyword) return r("kw-early-title", "neutral", 0, "Skipped — no focus keyphrase.");
  const title = input.metaTitle || input.title;
  const ranges = findKeyphraseRanges(title, input.focusKeyword);
  if (ranges.length === 0) return r("kw-early-title", "bad", 0, "Focus keyphrase missing from title.");
  const ratio = ranges[0].start / Math.max(1, title.length);
  if (ratio <= 0.4) return r("kw-early-title", "good", 100, "Keyphrase is near the start of the title.");
  if (ratio <= 0.6) return r("kw-early-title", "warn", 60, "Keyphrase appears late in the title.", "Move the keyphrase to the first 40% of the title for better click-through.");
  return r("kw-early-title", "warn", 30, "Keyphrase is at the end of the title.");
}

export function checkKeywordInMeta(input: AnalysisInput): CheckResult {
  if (!input.focusKeyword) return r("kw-in-meta", "neutral", 0, "Skipped — no focus keyphrase.");
  const has = countKeyphraseStem(input.metaDescription, input.focusKeyword) > 0;
  return has
    ? r("kw-in-meta", "good", 100, "Keyphrase appears in the meta description.")
    : r("kw-in-meta", "bad", 0, "Keyphrase is not in the meta description.", "Include the keyphrase naturally in the meta description.");
}

export function checkKeywordInSlug(input: AnalysisInput): CheckResult {
  if (!input.focusKeyword) return r("kw-in-slug", "neutral", 0, "Skipped — no focus keyphrase.");
  const slugTokens = input.slug.split("-").filter(Boolean).join(" ");
  const has = countKeyphraseStem(slugTokens, input.focusKeyword) > 0;
  return has
    ? r("kw-in-slug", "good", 100, "Keyphrase appears in the URL slug.")
    : r("kw-in-slug", "warn", 30, "Keyphrase is not in the slug.", "Including the keyphrase in the slug helps relevance signals.");
}

export function checkKeywordInFirstParagraph(input: AnalysisInput): CheckResult {
  if (!input.focusKeyword) return r("kw-first-p", "neutral", 0, "Skipped — no focus keyphrase.");
  const has = countKeyphraseStem(input.structure.firstParagraphText, input.focusKeyword) > 0;
  return has
    ? r("kw-first-p", "good", 100, "Keyphrase appears in the first paragraph.")
    : r("kw-first-p", "warn", 30, "Keyphrase missing from the first paragraph.", "Mention the keyphrase in the first 100 words to set the topic for readers and search engines.");
}

export function checkKeywordInSubheading(input: AnalysisInput): CheckResult {
  if (!input.focusKeyword) return r("kw-in-h2", "neutral", 0, "Skipped — no focus keyphrase.");
  const subs = input.structure.headings.filter((h) => h.level >= 2);
  if (subs.length === 0)
    return r("kw-in-h2", "warn", 0, "No subheadings to check.", "Add H2/H3 subheadings to break up the content.");
  const has = subs.some((h) => countKeyphraseStem(h.text, input.focusKeyword) > 0);
  return has
    ? r("kw-in-h2", "good", 100, "Keyphrase appears in at least one subheading.")
    : r("kw-in-h2", "warn", 30, "Keyphrase not in any subheading.", "Use the keyphrase or a close variation in at least one H2/H3.");
}

export function checkKeywordDensity(input: AnalysisInput): CheckResult {
  if (!input.focusKeyword) return r("kw-density", "neutral", 0, "Skipped — no focus keyphrase.");
  if (input.wordCount < 50) return r("kw-density", "neutral", 0, "Too little content to measure density.");
  const occ = countKeyphraseStem(input.plainText, input.focusKeyword);
  const density = (occ / input.wordCount) * 100;
  if (density === 0)
    return r("kw-density", "bad", 0, "Keyphrase never appears in the body.", "Use the keyphrase a few times naturally throughout the post.");
  if (density < 0.5)
    return r("kw-density", "warn", 40, `Density ${density.toFixed(2)}% — under the recommended 0.5–2.5%.`);
  if (density > 2.5)
    return r("kw-density", "warn", 50, `Density ${density.toFixed(2)}% — above 2.5%. Risk of keyword stuffing.`);
  return r("kw-density", "good", 100, `Density ${density.toFixed(2)}% — within the recommended range.`);
}

export function checkKeywordInAlt(input: AnalysisInput): CheckResult {
  if (!input.focusKeyword) return r("kw-in-alt", "neutral", 0, "Skipped — no focus keyphrase.");
  if (input.structure.images.length === 0) return r("kw-in-alt", "neutral", 0, "No images in post.");
  const has = input.structure.images.some((img) => countKeyphraseStem(img.alt, input.focusKeyword) > 0);
  return has
    ? r("kw-in-alt", "good", 100, "Keyphrase appears in at least one image alt text.")
    : r("kw-in-alt", "warn", 30, "No image alt text contains the keyphrase.");
}

export function checkKeyphraseDistribution(input: AnalysisInput): CheckResult {
  if (!input.focusKeyword) return r("kw-distribution", "neutral", 0, "Skipped — no focus keyphrase.");
  if (input.wordCount < 300) return r("kw-distribution", "neutral", 0, "Post is too short to evaluate distribution.");
  const len = input.plainText.length;
  const thirds = [input.plainText.slice(0, len / 3), input.plainText.slice(len / 3, (2 * len) / 3), input.plainText.slice((2 * len) / 3)];
  const present = thirds.filter((t) => countKeyphraseStem(t, input.focusKeyword) > 0).length;
  if (present === 3) return r("kw-distribution", "good", 100, "Keyphrase appears across the whole post.");
  if (present === 2) return r("kw-distribution", "warn", 60, "Keyphrase is missing from one third of the post.");
  if (present === 1) return r("kw-distribution", "warn", 30, "Keyphrase only appears in one third of the post.");
  return r("kw-distribution", "bad", 0, "Keyphrase is not spread through the post.");
}

export function checkCannibalization(input: AnalysisInput): CheckResult {
  if (!input.focusKeyword) return r("kw-cannibal", "neutral", 0, "Skipped — no focus keyphrase.");
  if (input.cannibalization.length === 0) return r("kw-cannibal", "good", 100, "Keyphrase is unique among published posts.");
  const titles = input.cannibalization.slice(0, 2).map((c) => `“${c.title || c.slug}”`).join(", ");
  return r(
    "kw-cannibal",
    "warn",
    20,
    `${input.cannibalization.length} other published post${input.cannibalization.length === 1 ? "" : "s"} use this same keyphrase: ${titles}.`,
    "Consider using a more specific keyphrase, or consolidate competing posts to avoid keyword cannibalization.",
  );
}

export function basicChecks(input: AnalysisInput): CheckResult[] {
  return [
    checkFocusKeywordSet(input),
    checkKeywordInTitle(input),
    checkKeywordEarlyInTitle(input),
    checkKeywordInMeta(input),
    checkKeywordInSlug(input),
    checkKeywordInFirstParagraph(input),
    checkKeywordInSubheading(input),
    checkKeywordDensity(input),
    checkKeywordInAlt(input),
    checkKeyphraseDistribution(input),
    checkCannibalization(input),
  ];
}
