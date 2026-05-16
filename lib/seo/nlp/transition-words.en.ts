// Yoast's transition word list (English) — used by readability:transition-words check.
// Multi-word phrases are checked first; single tokens fall back to set lookup.
export const TRANSITION_PHRASES_EN: string[] = [
  "above all","accordingly","additionally","after all","after that","afterwards","all in all","all of a sudden",
  "also","although","altogether","as a consequence","as a result","as an example","as long as","as much as",
  "as soon as","as well as","at first","at last","at the same time","because","before","beforehand","besides",
  "but","by the same token","by the time","by the way","certainly","clearly","conversely","consequently",
  "correspondingly","despite","earlier","equally","equally important","especially","even if","even more",
  "even so","even though","eventually","every now and then","evidently","finally","first","firstly","first of all",
  "for example","for instance","for one thing","for one","for that reason","for the most part","for the same reason",
  "for the time being","for this purpose","for this reason","frequently","further","furthermore","generally","granted",
  "hence","here","however","identically","i.e.","immediately","in addition","in any case","in any event","in brief",
  "in case","in conclusion","in contrast","in detail","in due time","in essence","in fact","in front","in general",
  "in light of","in like fashion","in like manner","in order that","in order to","in other words","in particular",
  "in reality","in short","in similar fashion","in spite of","in summary","in the beginning","in the distance",
  "in the end","in the first place","in the fourth place","in the future","in the long run","in the meantime",
  "in the middle","in the past","in the same way","in the second place","in the third place","in this case",
  "in this manner","in this situation","in time","in truth","in turn","indeed","initially","instead","just as","just then",
  "lastly","later","later on","likewise","markedly","meanwhile","moreover","most compelling evidence","most important",
  "must be remembered","namely","naturally","never","nevertheless","next","nonetheless","not only … but also",
  "not to mention","notably","notwithstanding","now","obviously","of course","often","on balance","on condition that",
  "on one hand","on the contrary","on the next occasion","on the negative side","on the other hand","on the positive side",
  "on the whole","on this occasion","once","once in a while","one year","only if","otherwise","overall","particularly",
  "presently","previously","provided that","provided","quickly","rarely","regardless","regularly","second","secondly",
  "seeing that","seldom","shortly","significantly","similarly","simultaneously","since","so","so as to","so far",
  "so long as","so that","sometimes","soon","specifically","still","straightaway","subsequently","such as","suddenly",
  "summing up","surely","surprisingly","take the case of","that is","that is to say","then","then again","therefore",
  "third","thirdly","this time","though","thus","to","to be sure","to begin with","to clarify","to conclude","to date",
  "to demonstrate","to emphasize","to enumerate","to explain","to illustrate","to list","to point out","to put it another way",
  "to put it differently","to repeat","to rephrase it","to start with","to sum up","to summarize","to that end",
  "to the end that","to this end","together with","truly","ultimately","under those circumstances","undeniably",
  "undoubtedly","unless","unlike","until","until now","up against","up to the present time","what's more",
  "when","whenever","while","with attention to","with this in mind","with this intention","with this purpose in mind",
  "without a doubt","without delay","without doubt","without exception","without reservation","yet"
];

export const TRANSITION_SINGLES_EN = new Set<string>(
  TRANSITION_PHRASES_EN.filter((p) => !p.includes(" ")).map((p) => p.toLowerCase()),
);

export function sentenceHasTransition(sentence: string): boolean {
  const s = sentence.toLowerCase();
  for (const phrase of TRANSITION_PHRASES_EN) {
    if (!phrase.includes(" ")) continue;
    if (s.includes(` ${phrase} `) || s.startsWith(`${phrase} `) || s.endsWith(` ${phrase}`)) return true;
  }
  const tokens = s.split(/[^a-z']+/).filter(Boolean);
  for (const t of tokens) if (TRANSITION_SINGLES_EN.has(t)) return true;
  return false;
}
