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
