import type { AnalysisInput } from "./types";
import { stem, tokenizeWithStems } from "./nlp/stem";
import { STOP_WORDS_EN } from "./nlp/stop-words.en";
import {
  CLICHES,
  FILLER_WORDS,
  POWER_WORDS,
  REDUNDANCIES,
  WEASEL_WORDS,
} from "./nlp/dictionaries.en";
import { tokenizeWords } from "./nlp/tokenize";
import { countSyllablesInText } from "./nlp/syllables";

export type ContentInsights = {
  topWords: { word: string; count: number }[];
  fillers: { word: string; count: number }[];
  weasel: { word: string; count: number }[];
  cliches: { phrase: string; count: number }[];
  redundancies: { phrase: string; suggestion: string }[];
  overusedWord: { word: string; count: number; perThousand: number } | null;
  sentenceVariety: { stddev: number; meanLength: number; rating: "varied" | "ok" | "monotone" };
  gunningFog: number;
  smog: number;
  averageGradeLevel: number;
  estimatedReadMinutes: number;
};

function countMapToSorted(map: Map<string, number>, limit: number) {
  return [...map.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([word, count]) => ({ word, count }));
}

function stdDev(xs: number[]): number {
  if (xs.length < 2) return 0;
  const mean = xs.reduce((s, x) => s + x, 0) / xs.length;
  const v = xs.reduce((s, x) => s + (x - mean) ** 2, 0) / xs.length;
  return Math.sqrt(v);
}

export function computeInsights(input: AnalysisInput): ContentInsights {
  const tokens = tokenizeWithStems(input.plainText);
  const lower = input.plainText.toLowerCase();

  // Word frequency (non-stop, normalized to stems)
  const freq = new Map<string, number>();
  const fillerMap = new Map<string, number>();
  const weaselMap = new Map<string, number>();
  for (const t of tokens) {
    const raw = t.raw.toLowerCase();
    if (FILLER_WORDS.has(raw)) fillerMap.set(raw, (fillerMap.get(raw) ?? 0) + 1);
    if (WEASEL_WORDS.has(raw)) weaselMap.set(raw, (weaselMap.get(raw) ?? 0) + 1);
    if (STOP_WORDS_EN.has(raw)) continue;
    if (raw.length < 3) continue;
    freq.set(t.stem, (freq.get(t.stem) ?? 0) + 1);
  }

  const topWords = countMapToSorted(freq, 10);

  // Cliché detection (multiword phrases)
  const clicheCounts: { phrase: string; count: number }[] = [];
  for (const phrase of CLICHES) {
    let count = 0;
    let idx = 0;
    while ((idx = lower.indexOf(phrase, idx)) !== -1) {
      count++;
      idx += phrase.length;
    }
    if (count > 0) clicheCounts.push({ phrase, count });
  }

  // Redundancies
  const redundancyHits: { phrase: string; suggestion: string }[] = [];
  for (const [phrase, suggestion] of REDUNDANCIES) {
    if (lower.includes(phrase)) redundancyHits.push({ phrase, suggestion });
  }

  // Overused (non-stop word appearing > 1% of total words, or > 3 times per 1000)
  let overused: ContentInsights["overusedWord"] = null;
  if (input.wordCount > 200 && topWords.length > 0) {
    const w = topWords[0];
    // Don't flag the focus keyword (its high count is intentional)
    const focusStem = input.focusKeyword
      ? stem(input.focusKeyword.split(/\s+/)[0] ?? "")
      : "";
    if (w.word !== focusStem) {
      const perThousand = (w.count / input.wordCount) * 1000;
      if (perThousand > 12) overused = { word: w.word, count: w.count, perThousand };
    }
  }

  // Sentence variety
  const sentLengths = input.structure.sentences.map((s) => tokenizeWords(s).length).filter((n) => n > 0);
  const meanLength = sentLengths.length ? sentLengths.reduce((s, x) => s + x, 0) / sentLengths.length : 0;
  const stddev = stdDev(sentLengths);
  const rating: ContentInsights["sentenceVariety"]["rating"] =
    stddev >= 7 ? "varied" : stddev >= 4 ? "ok" : "monotone";

  // Readability grades
  const words = tokenizeWords(input.plainText);
  const wordsCount = Math.max(1, words.length);
  const sentencesCount = Math.max(1, input.structure.sentences.length);
  const complexWords = words.filter((w) => countSyllablesInText(w) >= 3).length;
  const syllables = countSyllablesInText(input.plainText);

  // Gunning Fog: 0.4 * ((words/sentences) + 100 * (complex/words))
  const fog = 0.4 * (wordsCount / sentencesCount + 100 * (complexWords / wordsCount));
  // SMOG: 1.0430 * sqrt(complex * 30/sentences) + 3.1291
  const smog = 1.043 * Math.sqrt((complexWords * 30) / sentencesCount) + 3.1291;
  // Flesch-Kincaid grade level: 0.39 * (words/sentences) + 11.8 * (syllables/words) - 15.59
  const fkGrade = 0.39 * (wordsCount / sentencesCount) + 11.8 * (syllables / wordsCount) - 15.59;
  const avgGrade = (fog + smog + Math.max(0, fkGrade)) / 3;

  return {
    topWords,
    fillers: countMapToSorted(fillerMap, 5),
    weasel: countMapToSorted(weaselMap, 5),
    cliches: clicheCounts.sort((a, b) => b.count - a.count).slice(0, 5),
    redundancies: redundancyHits.slice(0, 5),
    overusedWord: overused,
    sentenceVariety: {
      stddev: Math.round(stddev * 10) / 10,
      meanLength: Math.round(meanLength * 10) / 10,
      rating,
    },
    gunningFog: Math.round(fog * 10) / 10,
    smog: Math.round(smog * 10) / 10,
    averageGradeLevel: Math.round(avgGrade * 10) / 10,
    estimatedReadMinutes: Math.max(1, Math.round(input.wordCount / 230)),
  };
}

/** Count POWER words in a title. */
export function countPowerWords(title: string): { count: number; words: string[] } {
  const words = title.toLowerCase().split(/[^a-z']+/).filter(Boolean);
  const found = words.filter((w) => POWER_WORDS.has(w));
  return { count: found.length, words: [...new Set(found)] };
}

/** Heuristic title sentiment hint. Returns -1..+1, positive = upbeat. */
const POS_WORDS = new Set(["best","top","amazing","love","win","winning","winner","easy","simple","fast","free","huge","powerful","stunning","incredible","beautiful","success","proven","trusted","grow","boost","unlock"]);
const NEG_WORDS = new Set(["worst","fail","failure","mistake","mistakes","avoid","never","danger","wrong","stop","broken","bad","hard","slow","hate","ugly","kill","killed","killer","death","crash","crisis"]);
export function titleSentiment(title: string): number {
  const tokens = title.toLowerCase().split(/[^a-z']+/).filter(Boolean);
  let s = 0;
  for (const t of tokens) {
    if (POS_WORDS.has(t)) s += 1;
    if (NEG_WORDS.has(t)) s -= 1;
  }
  if (tokens.length === 0) return 0;
  return Math.max(-1, Math.min(1, s / Math.max(3, tokens.length / 2)));
}

export function titleHasNumber(title: string): boolean {
  return /\b\d{1,4}\b/.test(title);
}

export function titleHasYear(title: string, now = new Date()): boolean {
  const y = now.getFullYear();
  return new RegExp(`\\b(${y - 1}|${y}|${y + 1})\\b`).test(title);
}

export function titleIsQuestion(title: string): boolean {
  if (title.trim().endsWith("?")) return true;
  return /^(how|why|what|when|where|who|which|can|should|will|do|does|is|are|was)\b/i.test(title.trim());
}

export function titleHasBracket(title: string): boolean {
  return /[\[\(].+?[\]\)]/.test(title);
}

/** Pixel-width estimator for SERP title truncation. Calibrated against
 * Google's Arial/Roboto-like font at 20px. Rough — within ~5% of real. */
export function approximateTitlePixelWidth(title: string, fontSize = 20): number {
  // Width per character estimate based on character class. Avg ~0.55em.
  let px = 0;
  for (const ch of title) {
    if (ch === " ") px += 0.27;
    else if ('iIl|.,;:!\'"`'.includes(ch)) px += 0.28;
    else if ('fjrtl'.includes(ch)) px += 0.34;
    else if ('1234567890'.includes(ch)) px += 0.55;
    else if ('WMmw'.includes(ch)) px += 0.86;
    else if (/[A-Z]/.test(ch)) px += 0.66;
    else px += 0.55;
  }
  return Math.round(px * fontSize);
}

export function approximateMetaPixelWidth(meta: string, fontSize = 14): number {
  return approximateTitlePixelWidth(meta, fontSize);
}
