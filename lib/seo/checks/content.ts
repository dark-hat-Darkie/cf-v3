import type { AnalysisInput, CheckResult } from "../types";

function r(id: string, severity: CheckResult["severity"], score: number, message: string, why?: string): CheckResult {
  return { id, category: "seo", severity, score, message, why };
}

export function checkWordCount(input: AnalysisInput): CheckResult {
  const min = input.isCornerstone ? 900 : 600;
  if (input.wordCount === 0) return r("word-count", "bad", 0, "Post has no content yet.");
  if (input.wordCount < 300) return r("word-count", "bad", 10, `Only ${input.wordCount} words. Aim for ${min}+.`);
  if (input.wordCount < min) return r("word-count", "warn", 50, `${input.wordCount} words — recommended at least ${min}.`);
  return r("word-count", "good", 100, `${input.wordCount} words — meets the recommended length.`);
}

export function checkSingleH1(input: AnalysisInput): CheckResult {
  const h1s = input.structure.headings.filter((h) => h.level === 1);
  if (h1s.length === 0) return r("single-h1", "good", 100, "No extra H1 in body (post title is the page H1).");
  if (h1s.length === 1) return r("single-h1", "warn", 60, "Body contains an H1. Reserve H1 for the post title.");
  return r("single-h1", "bad", 0, `${h1s.length} H1s in body. Demote them to H2/H3.`);
}

export function checkHeadingHierarchy(input: AnalysisInput): CheckResult {
  const levels = input.structure.headings.map((h) => h.level);
  if (levels.length === 0) return r("heading-hierarchy", "warn", 0, "No subheadings.", "Use H2/H3 to organize the content.");
  let prev = 1;
  const skips: string[] = [];
  for (const lvl of levels) {
    if (lvl > prev + 1) skips.push(`H${prev}→H${lvl}`);
    prev = lvl;
  }
  if (skips.length === 0) return r("heading-hierarchy", "good", 100, "Heading hierarchy is well-formed.");
  return r("heading-hierarchy", "warn", 50, `Heading hierarchy skips: ${skips.join(", ")}.`);
}

export function checkSubheadingPresence(input: AnalysisInput): CheckResult {
  const subs = input.structure.headings.filter((h) => h.level >= 2);
  if (subs.length >= 2) return r("subheading-presence", "good", 100, `${subs.length} subheadings — good structure.`);
  if (subs.length === 1) return r("subheading-presence", "warn", 60, "Only one subheading.");
  if (input.wordCount > 300) return r("subheading-presence", "bad", 20, "No subheadings.", "Break content into H2/H3 sections so readers can scan.");
  return r("subheading-presence", "neutral", 0, "Post is too short to require subheadings.");
}

export function contentChecks(input: AnalysisInput): CheckResult[] {
  return [
    checkWordCount(input),
    checkSingleH1(input),
    checkHeadingHierarchy(input),
    checkSubheadingPresence(input),
  ];
}
