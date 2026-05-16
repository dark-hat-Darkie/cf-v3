/**
 * Curated English content-quality dictionaries.
 * Sourced from headline-CTR research (power words), Strunk & White (weasel /
 * filler), and common content style guides. Phrases are matched whole-word.
 */

/** "Power" or emotion-charged words that lift CTR in headlines. */
export const POWER_WORDS = new Set<string>([
  // proven / authority
  "proven","ultimate","essential","complete","definitive","comprehensive","official","trusted","verified",
  "expert","authoritative","authentic","accurate","authentic","credible","insider","backed","tested",
  // urgency
  "now","today","instantly","immediate","fast","quick","quickly","limited","deadline","hurry","last","final","ending",
  // exclusivity
  "secret","exclusive","private","unique","rare","hidden","unspoken","forbidden","banned","members","insider",
  // value
  "free","bonus","discount","save","cheap","affordable","value","worth","payback","payout","roi",
  // curiosity
  "amazing","surprising","unexpected","shocking","incredible","unbelievable","mindblowing","strange",
  // negative emotion (still lift)
  "avoid","never","worst","mistake","mistakes","warning","danger","wrong","stop","fail",
  // benefit
  "best","top","leading","winning","winner","huge","massive","massive","powerful","stunning",
  // results
  "results","boost","grow","growth","double","triple","increase","decrease","skyrocket","unlock",
  // story
  "story","journey","lessons","case","study","behind",
  // how / why / what
  "how","why","what","when","where",
  // direct
  "you","yours",
]);

/** Vague / "weasel" words that dilute claims. */
export const WEASEL_WORDS = new Set<string>([
  "some","several","many","various","most","majority","minority","few","number","numerous",
  "often","usually","sometimes","occasionally","frequently","commonly","generally","typically","mostly","mainly",
  "perhaps","maybe","possibly","probably","likely","apparently","arguably","supposedly","reportedly","allegedly",
  "may","might","could","seems","seemed","appears","appeared",
  "almost","nearly","approximately","roughly","around","about","circa",
  "fairly","quite","rather","somewhat","kind","sort",
  "experts","studies","research","scientists","they","people","everyone","everybody",
  "things","stuff","essentially","basically","actually","literally","virtually","practically",
]);

/** Filler words that add length without meaning. */
export const FILLER_WORDS = new Set<string>([
  "very","really","just","quite","truly","actually","basically","literally","totally","completely","absolutely",
  "definitely","certainly","clearly","obviously","simply","essentially","fundamentally","ultimately",
  "rather","fairly","somewhat","kind","sort","stuff","things","like","that",
  "then","so","well","right","okay","ok",
]);

/** Clichés that signal stale writing. Phrases (lowercase). */
export const CLICHES: string[] = [
  "at the end of the day",
  "think outside the box",
  "low hanging fruit",
  "move the needle",
  "boil the ocean",
  "synergy",
  "circle back",
  "drill down",
  "deep dive",
  "best practices",
  "game changer",
  "game-changer",
  "paradigm shift",
  "moving forward",
  "going forward",
  "world class",
  "world-class",
  "needle in a haystack",
  "win-win",
  "win win",
  "level up",
  "double down",
  "take it to the next level",
  "raise the bar",
  "push the envelope",
  "hit the ground running",
  "value add",
  "value-add",
  "value proposition",
  "secret sauce",
  "rock star",
  "rockstar",
  "ninja",
  "guru",
  "in this day and age",
  "at this point in time",
  "needless to say",
  "it goes without saying",
  "without further ado",
  "first and foremost",
  "in conclusion",
  "to be honest",
  "honestly",
  "with all due respect",
  "for what it's worth",
  "let's unpack",
  "the perfect storm",
];

/** Bad / vague anchor text. */
export const BAD_ANCHOR_TEXT = new Set<string>([
  "click here","click","here","read more","learn more","more","this","that","this link","link","more info",
  "read this","this article","this post","details","check this out","check it out","go","tap here","find out",
]);

/** Adverbs/modifiers commonly used in passive constructions and weak writing. */
export const WEAK_VERBS = new Set<string>([
  "is","was","were","been","being","be","have","has","had","get","got","make","made","do","did","does",
]);

/** Boilerplate redundancies. */
export const REDUNDANCIES: Array<[string, string]> = [
  ["absolutely essential", "essential"],
  ["actual fact", "fact"],
  ["added bonus", "bonus"],
  ["advance planning", "planning"],
  ["advance warning", "warning"],
  ["all-time record", "record"],
  ["basic fundamentals", "fundamentals"],
  ["close proximity", "near"],
  ["completely eliminate", "eliminate"],
  ["completely surrounded", "surrounded"],
  ["definite decision", "decision"],
  ["end result", "result"],
  ["exact same", "same"],
  ["each and every", "every"],
  ["false pretense", "pretense"],
  ["final outcome", "outcome"],
  ["foreign import", "import"],
  ["free gift", "gift"],
  ["future plans", "plans"],
  ["general consensus", "consensus"],
  ["honest truth", "truth"],
  ["new innovation", "innovation"],
  ["past history", "history"],
  ["personal opinion", "opinion"],
  ["plan ahead", "plan"],
  ["really very", "very"],
  ["sum total", "total"],
  ["unexpected surprise", "surprise"],
  ["very unique", "unique"],
];

/** Common alt-text antipatterns. */
export const ALT_TEXT_BAD_PREFIXES = ["image of", "picture of", "photo of", "graphic of", "icon of"];
