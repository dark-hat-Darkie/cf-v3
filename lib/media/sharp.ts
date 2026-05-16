import "server-only";
import sharp from "sharp";
import { encode } from "blurhash";

export type ProcessedImage = {
  width: number;
  height: number;
  mime: string;
  buffer: Buffer;
  blurhash: string;
};

const MAX_DIMENSION = 2400;

export async function processImage(input: ArrayBuffer, mime: string): Promise<ProcessedImage> {
  const buf = Buffer.from(input);

  // SVG: skip processing — store as-is
  if (mime === "image/svg+xml") {
    return {
      buffer: buf,
      mime: "image/svg+xml",
      width: 0,
      height: 0,
      blurhash: "",
    };
  }

  const pipeline = sharp(buf, { failOn: "error" }).rotate();
  const meta = await pipeline.metadata();
  const needsResize = (meta.width ?? 0) > MAX_DIMENSION || (meta.height ?? 0) > MAX_DIMENSION;

  const targetFormat: "webp" | "png" | "jpeg" =
    mime === "image/png" ? "png" : "webp";

  const transformed = await (needsResize
    ? pipeline.resize({ width: MAX_DIMENSION, height: MAX_DIMENSION, fit: "inside", withoutEnlargement: true })
    : pipeline
  )
    .toFormat(targetFormat, { quality: targetFormat === "png" ? undefined : 82 })
    .toBuffer({ resolveWithObject: true });

  const small = await sharp(buf).resize(32, 32, { fit: "inside" }).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const blurhash = encode(
    new Uint8ClampedArray(small.data),
    small.info.width,
    small.info.height,
    4,
    4,
  );

  return {
    buffer: transformed.data,
    mime: targetFormat === "png" ? "image/png" : "image/webp",
    width: transformed.info.width,
    height: transformed.info.height,
    blurhash,
  };
}
