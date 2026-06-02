// Client-safe source for the homepage "Selected work" cards.
//
// Card copy lives here (concise marketing lines); the 16:9 card image is the
// project's first full-page screenshot from the manifest, with a pre-baked blur
// placeholder from card-lqip.ts (so this stays client-safe — no server decode).
//
// Keep the `slug` list in sync with CASE_STUDIES in lib/case-studies-data.ts.

import { SCREENSHOTS } from "@/lib/media/screenshots-manifest";
import { CARD_LQIP } from "@/lib/media/card-lqip";

export interface FeaturedProject {
  slug: string;
  tag: string;
  title: string;
  desc: string;
  meta: [string, string][];
  card: { src: string; width: number; height: number; blurDataURL: string };
}

function card(slug: keyof typeof SCREENSHOTS) {
  const first = SCREENSHOTS[slug][0];
  return { src: first.src, width: first.width, height: first.height, blurDataURL: CARD_LQIP[slug] ?? "" };
}

export const FEATURED_PROJECTS: FeaturedProject[] = [
  {
    slug: "factwatch",
    tag: "Fact-check platform",
    title: "FactWatch — AI-assisted fact-check newsroom.",
    desc: "Editorial workflow, claim database, and an LLM-assisted verification pipeline — bilingual, Bangla-first.",
    meta: [["Client", "FactWatch"], ["Role", "Product · Web · ML"], ["Year", "2025"]],
    card: card("factwatch"),
  },
  {
    slug: "flipper",
    tag: "Marketplace · E-commerce",
    title: "Flipper — buy, sell & exchange electronics.",
    desc: "A trust-first marketplace for phones and gadgets — graded catalog, live bidding, trade-in, and local payments.",
    meta: [["Client", "Flipper"], ["Role", "Product · Web · Payments"], ["Year", "2025"]],
    card: card("flipper"),
  },
  {
    slug: "iqqra",
    tag: "EdTech · Kids",
    title: "iQQra — gamified Islamic learning for kids.",
    desc: "A prophet-story journey map, grade-based chapters, interactive quizzes, and a parent performance dashboard.",
    meta: [["Client", "iQQra"], ["Role", "Product · Web · Design"], ["Year", "2026"]],
    card: card("iqqra"),
  },
  {
    slug: "pzs",
    tag: "Community · Non-profit",
    title: "PZS Alumni — a network worthy of its legacy.",
    desc: "A bilingual alumni platform — member directory, committee, event galleries, notices, and online donations.",
    meta: [["Client", "PZS Alumni Association"], ["Role", "Web · Design · Payments"], ["Year", "2026"]],
    card: card("pzs"),
  },
  {
    slug: "tripking",
    tag: "Travel · E-commerce",
    title: "TripKing — a local hotel-booking engine.",
    desc: "Hotel search with rich filters, property pages with live availability, and a multi-traveler local checkout.",
    meta: [["Client", "TripKing"], ["Role", "Product · Web · Bookings"], ["Year", "2024"]],
    card: card("tripking"),
  },
];
