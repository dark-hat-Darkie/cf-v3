import "server-only";
import { SCREENSHOTS, type ScreenshotSlug } from "@/lib/media/screenshots-manifest";
import type { CaseScreenshotPage } from "@/lib/case-studies-data";

/**
 * Human labels for each project's ordered full-page screenshots, shown in the
 * scrollable lightbox thumbnail rail. Index = page order in the manifest.
 * TODO(owner): tweak labels (and consider Bangla for pzs) to taste.
 */
const LABELS: Partial<Record<ScreenshotSlug, string[]>> = {
  factwatch: ["Home", "Fact-check report"],
  flipper: ["Home", "Product detail"],
  iqqra: ["Home", "Blog", "About", "Student dashboard", "Interactive lesson", "Performance"],
  pzs: ["Home", "Member directory", "Gallery", "Event detail"],
  tripking: ["Home", "Hotel search", "Hotel detail", "Booking checkout"],
};

function isScreenshotSlug(slug: string): slug is ScreenshotSlug {
  return slug in SCREENSHOTS;
}

/**
 * Resolve a project's full-page screenshots into render-ready pages: manifest
 * dimensions + a pre-baked blur placeholder + a human label. Returns [] when the
 * slug has no screenshots (the case study then falls back to its bento gallery).
 *
 * Fully synchronous — the blur data URLs are baked at build time by
 * scripts/optimize-screenshots.ts — so it's safe to call during a Cache
 * Components render without `<Suspense>`.
 */
export function getScreenshotPages(slug: string): CaseScreenshotPage[] {
  if (!isScreenshotSlug(slug)) return [];
  const labels = LABELS[slug] ?? [];
  return SCREENSHOTS[slug].map((p, i) => ({
    src: p.src,
    width: p.width,
    height: p.height,
    blurDataURL: p.blurDataURL,
    label: labels[i] ?? `Page ${i + 1}`,
  }));
}
