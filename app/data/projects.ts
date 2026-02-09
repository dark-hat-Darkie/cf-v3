export interface GalleryItem {
  label: string;
  gradient: string;
  span?: "wide" | "tall";
}

export interface ProjectDetail {
  slug: string;
  name: string;
  tagline: string;
  categories: string[];
  metric: string | null;
  metricLabel: string | null;
  gradient: string;
  size: "large" | "small";
  // Case study details
  headline: string;
  description: string;
  client: string;
  duration: string;
  teamSize: string;
  role: string;
  year: string;
  challenges: string[];
  solutions: string[];
  results: { value: string; label: string }[];
  techStack: string[];
  scope: string[];
  gallery: GalleryItem[];
}

export const projects: ProjectDetail[] = [
  {
    slug: "factwatch",
    name: "FactWatch",
    tagline: "ReThink | ReDesign | ReBuild",
    categories: ["Rebranding", "Design", "Development"],
    metric: "+84%",
    metricLabel: "Productivity Boost",
    gradient: "from-purple-dark via-purple to-purple-mid",
    size: "large",
    headline: "FactWatch Boosted Their Productivity 84%",
    description:
      "An independent fact-checking platform affiliated with the University of Liberal Arts Bangladesh (ULAB) designed to combat misinformation and promote media literacy.",
    client: "University of Liberal Arts Bangladesh",
    duration: "6 months",
    teamSize: "8 members",
    role: "Web Platform Development & Fact-Checking System",
    year: "2022",
    challenges: [
      "Create trustworthy infrastructure for verifying claims",
      "Develop rapid verification systems for viral misinformation",
      "Educate audiences on media literacy principles",
      "Handle politically sensitive content responsibly",
    ],
    solutions: [
      "Multi-step verification workflow with expert reviewers",
      "Transparent rating system (True, False, Misleading, etc.)",
      "Educational resources and media literacy guides",
      "Secure backend infrastructure for sensitive data",
    ],
    results: [
      { value: "250+", label: "Claims Fact-Checked" },
      { value: "1.2M", label: "Annual Website Visitors" },
      { value: "85%", label: "User Trust Rating" },
      { value: "40+", label: "Media Partnerships" },
    ],
    techStack: ["Next.js", "Node.js", "PostgreSQL", "Redis", "Docker", "AWS"],
    scope: [
      "Platform Architecture",
      "Frontend Development",
      "Backend API",
      "Admin Dashboard",
      "Content Management",
      "Deployment & DevOps",
    ],
    gallery: [
      { label: "Homepage", gradient: "from-purple-dark via-purple to-purple-mid", span: "wide" },
      { label: "Fact-Check Editor", gradient: "from-purple via-pink to-purple-mid" },
      { label: "Verdict Dashboard", gradient: "from-purple-mid via-purple to-purple-dark" },
      { label: "Mobile View", gradient: "from-pink via-purple-mid to-purple", span: "tall" },
      { label: "Analytics Panel", gradient: "from-purple-dark via-purple-mid to-pink" },
      { label: "Admin Console", gradient: "from-purple via-purple-dark to-purple-mid", span: "wide" },
    ],
  },
  {
    slug: "tripking",
    name: "TripKing",
    tagline: "Branding | Design | Development",
    categories: ["Branding", "Design", "Development"],
    metric: "-29%",
    metricLabel: "Development Cost",
    gradient: "from-pink via-pink to-purple-light",
    size: "large",
    headline: "TripKing Reduced Development Costs by 29%",
    description:
      "A modern travel booking platform that connects travelers with curated experiences and local guides across Bangladesh.",
    client: "TripKing Ltd.",
    duration: "4 months",
    teamSize: "6 members",
    role: "Full-Stack Development & Brand Identity",
    year: "2023",
    challenges: [
      "Build a scalable booking system handling peak travel seasons",
      "Create an intuitive UX for both travelers and tour operators",
      "Integrate multiple payment gateways for local and international users",
      "Optimize performance for users with limited connectivity",
    ],
    solutions: [
      "Microservices architecture with auto-scaling capabilities",
      "User-tested interface with streamlined booking flow",
      "Unified payment system supporting bKash, Nagad, and card payments",
      "Progressive web app with offline-first approach",
    ],
    results: [
      { value: "10K+", label: "Monthly Active Users" },
      { value: "29%", label: "Cost Reduction" },
      { value: "4.8★", label: "App Store Rating" },
      { value: "150+", label: "Tour Packages" },
    ],
    techStack: ["React Native", "Node.js", "MongoDB", "Stripe", "Firebase"],
    scope: [
      "Brand Identity",
      "Mobile App Design",
      "Cross-Platform Development",
      "Payment Integration",
      "Push Notifications",
    ],
    gallery: [
      { label: "Landing Page", gradient: "from-pink via-pink to-purple-light", span: "wide" },
      { label: "Booking Flow", gradient: "from-purple-light via-pink to-pink" },
      { label: "Trip Explorer", gradient: "from-pink via-purple-mid to-purple-light" },
      { label: "Mobile App", gradient: "from-purple-mid via-pink to-pink", span: "tall" },
      { label: "Guide Profile", gradient: "from-pink via-purple-light to-purple-mid" },
      { label: "Payment Screen", gradient: "from-purple-light via-pink to-pink", span: "wide" },
    ],
  },
  {
    slug: "iqqra",
    name: "iQQra",
    tagline: "Branding | Design | Development",
    categories: ["Branding", "Design", "Development"],
    metric: null,
    metricLabel: null,
    gradient: "from-purple via-purple-mid to-pink",
    size: "small",
    headline: "iQQra — A Digital Learning Companion",
    description:
      "An Islamic education platform providing structured courses, quizzes, and community features for learners worldwide.",
    client: "iQQra Foundation",
    duration: "5 months",
    teamSize: "5 members",
    role: "Product Design & Full-Stack Development",
    year: "2023",
    challenges: [
      "Design an engaging interface for diverse age groups",
      "Support multiple content formats including audio and video",
      "Build a robust progress tracking and gamification system",
      "Ensure accessibility across low-end devices",
    ],
    solutions: [
      "Age-adaptive UI with customizable themes",
      "CDN-backed media delivery with adaptive streaming",
      "Achievement system with streaks, badges, and leaderboards",
      "Lightweight frontend optimized for 2G/3G networks",
    ],
    results: [
      { value: "5K+", label: "Active Learners" },
      { value: "200+", label: "Course Modules" },
      { value: "92%", label: "Completion Rate" },
      { value: "15+", label: "Countries Reached" },
    ],
    techStack: ["Flutter", "Firebase", "Node.js", "Algolia", "Cloudflare"],
    scope: [
      "Brand Identity",
      "UI/UX Design",
      "Mobile App Development",
      "Backend API",
      "Search Integration",
    ],
    gallery: [
      { label: "Course Dashboard", gradient: "from-purple via-purple-mid to-pink", span: "wide" },
      { label: "Lesson View", gradient: "from-purple-mid via-pink to-purple" },
      { label: "Quiz Interface", gradient: "from-pink via-purple to-purple-mid" },
      { label: "Progress Tracker", gradient: "from-purple via-purple-mid to-pink", span: "tall" },
      { label: "Community Hub", gradient: "from-purple-mid via-purple to-pink" },
      { label: "Achievements", gradient: "from-purple via-pink to-purple-mid", span: "wide" },
    ],
  },
  {
    slug: "lomba-shop",
    name: "Lomba Shop",
    tagline: "Design | Development",
    categories: ["Design", "Development"],
    metric: null,
    metricLabel: null,
    gradient: "from-purple-dark via-purple to-pink",
    size: "small",
    headline: "Lomba Shop — E-Commerce Reimagined",
    description:
      "A feature-rich e-commerce platform tailored for local businesses in Bangladesh with inventory management and delivery integration.",
    client: "Lomba Shop",
    duration: "3 months",
    teamSize: "4 members",
    role: "UI/UX Design & Frontend Development",
    year: "2024",
    challenges: [
      "Create a seamless shopping experience for mobile-first users",
      "Integrate with local delivery and payment providers",
      "Build a merchant dashboard for inventory and order management",
      "Handle high traffic during flash sales and promotions",
    ],
    solutions: [
      "Mobile-first responsive design with gesture-based navigation",
      "Unified API layer connecting Pathao, Steadfast, and local couriers",
      "Real-time dashboard with analytics and stock alerts",
      "Edge caching and queue-based order processing for peak loads",
    ],
    results: [
      { value: "500+", label: "Products Listed" },
      { value: "3K+", label: "Monthly Orders" },
      { value: "99.9%", label: "Uptime" },
      { value: "2.1s", label: "Avg Load Time" },
    ],
    techStack: ["Next.js", "Tailwind CSS", "Prisma", "PostgreSQL", "Vercel"],
    scope: [
      "UI/UX Design",
      "Frontend Development",
      "Merchant Dashboard",
      "Delivery Integration",
      "Performance Optimization",
    ],
    gallery: [
      { label: "Storefront", gradient: "from-purple-dark via-purple to-pink", span: "wide" },
      { label: "Product Page", gradient: "from-purple via-pink to-purple-mid" },
      { label: "Shopping Cart", gradient: "from-pink via-purple to-purple-dark" },
      { label: "Merchant Panel", gradient: "from-purple-dark via-purple-mid to-pink", span: "tall" },
      { label: "Order Tracking", gradient: "from-purple via-purple-dark to-pink" },
      { label: "Analytics View", gradient: "from-purple-mid via-purple to-purple-dark", span: "wide" },
    ],
  },
];
