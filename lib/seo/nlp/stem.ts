/**
 * Light Porter-ish stemmer tuned for marketing/blog prose.
 * Goals: "strategy" ↔ "strategies", "market" ↔ "marketing" ↔ "marketed",
 * "write" ↔ "writing" ↔ "writes". Aggressive enough to catch real variants,
 * conservative enough to avoid collapsing unrelated words.
 */
export function stem(word: string): string {
  let w = word.toLowerCase();
  if (w.length <= 3) return w;

  // Plurals
  if (w.endsWith("ies") && w.length > 4) w = w.slice(0, -3) + "y";
  else if (w.endsWith("sses")) w = w.slice(0, -2);
  else if (w.endsWith("xes") || w.endsWith("zes") || w.endsWith("ches") || w.endsWith("shes")) w = w.slice(0, -2);
  else if (w.endsWith("ses") && w.length > 4) w = w.slice(0, -1);
  else if (w.endsWith("s") && !w.endsWith("ss") && !w.endsWith("us") && !w.endsWith("is")) w = w.slice(0, -1);

  // Past tense / participle
  if (w.endsWith("ied") && w.length > 4) w = w.slice(0, -3) + "y";
  else if (w.endsWith("eed")) w = w.slice(0, -1); // freed → free
  else if (w.endsWith("ed") && w.length > 4) {
    const stem = w.slice(0, -2);
    if (/[aeiouy]/.test(stem)) {
      // double consonant: stopped → stop
      if (stem.length >= 2 && stem[stem.length - 1] === stem[stem.length - 2] && !"aeiouy".includes(stem[stem.length - 1])) {
        w = stem.slice(0, -1);
      } else {
        w = stem;
      }
    }
  }

  // -ing
  if (w.endsWith("ing") && w.length > 5) {
    const stem = w.slice(0, -3);
    if (/[aeiouy]/.test(stem)) {
      if (stem.length >= 2 && stem[stem.length - 1] === stem[stem.length - 2] && !"aeiouy".includes(stem[stem.length - 1])) {
        w = stem.slice(0, -1);
      } else {
        w = stem;
      }
    }
  }

  // Add back "e" for common silent-e words: writ → write, mak → make
  if (w.length >= 3 && /[aeiouy][^aeiouy][^aeiouys]?$/.test(w)) {
    // heuristic: very fuzzy; only used for symmetric matching, not display
  }

  // -ly, -ness, -ment
  if (w.endsWith("ly") && w.length > 4) w = w.slice(0, -2);
  else if (w.endsWith("ness") && w.length > 5) w = w.slice(0, -4);
  else if (w.endsWith("ment") && w.length > 6) w = w.slice(0, -4);

  // -er, -or (drop only if not a one-syllable word like "her")
  if ((w.endsWith("er") || w.endsWith("or")) && w.length > 4) w = w.slice(0, -2);

  return w;
}

/** Stem each word in a phrase. */
export function stemPhrase(phrase: string): string[] {
  return phrase
    .toLowerCase()
    .split(/[^a-z']+/)
    .filter(Boolean)
    .map(stem);
}

/** Normalize text for matching: lowercase + strip diacritics. */
export function normalize(s: string): string {
  return s.toLowerCase().normalize("NFKD").replace(/[̀-ͯ]/g, "");
}

/** Tokenize text into stemmed tokens with original positions. */
export type TokenSpan = { start: number; end: number; raw: string; stem: string };
export function tokenizeWithStems(text: string): TokenSpan[] {
  const out: TokenSpan[] = [];
  const re = /[a-zA-Z][a-zA-Z'-]*/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(text)) !== null) {
    out.push({ start: m.index, end: m.index + m[0].length, raw: m[0], stem: stem(m[0]) });
  }
  return out;
}

/**
 * Count keyphrase occurrences using stem-aware whole-phrase matching.
 * "content marketing strategy" matches "content marketing strategies".
 * Allows up to 1 inserted token between phrase words (so "content marketing"
 * matches "content-driven marketing" loosely — Yoast's "keyphrase variation").
 */
export function countKeyphraseStem(
  text: string,
  phrase: string,
  opts: { allowGap?: boolean } = {},
): number {
  const phraseStems = stemPhrase(phrase);
  if (phraseStems.length === 0) return 0;
  const tokens = tokenizeWithStems(text);
  if (tokens.length === 0) return 0;
  const allowGap = opts.allowGap ?? false;

  let count = 0;
  let i = 0;
  while (i <= tokens.length - phraseStems.length) {
    let j = 0;
    let k = i;
    let gapsUsed = 0;
    while (j < phraseStems.length && k < tokens.length) {
      if (tokens[k].stem === phraseStems[j]) {
        j++;
        k++;
      } else if (allowGap && gapsUsed === 0 && j > 0 && j < phraseStems.length) {
        gapsUsed++;
        k++;
      } else {
        break;
      }
    }
    if (j === phraseStems.length) {
      count++;
      i = k;
    } else {
      i++;
    }
  }
  return count;
}

/** Find all matches in text — returns char-offset ranges. Useful for decorations. */
export function findKeyphraseRanges(text: string, phrase: string): Array<{ start: number; end: number }> {
  const phraseStems = stemPhrase(phrase);
  if (phraseStems.length === 0) return [];
  const tokens = tokenizeWithStems(text);
  const out: Array<{ start: number; end: number }> = [];

  let i = 0;
  while (i <= tokens.length - phraseStems.length) {
    let j = 0;
    while (j < phraseStems.length && i + j < tokens.length && tokens[i + j].stem === phraseStems[j]) j++;
    if (j === phraseStems.length) {
      out.push({ start: tokens[i].start, end: tokens[i + j - 1].end });
      i += j;
    } else {
      i++;
    }
  }
  return out;
}
