// Lightweight English passive-voice detector.
// Heuristic: a sentence is flagged passive if it contains a form of "to be"
// followed within a 3-word window by a past participle that is NOT typically used
// in an active perfect tense context. This catches the majority of true passives
// in marketing prose without heavy NLP overhead.

const BE_FORMS = new Set(["am","is","are","was","were","be","been","being","get","gets","got","getting"]);

const COMMON_PAST_PARTICIPLES = new Set<string>([
  "abandoned","accepted","achieved","acquired","added","addressed","adjusted","administered","admitted","adopted",
  "advised","affected","aimed","allocated","allowed","altered","analyzed","announced","answered","applied","appointed",
  "approved","arranged","arrested","assembled","assessed","assigned","assisted","attached","attended","authored","authorized",
  "automated","awarded","banned","based","beaten","begun","believed","bitten","blamed","blocked","born","borrowed",
  "bought","broken","brought","built","burned","bought","cancelled","captured","carried","cast","caught","caused",
  "celebrated","challenged","changed","charged","checked","chosen","claimed","cleaned","cleared","clicked","closed",
  "coded","collected","combined","committed","communicated","compared","compiled","completed","composed","concerned",
  "concluded","conducted","confirmed","confronted","connected","considered","constructed","consumed","contacted","contained",
  "continued","contributed","controlled","converted","conveyed","cooked","copied","corrected","corresponded","cost",
  "counted","covered","created","credited","crossed","cut","damaged","deactivated","dealt","debated","decided","declared",
  "decreased","defined","delayed","delegated","delivered","demanded","demonstrated","denied","deployed","described",
  "designed","destroyed","detected","determined","developed","devoted","died","directed","disabled","discharged","disclosed",
  "discovered","discussed","dismissed","displayed","disposed","disrupted","distributed","divided","documented","done",
  "donated","double-checked","downloaded","drafted","drawn","dressed","driven","dropped","earned","eaten","edited",
  "educated","elected","eliminated","embedded","emphasized","employed","enabled","encountered","encouraged","ended",
  "endorsed","enforced","engaged","engineered","enhanced","enjoyed","enriched","entered","entertained","entitled","equipped",
  "established","estimated","evaluated","examined","exceeded","excluded","executed","exhausted","expanded","expected",
  "experienced","explained","explored","exported","exposed","expressed","extended","extracted","faced","faded","failed",
  "favored","filed","filled","filmed","filtered","financed","fined","finished","fired","fitted","fixed","flagged",
  "flown","focused","followed","forbidden","forced","forecast","forgotten","formed","forwarded","fought","found","framed",
  "frozen","fuelled","fulfilled","funded","gained","gathered","generated","given","governed","graded","granted","grouped",
  "grown","guaranteed","guided","handled","handed","happened","harvested","headed","heard","held","helped","hidden","hired",
  "hit","hosted","identified","ignored","illustrated","implemented","imported","imposed","impressed","improved","included",
  "increased","incurred","indicated","induced","influenced","informed","initiated","injured","inserted","inspected","inspired",
  "installed","instructed","insured","integrated","intended","intercepted","interpreted","interrupted","introduced","invented",
  "invested","investigated","invited","involved","issued","joined","judged","kept","killed","knocked","known","labeled","laid",
  "launched","lead","leaked","learned","led","left","lent","let","liberated","licensed","lifted","liked","limited","linked",
  "listed","loaded","loaned","located","logged","looked","lost","made","mailed","maintained","managed","mandated","marked",
  "marketed","matched","measured","mentioned","merged","minimized","missed","modified","monitored","motivated","moved","named",
  "navigated","needed","negotiated","noted","noticed","notified","observed","obtained","occupied","offered","offset","opened",
  "operated","ordered","organized","outsourced","overcome","overseen","overturned","owned","packed","painted","paid","parked",
  "passed","patented","paused","performed","permitted","persuaded","picked","piloted","placed","planned","played","posted",
  "powered","practiced","praised","predicted","preferred","prepared","prescribed","presented","preserved","pressed","prevented",
  "previewed","priced","printed","prioritized","processed","produced","programmed","prohibited","projected","promoted","prompted",
  "proposed","protected","proved","provided","published","pulled","purchased","pursued","pushed","put","qualified","quoted",
  "raised","ranked","rated","reached","read","realized","received","recognized","recommended","reconciled","recorded","recovered",
  "recruited","reduced","referred","refined","reflected","refunded","refused","regained","registered","regulated","rejected",
  "related","released","relied","relocated","remained","remarketed","remembered","remixed","removed","rendered","renewed",
  "rented","reorganized","repaid","repaired","repeated","replaced","replied","reported","represented","reprinted","reproduced",
  "reproved","requested","required","rescheduled","researched","resolved","responded","restored","restricted","resumed","retained",
  "retired","retrieved","returned","revealed","reviewed","revised","revoked","ridden","ringed","rolled","ruled","run","sacked",
  "said","sampled","saved","scanned","scheduled","screened","sealed","searched","secured","seen","seized","selected","sent",
  "served","set","settled","shared","shaped","shifted","shipped","shortened","shown","shut","signed","simplified","simulated",
  "sized","sketched","slowed","sold","solved","sorted","sought","sourced","spent","sponsored","spread","staffed","staged",
  "standardized","started","stated","stayed","steered","stocked","stopped","stored","streamed","streamlined","stressed","structured",
  "studied","submitted","subscribed","subsidized","suggested","summarized","supplied","supported","surveyed","suspended","switched",
  "synced","synthesized","tagged","taken","targeted","taught","taxed","tested","tied","timed","tipped","tolerated","tracked",
  "trained","transferred","transformed","translated","transported","treated","tried","triggered","trimmed","trusted","tuned",
  "uncovered","underestimated","underlined","understood","undertaken","unfolded","unified","updated","upheld","uploaded","urged",
  "used","valued","verified","viewed","visited","voted","waged","warned","weakened","welcomed","widened","won","worked","worn",
  "wrapped","written"
]);

const ED_EXCEPTIONS = new Set<string>([
  // simple past forms commonly mistaken for participles in an active context are still detected;
  // exceptions are non-passive -ed verbs like "indeed", "kindred", etc.
  "indeed","needed","seemed",
]);

function isParticiple(word: string): boolean {
  const w = word.toLowerCase();
  if (ED_EXCEPTIONS.has(w)) return false;
  if (COMMON_PAST_PARTICIPLES.has(w)) return true;
  // Regular -ed past participle, minimum 4 chars
  if (w.length >= 4 && w.endsWith("ed") && /^[a-z'-]+$/.test(w)) return true;
  return false;
}

export function isSentencePassive(sentence: string): boolean {
  const tokens = sentence.toLowerCase().split(/[^a-z'-]+/).filter(Boolean);
  for (let i = 0; i < tokens.length; i++) {
    if (BE_FORMS.has(tokens[i])) {
      for (let j = i + 1; j <= Math.min(tokens.length - 1, i + 4); j++) {
        if (isParticiple(tokens[j])) return true;
        // Stop if we cross a clause boundary heuristic
        if (["that","which","who","because","but","and","or"].includes(tokens[j])) break;
      }
    }
  }
  return false;
}
