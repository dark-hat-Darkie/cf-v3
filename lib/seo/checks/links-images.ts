import type { AnalysisInput, CheckResult } from "../types";

function r(id: string, severity: CheckResult["severity"], score: number, message: string, why?: string, fix?: CheckResult["fix"]): CheckResult {
  return { id, category: "seo", severity, score, message, why, fix };
}

export function checkInternalLink(input: AnalysisInput): CheckResult {
  const internal = input.structure.links.filter((l) => !l.isExternal);
  if (internal.length === 0)
    return r("link-internal", "warn", 20, "No internal links.", "Link to at least one related post to help readers and search engines.");
  return r("link-internal", "good", 100, `${internal.length} internal link${internal.length === 1 ? "" : "s"}.`);
}

export function checkExternalLink(input: AnalysisInput): CheckResult {
  const external = input.structure.links.filter((l) => l.isExternal);
  if (external.length === 0)
    return r("link-external", "warn", 30, "No external links.", "Cite at least one authoritative external source.");
  return r("link-external", "good", 100, `${external.length} external link${external.length === 1 ? "" : "s"}.`);
}

export function checkExternalRel(input: AnalysisInput): CheckResult {
  const external = input.structure.links.filter((l) => l.isExternal);
  if (external.length === 0) return r("link-external-rel", "neutral", 0, "No external links.");
  const missing = external.filter((l) => !l.rel || !/noopener/.test(l.rel)).length;
  if (missing === 0) return r("link-external-rel", "good", 100, "All external links use rel='noopener'.");
  return r(
    "link-external-rel",
    "warn",
    40,
    `${missing} external link${missing === 1 ? "" : "s"} missing rel='noopener noreferrer'.`,
    "External links should open safely — we'll add this automatically at publish time.",
    { kind: "client", label: "Fix all external links", intent: "fix-external-rel" },
  );
}

export function checkLinkDensity(input: AnalysisInput): CheckResult {
  if (input.wordCount === 0) return r("link-density", "neutral", 0, "No content.");
  const total = input.structure.links.length;
  const per1000 = (total / input.wordCount) * 1000;
  if (per1000 > 50) return r("link-density", "warn", 30, `${total} links — ${per1000.toFixed(0)} per 1000 words. Too many.`);
  return r("link-density", "good", 100, `${total} link${total === 1 ? "" : "s"} (${per1000.toFixed(1)} / 1000 words).`);
}

export function checkAllImagesAlt(input: AnalysisInput): CheckResult {
  const imgs = input.structure.images;
  if (imgs.length === 0) return r("img-alt-all", "neutral", 0, "No images.");
  const missing = imgs.filter((i) => !i.alt.trim()).length;
  if (missing === 0) return r("img-alt-all", "good", 100, "All images have alt text.");
  return r(
    "img-alt-all",
    "bad",
    Math.max(0, 100 - missing * 40),
    `${missing} image${missing === 1 ? "" : "s"} missing alt text.`,
    "Alt text is essential for accessibility and image SEO.",
  );
}

export function checkHasImage(input: AnalysisInput): CheckResult {
  if (input.structure.images.length === 0)
    return r("img-has", "warn", 30, "No images in the body.", "At least one image breaks up long-form content and helps engagement.");
  return r("img-has", "good", 100, `${input.structure.images.length} image${input.structure.images.length === 1 ? "" : "s"} in body.`);
}

export function checkFeaturedImage(input: AnalysisInput): CheckResult {
  if (!input.featuredImage) return r("img-featured", "bad", 0, "No featured image.", "Featured images are used as the OG image and in cards.");
  if (!input.featuredImage.alt) return r("img-featured", "warn", 50, "Featured image has no alt text.");
  return r("img-featured", "good", 100, "Featured image is set with alt text.");
}

export function checkFeaturedImageDims(input: AnalysisInput): CheckResult {
  if (!input.featuredImage) return r("img-featured-dims", "neutral", 0, "No featured image.");
  const w = input.featuredImage.width ?? 0;
  const h = input.featuredImage.height ?? 0;
  if (w < 1200 || h < 630)
    return r("img-featured-dims", "warn", 50, `Featured image is ${w}×${h} — under 1200×630.`, "Open Graph and Twitter prefer 1200×630 or larger.");
  return r("img-featured-dims", "good", 100, `Featured image is ${w}×${h} — meets 1200×630.`);
}

export function linksImagesChecks(input: AnalysisInput): CheckResult[] {
  return [
    checkInternalLink(input),
    checkExternalLink(input),
    checkExternalRel(input),
    checkLinkDensity(input),
    checkAllImagesAlt(input),
    checkHasImage(input),
    checkFeaturedImage(input),
    checkFeaturedImageDims(input),
  ];
}
