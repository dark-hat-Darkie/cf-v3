// Lightweight sentence + word tokenizers tuned for marketing prose.

export function tokenizeWords(text: string): string[] {
  return text.split(/[^A-Za-z0-9'-]+/).filter(Boolean);
}

export function tokenizeSentences(text: string): string[] {
  // Split on sentence-ending punctuation followed by whitespace + capital/quote/digit.
  // Avoids splitting on common abbreviations.
  const ABBREV = /\b(?:e\.g|i\.e|etc|vs|Mr|Mrs|Ms|Dr|Prof|Sr|Jr|Inc|Ltd|St)\.$/i;
  const out: string[] = [];
  let buf = "";
  const parts = text.split(/(\s+)/);
  for (const part of parts) {
    buf += part;
    const trimmed = buf.trimEnd();
    if (/[.!?]"?\)?$/.test(trimmed) && !ABBREV.test(trimmed)) {
      const sent = buf.trim();
      if (sent) out.push(sent);
      buf = "";
    }
  }
  const tail = buf.trim();
  if (tail) out.push(tail);
  return out;
}

export function tokenizeParagraphs(text: string): string[] {
  return text.split(/\n{2,}|\n/).map((p) => p.trim()).filter(Boolean);
}

export function normalizeForMatch(s: string): string {
  return s.toLowerCase().normalize("NFKD").replace(/[̀-ͯ]/g, "").trim();
}

export function escapeRegex(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/** Count whole-phrase occurrences (case + diacritic insensitive). */
export function countPhraseOccurrences(haystack: string, needle: string): number {
  const h = normalizeForMatch(haystack);
  const n = normalizeForMatch(needle);
  if (!n) return 0;
  const re = new RegExp(`\\b${escapeRegex(n)}\\b`, "g");
  return (h.match(re) ?? []).length;
}
