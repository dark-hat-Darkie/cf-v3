/**
 * Optimize the raw full-page project screenshots into web-ready WebP, and
 * generate the manifest + card LQIP map the app consumes.
 *
 * Input:  public/assets/projects/{slug}{n}.png   (raw, ~50MB total)
 * Output: public/assets/projects/optimized/{slug}{n}.webp
 *         lib/media/screenshots-manifest.ts   (ordered pages + blurhash per slug)
 *         lib/media/card-lqip.ts              (16:9 top-crop data URL per slug)
 *
 * Idempotent: always overwrites from source, so re-running after re-capturing
 * a screenshot produces deterministic output.
 *
 * NOTE: this is a plain Node script (tsx). It cannot import
 * lib/media/blur-data-url.ts (that module is `import "server-only"` and throws
 * outside Next), so the blurhash→dataURL helper is inlined below.
 *
 * Run with:
 *   npm run media:screenshots   (or: npx tsx scripts/optimize-screenshots.ts)
 */
import { readdir, mkdir, writeFile } from "node:fs/promises";
import { resolve, join } from "node:path";
import sharp from "sharp";
import { encode, decode } from "blurhash";

const PROJECTS_DIR = resolve(process.cwd(), "public/assets/projects");
const OUT_DIR = join(PROJECTS_DIR, "optimized");
const PUBLIC_PREFIX = "/assets/projects/optimized";
const MANIFEST_PATH = resolve(process.cwd(), "lib/media/screenshots-manifest.ts");
const CARD_LQIP_PATH = resolve(process.cwd(), "lib/media/card-lqip.ts");

const MAX_WIDTH = 1600;
const WEBP = { quality: 72, effort: 6 } as const;

interface Page {
  src: string;
  width: number;
  height: number;
  blurDataURL: string;
}

/** Inlined copy of lib/media/blur-data-url.ts (can't import the server-only module here). */
function blurhashToDataUrl(hash: string, width: number, height: number): Promise<string> {
  const pixels = decode(hash, width, height);
  return sharp(Buffer.from(pixels), { raw: { width, height, channels: 4 } })
    .png()
    .toBuffer()
    .then((buf) => `data:image/png;base64,${buf.toString("base64")}`);
}

/** Encode a blurhash from a sharp pipeline (downsampled to keep encode cheap). */
async function blurhashFrom(pipeline: sharp.Sharp, boxW: number, boxH: number): Promise<string> {
  const { data, info } = await pipeline
    .raw()
    .ensureAlpha()
    .resize(boxW, boxH, { fit: "fill" })
    .toBuffer({ resolveWithObject: true });
  return encode(new Uint8ClampedArray(data), info.width, info.height, 4, 3);
}

/** Parse "iqqra3.png" => { slug: "iqqra", n: 3 }. Ignores non-matching files. */
function parseName(file: string): { slug: string; n: number } | null {
  const m = /^([a-z][a-z0-9-]*?)(\d+)\.png$/i.exec(file);
  if (!m) return null;
  return { slug: m[1].toLowerCase(), n: Number(m[2]) };
}

async function main() {
  await mkdir(OUT_DIR, { recursive: true });

  const files = (await readdir(PROJECTS_DIR))
    .map((f) => ({ file: f, parsed: parseName(f) }))
    .filter((x): x is { file: string; parsed: { slug: string; n: number } } => x.parsed !== null)
    .sort((a, b) => a.parsed.slug.localeCompare(b.parsed.slug) || a.parsed.n - b.parsed.n);

  if (files.length === 0) {
    console.error(`No raw PNG screenshots found in ${PROJECTS_DIR}`);
    process.exit(1);
  }

  const bySlug = new Map<string, Page[]>();
  const cardLqip = new Map<string, string>();
  let totalBytes = 0;

  for (const { file, parsed } of files) {
    const inputPath = join(PROJECTS_DIR, file);
    const outName = `${parsed.slug}${parsed.n}.webp`;
    const outPath = join(OUT_DIR, outName);

    // 1. Optimized WebP (single pass, read back the resized dimensions).
    const { data: webp, info } = await sharp(inputPath)
      .resize({ width: MAX_WIDTH, withoutEnlargement: true })
      .webp(WEBP)
      .toBuffer({ resolveWithObject: true });
    await writeFile(outPath, webp);
    totalBytes += webp.length;

    // 2. Full-image blur placeholder, pre-decoded to a data URL so the app can
    //    consume it synchronously at render (no sharp/async under cacheComponents).
    const fullHash = await blurhashFrom(sharp(inputPath), 24, 32);
    const blurDataURL = await blurhashToDataUrl(fullHash, 32, 18);

    const page: Page = {
      src: `${PUBLIC_PREFIX}/${outName}`,
      width: info.width,
      height: info.height,
      blurDataURL,
    };
    if (!bySlug.has(parsed.slug)) bySlug.set(parsed.slug, []);
    bySlug.get(parsed.slug)!.push(page);

    // 3. For the first page of each project, build a 16:9 top-crop LQIP for the card.
    if (parsed.n === Math.min(...files.filter((f) => f.parsed.slug === parsed.slug).map((f) => f.parsed.n))) {
      const meta = await sharp(inputPath).metadata();
      const w = meta.width ?? info.width;
      const h = meta.height ?? info.height;
      const cropH = Math.min(h, Math.round((w * 9) / 16));
      const topHash = await blurhashFrom(
        sharp(inputPath).extract({ left: 0, top: 0, width: w, height: cropH }),
        32,
        18,
      );
      cardLqip.set(parsed.slug, await blurhashToDataUrl(topHash, 32, 18));
    }

    const kb = (webp.length / 1024).toFixed(0);
    console.log(`  ${file.padEnd(18)} → ${outName.padEnd(18)} ${info.width}×${info.height}  ${kb} KB`);
  }

  const slugs = [...bySlug.keys()].sort();

  // ── Write screenshots-manifest.ts ──
  const slugUnion = slugs.map((s) => `'${s}'`).join(" | ");
  let manifest = `// AUTO-GENERATED by scripts/optimize-screenshots.ts — do not edit by hand.\n`;
  manifest += `export interface ScreenshotPage {\n  src: string;\n  width: number;\n  height: number;\n  blurDataURL: string;\n}\n\n`;
  manifest += `export type ScreenshotSlug = ${slugUnion};\n\n`;
  manifest += `export const SCREENSHOTS: Record<ScreenshotSlug, ScreenshotPage[]> = {\n`;
  for (const slug of slugs) {
    manifest += `  ${slug}: [\n`;
    for (const p of bySlug.get(slug)!) {
      manifest += `    {\n      src: ${JSON.stringify(p.src)},\n      width: ${p.width},\n      height: ${p.height},\n      blurDataURL: ${JSON.stringify(p.blurDataURL)},\n    },\n`;
    }
    manifest += `  ],\n`;
  }
  manifest += `};\n`;
  await writeFile(MANIFEST_PATH, manifest);

  // ── Write card-lqip.ts ──
  let lqip = `// AUTO-GENERATED by scripts/optimize-screenshots.ts — do not edit by hand.\n`;
  lqip += `// 16:9 top-crop blur placeholders for the homepage "Selected work" cards (client-safe).\n`;
  lqip += `export const CARD_LQIP: Record<string, string> = {\n`;
  for (const slug of slugs) {
    lqip += `  ${slug}: ${JSON.stringify(cardLqip.get(slug) ?? "")},\n`;
  }
  lqip += `};\n`;
  await writeFile(CARD_LQIP_PATH, lqip);

  console.log(`\n✓ ${files.length} screenshots → ${(totalBytes / 1024 / 1024).toFixed(2)} MB total WebP`);
  console.log(`✓ wrote ${MANIFEST_PATH}`);
  console.log(`✓ wrote ${CARD_LQIP_PATH}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
