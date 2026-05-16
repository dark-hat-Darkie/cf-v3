import "server-only";
import { decode } from "blurhash";
import sharp from "sharp";

/**
 * Decode a blurhash to a tiny base64 PNG data URL suitable for
 * `next/image`'s `placeholder="blur"` / `blurDataURL` prop.
 *
 * Returns `undefined` on missing hash or decode failure so callers can pass
 * the result directly to `next/image` without conditionals.
 */
export async function blurhashToDataUrl(
  hash: string | null | undefined,
  width = 32,
  height = 18,
): Promise<string | undefined> {
  if (!hash) return undefined;
  try {
    const pixels = decode(hash, width, height);
    const buffer = await sharp(Buffer.from(pixels), {
      raw: { width, height, channels: 4 },
    })
      .png()
      .toBuffer();
    return `data:image/png;base64,${buffer.toString("base64")}`;
  } catch {
    return undefined;
  }
}
