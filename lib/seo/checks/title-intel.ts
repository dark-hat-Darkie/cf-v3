import type { AnalysisInput, CheckResult } from "../types";
import {
  approximateTitlePixelWidth,
  countPowerWords,
  titleHasNumber,
  titleHasYear,
  titleIsQuestion,
  titleSentiment,
} from "../insights";

function r(id: string, severity: CheckResult["severity"], score: number, message: string, why?: string): CheckResult {
  return { id, category: "seo", severity, score, message, why };
}

const SERP_TITLE_PX_LIMIT = 580; // Google desktop ~580px; mobile ~660px
const SERP_META_PX_LIMIT = 920;  // ~158 chars at 14px

export function checkTitlePixelWidth(input: AnalysisInput): CheckResult {
  const title = input.metaTitle || input.title;
  if (!title) return r("title-pixel", "neutral", 0, "No title yet.");
  const px = approximateTitlePixelWidth(title);
  if (px <= 500) return r("title-pixel", "warn", 50, `Title ~${px}px — leaves SERP space unused.`, "You can use the available width for keywords or value cues.");
  if (px <= SERP_TITLE_PX_LIMIT) return r("title-pixel", "good", 100, `Title ~${px}px — fits desktop SERP.`);
  return r("title-pixel", "warn", 50, `Title ~${px}px — likely truncated above ~${SERP_TITLE_PX_LIMIT}px in Google.`, "Trim, or rely on hookable wording before ~580px.");
}

export function checkMetaPixelWidth(input: AnalysisInput): CheckResult {
  if (!input.metaDescription) return r("meta-pixel", "neutral", 0, "No meta description.");
  const px = approximateTitlePixelWidth(input.metaDescription, 14);
  if (px <= 700) return r("meta-pixel", "warn", 50, `Meta description ~${px}px — uses < 75% of SERP width.`);
  if (px <= SERP_META_PX_LIMIT) return r("meta-pixel", "good", 100, `Meta description ~${px}px — fills SERP nicely.`);
  return r("meta-pixel", "warn", 50, `Meta description ~${px}px — may truncate above ~${SERP_META_PX_LIMIT}px.`);
}

export function checkTitlePowerWord(input: AnalysisInput): CheckResult {
  const title = input.metaTitle || input.title;
  if (!title) return r("title-power", "neutral", 0, "No title yet.");
  const { count, words } = countPowerWords(title);
  if (count === 0) return r("title-power", "warn", 40, "No power words in the title.", "Words like “proven”, “ultimate”, “essential”, “best”, “avoid” lift click-through rate. Use sparingly — 1 or 2 max.");
  if (count > 3) return r("title-power", "warn", 60, `Title uses ${count} power words (${words.slice(0, 3).join(", ")}…).`, "Too many emotional triggers reads as spammy. Aim for 1–2.");
  return r("title-power", "good", 100, `Power words used: ${words.join(", ")}.`);
}

export function checkTitleNumber(input: AnalysisInput): CheckResult {
  const title = input.metaTitle || input.title;
  if (!title) return r("title-number", "neutral", 0, "No title yet.");
  if (titleHasNumber(title)) return r("title-number", "good", 100, "Title contains a number.");
  return r("title-number", "warn", 50, "Title has no number.", "Listicles and stats in titles (“7 ways…”, “increase by 40%”) earn more clicks.");
}

export function checkTitleYear(input: AnalysisInput): CheckResult {
  const title = input.metaTitle || input.title;
  if (!title) return r("title-year", "neutral", 0, "No title yet.");
  if (titleHasYear(title)) return r("title-year", "good", 100, "Title is dated — signals freshness.");
  return r("title-year", "warn", 30, "Title has no year.", "For evergreen-but-trending topics, adding the current year signals freshness.");
}

export function checkTitleSentiment(input: AnalysisInput): CheckResult {
  const title = input.metaTitle || input.title;
  if (!title) return r("title-sentiment", "neutral", 0, "No title yet.");
  const s = titleSentiment(title);
  if (s > 0.2) return r("title-sentiment", "good", 100, "Title leans positive — good for top-of-funnel.");
  if (s < -0.2) return r("title-sentiment", "good", 100, "Title leans negative — strong for warning/avoidance posts.");
  return r("title-sentiment", "warn", 50, "Title is emotionally flat.", "Headlines with clear positive or negative framing outperform neutral ones.");
}

export function checkTitleQuestion(input: AnalysisInput): CheckResult {
  const title = input.metaTitle || input.title;
  if (!title) return r("title-question", "neutral", 0, "No title yet.");
  if (titleIsQuestion(title)) return r("title-question", "good", 100, "Title is phrased as a question — strong for People-Also-Ask traction.");
  return r("title-question", "neutral", 0, "Not a question title.");
}

export function titleIntelChecks(input: AnalysisInput): CheckResult[] {
  return [
    checkTitlePixelWidth(input),
    checkMetaPixelWidth(input),
    checkTitlePowerWord(input),
    checkTitleNumber(input),
    checkTitleYear(input),
    checkTitleSentiment(input),
    checkTitleQuestion(input),
  ];
}
