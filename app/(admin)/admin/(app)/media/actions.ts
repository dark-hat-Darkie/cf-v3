"use server";

import "server-only";
import { put } from "@vercel/blob";
import { desc, eq } from "drizzle-orm";
import { z } from "zod";
import { db } from "@/db/client";
import { media } from "@/db/schema";
import { requireUser } from "@/lib/auth/session";
import { processImage } from "@/lib/media/sharp";

const ALLOWED_MIME = new Set(["image/jpeg", "image/png", "image/webp", "image/svg+xml", "image/gif"]);
const MAX_BYTES = 10 * 1024 * 1024; // 10 MB

const altUpdateSchema = z.object({
  id: z.number().int().positive(),
  alt: z.string().max(400),
});

type MediaItem = {
  id: number;
  url: string;
  alt: string;
  width: number | null;
  height: number | null;
};

export async function fetchMediaAction(): Promise<MediaItem[]> {
  await requireUser();
  const rows = await db.select().from(media).orderBy(desc(media.createdAt)).limit(120);
  return rows.map((m) => ({ id: m.id, url: m.blobUrl, alt: m.alt, width: m.width, height: m.height }));
}

export async function uploadInlineAction(formData: FormData): Promise<MediaItem | { error: string }> {
  await requireUser();
  const file = formData.get("file");
  if (!(file instanceof File)) return { error: "No file" };
  if (file.size === 0) return { error: "Empty file" };
  if (file.size > MAX_BYTES) return { error: "File exceeds 10 MB" };
  if (!ALLOWED_MIME.has(file.type)) return { error: `Unsupported type: ${file.type}` };

  const buf = await file.arrayBuffer();
  const processed = await processImage(buf, file.type);

  const baseName = (file.name || "image").replace(/\.[^.]+$/, "").replace(/[^a-zA-Z0-9-_]/g, "-").slice(0, 60);
  const ext = processed.mime === "image/webp" ? "webp" : processed.mime === "image/png" ? "png" : processed.mime === "image/svg+xml" ? "svg" : "bin";
  const pathname = `media/${Date.now().toString(36)}-${baseName}.${ext}`;

  const blob = await put(pathname, processed.buffer, {
    access: "public",
    contentType: processed.mime,
    addRandomSuffix: false,
  });

  const [row] = await db
    .insert(media)
    .values({
      blobUrl: blob.url,
      pathname: blob.pathname,
      alt: "",
      width: processed.width || null,
      height: processed.height || null,
      mime: processed.mime,
      sizeBytes: processed.buffer.byteLength,
      blurhash: processed.blurhash || null,
    })
    .returning();

  return { id: row.id, url: row.blobUrl, alt: row.alt, width: row.width, height: row.height };
}

export async function updateAltAction(input: unknown) {
  await requireUser();
  const parsed = altUpdateSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: "Invalid payload" };
  await db.update(media).set({ alt: parsed.data.alt }).where(eq(media.id, parsed.data.id));
  return { ok: true };
}

export async function deleteMediaAction(id: number) {
  await requireUser();
  // NOTE: we do not delete from Vercel Blob here to keep this fast — orphans can be reaped later.
  await db.delete(media).where(eq(media.id, id));
  return { ok: true };
}
