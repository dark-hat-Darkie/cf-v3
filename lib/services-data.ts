export interface ProcessStep {
  n: string;
  title: string;
  desc: string;
  duration: string;
}

export interface Deliverable {
  title: string;
  desc: string;
}

export interface ServiceStat {
  value: string;
  label: string;
}

export interface ServiceData {
  slug: string;
  n: string;
  title: string;
  chip: string;
  headline1: string;
  headline2: string;
  sub: string;
  img: string;
  stats: ServiceStat[];
  opening: { bold: string; rest: string };
  bodyCol1: string;
  bodyCol2: string;
  insight: string;
  insightSource: string;
  process: ProcessStep[];
  deliverables: Deliverable[];
  tech: string[];
  starting: string;
  timeline: string;
}

export const SERVICES: ServiceData[] = [
  {
    slug: 'web-development',
    n: '01',
    title: 'Web Development',
    chip: 'Flagship service',
    headline1: 'Code that ships.',
    headline2: 'Products that scale.',
    sub: 'Next.js, TypeScript, edge-first stacks. We build for 10 million users from day one — not just the demo.',
    img: '/assets/web-dev.png',
    stats: [
      { value: '95+', label: 'Lighthouse score' },
      { value: '< 2s', label: 'Time to interactive' },
      { value: '100%', label: 'TypeScript coverage' },
    ],
    opening: {
      bold: 'Most agencies build for the pitch.',
      rest: ' We build for the next 10 million users — and the engineers who have to maintain it at 3 a.m.',
    },
    bodyCol1:
      'A codebase is a long-term commitment. We treat it that way. Every architectural decision is documented, every edge case is typed, every performance regression is caught before it reaches production. You inherit code you can actually understand.',
    bodyCol2:
      'We work in your repo, your stack, your timezone. Bi-weekly demos, async stand-ups, and a Slack channel you will actually want to check. No hand-holding required — just the output you booked us for.',
    insight:
      '"The best code is the code your team can still read 18 months later."',
    insightSource: 'CodeFlee engineering principle',
    process: [
      {
        n: '01',
        title: 'Discovery & Architecture',
        desc: 'We map your product\'s data flows, user paths, and infrastructure requirements before a line of code is written. The right architecture now is cheaper than a rewrite later.',
        duration: '1–2 wks',
      },
      {
        n: '02',
        title: 'Design System Setup',
        desc: 'Token-based design system wired directly to your Tailwind config and component library. Zero ambiguity between design and implementation from day one.',
        duration: '1 wk',
      },
      {
        n: '03',
        title: 'Sprint Development',
        desc: 'Two-week sprints with a working demo at the end of each. You see progress constantly — not a big reveal after months of radio silence.',
        duration: '3–8 wks',
      },
      {
        n: '04',
        title: 'Quality & Performance',
        desc: 'Lighthouse audits, accessibility checks (WCAG 2.1 AA), and load testing against real traffic volumes. We don\'t ship without green across the board.',
        duration: '1 wk',
      },
      {
        n: '05',
        title: 'Launch & Handoff',
        desc: 'Production deploy, CI/CD walkthrough, and a live documentation session with your team. You own the code — and you know how to work with it.',
        duration: '1 wk',
      },
    ],
    deliverables: [
      { title: 'Production codebase', desc: 'Fully typed TypeScript monorepo with automated CI/CD pipeline on Vercel or your infra.' },
      { title: 'Design system', desc: 'Component library with Storybook docs, design tokens, and Figma hand-off.' },
      { title: 'Database schema', desc: 'Prisma ORM with versioned migrations, seed scripts, and query optimization.' },
      { title: 'API layer', desc: 'REST or tRPC with authentication, rate limiting, and OpenAPI documentation.' },
      { title: 'Performance audit', desc: 'Core Web Vitals report targeting 95+ Lighthouse score, with a remediation log.' },
      { title: 'Test suite', desc: 'Unit and integration tests at >80% coverage, with E2E tests for critical paths.' },
      { title: 'Deployment pipeline', desc: 'GitHub Actions CI/CD with preview deploys on every PR and rollback support.' },
      { title: 'Technical documentation', desc: 'Architecture decisions, API reference, environment setup guide, and runbook.' },
      { title: '30-day support', desc: 'Bug fixes and minor iterations in the first 30 days post-launch. No billable surprises.' },
    ],
    tech: ['Next.js', 'TypeScript', 'React', 'PostgreSQL', 'Tailwind CSS', 'Vercel', 'Prisma', 'Redis', 'Stripe', 'tRPC', 'GraphQL', 'Bun'],
    starting: '$12,000',
    timeline: '6–12 weeks',
  },
  {
    slug: 'mobile-apps',
    n: '02',
    title: 'Mobile Apps',
    chip: 'Cross-platform',
    headline1: 'Apps people open.',
    headline2: 'Not apps they delete.',
    sub: 'React Native for cross-platform reach, Swift or Kotlin when native performance is non-negotiable. Shipped to both stores.',
    img: '/assets/app-dev.png',
    stats: [
      { value: '4.8★', label: 'Avg. store rating' },
      { value: '< 400ms', label: 'Cold start time' },
      { value: '3 mo', label: 'Post-launch support' },
    ],
    opening: {
      bold: '70% of apps are deleted within 72 hours.',
      rest: ' The ones that stay feel like they were built for you, personally. That is not an accident.',
    },
    bodyCol1:
      'Great mobile products are not scaled-down websites. They respect the thumb zone, the notification permission moment, the first-launch experience that determines whether the user comes back tomorrow. We design for real behavior, not happy-path flows.',
    bodyCol2:
      'We ship to both stores. No "iOS first, Android later" compromises unless your data says otherwise. TestFlight and Google Play beta programs run with 50+ real users before any production release. Bugs found by us, not your customers.',
    insight:
      '"The moment a user has to read an instruction, the design has already failed."',
    insightSource: 'CodeFlee mobile design review',
    process: [
      {
        n: '01',
        title: 'Product Definition',
        desc: 'Jobs-to-be-done mapping, user flow diagrams, and technical architecture. We align on what success looks like — in measurable terms — before anything is designed.',
        duration: '1–2 wks',
      },
      {
        n: '02',
        title: 'UI/UX Sprint',
        desc: 'High-fidelity Figma prototypes tested with real users. We validate the flows before development starts, not after you\'ve already paid for the wrong feature.',
        duration: '2–3 wks',
      },
      {
        n: '03',
        title: 'MVP Development',
        desc: 'React Native or native Swift/Kotlin — chosen by what your app actually needs. Two-week sprints, demo calls every Friday, working builds available daily via Expo Go or TestFlight.',
        duration: '4–8 wks',
      },
      {
        n: '04',
        title: 'Beta Testing',
        desc: 'Real users on real devices. TestFlight and Google Play Internal track with 50+ testers. We iterate on what actually breaks, not what we assumed would break.',
        duration: '1–2 wks',
      },
      {
        n: '05',
        title: 'Store Submission',
        desc: 'App Store and Google Play submission with optimized listing, screenshots, preview video, and launch-week monitoring. We stay on until the review passes.',
        duration: '1 wk',
      },
    ],
    deliverables: [
      { title: 'iOS + Android apps', desc: 'Published to the App Store and Google Play, with source code and signing certificates.' },
      { title: 'Push notifications', desc: 'Configured with deep-link routing, A/B tested copy, and delivery analytics.' },
      { title: 'Analytics integration', desc: 'Amplitude or Mixpanel with key events, funnels, and retention dashboards.' },
      { title: 'Authentication', desc: 'Social login, biometrics, and secure token management with refresh rotation.' },
      { title: 'Offline support', desc: 'Core features work without internet using optimistic updates and local caching.' },
      { title: 'In-app purchases', desc: 'RevenueCat integration with subscription management and entitlement logic.' },
      { title: 'Store assets', desc: 'App Store screenshots, preview video, Google Play feature graphic, and listing copy.' },
      { title: '90-day support', desc: 'Bug fixes, OS update patches, and minor feature iterations for 3 months post-launch.' },
    ],
    tech: ['React Native', 'Expo', 'Swift', 'Kotlin', 'Firebase', 'RevenueCat', 'Amplitude', 'Fastlane', 'TestFlight', 'GraphQL', 'Zustand', 'MMKV'],
    starting: '$18,000',
    timeline: '10–18 weeks',
  },
  {
    slug: 'ui-ux-design',
    n: '03',
    title: 'UI / UX Design',
    chip: 'Figma native',
    headline1: 'Interfaces that',
    headline2: 'feel inevitable.',
    sub: 'User research, interaction design, and design systems that make your development team actually love the handoff.',
    img: '/assets/ui-dev.png',
    stats: [
      { value: '40%', label: 'Avg. conversion lift' },
      { value: '0 px', label: 'Design-dev gap' },
      { value: '2 wks', label: 'First prototype' },
    ],
    opening: {
      bold: 'Users don\'t read. They scan, tap, and leave.',
      rest: ' We design for the way people actually behave — not the way we wish they would.',
    },
    bodyCol1:
      'Every interface we design starts with a question: what is the user trying to accomplish, and what is stopping them? We run real user interviews, analyze behavioral data, and audit your current state before proposing anything new. Guesswork is expensive.',
    bodyCol2:
      'Our design systems are Figma-native and engineer-friendly. Components are auto-laid out, variants are named consistently, and every token maps directly to your codebase. Handoff is a ceremony, not a headache. Your engineers will thank you.',
    insight:
      '"A design system is not a constraint. It is the freedom to focus on problems that actually matter."',
    insightSource: 'CodeFlee design principle',
    process: [
      {
        n: '01',
        title: 'Research & Discovery',
        desc: 'User interviews, competitive analysis, and heuristic evaluation of your current product. We collect signal before generating solutions.',
        duration: '1 wk',
      },
      {
        n: '02',
        title: 'Information Architecture',
        desc: 'Sitemaps, user flows, and content hierarchy. The skeleton of the product before any visual decisions are made.',
        duration: '1 wk',
      },
      {
        n: '03',
        title: 'Low-Fidelity Wireframes',
        desc: 'Structural wireframes covering every core use case. Tested with stakeholders and real users to validate flows before visual work begins.',
        duration: '1 wk',
      },
      {
        n: '04',
        title: 'Visual Design System',
        desc: 'Full Figma design system: color tokens, typography scale, spacing system, 100+ components with variants, and comprehensive usage guidelines.',
        duration: '2–4 wks',
      },
      {
        n: '05',
        title: 'Handoff & QA Support',
        desc: 'Developer handoff with Figma inspect, motion specifications, responsive breakpoints documented, and live QA support during implementation.',
        duration: 'Ongoing',
      },
    ],
    deliverables: [
      { title: 'Research report', desc: 'User insights, behavioral analysis, and prioritized recommendations with evidence.' },
      { title: 'User flows', desc: 'Documented paths for every key use case, including edge cases and error states.' },
      { title: 'Wireframe library', desc: 'Low-fidelity wireframes for all core screens, annotated for stakeholder review.' },
      { title: 'Design system', desc: '100+ Figma components with auto-layout, variants, and complete token coverage.' },
      { title: 'High-fidelity screens', desc: 'Pixel-perfect mockups for all states, interactions, and responsive breakpoints.' },
      { title: 'Motion spec', desc: 'Interaction patterns, easing curves, and animation timing documented for engineers.' },
      { title: 'Accessibility audit', desc: 'WCAG 2.1 AA compliance review with a remediation checklist.' },
      { title: 'Developer annotations', desc: 'Every screen annotated with spacing, behavior notes, and implementation guidance.' },
    ],
    tech: ['Figma', 'FigJam', 'Principle', 'Framer', 'Maze', 'Hotjar', 'Miro', 'Lottie', 'ProtoPie', 'Zeroheight', 'Storybook', 'Chromatic'],
    starting: '$8,000',
    timeline: '4–8 weeks',
  },
  {
    slug: 'brand-motion',
    n: '04',
    title: 'Brand & Motion',
    chip: 'Signature work',
    headline1: 'Brands built to',
    headline2: 'outlast the trend cycle.',
    sub: 'Identity systems, visual language, and motion principles that hold up whether you are pitching to investors or running a Super Bowl ad.',
    img: '/assets/clean.png',
    stats: [
      { value: '20+', label: 'Identity systems' },
      { value: '360°', label: 'Visual coverage' },
      { value: '∞', label: 'Lifetime license' },
    ],
    opening: {
      bold: 'A logo is not a brand.',
      rest: ' The 12,000 micro-decisions that follow — how you write an error message, how your button animates, how your CEO signs their emails — that is the brand.',
    },
    bodyCol1:
      'We do not make things that look good. We build visual systems that communicate, scale, and survive the transition from seed round to Series B. Brand is strategy made visible. Every asset we deliver has a reason to exist beyond looking nice.',
    bodyCol2:
      'Motion is the new differentiator. In a world of static screenshots and Figma exports, the way your product moves tells users whether to trust it. We design motion principles that translate from microinteractions to full-page transitions — consistent, purposeful, never gratuitous.',
    insight:
      '"People don\'t remember what you said. They remember how you made them feel. Motion is the feeling."',
    insightSource: 'CodeFlee brand strategy session',
    process: [
      {
        n: '01',
        title: 'Brand Audit',
        desc: 'Competitive landscape analysis and an honest audit of your current brand assets, positioning, and perception gap.',
        duration: '1 wk',
      },
      {
        n: '02',
        title: 'Strategy Session',
        desc: 'Brand positioning, personality matrix, tone-of-voice principles, and target audience definition. The brief before the brief.',
        duration: '1 wk',
      },
      {
        n: '03',
        title: 'Identity Design',
        desc: 'Logo system, color palette, typography stack, iconography, and secondary graphic elements — all designed as an interconnected system.',
        duration: '2–4 wks',
      },
      {
        n: '04',
        title: 'Brand Guidelines',
        desc: 'Comprehensive brand book with usage rules, real-world examples, and do/don\'t guides. Built to hand to a contractor and get the right result.',
        duration: '1–2 wks',
      },
      {
        n: '05',
        title: 'Motion Principles',
        desc: 'A keyframe animation system: 5–7 core patterns covering entrances, exits, state changes, and loading states — all mapped to your brand personality.',
        duration: '1–2 wks',
      },
    ],
    deliverables: [
      { title: 'Logo system', desc: 'Primary, wordmark, icon, and reverse variants in SVG, PNG, and EPS for every context.' },
      { title: 'Color system', desc: 'Primary, secondary, and extended palette with WCAG contrast ratios and usage rules.' },
      { title: 'Typography stack', desc: 'Primary and secondary typefaces with a complete scale, weights, and usage guidelines.' },
      { title: 'Iconography set', desc: 'Custom icon library in SVG, matched to brand language and optical sizing.' },
      { title: 'Motion system', desc: '5–7 core animation patterns exported as Lottie JSON and CSS keyframes.' },
      { title: 'Brand guidelines', desc: '60+ page PDF and Figma reference with every rule, example, and exception documented.' },
      { title: 'Asset library', desc: 'All brand files organized in Figma with exported ZIP for offline use.' },
      { title: 'Social media kit', desc: 'Profile assets, story templates, cover images, and on-brand post templates.' },
    ],
    tech: ['Figma', 'After Effects', 'Lottie', 'Illustrator', 'Blender', 'Principle', 'Framer', 'Brandpad', 'Spline', 'Cinema 4D', 'DaVinci', 'Rive'],
    starting: '$6,000',
    timeline: '3–6 weeks',
  },
  {
    slug: 'webgl-3d',
    n: '05',
    title: 'WebGL / 3D',
    chip: 'Experimental',
    headline1: '3D experiences',
    headline2: 'that earn the scroll.',
    sub: 'Interactive Three.js scenes and product visualizations that turn passive viewers into engaged users — without killing their battery.',
    img: '/assets/tech.png',
    stats: [
      { value: '60fps', label: 'Performance target' },
      { value: '< 3 MB', label: 'Scene budget' },
      { value: 'All', label: 'Device support' },
    ],
    opening: {
      bold: 'The web is flat.',
      rest: ' Until it isn\'t. The studios and products that stand out in 2025 are the ones that treat the browser as a canvas, not a document.',
    },
    bodyCol1:
      'We build Three.js experiences that run at 60fps on a MacBook Air and degrade gracefully on a three-year-old Android. Performance is not an afterthought — it is a design constraint. Every scene starts with a draw call budget and a texture compression target.',
    bodyCol2:
      'WebGL is not just for portfolios. Product visualizations, immersive onboarding, data storytelling, interactive configurators — these are conversion tools. We help you figure out whether 3D will move your metric, and only then do we write the first shader.',
    insight:
      '"The best WebGL experience is the one the user doesn\'t know is WebGL. They just know they couldn\'t stop scrolling."',
    insightSource: 'CodeFlee creative review',
    process: [
      {
        n: '01',
        title: 'Concept & Storyboard',
        desc: 'Define the narrative arc, interaction moments, and technical scope. We build a performance brief before any assets are created.',
        duration: '1 wk',
      },
      {
        n: '02',
        title: '3D Asset Creation',
        desc: 'Model, texture, and rig assets in Blender with a performance budget in mind. Draco compression and KTX2 textures from the start.',
        duration: '2–3 wks',
      },
      {
        n: '03',
        title: 'Scene Development',
        desc: 'Three.js scene with custom lighting, post-processing pipeline, and scroll-linked interaction. Every frame earns its place.',
        duration: '2–4 wks',
      },
      {
        n: '04',
        title: 'Performance Optimization',
        desc: 'Texture atlasing, instanced meshes, draw call reduction, and frame rate testing across 30+ real devices. We ship when it\'s smooth.',
        duration: '1 wk',
      },
      {
        n: '05',
        title: 'Integration & Launch',
        desc: 'Embed into your Next.js or any web stack. Cross-browser tested, static image fallback for WebGL-unsupported contexts.',
        duration: '1 wk',
      },
    ],
    deliverables: [
      { title: 'Three.js scene', desc: 'Self-contained, embeddable React component with full source code and documentation.' },
      { title: '3D assets', desc: 'GLB/GLTF models with Draco compression, optimized to < 3 MB total scene budget.' },
      { title: 'Custom shaders', desc: 'GLSL vertex and fragment shaders for custom visual effects, documented and transferable.' },
      { title: 'Scroll interaction', desc: 'Lenis smooth scroll with GSAP ScrollTrigger or custom RAF-based scroll linking.' },
      { title: 'Performance report', desc: 'FPS and memory profiling across mobile, tablet, and desktop with optimization log.' },
      { title: 'Graceful fallback', desc: 'Static image fallback for devices that cannot run WebGL — zero broken experiences.' },
      { title: 'Source code', desc: 'Fully documented Three.js code with setup guide and extension notes.' },
      { title: 'CMS integration', desc: 'Optional: CMS-controlled scene parameters so your team can iterate without code.' },
    ],
    tech: ['Three.js', 'GLSL', 'GSAP', 'Lenis', 'WebGPU', 'Blender', 'Draco', 'KTX2', 'React Three Fiber', 'Vite', 'Spline', 'Rive'],
    starting: '$14,000',
    timeline: '6–10 weeks',
  },
  {
    slug: 'ecommerce',
    n: '06',
    title: 'E-Commerce',
    chip: 'Revenue-focused',
    headline1: 'Online stores that',
    headline2: 'convert, not just display.',
    sub: 'Shopify Plus, custom headless storefronts, and Stripe checkout flows — engineered around your revenue metrics, not platform limitations.',
    img: '/assets/solutions.png',
    stats: [
      { value: '3.2×', label: 'Avg. conversion lift' },
      { value: '< 1s', label: 'Checkout load time' },
      { value: '$0', label: 'Platform lock-in' },
    ],
    opening: {
      bold: 'Your product is good. Your checkout is killing it.',
      rest: ' The average cart abandonment rate is 70.19%. Every second of load time, every extra form field, every moment of doubt costs you real money.',
    },
    bodyCol1:
      'We start every e-commerce engagement with a conversion audit. Where are users dropping off? What is your checkout completion rate? What does your mobile experience actually feel like at 3G? The answers determine the scope — not a pre-packaged Shopify theme.',
    bodyCol2:
      'Headless is not always the answer. Sometimes a well-optimized Shopify Plus theme with a custom checkout extension outperforms a custom storefront at a third of the cost. We give you the honest recommendation, then build the best version of it.',
    insight:
      '"Every 100ms reduction in checkout load time increases conversion by 1%. We have seen clients get a 23% lift from 3 weeks of focused optimization."',
    insightSource: 'CodeFlee e-commerce audit, 2024',
    process: [
      {
        n: '01',
        title: 'Audit & Strategy',
        desc: 'Conversion rate analysis, funnel drop-off mapping, and a platform recommendation. We find the constraint before we start building.',
        duration: '1 wk',
      },
      {
        n: '02',
        title: 'UX & Wireframing',
        desc: 'Checkout flow redesign, product page patterns, and mobile-first wireframes tested against your actual customer data.',
        duration: '1–2 wks',
      },
      {
        n: '03',
        title: 'Development',
        desc: 'Shopify Plus custom theme or headless storefront with Next.js Commerce. Two-week sprints, live preview URLs on every PR.',
        duration: '4–8 wks',
      },
      {
        n: '04',
        title: 'Payments & Logic',
        desc: 'Stripe integration, tax handling, inventory sync, discount logic, and subscription support. Every edge case covered before launch.',
        duration: '1–2 wks',
      },
      {
        n: '05',
        title: 'Launch & Optimize',
        desc: 'Full QA across devices, analytics setup, and A/B test configuration for key conversion points. We monitor launch week with you.',
        duration: '1 wk',
      },
    ],
    deliverables: [
      { title: 'Storefront', desc: 'Shopify Plus theme or custom headless store with your brand implemented pixel-perfectly.' },
      { title: 'Optimized checkout', desc: 'Custom checkout flow targeting < 1s load time, tested on real mobile devices.' },
      { title: 'Product page templates', desc: 'High-converting templates with social proof, urgency signals, and dynamic recommendations.' },
      { title: 'Payment integration', desc: 'Stripe, Klarna, or Shopify Payments with 3D Secure and subscription support.' },
      { title: 'Inventory sync', desc: 'Real-time stock management, low-stock alerts, and backorder handling.' },
      { title: 'Analytics setup', desc: 'GA4 + Shopify analytics with full e-commerce tracking and conversion attribution.' },
      { title: 'Email automation', desc: 'Abandoned cart, post-purchase, and review request flows via Klaviyo or Postmark.' },
      { title: 'Performance audit', desc: 'Core Web Vitals report targeting 90+ Lighthouse on mobile and desktop.' },
    ],
    tech: ['Shopify Plus', 'Next.js', 'Stripe', 'Klaviyo', 'GA4', 'Sanity', 'GraphQL', 'Algolia', 'Contentful', 'Vercel', 'Hydrogen', 'Remix'],
    starting: '$15,000',
    timeline: '8–14 weeks',
  },
];

export function getService(slug: string): ServiceData | undefined {
  return SERVICES.find(s => s.slug === slug);
}
