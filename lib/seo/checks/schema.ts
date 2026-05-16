import type { AnalysisInput, CheckResult } from "../types";

function r(id: string, severity: CheckResult["severity"], score: number, message: string, why?: string): CheckResult {
  return { id, category: "schema", severity, score, message, why };
}

export function checkSchemaType(input: AnalysisInput): CheckResult {
  if (!input.schemaType) return r("schema-type", "warn", 30, "No schema.org type set.", "Choose BlogPosting (default) or Article for richer search results.");
  return r("schema-type", "good", 100, `Schema type: ${input.schemaType}.`);
}

export function checkOgImage(input: AnalysisInput): CheckResult {
  const img = input.ogImage ?? input.featuredImage;
  if (!img) return r("og-image", "bad", 0, "No OG image.", "Set a featured image or explicit OG image so links preview nicely.");
  if (!img.alt) return r("og-image", "warn", 50, "OG image has no alt text.");
  const w = img.width ?? 0;
  const h = img.height ?? 0;
  if (w < 1200 || h < 630) return r("og-image", "warn", 60, `OG image is ${w}×${h} — below 1200×630.`);
  return r("og-image", "good", 100, `OG image is ${w}×${h} — perfect.`);
}

export function checkTwitterCard(input: AnalysisInput): CheckResult {
  if (input.twitterCard === "summary_large_image") return r("twitter-card", "good", 100, "Twitter card: summary_large_image.");
  return r("twitter-card", "warn", 60, "Twitter card type is `summary`. Switch to `summary_large_image` if your OG image is widescreen.");
}

export function checkCanonical(input: AnalysisInput): CheckResult {
  if (!input.canonical) return r("canonical", "good", 100, "Canonical auto-derived from slug.");
  if (!/^https?:\/\//i.test(input.canonical)) return r("canonical", "bad", 0, "Canonical override is not an absolute URL.");
  return r("canonical", "good", 100, "Canonical override set.");
}

export function checkRobots(input: AnalysisInput): CheckResult {
  if (input.robotsIndex && input.robotsFollow) return r("robots", "good", 100, "Robots: index, follow.");
  if (!input.robotsIndex && !input.robotsFollow) return r("robots", "warn", 50, "Robots: noindex, nofollow. Page will not be indexed.");
  if (!input.robotsIndex) return r("robots", "warn", 60, "Robots: noindex. Page will be excluded from search results.");
  return r("robots", "warn", 60, "Robots: nofollow. Links on this page won't pass authority.");
}

export function schemaChecks(input: AnalysisInput): CheckResult[] {
  return [
    checkSchemaType(input),
    checkOgImage(input),
    checkTwitterCard(input),
    checkCanonical(input),
    checkRobots(input),
  ];
}
