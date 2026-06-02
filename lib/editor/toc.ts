import "server-only";
import type { JSONContent } from "@tiptap/core";
import GithubSlugger from "github-slugger";

export type TocHeading = { id: string; text: string; level: 2 | 3 };

/**
 * Walk a ProseMirror doc top-down and collect H2/H3 headings.
 * Uses the same slugger algorithm + walk order as renderPostHtml so anchor IDs match.
 */
export function extractToc(doc: JSONContent | null | undefined): TocHeading[] {
  if (!doc || doc.type !== "doc" || !Array.isArray(doc.content)) return [];
  const slugger = new GithubSlugger();
  const out: TocHeading[] = [];

  const walk = (node: JSONContent): void => {
    if (node.type === "heading") {
      const level = node.attrs?.level;
      if (level === 2 || level === 3) {
        const text = flattenText(node).replace(/\s+/g, " ").trim();
        if (text) {
          out.push({ id: slugger.slug(text), text, level });
        }
      }
    }
    if (Array.isArray(node.content)) {
      for (const child of node.content) walk(child);
    }
  };

  for (const child of doc.content) walk(child);
  return out;
}

function flattenText(node: JSONContent): string {
  if (typeof node.text === "string") return node.text;
  if (!Array.isArray(node.content)) return "";
  let out = "";
  for (const child of node.content) out += flattenText(child);
  return out;
}

/**
 * Collect H2/H3 headings straight from rendered post HTML.
 *
 * This is the authoritative source: the anchor IDs come from the same HTML the
 * page actually renders (injected by `postProcessHtml`), so TOC links always
 * resolve. It also tolerates ProseMirror docs whose heading nodes are missing
 * `attrs.level` — those render correct <h2>/<h3> via TipTap but are invisible to
 * the JSON walk in `extractToc`. Prefer this over `extractToc` for stored posts.
 */
export function extractTocFromHtml(html: string | null | undefined): TocHeading[] {
  if (!html) return [];
  const out: TocHeading[] = [];
  const re = /<(h2|h3)\b([^>]*)>([\s\S]*?)<\/\1>/gi;
  let m: RegExpExecArray | null;
  while ((m = re.exec(html)) !== null) {
    const idMatch = m[2].match(/\sid="([^"]+)"/i);
    if (!idMatch) continue; // no anchor → nothing to link to
    const text = decodeEntities(m[3].replace(/<[^>]+>/g, "")).replace(/\s+/g, " ").trim();
    if (text) out.push({ id: idMatch[1], text, level: m[1].toLowerCase() === "h2" ? 2 : 3 });
  }
  return out;
}

function decodeEntities(s: string): string {
  return s
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#(?:39|x27);/gi, "'");
}
