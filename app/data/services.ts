export interface Service {
  slug: string;
  title: string;
  tagline: string;
  description: string;
  accent: string;
  accentLight: string;
  iconPath: string;
  heroDescription: string;
  features: { title: string; description: string }[];
  process: { step: string; title: string; description: string }[];
  techStack?: string[];
  faqs: { question: string; answer: string }[];
}

export const services: Service[] = [
  {
    slug: "web-development",
    title: "Web Development",
    tagline: "Build for the modern web",
    description:
      "Modern, responsive web applications built with cutting-edge frameworks and optimized for performance.",
    accent: "from-blue-400 to-purple",
    accentLight: "bg-blue-400/10",
    iconPath:
      "M12 21a9.004 9.004 0 0 0 8.716-6.747M12 21a9.004 9.004 0 0 1-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 0 1 7.843 4.582M12 3a8.997 8.997 0 0 0-7.843 4.582m15.686 0A11.953 11.953 0 0 1 12 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0 1 21 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0 1 12 16.5a17.92 17.92 0 0 1-8.716-2.247m0 0A8.966 8.966 0 0 1 3 12c0-1.264.26-2.466.73-3.558",
    heroDescription:
      "We craft high-performance web applications that load fast, look stunning, and scale effortlessly. From single-page apps to complex enterprise platforms, our team delivers code that stands the test of time.",
    features: [
      {
        title: "Responsive Design",
        description:
          "Pixel-perfect layouts that adapt seamlessly across every screen size and device.",
      },
      {
        title: "Performance Optimized",
        description:
          "Sub-second load times with code splitting, lazy loading, and edge caching strategies.",
      },
      {
        title: "SEO-First Architecture",
        description:
          "Server-side rendering and structured data to maximize your search visibility from day one.",
      },
      {
        title: "API Integration",
        description:
          "Seamless connection with third-party services, payment gateways, and custom backends.",
      },
      {
        title: "Progressive Web Apps",
        description:
          "Offline-capable, installable web apps that rival native mobile experiences.",
      },
      {
        title: "Analytics & Monitoring",
        description:
          "Built-in performance monitoring, error tracking, and user analytics dashboards.",
      },
    ],
    process: [
      {
        step: "01",
        title: "Discovery & Planning",
        description:
          "We dive deep into your requirements, audience, and goals to create a detailed technical roadmap.",
      },
      {
        step: "02",
        title: "Design & Prototyping",
        description:
          "Interactive wireframes and high-fidelity mockups ensure alignment before a single line of code is written.",
      },
      {
        step: "03",
        title: "Development & Testing",
        description:
          "Agile sprints with continuous integration, automated testing, and regular demo sessions.",
      },
      {
        step: "04",
        title: "Launch & Support",
        description:
          "Zero-downtime deployment with post-launch monitoring, optimization, and ongoing maintenance.",
      },
    ],
    techStack: [
      "React",
      "Next.js",
      "TypeScript",
      "Node.js",
      "Tailwind CSS",
      "PostgreSQL",
      "Redis",
      "AWS",
    ],
    faqs: [
      {
        question: "How long does a typical web project take?",
        answer:
          "Most projects range from 4-12 weeks depending on complexity. We provide a detailed timeline after the discovery phase.",
      },
      {
        question: "Do you provide ongoing maintenance?",
        answer:
          "Yes. We offer flexible maintenance plans that cover security updates, performance monitoring, and feature enhancements.",
      },
      {
        question: "Can you work with our existing tech stack?",
        answer:
          "Absolutely. We're experienced across many frameworks and can adapt to your current infrastructure or recommend improvements.",
      },
    ],
  },
  {
    slug: "app-development",
    title: "App Development",
    tagline: "Mobile experiences that delight",
    description:
      "Native and cross-platform mobile applications designed for seamless user experiences across all devices.",
    accent: "from-purple to-pink",
    accentLight: "bg-purple/10",
    iconPath:
      "M10.5 1.5H8.25A2.25 2.25 0 0 0 6 3.75v16.5a2.25 2.25 0 0 0 2.25 2.25h7.5A2.25 2.25 0 0 0 18 20.25V3.75a2.25 2.25 0 0 0-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3",
    heroDescription:
      "From concept to App Store, we build mobile applications that users love. Whether you need a native iOS app, an Android powerhouse, or a cross-platform solution, we deliver polished, performant apps.",
    features: [
      {
        title: "Cross-Platform Development",
        description:
          "Single codebase apps for iOS and Android using React Native, cutting development time in half.",
      },
      {
        title: "Native Performance",
        description:
          "Smooth 60fps animations and instant response times that feel truly native on every device.",
      },
      {
        title: "Offline-First Design",
        description:
          "Robust local data storage and sync strategies so your app works even without connectivity.",
      },
      {
        title: "Push Notifications",
        description:
          "Intelligent, segmented push notification systems that boost retention without annoying users.",
      },
      {
        title: "App Store Optimization",
        description:
          "Strategic keyword placement, compelling screenshots, and review management for higher rankings.",
      },
      {
        title: "Biometric Security",
        description:
          "Face ID, fingerprint, and secure enclave integration for bulletproof authentication.",
      },
    ],
    process: [
      {
        step: "01",
        title: "Strategy & Research",
        description:
          "Market analysis, user persona development, and feature prioritization to build the right thing first.",
      },
      {
        step: "02",
        title: "UX & Interface Design",
        description:
          "Platform-specific UI patterns with interactive prototypes tested on real devices.",
      },
      {
        step: "03",
        title: "Agile Development",
        description:
          "Two-week sprints with TestFlight / Play Store beta builds for continuous feedback loops.",
      },
      {
        step: "04",
        title: "Launch & Iterate",
        description:
          "Guided store submission, post-launch analytics, and data-driven feature iterations.",
      },
    ],
    techStack: [
      "React Native",
      "Swift",
      "Kotlin",
      "Expo",
      "Firebase",
      "GraphQL",
      "Redux",
      "Fastlane",
    ],
    faqs: [
      {
        question: "Should I build native or cross-platform?",
        answer:
          "Cross-platform (React Native) is ideal for most use cases—it's faster and more cost-effective. We recommend native only when the app requires deep OS-level access.",
      },
      {
        question: "How do you handle app store submissions?",
        answer:
          "We manage the entire submission process including store listings, screenshots, compliance reviews, and post-approval monitoring.",
      },
      {
        question: "Can you integrate with our existing backend?",
        answer:
          "Yes. We build flexible API layers that connect with any backend, whether REST, GraphQL, or custom protocols.",
      },
    ],
  },
  {
    slug: "ui-ux-design",
    title: "UI/UX Design",
    tagline: "Design that converts",
    description:
      "User-centered design that blends aesthetics with functionality to create intuitive digital products.",
    accent: "from-pink to-orange-400",
    accentLight: "bg-pink/10",
    iconPath:
      "M9.53 16.122a3 3 0 0 0-5.78 1.128 2.25 2.25 0 0 1-2.4 2.245 4.5 4.5 0 0 0 8.4-2.245c0-.399-.078-.78-.22-1.128Zm0 0a15.998 15.998 0 0 0 3.388-1.62m-5.043-.025a15.994 15.994 0 0 1 1.622-3.395m3.42 3.42a15.995 15.995 0 0 0 4.764-4.648l3.876-5.814a1.151 1.151 0 0 0-1.597-1.597L14.146 6.32a15.996 15.996 0 0 0-4.649 4.763m3.42 3.42a6.776 6.776 0 0 0-3.42-3.42",
    heroDescription:
      "Great design isn't just about looking good—it's about solving problems. We create interfaces that feel effortless, guide users naturally, and turn visitors into loyal customers.",
    features: [
      {
        title: "User Research & Testing",
        description:
          "Data-backed decisions through interviews, surveys, heatmaps, and usability testing sessions.",
      },
      {
        title: "Wireframing & Prototyping",
        description:
          "Interactive prototypes that let you test the full user journey before development begins.",
      },
      {
        title: "Design Systems",
        description:
          "Scalable component libraries with tokens, variants, and documentation for consistent UI.",
      },
      {
        title: "Motion & Micro-interactions",
        description:
          "Purposeful animations that provide feedback, guide attention, and add personality.",
      },
      {
        title: "Accessibility (WCAG)",
        description:
          "Inclusive designs that meet WCAG 2.1 AA standards, ensuring everyone can use your product.",
      },
      {
        title: "Conversion Optimization",
        description:
          "A/B tested layouts and flows scientifically proven to increase signups, sales, and engagement.",
      },
    ],
    process: [
      {
        step: "01",
        title: "Research & Audit",
        description:
          "Competitive analysis, user interviews, and heuristic evaluation of your current experience.",
      },
      {
        step: "02",
        title: "Information Architecture",
        description:
          "Site maps, user flows, and content hierarchy that make navigation intuitive.",
      },
      {
        step: "03",
        title: "Visual Design",
        description:
          "High-fidelity screens in Figma with responsive variants and interactive prototypes.",
      },
      {
        step: "04",
        title: "Handoff & QA",
        description:
          "Developer-ready specs with pixel-perfect assets, annotations, and design QA support.",
      },
    ],
    techStack: [
      "Figma",
      "Framer",
      "Adobe XD",
      "Maze",
      "Hotjar",
      "Storybook",
      "Lottie",
      "Zeplin",
    ],
    faqs: [
      {
        question: "Do you redesign existing products?",
        answer:
          "Yes. We often work on redesign projects—starting with a UX audit to identify pain points, then iteratively improving the experience.",
      },
      {
        question: "What deliverables do we receive?",
        answer:
          "Complete Figma files with responsive variants, a component library, design tokens, interactive prototype, and developer handoff documentation.",
      },
      {
        question: "How do you measure design success?",
        answer:
          "We set measurable KPIs upfront—task completion rates, time on task, conversion rates—and validate through post-launch analytics.",
      },
    ],
  },
  {
    slug: "wordpress-development",
    title: "WordPress Development",
    tagline: "Powerful sites, easy management",
    description:
      "Custom WordPress themes and plugins tailored to your brand, with powerful CMS capabilities.",
    accent: "from-emerald-400 to-teal-500",
    accentLight: "bg-emerald-400/10",
    iconPath:
      "M17.25 6.75 22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3-4.5 16.5",
    heroDescription:
      "WordPress powers over 40% of the web for good reason. We build custom themes and plugins that give you enterprise-grade functionality with the simplicity of a world-class CMS.",
    features: [
      {
        title: "Custom Theme Development",
        description:
          "Bespoke themes built from scratch—no bloated templates. Clean code that matches your brand perfectly.",
      },
      {
        title: "Plugin Development",
        description:
          "Custom plugins for unique business logic, integrations, and functionality you can't find off-the-shelf.",
      },
      {
        title: "WooCommerce Solutions",
        description:
          "Full e-commerce setups with payment gateways, inventory management, and custom checkout flows.",
      },
      {
        title: "Speed Optimization",
        description:
          "Server-level caching, image optimization, and CDN setup to achieve sub-2s page loads.",
      },
      {
        title: "Security Hardening",
        description:
          "Firewall configuration, malware scanning, and security best practices to keep your site safe.",
      },
      {
        title: "Migration Services",
        description:
          "Seamless migration from any platform to WordPress with zero downtime and full SEO preservation.",
      },
    ],
    process: [
      {
        step: "01",
        title: "Requirements & Audit",
        description:
          "Understand your content strategy, admin workflows, and integration needs to plan the build.",
      },
      {
        step: "02",
        title: "Theme & Plugin Design",
        description:
          "Custom design mockups paired with a plugin architecture plan for maximum flexibility.",
      },
      {
        step: "03",
        title: "Build & Configure",
        description:
          "Theme development, plugin coding, content migration, and thorough cross-browser testing.",
      },
      {
        step: "04",
        title: "Training & Launch",
        description:
          "Hands-on CMS training for your team, followed by a smooth launch with monitoring in place.",
      },
    ],
    techStack: [
      "WordPress",
      "PHP",
      "MySQL",
      "ACF Pro",
      "WooCommerce",
      "Elementor",
      "Cloudflare",
      "WP CLI",
    ],
    faqs: [
      {
        question: "Is WordPress good for large-scale sites?",
        answer:
          "Yes. With proper architecture, caching, and hosting, WordPress handles millions of page views. Sites like TechCrunch and BBC America run on WordPress.",
      },
      {
        question: "Can you convert my existing site to WordPress?",
        answer:
          "Absolutely. We migrate content, preserve SEO rankings, and ensure all URLs redirect correctly during the transition.",
      },
      {
        question: "Do you use page builders?",
        answer:
          "Only when it makes sense for your team's workflow. For most projects, we prefer custom Gutenberg blocks for better performance and control.",
      },
    ],
  },
  {
    slug: "mvp-development",
    title: "MVP Development",
    tagline: "Launch fast, learn faster",
    description:
      "Rapid prototyping and MVP builds to validate your ideas fast and get to market ahead of competition.",
    accent: "from-amber-400 to-orange-500",
    accentLight: "bg-amber-400/10",
    iconPath:
      "M15.59 14.37a6 6 0 0 1-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 0 0 6.16-12.12A14.98 14.98 0 0 0 9.631 8.41m5.96 5.96a14.926 14.926 0 0 1-5.841 2.58m-.119-8.54a6 6 0 0 0-7.381 5.84h4.8m2.581-5.84a14.927 14.927 0 0 0-2.58 5.84m2.699 2.7c-.103.021-.207.041-.311.06a15.09 15.09 0 0 1-2.448-2.448 14.9 14.9 0 0 1 .06-.312m-2.24 2.39a4.493 4.493 0 0 0-1.757 4.306 4.493 4.493 0 0 0 4.306-1.758M16.5 9a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Z",
    heroDescription:
      "Stop guessing, start validating. We turn your idea into a functional product in weeks—not months—so you can test with real users, attract investors, and iterate with confidence.",
    features: [
      {
        title: "Rapid Prototyping",
        description:
          "Clickable prototypes in days that let you test core assumptions before writing production code.",
      },
      {
        title: "Lean Architecture",
        description:
          "Modular, scalable foundations that support your MVP now and your enterprise product later.",
      },
      {
        title: "User Feedback Loops",
        description:
          "Built-in analytics and feedback tools to capture real user behavior from day one.",
      },
      {
        title: "Investor-Ready Demos",
        description:
          "Polished demo environments and pitch-ready materials to help you secure funding.",
      },
      {
        title: "Scope Prioritization",
        description:
          "Ruthless feature prioritization using the MoSCoW method to ship what matters most.",
      },
      {
        title: "Post-MVP Roadmap",
        description:
          "Data-driven feature roadmap based on actual usage patterns and user feedback.",
      },
    ],
    process: [
      {
        step: "01",
        title: "Ideation Workshop",
        description:
          "Collaborative session to define your value proposition, target users, and core feature set.",
      },
      {
        step: "02",
        title: "Rapid Design Sprint",
        description:
          "5-day design sprint producing validated wireframes and a clickable prototype.",
      },
      {
        step: "03",
        title: "Build Sprint",
        description:
          "4-8 week focused development cycle with weekly demos and continuous user testing.",
      },
      {
        step: "04",
        title: "Launch & Measure",
        description:
          "Soft launch with analytics, user interviews, and a data-backed iteration plan.",
      },
    ],
    techStack: [
      "Next.js",
      "Supabase",
      "Vercel",
      "Stripe",
      "Tailwind CSS",
      "Prisma",
      "Resend",
      "Posthog",
    ],
    faqs: [
      {
        question: "How quickly can you build an MVP?",
        answer:
          "Most MVPs are delivered in 4-8 weeks. Simple products can ship in as little as 3 weeks with a focused scope.",
      },
      {
        question: "What happens after the MVP launches?",
        answer:
          "We analyze user data, conduct feedback sessions, and build a prioritized roadmap for the next iteration. Many clients continue with us for V2 and beyond.",
      },
      {
        question: "Will the MVP code be production-ready?",
        answer:
          "Yes. We don't cut corners on architecture. Your MVP is built on a solid foundation that scales with your growth.",
      },
    ],
  },
  {
    slug: "digital-marketing",
    title: "Digital Marketing",
    tagline: "Grow your digital presence",
    description:
      "Data-driven marketing strategies that amplify your online presence and drive measurable growth.",
    accent: "from-violet-500 to-purple",
    accentLight: "bg-violet-500/10",
    iconPath:
      "M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z",
    heroDescription:
      "Stop burning budget on ads that don't convert. Our data-driven strategies combine SEO, content marketing, and paid acquisition to deliver predictable, scalable growth for your business.",
    features: [
      {
        title: "SEO & Content Strategy",
        description:
          "Keyword research, on-page optimization, and content calendars that drive organic traffic.",
      },
      {
        title: "Paid Advertising",
        description:
          "ROI-focused campaigns on Google Ads, Meta, and LinkedIn with continuous A/B testing.",
      },
      {
        title: "Social Media Management",
        description:
          "Consistent brand storytelling across platforms with community engagement and growth tactics.",
      },
      {
        title: "Email Marketing",
        description:
          "Segmented drip campaigns, newsletters, and automation flows that nurture leads to conversion.",
      },
      {
        title: "Analytics & Reporting",
        description:
          "Custom dashboards showing real-time performance metrics, attribution modeling, and ROI tracking.",
      },
      {
        title: "Conversion Rate Optimization",
        description:
          "Landing page tests, funnel analysis, and UX improvements that maximize every visitor's value.",
      },
    ],
    process: [
      {
        step: "01",
        title: "Audit & Strategy",
        description:
          "Comprehensive analysis of your current digital presence, competitors, and market opportunities.",
      },
      {
        step: "02",
        title: "Campaign Setup",
        description:
          "Channel selection, audience targeting, creative production, and tracking implementation.",
      },
      {
        step: "03",
        title: "Execute & Optimize",
        description:
          "Launch campaigns with daily monitoring, weekly optimizations, and bi-weekly performance reports.",
      },
      {
        step: "04",
        title: "Scale & Expand",
        description:
          "Double down on winning channels, explore new opportunities, and continuously raise the bar.",
      },
    ],
    faqs: [
      {
        question: "How soon will we see results?",
        answer:
          "Paid campaigns can show results within days. SEO typically takes 3-6 months to build meaningful organic traffic. We set realistic expectations upfront.",
      },
      {
        question: "What's the minimum budget for ads?",
        answer:
          "We recommend starting with at least $1,000/month in ad spend to gather enough data for meaningful optimization. Our management fee is separate.",
      },
      {
        question: "Do you provide content creation?",
        answer:
          "Yes. Our team includes copywriters, designers, and video editors who produce high-quality content tailored to each channel.",
      },
    ],
  },
];

export function getServiceBySlug(slug: string): Service | undefined {
  return services.find((s) => s.slug === slug);
}
