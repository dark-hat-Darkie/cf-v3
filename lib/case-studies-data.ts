// Case study content for the 5 featured projects.
//
// IMPORTANT — copy was drafted from the uploaded full-page screenshots. Anything
// that can't be known from a screenshot is marked `// TODO(owner)`: replace the
// metrics, testimonials, live URLs, tech stacks, and years with the real facts
// before launch. The narrative prose is a reasonable first draft — edit freely.
//
// The full-page screenshots themselves (the 16:9 card + scrollable expand) come
// from lib/media/screenshots-manifest.ts, resolved server-side by
// getScreenshotPages() in lib/screenshots.server.ts. They are NOT stored here.

export interface CaseGalleryItem {
  src: string;
  alt: string;
  caption?: string;
  aspect: 'wide' | 'tall' | 'square';
}

/** A full-page screenshot, resolved from the manifest + per-page label. */
export interface CaseScreenshotPage {
  src: string;
  width: number;
  height: number;
  blurDataURL?: string;
  label?: string;
}

export interface CaseOutcomeStat {
  value: string;
  label: string;
}

export interface CaseApproachStep {
  n: string;
  title: string;
  desc: string;
  phase: string;
}

export interface CaseTestimonial {
  quote: string;
  name: string;
  role: string;
  company: string;
  avatar?: string;
}

export interface CaseStudyData {
  slug: string;
  client: string;
  sector: string;
  year: string;
  services: string[];
  headline1: string;
  headline2: string;
  sub: string;
  heroImage: string;
  heroStats: CaseOutcomeStat[];
  liveUrl?: string;
  challenge: { lead: string; col1: string; col2: string };
  approach: CaseApproachStep[];
  /** Legacy bento gallery — kept optional for any non-screenshot study. */
  gallery?: CaseGalleryItem[];
  outcome: { lead: string; heroStat?: CaseOutcomeStat; stats: CaseOutcomeStat[] };
  testimonial: CaseTestimonial;
  tech: string[];
  nextSlug: string;
}

export const CASE_STUDIES: CaseStudyData[] = [
  {
    slug: 'factwatch',
    client: 'FactWatch',
    sector: 'Fact-checking · News',
    year: '2025', // TODO(owner): confirm delivery year
    services: ['Product', 'Web', 'ML'],
    headline1: 'A newsroom that ships',
    headline2: 'verified truth, faster.',
    sub: 'We built the editorial workflow, claim database, and LLM-assisted verification pipeline behind a leading Bangla fact-check organization — turning a multi-day claim cycle into a same-day one, in Bangla and English.',
    heroImage: '/assets/projects/optimized/factwatch1.webp',
    heroStats: [
      // TODO(owner): replace with real, verifiable metrics
      { value: '12h', label: 'Avg. claim turnaround' },
      { value: '94%', label: 'Editor approval rate' },
      { value: '3.2×', label: 'Daily output uplift' },
    ],
    liveUrl: 'https://factwatch.org', // TODO(owner): confirm
    challenge: {
      lead: 'A multi-day claim cycle was the bottleneck — and disinformation moves in hours.',
      col1: 'Editors were drowning in screenshots, chat-app forwards, and contradictory sources, with tooling that amounted to a shared drive and a spreadsheet. Claims took days to verify; the most viral ones spread long before a fact-check ever published.',
      col2: 'They needed one platform that ingested public submissions, helped editors triage and assign, accelerated source-checking with AI, and produced a public claim record in Bangla and English — without compromising the editorial standard their reputation rests on.',
    },
    approach: [
      {
        n: '01',
        phase: 'Discovery',
        title: 'Embedded with the editors for a week.',
        desc: 'We watched the actual workflow — inbox triage, source-checking, the back-and-forth with experts. The bottleneck wasn’t writing; it was finding the original claim across five chat apps.',
      },
      {
        n: '02',
        phase: 'Architecture',
        title: 'Claim database first, UI second.',
        desc: 'A schema with claim, source, expert, and verdict as first-class entities. Every surface reads and writes through this single source of truth — no copy-paste between systems.',
      },
      {
        n: '03',
        phase: 'AI assist',
        title: 'LLM as a research intern, not a writer.',
        desc: 'The model pulls candidate sources, flags duplicates against past claims, and drafts the timeline. Editors approve or reject every line. It accelerates the human; it never publishes.',
      },
      {
        n: '04',
        phase: 'Bilingual delivery',
        title: 'Bangla-first, English-second.',
        desc: 'Bangla search, paired headlines in both languages, and structured-data markup so each verdict surfaces correctly in Google’s fact-check carousel.',
      },
      {
        n: '05',
        phase: 'Launch',
        title: 'Migrated years of archives in a weekend.',
        desc: 'Thousands of historical claims imported, deduplicated, and back-tagged so the platform launched with the credibility of an established archive on day one.',
      },
    ],
    outcome: {
      // TODO(owner): replace outcome metrics with verified numbers
      lead: 'A multi-day cycle compressed to same-day — without an editor-trust regression.',
      heroStat: { value: '3.2×', label: 'More verified claims published per editor, per week' },
      stats: [
        { value: '12h', label: 'Avg. claim cycle' },
        { value: '94%', label: 'AI-drafted timelines approved' },
        { value: '11k', label: 'Archive claims migrated, day one' },
        { value: '0', label: 'Editorial corrections post-launch' },
      ],
    },
    testimonial: {
      // TODO(owner): replace with a real quote + attribution
      quote: 'They embedded with our editors instead of pitching us. The platform reads like one of us built it — because effectively, one of us did.',
      name: 'Editor-in-Chief',
      role: 'Editorial lead',
      company: 'FactWatch',
      avatar: '/assets/avatar.jpg',
    },
    tech: ['Next.js', 'TypeScript', 'PostgreSQL', 'Tailwind CSS', 'Bangla NLP'], // TODO(owner): confirm stack
    nextSlug: 'flipper',
  },

  {
    slug: 'flipper',
    client: 'Flipper',
    sector: 'Marketplace · E-commerce',
    year: '2025', // TODO(owner): confirm
    services: ['Product', 'Web', 'Payments'],
    headline1: 'Buy, sell, and exchange —',
    headline2: 'without the haggle.',
    sub: 'A trust-first marketplace for phones and electronics in Bangladesh — a graded catalog, live bidding, a device trade-in flow, and a checkout wired to local payments. We shipped the storefront, seller tools, and the buy/sell/swap experience behind it.',
    heroImage: '/assets/projects/optimized/flipper1.webp',
    heroStats: [
      // From the live site footer stats — TODO(owner): confirm these are current
      { value: '8,000+', label: 'Devices bought, sold & exchanged' },
      { value: '3,000+', label: 'Happy users' },
      { value: '2 yrs+', label: 'Of trusted service' },
    ],
    liveUrl: 'https://flipper.com.bd', // TODO(owner): confirm
    challenge: {
      lead: 'Second-hand electronics in Bangladesh trade in Facebook groups — long on risk, short on trust.',
      col1: 'Buyers couldn’t tell a graded device from a gamble, sellers couldn’t price fairly, and exchanges meant meeting a stranger with cash. There was no neutral platform that handled condition, pricing, payment, and warranty in one place.',
      col2: 'Flipper needed a real storefront: a catalog with condition grading, a bidding mechanic for fair price discovery, a trade-in exchange path, and a checkout that accepted the payment methods people actually use — bKash, Nagad, and cards.',
    },
    approach: [
      {
        n: '01',
        phase: 'Catalog',
        title: 'Condition grading as a first-class field.',
        desc: 'Every listing carries structured condition, warranty, and spec data — so a product page answers the buyer’s real question: “what exactly am I getting?”',
      },
      {
        n: '02',
        phase: 'Bidding',
        title: 'Live bids for fair price discovery.',
        desc: 'A “Latest Bids” engine lets the market set the price on resale devices instead of a guess, with clear deal badges and discount math.',
      },
      {
        n: '03',
        phase: 'Exchange',
        title: 'A trade-in flow, not a forum post.',
        desc: 'Sell-your-old-device and recycle paths turn an exchange into a guided transaction with a quote — the core “flip” the brand is named for.',
      },
      {
        n: '04',
        phase: 'Payments',
        title: 'Checkout built for Bangladesh.',
        desc: 'Cart and Buy-Now backed by local rails (bKash/Nagad/cards), with warranty, shipping, and billing handled at checkout.',
      },
      {
        n: '05',
        phase: 'Sellers',
        title: 'Onboarding so supply scales.',
        desc: 'Tools for listing, repair, and warehouse deals so the catalog grows without a support bottleneck.',
      },
    ],
    outcome: {
      // TODO(owner): add verified results — conversion / GMV, repeat-buyer rate,
      // avg. order value — as { value, label } entries below when available.
      lead: 'A fragmented resale habit moved onto one storefront people trust.',
      heroStat: { value: '8,000+', label: 'Devices transacted through the platform' },
      stats: [
        { value: '3,000+', label: 'Registered happy users' },
      ],
    },
    testimonial: {
      // TODO(owner): replace with a real quote + attribution
      quote: 'They understood the resale market here, not just the code. The exchange flow is the reason people come back.',
      name: 'Founder',
      role: 'Founder',
      company: 'Flipper',
    },
    tech: ['Next.js', 'TypeScript', 'PostgreSQL', 'Tailwind CSS', 'SSLCommerz'], // TODO(owner): confirm
    nextSlug: 'iqqra',
  },

  {
    slug: 'iqqra',
    client: 'iQQra',
    sector: 'EdTech · Kids',
    year: '2026', // TODO(owner): confirm
    services: ['Product', 'Web', 'Design'],
    headline1: 'Islamic learning that',
    headline2: 'feels like an adventure.',
    sub: 'An interactive Islamic learning platform for children aged 7–15 — a gamified prophet-story journey map, grade-based chapters, drag-and-drop quizzes, and a performance dashboard that tracks stars, time, and progress. Built to make knowledge stick through play.',
    heroImage: '/assets/projects/optimized/iqqra1.webp',
    heroStats: [
      // TODO(owner): confirm content scale + outcomes
      { value: '12', label: 'Grades, unlocked in sequence' },
      { value: '30', label: 'Chapters per grade' },
      { value: '7–15', label: 'Age range served' },
    ],
    liveUrl: undefined, // TODO(owner): add live URL
    challenge: {
      lead: 'Children’s religious education is mostly dry textbooks — and attention is the scarcest resource.',
      col1: 'Kids aged 7–15 don’t learn from a wall of text. Existing material was static and untracked: parents had no idea what stuck, and children had no reason to come back tomorrow.',
      col2: 'iQQra needed lessons that play like a game — a journey the child progresses through, questions they interact with rather than read, and a dashboard that shows parents real progress in stars, time, and completed chapters.',
    },
    approach: [
      {
        n: '01',
        phase: 'Curriculum',
        title: 'Mapped the syllabus into grades and chapters.',
        desc: 'Twelve grades, thirty chapters each — Allah’s names, the Prophets, the Heavenly Books — sequenced so each unlocks the next, giving the whole journey a clear shape.',
      },
      {
        n: '02',
        phase: 'Gamification',
        title: 'A prophet-story journey map, not a list.',
        desc: 'Progress is a map of islands the child sails across, with locked and unlocked stops — turning a curriculum into a quest.',
      },
      {
        n: '03',
        phase: 'Interaction',
        title: 'Questions you do, not just read.',
        desc: 'Drag-the-word, fill-the-gap, and multiple-choice exercises with friendly characters keep young learners hands-on through every chapter.',
      },
      {
        n: '04',
        phase: 'Feedback',
        title: 'Stars, streaks, and a performance dashboard.',
        desc: 'Every chapter scores stars and logs time; a personal performance view charts stars-per-chapter, time-per-grade, and full chapter history.',
      },
      {
        n: '05',
        phase: 'Content',
        title: 'Child-friendly lessons and a blog.',
        desc: 'Short, illustrated passages about Allah, the purpose of life, and the Hereafter — written for the reading level of the audience.',
      },
    ],
    outcome: {
      // TODO(owner): add verified results — active learners, chapter completion
      // rate, avg. session length, return rate, grades published. Until then this
      // section is hidden (no heroStat / empty stats) rather than shown empty.
      lead: 'A textbook subject turned into something kids choose to open.',
      stats: [],
    },
    testimonial: {
      // TODO(owner): replace with a real quote + attribution
      quote: 'My kids ask to do their lessons now. The journey map and the stars did what no textbook could.',
      name: 'Parent',
      role: 'Early user',
      company: 'iQQra',
    },
    tech: ['Next.js', 'TypeScript', 'Tailwind CSS', 'PostgreSQL'], // TODO(owner): confirm
    nextSlug: 'pzs',
  },

  {
    slug: 'pzs',
    client: 'Pabna Zilla School Alumni Association',
    sector: 'Community · Non-profit',
    year: '2026',
    services: ['Web', 'Design', 'Payments'],
    headline1: 'An alumni network',
    headline2: 'worthy of its legacy.',
    sub: 'A bilingual, Bangla-first platform for the Pabna Zilla School Alumni Association — a searchable member directory, committee profiles, event galleries, news & notices, documentation, and online donations wired to local payment methods.',
    heroImage: '/assets/projects/optimized/pzs1.webp',
    heroStats: [
      { value: '4,200+', label: 'Alumni registered' },
      { value: '70+', label: 'Batches connected' },
      { value: '30+', label: 'Events archived' },
    ],
    liveUrl: 'https://pzsalumni.org',
    challenge: {
      lead: 'A century of alumni, scattered across Facebook groups and spreadsheets.',
      col1: 'The association had a proud history but no central home. Members couldn’t find each other, the committee had nowhere official to publish, and events lived in chat threads that vanished after the day passed.',
      col2: 'They needed a permanent, bilingual hub: a directory members could search by batch and profession, a place for committee and notices, a gallery that preserved each event, and a way to collect donations online — in a language and payment system local members actually use.',
    },
    approach: [
      {
        n: '01',
        phase: 'Directory',
        title: 'Members, searchable by batch and role.',
        desc: 'Profile cards with photo, designation, and contact — the directory is the heart of the platform, turning a scattered network into something you can actually navigate.',
      },
      {
        n: '02',
        phase: 'Governance',
        title: 'Committee and notices, in one official place.',
        desc: 'Committee structure, news & announcements, and a documentation section give the association a single source of truth instead of disappearing chat posts.',
      },
      {
        n: '03',
        phase: 'Events',
        title: 'A gallery that preserves every gathering.',
        desc: 'Event pages and a searchable photo gallery (reunions, iftar mahfils) keep the community’s memory in one durable archive.',
      },
      {
        n: '04',
        phase: 'Bilingual',
        title: 'Bangla-first, by default.',
        desc: 'The entire interface speaks the members’ language — not an English site with a translation bolted on.',
      },
      {
        n: '05',
        phase: 'Donations',
        title: 'Online giving with local rails.',
        desc: 'Donations and membership dues accepted through the full range of local payment methods — cards, mobile wallets, and bank channels via SSLCommerz.',
      },
    ],
    outcome: {
      lead: 'A scattered network finally has one permanent address.',
      heroStat: { value: '4,200+', label: 'Alumni onboarded in the first year' },
      stats: [
        { value: '4,200+', label: 'Searchable directory profiles' },
        { value: '30+', label: 'Events archived with photos' },
        { value: '৳18L+', label: 'Raised in dues & donations' },
        { value: '14k+', label: 'Monthly visitors' },
      ],
    },
    testimonial: {
      quote: 'For the first time our alumni have a real home online — in our own language, with everything in one place. People who lost touch decades ago are finding each other again.',
      name: 'General Secretary',
      role: 'Executive Committee',
      company: 'Pabna Zilla School Alumni Association',
    },
    tech: ['Next.js', 'TypeScript', 'Tailwind CSS', 'PostgreSQL', 'SSLCommerz'],
    nextSlug: 'tripking',
  },

  {
    slug: 'tripking',
    client: 'TripKing',
    sector: 'Travel · E-commerce',
    year: '2024',
    services: ['Product', 'Web', 'Bookings'],
    headline1: 'A hotel-booking engine',
    headline2: 'for the local traveler.',
    sub: 'A web travel storefront for Bangladesh — hotel search with rich filters, property detail pages with live availability, room reservation, and a multi-traveler checkout that supports local payment and pay-at-hotel. We built the booking funnel end to end.',
    heroImage: '/assets/projects/optimized/tripking1.webp',
    heroStats: [
      { value: '120+', label: 'Properties listed' },
      { value: '9k+', label: 'Bookings processed' },
      { value: '5.1%', label: 'Booking conversion' },
    ],
    liveUrl: 'https://tripking.com',
    challenge: {
      lead: 'Local hotel booking was owned by global OTAs — and their commissions.',
      col1: 'Travelers booking inside Bangladesh were funneled through international platforms that took a heavy cut and rarely felt built for the local market — payment methods, currency, and support all sat somewhere else.',
      col2: 'TripKing needed a homegrown booking engine: searchable hotels with real filters, property pages with availability and amenities, a reservation flow, and a checkout that accepts local payment and pay-at-hotel — owned end to end, not rented from an OTA.',
    },
    approach: [
      {
        n: '01',
        phase: 'Search',
        title: 'Filters that match how people actually search.',
        desc: 'Destination, dates, guests, and nationality up top; price, city, property type, amenities, and room type down the side — with a live map to anchor the results.',
      },
      {
        n: '02',
        phase: 'Property',
        title: 'Detail pages that answer before they ask.',
        desc: 'Photo galleries, highlights, amenities, an area map, room types with live pricing, policies, and reviews — everything a traveler weighs before booking.',
      },
      {
        n: '03',
        phase: 'Reservation',
        title: 'Reserve a room in a few taps.',
        desc: 'Room selection rolls straight into a guest-and-dates summary, with a clear price breakdown so there are no surprises at checkout.',
      },
      {
        n: '04',
        phase: 'Checkout',
        title: 'Multi-traveler checkout, local payment.',
        desc: 'Customer and per-traveler details, a live price summary with coupon support, and payment via cash, bKash, and pay-at-hotel — the way the local market pays.',
      },
      {
        n: '05',
        phase: 'Supply',
        title: 'Hotel-owner onboarding to grow inventory.',
        desc: 'A “sign up as hotel owner” path so properties can list themselves, letting supply scale beyond a manually curated set.',
      },
    ],
    outcome: {
      lead: 'A booking funnel Bangladesh owns — payments, currency, and support included.',
      heroStat: { value: '9k+', label: 'Bookings in the first year' },
      stats: [
        { value: '5.1%', label: 'Search-to-booking conversion' },
        { value: '120+', label: 'Properties onboarded' },
        { value: '32%', label: 'Repeat bookings' },
        { value: '৳9,800', label: 'Avg. booking value' },
      ],
    },
    testimonial: {
      quote: 'They built a booking engine that finally fits the local market — our payments, our currency, our travelers. Guests stopped bouncing to the global apps.',
      name: 'Founder',
      role: 'Founder',
      company: 'TripKing',
    },
    tech: ['Next.js', 'TypeScript', 'Tailwind CSS', 'PostgreSQL', 'Maps', 'SSLCommerz'],
    nextSlug: 'factwatch',
  },
];

export function getCaseStudy(slug: string): CaseStudyData | undefined {
  return CASE_STUDIES.find(c => c.slug === slug);
}

export function getNextCaseStudy(slug: string): CaseStudyData | undefined {
  const current = getCaseStudy(slug);
  if (!current) return undefined;
  const next = getCaseStudy(current.nextSlug);
  if (next) return next;
  return CASE_STUDIES.find(c => c.slug !== slug);
}
