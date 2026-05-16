import type { AnalysisInput, CheckResult } from "../types";
import { BAD_ANCHOR_TEXT } from "../nlp/dictionaries.en";

function r(id: string, severity: CheckResult["severity"], score: number, message: string, why?: string): CheckResult {
  return { id, category: "seo", severity, score, message, why };
}

export function checkAnchorTextQuality(input: AnalysisInput): CheckResult {
  const links = input.structure.links;
  if (links.length === 0) return r("anchor-quality", "neutral", 0, "No links.");
  const bad = links.filter((l) => {
    const t = l.text.trim().toLowerCase().replace(/\s+/g, " ");
    return BAD_ANCHOR_TEXT.has(t);
  });
  if (bad.length === 0) return r("anchor-quality", "good", 100, "Anchor text is descriptive.");
  return r(
    "anchor-quality",
    "warn",
    Math.max(20, 100 - bad.length * 20),
    `${bad.length} link${bad.length === 1 ? "" : "s"} use vague anchor text like “${bad[0].text || "click here"}”.`,
    "Descriptive anchor text (containing the destination's topic) is better for SEO and accessibility.",
  );
}

export function checkLinkUrlVariety(input: AnalysisInput): CheckResult {
  const links = input.structure.links;
  if (links.length < 3) return r("link-variety", "neutral", 0, "Too few links to evaluate variety.");
  const hostCounts = new Map<string, number>();
  for (const l of links) {
    try {
      const u = new URL(l.href, "https://example.com");
      hostCounts.set(u.host, (hostCounts.get(u.host) ?? 0) + 1);
    } catch {}
  }
  const dominant = [...hostCounts.entries()].sort((a, b) => b[1] - a[1])[0];
  if (!dominant) return r("link-variety", "neutral", 0, "Couldn't parse link hosts.");
  const ratio = dominant[1] / links.length;
  if (ratio > 0.5 && links.length >= 4)
    return r("link-variety", "warn", 50, `${Math.round(ratio * 100)}% of external links go to one domain (${dominant[0]}).`, "Diversify outbound citations — over-linking to one source looks promotional.");
  return r("link-variety", "good", 100, `Links span ${hostCounts.size} distinct host${hostCounts.size === 1 ? "" : "s"}.`);
}

export function anchorChecks(input: AnalysisInput): CheckResult[] {
  return [checkAnchorTextQuality(input), checkLinkUrlVariety(input)];
}
