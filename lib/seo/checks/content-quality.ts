import type { AnalysisInput, CheckResult } from "../types";
import { computeInsights } from "../insights";
import { ALT_TEXT_BAD_PREFIXES } from "../nlp/dictionaries.en";

function r(id: string, severity: CheckResult["severity"], score: number, message: string, why?: string): CheckResult {
  return { id, category: "readability", severity, score, message, why };
}

export function checkFillerWords(input: AnalysisInput, insights = computeInsights(input)): CheckResult {
  if (input.wordCount < 100) return r("filler", "neutral", 0, "Too little content to evaluate fillers.");
  const total = insights.fillers.reduce((s, f) => s + f.count, 0);
  const ratio = total / input.wordCount;
  if (total === 0) return r("filler", "good", 100, "No filler words detected.");
  if (ratio < 0.01) return r("filler", "good", 100, `Few filler words (${total}).`);
  if (ratio < 0.02) return r("filler", "warn", 60, `${total} filler words — consider trimming.`);
  const sample = insights.fillers.slice(0, 3).map((f) => `“${f.word}”×${f.count}`).join(", ");
  return r("filler", "bad", 30, `${total} filler words — ${sample}.`, "Words like “very”, “really”, “just” weaken your writing. Cut them or replace with stronger phrasing.");
}

export function checkWeaselWords(input: AnalysisInput, insights = computeInsights(input)): CheckResult {
  if (input.wordCount < 100) return r("weasel", "neutral", 0, "Too little content.");
  const total = insights.weasel.reduce((s, w) => s + w.count, 0);
  const ratio = total / input.wordCount;
  if (total === 0) return r("weasel", "good", 100, "No vague qualifiers detected.");
  if (ratio < 0.015) return r("weasel", "good", 100, `Minimal vague language (${total}).`);
  const sample = insights.weasel.slice(0, 3).map((w) => `“${w.word}”×${w.count}`).join(", ");
  if (ratio < 0.03) return r("weasel", "warn", 60, `${total} vague qualifiers — ${sample}.`, "Words like “some”, “often”, “may” dilute claims. Be specific or cite a source.");
  return r("weasel", "bad", 30, `${total} vague qualifiers — ${sample}.`);
}

export function checkCliches(input: AnalysisInput, insights = computeInsights(input)): CheckResult {
  if (insights.cliches.length === 0) return r("cliches", "good", 100, "No clichés detected.");
  const sample = insights.cliches.slice(0, 2).map((c) => `“${c.phrase}”`).join(", ");
  if (insights.cliches.length === 1) return r("cliches", "warn", 60, `Cliché detected: ${sample}.`, "Clichés feel generic. Replace with a specific, concrete phrasing.");
  return r("cliches", "warn", 30, `${insights.cliches.length} clichés detected — ${sample}.`);
}

export function checkRedundancies(input: AnalysisInput, insights = computeInsights(input)): CheckResult {
  if (insights.redundancies.length === 0) return r("redundancies", "good", 100, "No redundant phrasings detected.");
  const sample = insights.redundancies.slice(0, 2).map((rd) => `“${rd.phrase}” → “${rd.suggestion}”`).join("; ");
  return r("redundancies", "warn", 50, `${insights.redundancies.length} redundant phrasing${insights.redundancies.length === 1 ? "" : "s"}: ${sample}.`, "Tighten the prose by cutting the redundant word.");
}

export function checkOverusedWord(input: AnalysisInput, insights = computeInsights(input)): CheckResult {
  if (!insights.overusedWord) return r("overused", "good", 100, "No single word dominates the post.");
  const o = insights.overusedWord;
  return r("overused", "warn", 60, `“${o.word}” appears ${o.count} times (${o.perThousand.toFixed(0)}/1k words).`, "If this isn't your focus keyphrase, vary the wording with synonyms.");
}

export function checkSentenceVariety(input: AnalysisInput, insights = computeInsights(input)): CheckResult {
  if (input.structure.sentences.length < 6) return r("sentence-variety", "neutral", 0, "Too few sentences.");
  const v = insights.sentenceVariety;
  if (v.rating === "varied") return r("sentence-variety", "good", 100, `Sentence length varies well (σ=${v.stddev}, mean=${v.meanLength}).`);
  if (v.rating === "ok") return r("sentence-variety", "warn", 60, `Moderate variety (σ=${v.stddev}). Mix in shorter punchy sentences.`);
  return r("sentence-variety", "bad", 30, `Monotone rhythm (σ=${v.stddev}). All sentences feel similar.`, "Mix sentence lengths — a punchy short sentence after long ones lifts pacing.");
}

export function checkAltTextQuality(input: AnalysisInput): CheckResult {
  if (input.structure.images.length === 0) return r("alt-quality", "neutral", 0, "No images.");
  const issues: string[] = [];
  let problems = 0;
  for (const img of input.structure.images) {
    const a = img.alt.toLowerCase();
    if (!a) continue; // already covered by img-alt-all
    if (ALT_TEXT_BAD_PREFIXES.some((p) => a.startsWith(p))) {
      problems++;
      issues.push(`"${img.alt.slice(0, 40)}…" starts with redundant prefix`);
    } else if (a.length < 5) {
      problems++;
      issues.push(`"${img.alt}" too short`);
    } else if (a.length > 125) {
      problems++;
      issues.push(`alt over 125 chars`);
    }
  }
  if (problems === 0) return r("alt-quality", "good", 100, "Alt text quality is good.");
  return r("alt-quality", "warn", 50, `${problems} alt-text issue${problems === 1 ? "" : "s"}: ${issues[0]}.`, "Alt text should describe the image (not start with “image of”), be 5–125 characters, and meaningful for screen readers.");
}

export function contentQualityChecks(input: AnalysisInput, insights = computeInsights(input)): CheckResult[] {
  return [
    checkFillerWords(input, insights),
    checkWeaselWords(input, insights),
    checkCliches(input, insights),
    checkRedundancies(input, insights),
    checkOverusedWord(input, insights),
    checkSentenceVariety(input, insights),
    checkAltTextQuality(input),
  ];
}
