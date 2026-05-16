// Standard English stopwords (subset used for slug + density tuning)
export const STOP_WORDS_EN = new Set<string>([
  "a","an","and","are","as","at","be","but","by","do","for","from","has","have","he","her","him","his","how",
  "i","if","in","into","is","it","its","just","me","my","no","not","now","of","off","on","or","our","out","over",
  "own","she","so","some","than","that","the","their","them","then","there","these","they","this","those","to",
  "too","up","very","was","we","were","what","when","where","which","who","whom","why","will","with","you","your",
  "yours","ourselves","yourself","itself","themselves","about","above","after","again","against","all","am","any",
  "because","been","before","being","below","between","both","can","did","does","doing","down","during","each","few",
  "further","had","having","here","hers","herself","himself","more","most","myself","nor","once","only","other",
  "ours","same","such","through","under","until","while","would","could","should","may","might"
]);

export function isStopWord(token: string): boolean {
  return STOP_WORDS_EN.has(token.toLowerCase());
}
