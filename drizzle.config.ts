import { readFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";
import dns from "node:dns";
import type { Config } from "drizzle-kit";

// Minimal .env loader — drizzle-kit doesn't read .env.local on its own.
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

// Order matches Next.js: .env.local overrides .env
loadEnv(".env");
loadEnv(".env.local");

// WSL2 has no public IPv6 connectivity. Force any DNS lookup in this process
// to return only IPv4 addresses. This catches `dns.lookup`-based clients (ws,
// pg, http) — drizzle-kit's neon-websocket driver is one of them.
if (process.env.WSL_DISTRO_NAME || process.env.WSL_INTEROP || process.env.FORCE_IPV4 === "1") {
  dns.setDefaultResultOrder("ipv4first");
  const originalLookup = dns.lookup.bind(dns) as unknown as (
    hostname: string,
    opts: unknown,
    cb: unknown,
  ) => void;
  // @ts-expect-error reassigning to force IPv4
  dns.lookup = (hostname: string, opts: unknown, cb?: unknown) => {
    if (typeof opts === "function") {
      return originalLookup(hostname, { family: 4 }, opts);
    }
    const merged = { ...(typeof opts === "object" && opts ? opts : {}), family: 4 };
    return originalLookup(hostname, merged, cb);
  };
}

const url = process.env.DATABASE_URL_UNPOOLED ?? process.env.DATABASE_URL;
if (!url) {
  throw new Error("DATABASE_URL_UNPOOLED or DATABASE_URL must be set for drizzle-kit");
}

export default {
  schema: "./db/schema.ts",
  out: "./db/migrations",
  dialect: "postgresql",
  casing: "snake_case",
  dbCredentials: { url },
} satisfies Config;
