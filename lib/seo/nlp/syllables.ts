// Approximate English syllable counter for Flesch Reading Ease.

export function countSyllables(word: string): number {
  const w = word.toLowerCase().replace(/[^a-z]/g, "");
  if (w.length === 0) return 0;
  if (w.length <= 3) return 1;
  // Silent e
  let s = w.replace(/(?:[^laeiouy])e$/, "");
  s = s.replace(/^y/, "");
  const m = s.match(/[aeiouy]{1,2}/g);
  return Math.max(1, m ? m.length : 1);
}

export function countSyllablesInText(text: string): number {
  let total = 0;
  for (const w of text.split(/[^A-Za-z']+/)) if (w) total += countSyllables(w);
  return total;
}
