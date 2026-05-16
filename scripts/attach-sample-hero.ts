/**
 * Attach a featured hero image to the most-recent published post.
 *
 * Creates a media row pointing at /assets/c1.webp (a local public asset) and
 * sets featuredImageId on the latest post that doesn't already have one.
 *
 * Run with:
 *   npx tsx scripts/attach-sample-hero.ts
 */
import { readFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";

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
    if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) val = val.slice(1, -1);
    if (process.env[key] === undefined) process.env[key] = val;
  }
}
loadEnv(".env");
loadEnv(".env.local");

async function main() {
  const dns = await import("node:dns");
  dns.setDefaultResultOrder("ipv4first");
  const { Agent, setGlobalDispatcher } = await import("undici");
  setGlobalDispatcher(new Agent({ connect: { family: 4 } as never }));

  const { db } = await import("../db/client");
  const { posts, media } = await import("../db/schema");
  const { eq, desc, and, isNull } = await import("drizzle-orm");

  // 1. Find the latest published post that doesn't already have a hero.
  const [target] = await db
    .select({ id: posts.id, slug: posts.slug, featuredImageId: posts.featuredImageId })
    .from(posts)
    .where(and(eq(posts.status, "published"), isNull(posts.featuredImageId)))
    .orderBy(desc(posts.publishedAt))
    .limit(1);

  if (!target) {
    console.log("No published post without a hero image — nothing to do.");
    process.exit(0);
  }

  // 2. Create a media row pointing at the local public asset.
  const [mediaRow] = await db
    .insert(media)
    .values({
      blobUrl: "/assets/c1.webp",
      pathname: "local/c1.webp",
      alt: "Architectural diagram — engineering playbook",
      width: 1600,
      height: 900,
      mime: "image/webp",
      sizeBytes: 0,
      blurhash: "LLM}Mp$#fQ$#09R,fQR,4JX6fQX6",
    })
    .returning({ id: media.id });

  // 3. Wire it up.
  await db
    .update(posts)
    .set({ featuredImageId: mediaRow.id, ogImageId: mediaRow.id, updatedAt: new Date() })
    .where(eq(posts.id, target.id));

  console.log(
    JSON.stringify(
      {
        ok: true,
        postId: target.id,
        slug: target.slug,
        mediaId: mediaRow.id,
        url: `/blog/${target.slug}`,
      },
      null,
      2,
    ),
  );
}

main().then(() => process.exit(0)).catch((e) => { console.error(e); process.exit(1); });
