/**
 * DEMO CONTENT: placeholder copy written for the design, not verified facts.
 *
 * Everything in this file is safe to edit or delete. Replace it with real
 * material before launch; search the codebase for `demo-content` to see where
 * each piece is used.
 */

/** Names shown in the "Trusted by" strip. */
export const DEMO_CLIENTS = ['FactWatch', 'Flipper', 'iQQra', 'TripKing', 'NextStop', 'Nomadic', 'PZS Alumni'];

/** The three disciplines under the homepage statement. */
export const DEMO_PILLARS = [
  {
    title: 'Strategy',
    text: 'We start with the business problem, not the feature list, so what we ship moves a number you care about.',
    items: ['Product discovery', 'Technical architecture', 'Roadmaps & scoping'],
  },
  {
    title: 'Design',
    text: 'Interfaces that feel obvious the first time. Systems your team can extend without calling us.',
    items: ['UX & interface design', 'Design systems', 'Brand & motion'],
  },
  {
    title: 'Engineering',
    text: 'Typed, tested, documented code that still makes sense eighteen months after launch.',
    items: ['Web & mobile apps', 'APIs & integrations', 'Performance & reliability'],
  },
];

/** A headline result per case study, shown on work cards. */
export const DEMO_RESULTS: Record<string, { value: string; label: string }> = {
  factwatch: { value: '3.2×', label: 'more claims verified per editor' },
  flipper: { value: '8,000+', label: 'devices traded on the platform' },
  iqqra: { value: '30', label: 'interactive chapters per grade' },
  pzs: { value: '4,200+', label: 'alumni registered' },
  tripking: { value: '2.4×', label: 'faster checkout than before' },
};

/** Homepage FAQ. */
export const DEMO_FAQ = [
  {
    q: 'How fast can you start?',
    a: 'Most projects kick off within one to two weeks of the first call. We take on a small number of engagements per quarter so the team you meet is the team that ships your work.',
  },
  {
    q: 'How do you price projects?',
    a: 'Fixed scope, fixed price, paid in milestones. You see the number before anything starts, and if the scope changes we re-quote in writing before doing the work.',
  },
  {
    q: 'Who will actually work on my project?',
    a: 'Senior engineers and designers only. The people in the kickoff call are the people in your Slack channel. No hand-off to a junior team.',
  },
  {
    q: 'Do we own the code and designs?',
    a: 'Yes. Source code, repositories, design files and infrastructure are yours from day one. We work in your accounts whenever you prefer.',
  },
  {
    q: 'Can you work with our in-house team?',
    a: 'That is most of what we do. We join your stand-ups, follow your conventions, document everything and hand over cleanly.',
  },
  {
    q: 'What happens after launch?',
    a: 'Every project includes 30 days of fixes and small iterations. After that you can keep us on a monthly retainer or take it fully in-house.',
  },
];

/** Journal cards used to fill the row when fewer than three real posts exist. */
export const DEMO_POSTS = [
  { title: 'Shipping weekly: how we keep long projects honest.', tag: 'Engineering', date: 'Apr 2026' },
  { title: 'Design systems that survive their first redesign.', tag: 'Design', date: 'Mar 2026' },
  { title: 'Why we stay small: the case for senior-only teams.', tag: 'Studio', date: 'Feb 2026' },
];

/**
 * Extra case-study detail: duration, team, goals, features, before/after and
 * takeaways. DEMO: written to show the layout; replace with the real project facts.
 */
export type DemoCaseDetail = {
  duration: string;
  team: string;
  platform: string;
  solution: string;
  goals: string[];
  features: { title: string; desc: string }[];
  timeline: { phase: string; weeks: string; text: string }[];
  roles: { role: string; who: string }[];
  compare: { metric: string; before: string; after: string }[];
  takeaways: { title: string; text: string }[];
};

const TIMELINE = (a: string, b: string, c: string, d: string) => [
  { phase: 'Discovery', weeks: a, text: 'Stakeholder interviews, audit of the existing product and a written scope.' },
  { phase: 'Design', weeks: b, text: 'Flows, wireframes and a design system reviewed in weekly sessions.' },
  { phase: 'Build', weeks: c, text: 'Two-week sprints with a working demo at the end of each.' },
  { phase: 'Launch', weeks: d, text: 'Performance pass, content migration, go-live and hand-over.' },
];

const ROLES = [
  { role: 'Project lead', who: 'Ferdous Rahman' },
  { role: 'Design', who: 'Zahid Hasan' },
  { role: 'Engineering', who: 'Mohon Das' },
  { role: 'Engineering', who: 'Shakil Ahmed' },
];

export const DEMO_CASES: Record<string, DemoCaseDetail> = {
  factwatch: {
    duration: '14 weeks', team: '4 people', platform: 'Web · CMS · ML pipeline',
    solution: 'One editorial workspace where a claim moves from intake to published verdict, with an assistant that drafts the evidence timeline for an editor to approve.',
    goals: ['Publish verified claims the same day they surface', 'Keep every verdict traceable to its sources', 'Serve Bangla and English readers from one newsroom'],
    features: [
      { title: 'Claim database', desc: 'Every claim, source and verdict in one searchable, linkable record.' },
      { title: 'Editorial workflow', desc: 'Intake, research, review and publish stages with clear ownership.' },
      { title: 'Assisted verification', desc: 'Drafted evidence timelines that editors accept, edit or reject.' },
      { title: 'Bilingual publishing', desc: 'Bangla-first articles with English versions from the same record.' },
      { title: 'Verdict labels', desc: 'Consistent, shareable rating stamps across web and social cards.' },
      { title: 'Archive migration', desc: 'Years of earlier fact-checks imported with redirects preserved.' },
    ],
    timeline: TIMELINE('Weeks 1–2', 'Weeks 3–5', 'Weeks 6–12', 'Weeks 13–14'),
    roles: ROLES,
    compare: [
      { metric: 'Time from claim to verdict', before: '2–3 days', after: 'Same day' },
      { metric: 'Tools an editor switches between', before: '5', after: '1' },
      { metric: 'Claims published per editor, per week', before: 'Baseline', after: '3.2×' },
    ],
    takeaways: [
      { title: 'Sit with the people doing the work', text: 'A week inside the newsroom changed the scope more than any workshop would have.' },
      { title: 'Assist, never decide', text: 'Editors trusted the assistant because every draft was theirs to reject.' },
      { title: 'Migrate early', text: 'Moving the archive in the first sprint surfaced the hard data problems while there was time to fix them.' },
    ],
  },
  flipper: {
    duration: '16 weeks', team: '4 people', platform: 'Web · Payments · Admin',
    solution: 'A single storefront for buying, selling and exchanging devices, with graded listings, live bidding and local payment methods built in.',
    goals: ['Make second-hand devices feel as safe to buy as new ones', 'Let sellers list a device in under two minutes', 'Support the payment methods local buyers actually use'],
    features: [
      { title: 'Graded catalog', desc: 'Condition grades with photo evidence on every listing.' },
      { title: 'Live bidding', desc: 'Timed auctions with real-time price updates and outbid alerts.' },
      { title: 'Trade-in flow', desc: 'Instant estimate for an old device, applied to the new order.' },
      { title: 'Local payments', desc: 'Cards, mobile wallets and cash on delivery in one checkout.' },
      { title: 'Seller dashboard', desc: 'Listings, offers, payouts and ratings in one place.' },
      { title: 'Order tracking', desc: 'Status updates from inspection to doorstep.' },
    ],
    timeline: TIMELINE('Weeks 1–2', 'Weeks 3–6', 'Weeks 7–14', 'Weeks 15–16'),
    roles: ROLES,
    compare: [
      { metric: 'Time to list a device', before: '10+ minutes', after: 'Under 2 minutes' },
      { metric: 'Payment methods at checkout', before: '1', after: '4' },
      { metric: 'Listings with verified condition', before: 'None', after: 'All' },
    ],
    takeaways: [
      { title: 'Trust is a feature', text: 'Grades and photo evidence did more for conversion than any discount.' },
      { title: 'Design the seller side first', text: 'A marketplace only works when listing is effortless.' },
      { title: 'Pay the local way', text: 'Adding wallets and cash on delivery mattered more than a faster checkout.' },
    ],
  },
  iqqra: {
    duration: '12 weeks', team: '4 people', platform: 'Web app · Parent dashboard',
    solution: 'A story-led learning journey where each grade unlocks in sequence, with quizzes for children and a clear progress view for parents.',
    goals: ['Keep children aged 7–15 engaged without ads or distractions', 'Give parents a plain view of progress', 'Let the curriculum grow grade by grade'],
    features: [
      { title: 'Journey map', desc: 'A visual path through the prophet stories, one chapter at a time.' },
      { title: 'Grade-based chapters', desc: 'Content unlocks in order, matched to age and reading level.' },
      { title: 'Interactive quizzes', desc: 'Short checks after each chapter with instant, friendly feedback.' },
      { title: 'Parent dashboard', desc: 'Progress, time spent and quiz results per child.' },
      { title: 'Rewards', desc: 'Badges and streaks that reward steady learning, not screen time.' },
      { title: 'Content studio', desc: 'Editors add chapters and quizzes without a developer.' },
    ],
    timeline: TIMELINE('Weeks 1–2', 'Weeks 3–5', 'Weeks 6–10', 'Weeks 11–12'),
    roles: ROLES,
    compare: [
      { metric: 'Where parents saw progress', before: 'Nowhere', after: 'One dashboard' },
      { metric: 'Adding a new chapter', before: 'Developer needed', after: 'Editor, in minutes' },
      { metric: 'Chapters per grade', before: 'Unstructured', after: '30, in sequence' },
    ],
    takeaways: [
      { title: 'Design for two audiences', text: 'Children need play; parents need clarity. Each got its own interface.' },
      { title: 'Sequence beats choice', text: 'Unlocking chapters in order kept children moving forward.' },
      { title: 'Make content independent', text: 'The content studio is what lets the product grow after launch.' },
    ],
  },
  pzs: {
    duration: '10 weeks', team: '3 people', platform: 'Web · Payments · CMS',
    solution: 'A bilingual home for the association: a searchable member directory, event archive, notices and online donations.',
    goals: ['Reconnect alumni across decades of batches', 'Take donations and memberships online', 'Give the committee a site they can update themselves'],
    features: [
      { title: 'Member directory', desc: 'Search alumni by batch, profession and location.' },
      { title: 'Online registration', desc: 'Membership sign-up and renewal with payment in one flow.' },
      { title: 'Event galleries', desc: 'Photo archives for reunions and programmes, by year.' },
      { title: 'Notices', desc: 'Announcements published by the committee in Bangla and English.' },
      { title: 'Donations', desc: 'One-off and recurring giving with receipts.' },
      { title: 'Committee pages', desc: 'Current and past committees with roles and terms.' },
    ],
    timeline: TIMELINE('Week 1', 'Weeks 2–4', 'Weeks 5–9', 'Week 10'),
    roles: ROLES.slice(0, 3),
    compare: [
      { metric: 'Membership sign-up', before: 'Paper form', after: 'Online, with payment' },
      { metric: 'Finding a batch-mate', before: 'Word of mouth', after: 'Searchable directory' },
      { metric: 'Publishing a notice', before: 'Days', after: 'Minutes' },
    ],
    takeaways: [
      { title: 'Respect the legacy', text: 'The design leans on the school’s own colours and photographs.' },
      { title: 'Bilingual from day one', text: 'Building both languages into the content model avoided a costly retrofit.' },
      { title: 'Hand over the keys', text: 'Committee members publish without us, which is the real measure of success.' },
    ],
  },
  tripking: {
    duration: '15 weeks', team: '4 people', platform: 'Web · Bookings · Payments',
    solution: 'A booking engine with fast filtered search, property pages that show live availability, and a checkout built for groups.',
    goals: ['Help travellers find the right hotel in seconds', 'Show availability and price without a phone call', 'Make group bookings as easy as single ones'],
    features: [
      { title: 'Hotel search', desc: 'Filters for price, rating, amenities and location that respond instantly.' },
      { title: 'Live availability', desc: 'Room inventory and prices pulled in real time.' },
      { title: 'Property pages', desc: 'Photos, rooms, policies and reviews in a scannable layout.' },
      { title: 'Multi-traveller checkout', desc: 'Several rooms and guests in a single booking.' },
      { title: 'Local payments', desc: 'Cards and mobile wallets, with clear refund rules.' },
      { title: 'Offers engine', desc: 'Seasonal deals and promo codes managed by the team.' },
    ],
    timeline: TIMELINE('Weeks 1–2', 'Weeks 3–5', 'Weeks 6–13', 'Weeks 14–15'),
    roles: ROLES,
    compare: [
      { metric: 'Steps to complete a booking', before: '9', after: '4' },
      { metric: 'Checking availability', before: 'Phone call', after: 'Live on the page' },
      { metric: 'Checkout time', before: 'Baseline', after: '2.4× faster' },
    ],
    takeaways: [
      { title: 'Speed is the feature', text: 'Search that answers instantly changed how people browsed.' },
      { title: 'Show the price early', text: 'Surfacing the total up front cut drop-off at checkout.' },
      { title: 'Groups are the norm', text: 'Designing for several travellers first made single bookings trivial.' },
    ],
  },
};
