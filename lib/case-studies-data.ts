export interface CaseGalleryItem {
  src: string;
  alt: string;
  caption?: string;
  aspect: 'wide' | 'tall' | 'square';
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
  gallery: CaseGalleryItem[];
  outcome: { lead: string; heroStat: CaseOutcomeStat; stats: CaseOutcomeStat[] };
  testimonial: CaseTestimonial;
  tech: string[];
  nextSlug: string;
}

export const CASE_STUDIES: CaseStudyData[] = [
  {
    slug: 'factwatch',
    client: 'FactWatch',
    sector: 'Fact-checking · News',
    year: '2025',
    services: ['Product', 'Web', 'ML'],
    headline1: 'A newsroom that ships',
    headline2: 'verified truth, faster.',
    sub: 'We built the editorial workflow, claim database, and LLM-assisted verification pipeline behind Bangladesh’s leading fact-check organization — cutting a four-day claim cycle to under twelve hours.',
    heroImage: '/assets/factwatch.png',
    heroStats: [
      { value: '12h', label: 'Avg. claim turnaround' },
      { value: '94%', label: 'Editor approval rate' },
      { value: '3.2×', label: 'Daily output uplift' },
    ],
    liveUrl: 'https://factwatch.org',
    challenge: {
      lead: 'A four-day claim cycle was the bottleneck — and disinformation moves in hours.',
      col1: 'FactWatch’s editors were drowning in screenshots, WhatsApp forwards, and contradictory sources. Their existing tooling was a Google Drive folder and a spreadsheet. Claims took four days to verify on average; the most viral ones often spread for two days before a fact-check ever published.',
      col2: 'They needed a single platform that ingested submissions from the public, helped editors triage and assign, accelerated source-checking with AI, and generated a public-facing claim record in Bangla and English — without compromising the editorial standard their reputation rests on.',
    },
    approach: [
      {
        n: '01',
        phase: 'Discovery',
        title: 'Embedded with three editors for a week.',
        desc: 'We watched the actual workflow — inbox triage, source-checking, the back-and-forth with experts. The bottleneck wasn’t writing; it was finding the original claim across five chat apps.',
      },
      {
        n: '02',
        phase: 'Architecture',
        title: 'Claim database first, UI second.',
        desc: 'Postgres schema with claim, source, expert, and verdict as first-class entities. Every UI surface reads and writes through this single source of truth — no copy-paste between systems.',
      },
      {
        n: '03',
        phase: 'AI assist',
        title: 'LLM as a research intern, not a writer.',
        desc: 'GPT-4o pulls candidate sources, flags duplicates against past claims, and drafts the timeline. Editors approve or reject every line. The model never publishes — it accelerates the human.',
      },
      {
        n: '04',
        phase: 'Bilingual delivery',
        title: 'Bangla-first, English-second — not a translation afterthought.',
        desc: 'Custom tokenizer for Bangla search, paired headlines in both languages, structured-data markup so each verdict surfaces correctly in Google’s fact-check carousel.',
      },
      {
        n: '05',
        phase: 'Launch',
        title: 'Migrated four years of archives in a weekend.',
        desc: '11,000 historical claims imported, deduplicated, and back-tagged. The new platform launched with the credibility of an established archive on day one, not an empty database.',
      },
    ],
    gallery: [
      { src: '/assets/factwatch.png', alt: 'FactWatch claim dashboard', caption: 'Editorial dashboard — claim triage and AI-assisted research', aspect: 'wide' },
      { src: '/assets/fw-pricing.png', alt: 'FactWatch verdict layout', caption: 'Public verdict page with bilingual headlines and source ladder', aspect: 'tall' },
      { src: '/assets/c1.webp', alt: 'FactWatch design system', caption: 'Component system — Bangla + English type stack', aspect: 'tall' },
      { src: '/assets/c2.webp', alt: 'FactWatch verification flow', caption: 'Verification flow with expert review checkpoints', aspect: 'wide' },
    ],
    outcome: {
      lead: 'A four-day cycle compressed to twelve hours — without a single editor-trust regression.',
      heroStat: { value: '3.2×', label: 'More verified claims published per editor, per week' },
      stats: [
        { value: '12h', label: 'Avg. claim cycle (was 4 days)' },
        { value: '94%', label: 'AI-drafted timelines approved by editors' },
        { value: '11k', label: 'Archive claims migrated, day one' },
        { value: '0', label: 'Editorial corrections post-launch' },
      ],
    },
    testimonial: {
      quote: 'CodeFlee shipped what three previous teams couldn’t. They embedded with our editors instead of pitching us. The platform reads like one of us built it — because effectively, one of us did.',
      name: 'Shahriar Sadat',
      role: 'Editor-in-Chief',
      company: 'FactWatch',
      avatar: '/assets/avatar.jpg',
    },
    tech: ['Next.js', 'TypeScript', 'PostgreSQL', 'Prisma', 'OpenAI GPT-4o', 'Tailwind CSS', 'Vercel', 'Algolia', 'Cloudflare R2', 'Sentry', 'Resend', 'Bangla NLP'],
    nextSlug: 'nextstop',
  },

  {
    slug: 'nextstop',
    client: 'NextStop Travel',
    sector: 'Travel · E-commerce',
    year: '2024',
    services: ['Product', 'Web', 'Payments'],
    headline1: 'From spreadsheet',
    headline2: 'to $1.2M GMV.',
    sub: 'A custom CMS, Stripe-powered checkout, and a design system that turned a one-person tour operator into a profitable booking engine in twelve months — without a single platform fee.',
    heroImage: '/assets/nextstop.png',
    heroStats: [
      { value: '$1.2M', label: 'GMV in year one' },
      { value: '6.4%', label: 'Booking conversion' },
      { value: '< 1s', label: 'Checkout TTI' },
    ],
    liveUrl: 'https://nextstoptravel.com',
    challenge: {
      lead: 'Bookings were a Google Form. Payments were a WhatsApp message. Growth was capped by the founder’s sleep schedule.',
      col1: 'NextStop had a great product — hand-curated tours across South Asia — and a back office held together with spreadsheets, manual invoicing, and a WhatsApp group for confirmations. Every booking required the founder’s direct intervention. Scaling meant either hiring or rebuilding the operations from the ground up.',
      col2: 'They’d evaluated Shopify, WordPress, and a custom build. Shopify couldn’t handle multi-day itineraries with optional add-ons. WordPress couldn’t handle the inventory logic. They needed a custom storefront that felt high-end, converted on mobile, and ran the business behind the scenes.',
    },
    approach: [
      {
        n: '01',
        phase: 'Conversion audit',
        title: 'Funnel the existing flow before we touch a pixel.',
        desc: 'Two weeks shadowing inquiries, mapping where prospects dropped off, and pricing the cost of each friction point. The headline finding: 71% of dropoffs happened before they ever saw a price.',
      },
      {
        n: '02',
        phase: 'Design system',
        title: 'A Figma library tuned for travel storytelling.',
        desc: 'Editorial type pairings, photo-led product cards, and a checkout pattern stress-tested against the four most common booking objections (price, dates, group size, refunds).',
      },
      {
        n: '03',
        phase: 'Build',
        title: 'Next.js storefront + Stripe + a real CMS.',
        desc: 'Server-rendered listings for SEO, Stripe Checkout for compliance and trust, and a Sanity-backed CMS so the team can publish a new tour in under twenty minutes — without us in the loop.',
      },
      {
        n: '04',
        phase: 'Operations',
        title: 'Booking confirmations as the source of truth.',
        desc: 'Webhook-driven inventory, automated confirmation emails with PDF vouchers, and a Slack channel that pings the team the moment a booking lands. No more spreadsheets — the system runs the operations.',
      },
      {
        n: '05',
        phase: 'Launch + iterate',
        title: 'Weekly conversion experiments for six months.',
        desc: 'A/B tests on hero copy, deposit-vs-full-payment, and itinerary detail length. We left them with a documented playbook and a dashboard their team can actually read.',
      },
    ],
    gallery: [
      { src: '/assets/nextstop.png', alt: 'NextStop tour landing page', caption: 'Editorial tour landing — photo-led, conversion-tuned', aspect: 'wide' },
      { src: '/assets/01.png', alt: 'NextStop checkout flow', caption: 'Stripe Checkout with deposit-or-full payment toggle', aspect: 'square' },
      { src: '/assets/02.png', alt: 'NextStop CMS', caption: 'Sanity-backed CMS — ship a new tour in 20 min', aspect: 'square' },
      { src: '/assets/c3.png', alt: 'NextStop booking dashboard', caption: 'Operator dashboard — inventory, vouchers, payouts', aspect: 'wide' },
    ],
    outcome: {
      lead: 'Twelve months in: a profitable booking engine that runs without the founder’s direct intervention.',
      heroStat: { value: '$1.2M', label: 'Booking GMV in year one — from $0' },
      stats: [
        { value: '6.4%', label: 'Booking conversion rate' },
        { value: '38%', label: 'Of revenue from organic search' },
        { value: '< 1s', label: 'Checkout time-to-interactive' },
        { value: '0', label: 'Platform fees — fully owned stack' },
      ],
    },
    testimonial: {
      quote: 'I went from running a tour business out of a spreadsheet to running it out of a dashboard. CodeFlee didn’t just build the site — they figured out the operations, then built the software around it.',
      name: 'Mohon Khan',
      role: 'Founder',
      company: 'NextStop Travel',
      avatar: '/assets/mohon.png',
    },
    tech: ['Next.js', 'TypeScript', 'Stripe', 'Sanity', 'PostgreSQL', 'Tailwind CSS', 'Vercel', 'Resend', 'GA4', 'Cloudflare', 'Sentry', 'Slack API'],
    nextSlug: 'tripking',
  },

  {
    slug: 'tripking',
    client: 'TripKing',
    sector: 'Mobile · Travel',
    year: '2024',
    services: ['Mobile', 'Design', 'Maps'],
    headline1: 'A trip planner',
    headline2: 'that works offline.',
    sub: 'A React Native app with offline-first itineraries, live group collaboration, and a custom map layer — shipped in nine weeks, 4.8★ across both stores, and 60k MAU within six months.',
    heroImage: '/assets/TripKing.png',
    heroStats: [
      { value: '4.8★', label: 'iOS + Android avg.' },
      { value: '9 wks', label: 'Concept to App Store' },
      { value: '60k', label: 'MAU at month six' },
    ],
    liveUrl: 'https://apps.apple.com/app/tripking',
    challenge: {
      lead: 'Travel apps die offline. The moment you land somewhere new, the app you needed is the app that won’t load.',
      col1: 'TripKing’s founders had spent six months evaluating no-code builders and template apps. Every prototype broke at exactly the same moment: the user got off a plane, lost cell signal, and the app was useless. They needed offline-first as a hard requirement, not a stretch goal.',
      col2: 'They also wanted live collaboration — a group of friends planning a trip together, edits syncing in real time — plus a map that didn’t feel like Google Maps in a wrapper. And they wanted it in nine weeks. Most agencies told them it would take six months.',
    },
    approach: [
      {
        n: '01',
        phase: 'Architecture bet',
        title: 'Local-first state, sync as the side effect.',
        desc: 'We chose WatermelonDB on-device with a CRDT sync layer — the app reads and writes locally, then reconciles in the background when online. No “network required” screens, ever.',
      },
      {
        n: '02',
        phase: 'Design',
        title: 'Native gestures, not web patterns.',
        desc: 'Two weeks of pure interaction design. Drag-to-reorder itineraries with haptics, swipe-to-edit days, peek-and-pop on places. Every gesture earns its place — nothing is there to look fancy.',
      },
      {
        n: '03',
        phase: 'Maps',
        title: 'Mapbox + custom tiles for downloadable regions.',
        desc: 'Pre-cached city tiles bundled with each itinerary. Pins, routes, and points-of-interest render fully offline. The map looks like a hand-drawn travel sketch — not the gas-station feel of stock Google Maps.',
      },
      {
        n: '04',
        phase: 'Collaboration',
        title: 'CRDT sync — conflict-free, optimistic, fast.',
        desc: 'Two friends editing the same day, even on different continents, both see each other’s changes within 200ms when online — and merge cleanly when one of them lands.',
      },
      {
        n: '05',
        phase: 'Launch',
        title: 'TestFlight beta with 80 real travelers.',
        desc: 'Three weeks of structured beta testing across 12 countries. We shipped 14 patches, killed one feature that nobody used, and submitted to both stores in week nine.',
      },
    ],
    gallery: [
      { src: '/assets/TripKing.png', alt: 'TripKing app screens', caption: 'Itinerary builder — drag-to-reorder with haptics', aspect: 'wide' },
      { src: '/assets/03.png', alt: 'TripKing map view', caption: 'Custom Mapbox tiles — fully offline', aspect: 'tall' },
      { src: '/assets/04.png', alt: 'TripKing collaboration', caption: 'Live collaboration with CRDT sync', aspect: 'tall' },
      { src: '/assets/c2.webp', alt: 'TripKing onboarding', caption: 'Onboarding — from install to first trip in 90 seconds', aspect: 'wide' },
    ],
    outcome: {
      lead: 'Shipped in nine weeks, 4.8★ across both stores, and a foundation that scales to a million users.',
      heroStat: { value: '60k', label: 'Monthly active users at month six' },
      stats: [
        { value: '4.8★', label: 'iOS App Store rating' },
        { value: '4.8★', label: 'Google Play rating' },
        { value: '< 400ms', label: 'Cold start time' },
        { value: '9 wks', label: 'Concept to App Store approval' },
      ],
    },
    testimonial: {
      quote: 'Six other agencies told us nine weeks was impossible. CodeFlee scoped it honestly, shipped it on time, and the app held up under launch traffic. The architecture decisions they made early are still paying off.',
      name: 'Ferdous Rahman',
      role: 'Co-founder',
      company: 'TripKing',
      avatar: '/assets/ferdous.png',
    },
    tech: ['React Native', 'Expo', 'TypeScript', 'WatermelonDB', 'Mapbox', 'Yjs CRDT', 'Firebase', 'Sentry', 'Amplitude', 'TestFlight', 'Fastlane', 'RevenueCat'],
    nextSlug: 'nomadic',
  },

  {
    slug: 'nomadic',
    client: 'Nomadic Co.',
    sector: 'Hospitality · SEO',
    year: '2023',
    services: ['WordPress', 'SEO', 'Conversion'],
    headline1: 'A boutique brand',
    headline2: 'that ranks like a giant.',
    sub: 'Bespoke Gutenberg blocks, a booking engine that doesn’t feel like WordPress, and a conversion-tuned landing system — organic bookings up 3.4× year over year, on a tenth of the previous ad spend.',
    heroImage: '/assets/nomadic.webp',
    heroStats: [
      { value: '3.4×', label: 'Organic bookings YoY' },
      { value: '−90%', label: 'Cut in paid ad spend' },
      { value: '#1', label: 'For 14 head terms' },
    ],
    liveUrl: 'https://nomadic.co',
    challenge: {
      lead: 'A brand that punched above its weight visually — and below it on Google.',
      col1: 'Nomadic Co. ran six boutique stays across Southeast Asia, with a brand and a guest experience that felt closer to Aman than to Booking.com. Their site, however, was a stock theme — slow, generic, and ranking somewhere on page three for the searches that mattered. They were paying for traffic that should have been free.',
      col2: 'They didn’t want to leave WordPress — their team was trained on it, their content workflow was built around it, and they’d been burned by a Webflow migration the year before. We needed to make WordPress feel like a custom platform without the team having to learn anything new.',
    },
    approach: [
      {
        n: '01',
        phase: 'SEO audit',
        title: 'Found the cliff, then climbed it.',
        desc: 'Page-three rankings for fourteen high-intent head terms. Core Web Vitals failing on every property page. Schema markup missing entirely. We had a six-week roadmap before we wrote a line of theme code.',
      },
      {
        n: '02',
        phase: 'Custom Gutenberg',
        title: 'Blocks that match the brand, not the theme marketplace.',
        desc: 'Twelve custom Gutenberg blocks: hero with motion, suite gallery with editorial captions, availability widget, testimonial slider, journal feed. Editors compose pages like they’re building a magazine spread.',
      },
      {
        n: '03',
        phase: 'Booking engine',
        title: 'Direct bookings without an iframe.',
        desc: 'Custom integration with Cloudbeds via REST. Real-time availability, pricing, and direct deposit through Stripe — no more being a sub-page on Booking.com’s checkout.',
      },
      {
        n: '04',
        phase: 'Performance',
        title: 'Static-first delivery on top of WordPress.',
        desc: 'Cloudflare-cached HTML, image optimization with AVIF, and a critical-CSS pipeline. Core Web Vitals went from red to green on every page, which was 80% of the SEO win.',
      },
      {
        n: '05',
        phase: 'Conversion',
        title: 'A/B tests on the room cards — every quarter.',
        desc: 'We left them with a Convert.com pipeline and a documented hypothesis backlog. Quarterly experiments on price anchoring, gallery length, and reservation friction.',
      },
    ],
    gallery: [
      { src: '/assets/nomadic.webp', alt: 'Nomadic homepage', caption: 'Editorial homepage — Gutenberg blocks, custom motion', aspect: 'wide' },
      { src: '/assets/lomba.png', alt: 'Nomadic suite page', caption: 'Suite detail — availability and direct deposit checkout', aspect: 'tall' },
      { src: '/assets/lomba2.png', alt: 'Nomadic editorial', caption: 'Journal feed — long-form content for organic search', aspect: 'tall' },
      { src: '/assets/c1.webp', alt: 'Nomadic mobile experience', caption: 'Mobile booking flow — thumb-zone optimized', aspect: 'wide' },
    ],
    outcome: {
      lead: 'A brand that no longer pays for traffic it should be earning — and a team that owns every pixel.',
      heroStat: { value: '3.4×', label: 'Organic bookings, year over year' },
      stats: [
        { value: '#1', label: 'For 14 high-intent head terms' },
        { value: '−90%', label: 'Cut in paid acquisition spend' },
        { value: '94', label: 'Lighthouse score, mobile' },
        { value: '38%', label: 'Of bookings now direct' },
      ],
    },
    testimonial: {
      quote: 'We had been told for years that WordPress couldn’t do what we needed. CodeFlee proved otherwise. The site looks bespoke, the team didn’t need retraining, and our SEO finally caught up to the brand.',
      name: 'Lomba Chowdhury',
      role: 'Brand Director',
      company: 'Nomadic Co.',
      avatar: '/assets/shakil.png',
    },
    tech: ['WordPress', 'Gutenberg', 'PHP', 'MySQL', 'Cloudflare', 'Cloudbeds API', 'Stripe', 'AVIF', 'Schema.org', 'Convert.com', 'GA4', 'WP-CLI'],
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
