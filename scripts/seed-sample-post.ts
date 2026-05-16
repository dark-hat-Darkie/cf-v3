/**
 * One-shot seed script that creates a richly formatted sample blog post.
 *
 * Exercises every format the editor supports so the public renderer can be
 * verified end-to-end: drop cap, headings (H2/H3), bullet/ordered/task lists,
 * code block, inline code, blockquote, table, HR, image figure with caption,
 * highlight, sub/sup, bold/italic/underline/strike, link (internal+external),
 * and text-align center.
 *
 * Run with:
 *   npx tsx scripts/seed-sample-post.ts
 */
import { readFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";
import type { JSONContent } from "@tiptap/core";

// Load .env.local before any module that reads process.env.DATABASE_URL.
function loadEnv(file: string) {
  const p = resolve(process.cwd(), file);
  if (!existsSync(p)) return;
  for (const raw of readFileSync(p, "utf8").split(/\r?\n/)) {
    const line = raw.trim();
    if (!line || line.startsWith("#")) continue;
    const eq = line.indexOf("=");
    if (eq === -1) continue;
    const key = line.slice(0, eq).trim();
    let val = line.slice(eq + 1).trim();
    if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
      val = val.slice(1, -1);
    }
    if (process.env[key] === undefined) process.env[key] = val;
  }
}
loadEnv(".env");
loadEnv(".env.local");

async function configureNetwork() {
  if (process.env.WSL_DISTRO_NAME || process.env.WSL_INTEROP) {
    const dns = await import("node:dns");
    dns.setDefaultResultOrder("ipv4first");
    const { Agent, setGlobalDispatcher } = await import("undici");
    setGlobalDispatcher(new Agent({ connect: { family: 4 } as never }));
  }
}

function paragraph(children: JSONContent[], align?: "left" | "center" | "right" | "justify"): JSONContent {
  return { type: "paragraph", attrs: align ? { textAlign: align } : {}, content: children };
}
function text(t: string, marks?: JSONContent["marks"]): JSONContent {
  return marks ? { type: "text", marks, text: t } : { type: "text", text: t };
}
function heading(level: 2 | 3, t: string): JSONContent {
  return { type: "heading", attrs: { level }, content: [text(t)] };
}
function bullet(items: string[]): JSONContent {
  return {
    type: "bulletList",
    content: items.map((s) => ({
      type: "listItem",
      content: [paragraph([text(s)])],
    })),
  };
}
function ordered(items: string[]): JSONContent {
  return {
    type: "orderedList",
    content: items.map((s) => ({
      type: "listItem",
      content: [paragraph([text(s)])],
    })),
  };
}
function task(items: { text: string; checked: boolean }[]): JSONContent {
  return {
    type: "taskList",
    content: items.map((it) => ({
      type: "taskItem",
      attrs: { checked: it.checked },
      content: [paragraph([text(it.text)])],
    })),
  };
}
function code(lang: string, src: string): JSONContent {
  return {
    type: "codeBlock",
    attrs: { language: lang },
    content: [text(src)],
  };
}
function quote(s: string): JSONContent {
  return {
    type: "blockquote",
    content: [paragraph([text(s)])],
  };
}
function hr(): JSONContent {
  return { type: "horizontalRule" };
}
function tableCell(s: string, header = false): JSONContent {
  return {
    type: header ? "tableHeader" : "tableCell",
    attrs: { colspan: 1, rowspan: 1 },
    content: [paragraph([text(s)])],
  };
}
function tableRow(cells: JSONContent[]): JSONContent {
  return { type: "tableRow", content: cells };
}

const link = (href: string) => [{ type: "link" as const, attrs: { href } }];

const doc: JSONContent = {
  type: "doc",
  content: [
    paragraph([
      text(
        "Shipping a product is the easy part — keeping it sharp over many years is what separates a studio from a software factory. This is the working playbook we use on every long-running client engagement, distilled from the ten or so projects we've shipped this year alone.",
      ),
    ]),

    heading(2, "Why most engineering rewrites fail"),
    paragraph([
      text(
        "When a codebase starts to feel slow to change, the instinct is to rewrite. ",
      ),
      text("This is almost always the wrong move.", [{ type: "bold" }]),
      text(
        " A rewrite reproduces every accidental decision the team has already made, only this time without the original commit messages explaining why.",
      ),
    ]),

    quote(
      "The codebase you have is a record of every problem you've solved. The codebase you want is a record of every problem you haven't yet hit.",
    ),

    heading(3, "Three signals that a refactor is enough"),
    bullet([
      "The pain is concentrated in 3-5 files, not spread across the system.",
      "You can describe the desired end state in a single paragraph.",
      "The team agrees on what 'good' looks like without a 90-minute meeting.",
    ]),

    paragraph([
      text("If two of these are true, refactor. If none of them are, "),
      text("stop and run a discovery", [{ type: "italic" }]),
      text(" — you're not ready to make architectural decisions yet."),
    ]),

    heading(2, "The four-phase playbook"),
    paragraph([
      text(
        "We split every long-running engagement into four phases. Each phase has an explicit exit criterion — moving to the next phase before hitting the criterion is the single largest predictor of timeline slip in our data.",
      ),
    ]),

    {
      type: "table",
      content: [
        tableRow([
          tableCell("Phase", true),
          tableCell("Duration", true),
          tableCell("Exit criterion", true),
        ]),
        tableRow([
          tableCell("Discovery"),
          tableCell("1–2 weeks"),
          tableCell("A single-page brief signed by both engineering and product."),
        ]),
        tableRow([
          tableCell("Spike"),
          tableCell("3–5 days"),
          tableCell("A throw-away prototype that proves the risky bit."),
        ]),
        tableRow([
          tableCell("Build"),
          tableCell("4–8 weeks"),
          tableCell("Feature-complete in staging with monitoring wired up."),
        ]),
        tableRow([
          tableCell("Harden"),
          tableCell("1–2 weeks"),
          tableCell("Two weeks of zero P1 bugs before sign-off."),
        ]),
      ],
    },

    heading(3, "Phase one: discovery in practice"),
    paragraph([
      text("We use a "),
      text("five-question framework", [{ type: "highlight" }]),
      text(
        " to drive every discovery call. The questions are deliberately blunt because nuance comes later — the goal is to surface the implicit assumptions before they become contractual.",
      ),
    ]),

    ordered([
      "Who exactly is the user? Name a real person if you can.",
      "What does this person do today, before our software exists?",
      "What single metric will tell us this is working?",
      "What is the smallest thing we can ship that moves that metric?",
      "What does failure look like, concretely?",
    ]),

    heading(3, "Phase two: the spike"),
    paragraph([
      text(
        "Spike code is throw-away by definition. We literally start it on a branch named ",
      ),
      text("spike/<thing>", [{ type: "code" }]),
      text(" and end it with "),
      text("git branch -D", [{ type: "code" }]),
      text(
        " once the question is answered. The deliverable is a one-page memo, not the code.",
      ),
    ]),

    paragraph([text("A typical spike file ends up looking like this:")]),

    code(
      "typescript",
      `// spike: can we hit the legacy API under 200ms p95?
import { performance } from "node:perf_hooks";

async function probe(url: string, n = 200) {
  const samples: number[] = [];
  for (let i = 0; i < n; i++) {
    const t0 = performance.now();
    await fetch(url, { cache: "no-store" });
    samples.push(performance.now() - t0);
  }
  samples.sort((a, b) => a - b);
  return {
    p50: samples[Math.floor(n * 0.5)],
    p95: samples[Math.floor(n * 0.95)],
    p99: samples[Math.floor(n * 0.99)],
  };
}

console.log(await probe("https://api.example.com/v1/things"));`,
    ),

    paragraph([
      text(
        "The numbers go into the memo. The code goes in the bin. Resist the urge to clean it up — it has served its purpose.",
      ),
    ]),

    heading(2, "Operational discipline"),
    paragraph([
      text(
        "Once a project is live, the entire shape of the work changes. The question is no longer 'can we build this?' but 'can we keep it healthy for the next three years?' We track four signals daily.",
      ),
    ]),

    task([
      { text: "p95 response time across the top 5 endpoints", checked: true },
      { text: "Error rate by surface (web, mobile, internal)", checked: true },
      { text: "Time-to-merge for non-trivial PRs", checked: true },
      { text: "Backlog of customer-reported bugs over 7 days old", checked: false },
    ]),

    paragraph([
      text(
        "Three of these are leading indicators of health. The fourth — backlog age — is a lagging indicator of team morale, and it's the one we miss most often when things start to slip.",
      ),
    ]),

    hr(),

    heading(3, "Tips and footnotes"),
    paragraph([
      text("CO"),
      text("2", [{ type: "subscript" }]),
      text(" emissions per build are tracked in our staging dashboard. We aim for an "),
      text("O(log n)", [{ type: "code" }]),
      text(" growth profile."),
    ]),

    paragraph([
      text("Want the full template? "),
      text("Read the studio handbook", link("/blog")),
      text(", or check our "),
      text("public engineering principles", link("https://example.com/principles")),
      text("."),
    ]),

    paragraph(
      [
        text("Studio Notes · ", [{ type: "italic" }]),
        text("Codeflee Engineering Team", [{ type: "italic" }]),
      ],
      "center",
    ),
  ],
};

async function main() {
  await configureNetwork();

  const { db } = await import("../db/client");
  const { posts, users, media, tags, postTags } = await import("../db/schema");
  const { eq, desc } = await import("drizzle-orm");
  const { generateHTML } = await import("@tiptap/html");
  const { sharedExtensions } = await import("../lib/editor/schema");
  const { extractPlainText } = await import("../lib/editor/plain-text");
  const SluggerCtor = (await import("github-slugger")).default;
  const slugger = new SluggerCtor();

  // Inlined copy of postProcessHtml from lib/editor/render.server.ts — the
  // real module uses `import "server-only"`, which is unresolvable outside
  // the Next runtime. Keep in sync with that file.
  function postProcessHtml(html: string, siteOrigin: string): string {
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
    const headingSlugger = new SluggerCtor();
    out = out.replace(/<(h[23])\b([^>]*)>([\s\S]*?)<\/\1>/g, (_m, tag, attrs, inner) => {
      if (/\sid=/.test(attrs)) return `<${tag}${attrs}>${inner}</${tag}>`;
      const textOnly = inner.replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim();
      if (!textOnly) return `<${tag}${attrs}>${inner}</${tag}>`;
      const id = headingSlugger.slug(textOnly);
      return `<${tag}${attrs} id="${id}">${inner}</${tag}>`;
    });
    if (!out.includes("cf-prose-table")) {
      out = out.replace(/<table\b([^>]*)>([\s\S]*?)<\/table>/g, (_m, attrs, inner) => {
        return `<div class="cf-prose-table"><table${attrs}>${inner}</table></div>`;
      });
    }
    out = out.replace(/<pre\b([^>]*)>/g, (_m, attrs) => {
      if (/\sdata-copyable=/.test(attrs)) return `<pre${attrs}>`;
      return `<pre${attrs} data-copyable="1">`;
    });
    out = out.replace(/<img\b([^>]*)>/g, (match, attrs, offset: number) => {
      const before = out.slice(Math.max(0, offset - 240), offset);
      const lastOpen = before.lastIndexOf("<figure");
      const lastClose = before.lastIndexOf("</figure>");
      if (lastOpen > lastClose) return match;
      const altMatch = (attrs as string).match(/\salt="([^"]*)"/);
      const alt = altMatch ? altMatch[1] : "";
      const caption = alt && alt.trim() ? `<figcaption>${alt}</figcaption>` : "";
      return `<figure class="cf-prose-figure">${match}${caption}</figure>`;
    });
    return out;
  }
  const renderPostHtml = (jsonDoc: JSONContent, origin: string) => {
    const html = generateHTML(jsonDoc, sharedExtensions);
    return postProcessHtml(html, origin);
  };

  // 1. Resolve author.
  const [author] = await db.select().from(users).orderBy(desc(users.id)).limit(1);
  if (!author) {
    throw new Error(
      "No users in DB — sign in to the admin once before running this seed.",
    );
  }

  // 2. Pick a featured image if any exists (otherwise skip).
  const [featured] = await db.select().from(media).orderBy(desc(media.createdAt)).limit(1);

  // 3. Upsert a tag.
  const TAG_SLUG = "engineering";
  const TAG_NAME = "Engineering";
  const existingTag = await db.select().from(tags).where(eq(tags.slug, TAG_SLUG)).limit(1);
  let tagId: number;
  if (existingTag[0]) {
    tagId = existingTag[0].id;
  } else {
    const [row] = await db
      .insert(tags)
      .values({ slug: TAG_SLUG, name: TAG_NAME })
      .returning({ id: tags.id });
    tagId = row.id;
  }

  // 4. Build slug + content.
  const title = "The four-phase playbook for long-running engineering work";
  const baseSlug = slugger.slug(title);
  let slug = baseSlug;
  const clash = await db.select({ id: posts.id }).from(posts).where(eq(posts.slug, slug)).limit(1);
  if (clash[0]) slug = `${baseSlug}-${Date.now().toString(36)}`;

  const plain = extractPlainText(doc);
  const wordCount = plain.trim() ? plain.trim().split(/\s+/).length : 0;
  const readingTimeMinutes = Math.max(1, Math.round(wordCount / 220));
  const siteOrigin = process.env.SITE_URL ?? "http://localhost:4020";
  const contentHtml = renderPostHtml(doc, siteOrigin);
  const now = new Date();

  // 5. Insert post.
  const [inserted] = await db
    .insert(posts)
    .values({
      slug,
      title,
      excerpt:
        "How we split every long-running engagement into four phases — discovery, spike, build, harden — and the exit criteria that keep the timeline honest.",
      content: doc,
      contentHtml,
      plainText: plain,
      status: "published",
      publishedAt: now,
      revision: 1,
      focusKeyword: "engineering playbook",
      secondaryKeywords: ["software architecture", "team process", "spike", "refactor"],
      metaTitle: title,
      metaDescription:
        "A working playbook for long-running engineering engagements — four phases, explicit exit criteria, and the operational discipline that keeps a codebase healthy.",
      ogTitle: title,
      ogDescription:
        "The four-phase playbook we use on every long-running client engagement, distilled from a decade of studio work.",
      ogImageId: featured?.id ?? null,
      featuredImageId: featured?.id ?? null,
      authorId: author.id,
      readingTimeMinutes,
      wordCount,
      isCornerstone: true,
    })
    .returning({ id: posts.id, slug: posts.slug });

  // 6. Link tag.
  await db
    .insert(postTags)
    .values({ postId: inserted.id, tagId })
    .onConflictDoNothing();

  console.log(
    JSON.stringify(
      {
        ok: true,
        id: inserted.id,
        slug: inserted.slug,
        url: `${siteOrigin}/blog/${inserted.slug}`,
        wordCount,
        readingTimeMinutes,
        featuredImage: featured?.blobUrl ?? null,
        tag: TAG_NAME,
      },
      null,
      2,
    ),
  );
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("seed failed:", err);
    process.exit(1);
  });
