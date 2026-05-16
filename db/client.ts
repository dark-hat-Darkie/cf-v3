import { neon, neonConfig } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";

neonConfig.fetchConnectionCache = true;

// WSL2 IPv6 workaround — applied at module load time so build-time prerenders
// also get IPv4. See instrumentation.ts for the runtime equivalent.
if (
  typeof process !== "undefined" &&
  (process.env.WSL_DISTRO_NAME || process.env.WSL_INTEROP || process.env.FORCE_IPV4 === "1")
) {
  (async () => {
    try {
      const { Agent, setGlobalDispatcher } = await import("undici");
      setGlobalDispatcher(new Agent({ connect: { family: 4 } as never }));
    } catch {}
  })();
}

let _db: ReturnType<typeof drizzle<typeof schema>> | null = null;

function getDb() {
  if (_db) return _db;
  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error("DATABASE_URL is not set. Add it to .env.local or your hosting provider env.");
  }
  const sql = neon(url);
  _db = drizzle(sql, { schema, casing: "snake_case" });
  return _db;
}

export function hasDatabase(): boolean {
  return Boolean(process.env.DATABASE_URL);
}

// Proxy that lazily resolves the DB. Allows imports without env vars at build time.
export const db = new Proxy({} as ReturnType<typeof drizzle<typeof schema>>, {
  get(_t, prop, receiver) {
    const target = getDb();
    return Reflect.get(target as object, prop, receiver);
  },
}) as ReturnType<typeof drizzle<typeof schema>>;

export type DB = typeof db;
export { schema };
