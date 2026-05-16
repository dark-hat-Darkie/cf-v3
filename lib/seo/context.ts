import type { JSONContent } from "@tiptap/core";
import type { AnalysisInput } from "./types";
import { tokenizeParagraphs, tokenizeSentences } from "./nlp/tokenize";

export type Structure = AnalysisInput["structure"];

export function buildStructure(doc: JSONContent | null | undefined, plainText: string, siteOrigin: string): Structure {
  const headings: { level: number; text: string }[] = [];
  const links: { href: string; text: string; isExternal: boolean; rel: string | null }[] = [];
  const images: { src: string; alt: string }[] = [];

  const collectText = (node: JSONContent | undefined): string => {
    if (!node) return "";
    if (node.text) return node.text;
    if (!node.content) return "";
    return node.content.map(collectText).join("");
  };

  const walk = (node: JSONContent | undefined) => {
    if (!node) return;
    if (node.type === "heading") {
      const level = Number(node.attrs?.level ?? 1);
      const text = collectText(node).trim();
      headings.push({ level, text });
    }
    if (node.type === "image") {
      const src = String(node.attrs?.src ?? "");
      const alt = String(node.attrs?.alt ?? "");
      if (src) images.push({ src, alt });
    }
    if (node.marks) {
      for (const m of node.marks) {
        if (m.type === "link") {
          const href = String(m.attrs?.href ?? "");
          const text = node.text ?? "";
          if (href) {
            const isExternal = /^https?:\/\//i.test(href) && !href.startsWith(siteOrigin);
            const rel = (m.attrs?.rel as string | undefined) ?? null;
            links.push({ href, text, isExternal, rel });
          }
        }
      }
    }
    if (node.content) for (const c of node.content) walk(c);
  };
  walk(doc ?? undefined);

  const paragraphs = tokenizeParagraphs(plainText);
  const sentences = tokenizeSentences(plainText);
  const firstParagraphText = paragraphs[0] ?? "";

  return { headings, paragraphs, sentences, links, images, firstParagraphText };
}
