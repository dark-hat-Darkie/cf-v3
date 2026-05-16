import type { JSONContent } from "@tiptap/core";

/**
 * Extract plain text from a ProseMirror doc with paragraph boundaries.
 * Pure — safe to import from client or server.
 */
export function extractPlainText(doc: JSONContent | null | undefined): string {
  if (!doc) return "";
  const parts: string[] = [];
  const walk = (n: JSONContent | undefined) => {
    if (!n) return;
    if (n.text) parts.push(n.text);
    if (n.content) for (const c of n.content) walk(c);
    if (
      n.type === "paragraph" ||
      n.type === "heading" ||
      n.type === "listItem" ||
      n.type === "tableCell" ||
      n.type === "tableHeader"
    ) {
      parts.push("\n");
    }
  };
  walk(doc);
  return parts.join("").replace(/[ \t]+/g, " ").replace(/\n{3,}/g, "\n\n").trim();
}

export function wordCountOf(text: string): number {
  const t = text.trim();
  return t ? t.split(/\s+/).length : 0;
}
