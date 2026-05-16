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
  const { posts } = await import("../db/schema");
  const rows = await db
    .select({
      id: posts.id,
      slug: posts.slug,
      status: posts.status,
      publishedAt: posts.publishedAt,
      title: posts.title,
    })
    .from(posts);
  console.log(JSON.stringify(rows, null, 2));
}

main().then(() => process.exit(0)).catch((e) => { console.error(e); process.exit(1); });
