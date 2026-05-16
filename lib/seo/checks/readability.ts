import type { AnalysisInput, CheckResult } from "../types";
import { countSyllablesInText } from "../nlp/syllables";
import { isSentencePassive } from "../nlp/passive-voice.en";
import { sentenceHasTransition } from "../nlp/transition-words.en";
import { tokenizeWords } from "../nlp/tokenize";

function r(id: string, severity: CheckResult["severity"], score: number, message: string, why?: string): CheckResult {
  return { id, category: "readability", severity, score, message, why };
}

export function fleschReadingEase(text: string): number {
  const words = tokenizeWords(text);
  if (words.length === 0) return 100;
  const sentences = Math.max(1, text.split(/[.!?]+/).filter((s) => s.trim()).length);
  const syllables = countSyllablesInText(text);
  const wps = words.length / sentences;
  const spw = syllables / words.length;
  return Math.max(0, Math.min(100, Math.round(206.835 - 1.015 * wps - 84.6 * spw)));
}

export function checkFlesch(input: AnalysisInput): CheckResult {
  if (input.wordCount < 50) return r("flesch", "neutral", 0, "Not enough content to score yet.");
  const score = fleschReadingEase(input.plainText);
  if (score >= 60) return r("flesch", "good", 100, `Flesch ${score} — easy to read.`);
  if (score >= 50) return r("flesch", "warn", 60, `Flesch ${score} — fairly difficult.`, "Use shorter sentences and simpler words.");
  return r("flesch", "bad", 30, `Flesch ${score} — difficult to read.`, "Shorten sentences and replace long or technical words with everyday ones.");
}

export function checkSentenceLength(input: AnalysisInput): CheckResult {
  const sents = input.structure.sentences;
  if (sents.length === 0) return r("sentence-length", "neutral", 0, "No sentences yet.");
  const longCount = sents.filter((s) => tokenizeWords(s).length > 20).length;
  const ratio = longCount / sents.length;
  if (ratio < 0.25) return r("sentence-length", "good", 100, `${Math.round(ratio * 100)}% of sentences are long — good pacing.`);
  if (ratio < 0.35) return r("sentence-length", "warn", 60, `${Math.round(ratio * 100)}% of sentences exceed 20 words.`, "Aim for under 25% long sentences.");
  return r("sentence-length", "bad", 30, `${Math.round(ratio * 100)}% of sentences are long — break them up.`);
}

export function checkParagraphLength(input: AnalysisInput): CheckResult {
  const paras = input.structure.paragraphs;
  if (paras.length === 0) return r("paragraph-length", "neutral", 0, "No paragraphs yet.");
  const longCount = paras.filter((p) => tokenizeWords(p).length > 150).length;
  const ratio = longCount / paras.length;
  if (ratio === 0) return r("paragraph-length", "good", 100, "All paragraphs are well-sized.");
  if (ratio < 0.25) return r("paragraph-length", "warn", 60, `${longCount} paragraph${longCount === 1 ? "" : "s"} over 150 words.`);
  return r("paragraph-length", "bad", 30, `${Math.round(ratio * 100)}% of paragraphs are too long.`, "Split long paragraphs — aim for 3–4 sentences each.");
}

export function checkSubheadingDistribution(input: AnalysisInput): CheckResult {
  if (input.wordCount < 300) return r("subhead-dist", "neutral", 0, "Post is too short for this check.");
  const headingPositions: number[] = [];
  // Estimate by mapping headings to plaintext position via order — approximate but useful
  let cursor = 0;
  for (const h of input.structure.headings) {
    const idx = input.plainText.toLowerCase().indexOf(h.text.toLowerCase(), cursor);
    if (idx >= 0) {
      headingPositions.push(idx);
      cursor = idx + h.text.length;
    }
  }
  if (headingPositions.length === 0)
    return r("subhead-dist", "bad", 20, "No subheadings detected.", "Long content without subheadings is hard to scan.");

  // Words between successive headings
  const segments: number[] = [];
  for (let i = 0; i < headingPositions.length; i++) {
    const start = headingPositions[i];
    const end = headingPositions[i + 1] ?? input.plainText.length;
    segments.push(tokenizeWords(input.plainText.slice(start, end)).length);
  }
  // Prefix before first heading
  segments.push(tokenizeWords(input.plainText.slice(0, headingPositions[0])).length);
  const tooLong = segments.filter((w) => w > 300).length;
  if (tooLong === 0) return r("subhead-dist", "good", 100, "Subheadings keep sections under 300 words.");
  return r("subhead-dist", "warn", 50, `${tooLong} section${tooLong === 1 ? "" : "s"} run longer than 300 words.`, "Add a subheading every 200–300 words.");
}

export function checkPassiveVoice(input: AnalysisInput): CheckResult {
  const sents = input.structure.sentences;
  if (sents.length < 4) return r("passive", "neutral", 0, "Not enough sentences to score passive voice.");
  const passive = sents.filter(isSentencePassive).length;
  const ratio = passive / sents.length;
  if (ratio < 0.1) return r("passive", "good", 100, `${Math.round(ratio * 100)}% passive — strong active voice.`);
  if (ratio < 0.2) return r("passive", "warn", 60, `${Math.round(ratio * 100)}% passive — try to reduce below 10%.`);
  return r("passive", "bad", 30, `${Math.round(ratio * 100)}% passive — rewrite passive sentences in active voice.`);
}

export function checkTransitionWords(input: AnalysisInput): CheckResult {
  const sents = input.structure.sentences;
  if (sents.length < 4) return r("transition", "neutral", 0, "Not enough sentences to measure transitions.");
  const withT = sents.filter(sentenceHasTransition).length;
  const ratio = withT / sents.length;
  if (ratio >= 0.3) return r("transition", "good", 100, `${Math.round(ratio * 100)}% of sentences use a transition word.`);
  if (ratio >= 0.2) return r("transition", "warn", 60, `${Math.round(ratio * 100)}% transitions — aim for 30%.`);
  return r("transition", "bad", 30, `Only ${Math.round(ratio * 100)}% of sentences use transitions.`, "Connectors like “however”, “for example”, “in addition” improve flow.");
}

export function checkConsecutiveSentenceStart(input: AnalysisInput): CheckResult {
  const sents = input.structure.sentences;
  if (sents.length < 4) return r("consecutive-start", "neutral", 0, "Not enough sentences.");
  let streak = 1, maxStreak = 1, prev = "";
  const offenders: string[] = [];
  for (const s of sents) {
    const first = (tokenizeWords(s)[0] ?? "").toLowerCase();
    if (first && first === prev) {
      streak++;
      if (streak > maxStreak) maxStreak = streak;
      if (streak >= 3 && !offenders.includes(first)) offenders.push(first);
    } else {
      streak = 1;
    }
    prev = first;
  }
  if (offenders.length === 0) return r("consecutive-start", "good", 100, "No three-in-a-row sentence starters.");
  return r("consecutive-start", "warn", 50, `Sentences starting with “${offenders.join("”, “")}” run consecutively.`, "Vary how you start sentences for better rhythm.");
}

export function readabilityChecks(input: AnalysisInput): CheckResult[] {
  return [
    checkFlesch(input),
    checkSentenceLength(input),
    checkParagraphLength(input),
    checkSubheadingDistribution(input),
    checkPassiveVoice(input),
    checkTransitionWords(input),
    checkConsecutiveSentenceStart(input),
  ];
}
