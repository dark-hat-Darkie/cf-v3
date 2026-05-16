import "server-only";
import { generateHTML } from "@tiptap/html";
import type { JSONContent } from "@tiptap/core";
import GithubSlugger from "github-slugger";
import { sharedExtensions } from "./schema";

/**
 * Render ProseMirror JSON to HTML, then post-process:
 *  - Lazy-load all images except the first (LCP eager + fetchpriority high)
 *  - Add rel="noopener noreferrer" + target="_blank" to absolute external links
 *  - Inject id="…" on H2/H3 for table-of-contents anchoring
 *  - Wrap tables in a horizontal-scroll container for mobile
 *  - Mark <pre> with data-copyable so the client copy enhancer attaches a button
 *  - Wrap bare <img> in <figure> + optional <figcaption> from alt
 */
export function renderPostHtml(doc: JSONContent, siteOrigin: string): string {
  if (!doc || doc.type !== "doc" || !doc.content?.length) return "";
  const html = generateHTML(doc as JSONContent, sharedExtensions);
  return postProcessHtml(html, siteOrigin);
}

export function postProcessHtml(html: string, siteOrigin: string): string {
  let firstImageSeen = false;
  let out = html.replace(/<img\b([^>]*)>/g, (_m, attrs) => {
    const isFirst = !firstImageSeen;
    firstImageSeen = true;
    let next = attrs;
    if (isFirst) {
      next = next.replace(/\sloading="lazy"/g, "");
      if (!/\sloading=/.test(next)) next += ` loading="eager"`;
      if (!/\sfetchpriority=/.test(next)) next += ` fetchpriority="high"`;
    } else if (!/\sloading=/.test(next)) {
      next += ` loading="lazy"`;
    }
    if (!/\sdecoding=/.test(next)) next += ` decoding="async"`;
    return `<img${next}>`;
  });

  out = out.replace(/<a\b([^>]*)>/g, (_m, attrs) => {
    const hrefMatch = attrs.match(/href="([^"]+)"/);
    if (!hrefMatch) return `<a${attrs}>`;
    const href = hrefMatch[1];
    let next = attrs;
    const isAbsolute = /^https?:\/\//i.test(href);
    if (isAbsolute && !href.startsWith(siteOrigin)) {
      if (!/\srel=/.test(next)) next += ` rel="noopener noreferrer"`;
      else if (!/noopener/.test(next)) next = next.replace(/rel="([^"]*)"/, 'rel="$1 noopener noreferrer"');
      if (!/\starget=/.test(next)) next += ` target="_blank"`;
    }
    return `<a${next}>`;
  });

  // Heading IDs (H2 + H3) — slugify text content via github-slugger for dedupe.
  const slugger = new GithubSlugger();
  out = out.replace(/<(h[23])\b([^>]*)>([\s\S]*?)<\/\1>/g, (_m, tag, attrs, inner) => {
    if (/\sid=/.test(attrs)) return `<${tag}${attrs}>${inner}</${tag}>`;
    const textOnly = inner.replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim();
    if (!textOnly) return `<${tag}${attrs}>${inner}</${tag}>`;
    const id = slugger.slug(textOnly);
    return `<${tag}${attrs} id="${id}">${inner}</${tag}>`;
  });

  // Wrap tables in a horizontal-scroll container (idempotent).
  if (!out.includes("cf-prose-table")) {
    out = out.replace(/<table\b([^>]*)>([\s\S]*?)<\/table>/g, (_m, attrs, inner) => {
      return `<div class="cf-prose-table"><table${attrs}>${inner}</table></div>`;
    });
  }

  // Mark <pre> blocks for the client copy-button enhancer.
  out = out.replace(/<pre\b([^>]*)>/g, (_m, attrs) => {
    if (/\sdata-copyable=/.test(attrs)) return `<pre${attrs}>`;
    return `<pre${attrs} data-copyable="1">`;
  });

  // Wrap bare <img> in <figure> + optional <figcaption> from non-empty alt.
  out = wrapBareImagesInFigures(out);

  return out;
}

function wrapBareImagesInFigures(html: string): string {
  return html.replace(/<img\b([^>]*)>/g, (match, attrs, offset: number) => {
    // Skip if already inside a <figure> — look at preceding 240 chars.
    const before = html.slice(Math.max(0, offset - 240), offset);
    const lastOpen = before.lastIndexOf("<figure");
    const lastClose = before.lastIndexOf("</figure>");
    if (lastOpen > lastClose) return match;

    const altMatch = (attrs as string).match(/\salt="([^"]*)"/);
    const alt = altMatch ? altMatch[1] : "";
    const caption = alt && alt.trim() ? `<figcaption>${alt}</figcaption>` : "";
    return `<figure class="cf-prose-figure">${match}${caption}</figure>`;
  });
}

export { extractPlainText } from "./plain-text";
