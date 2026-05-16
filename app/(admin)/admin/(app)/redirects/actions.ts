"use server";

import "server-only";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { db } from "@/db/client";
import { redirects } from "@/db/schema";
import { requireUser } from "@/lib/auth/session";

const redirectSchema = z.object({
  fromPath: z.string().min(1).max(400).startsWith("/"),
  toPath: z.string().min(1).max(400),
  status: z.union([z.literal(301), z.literal(302)]).default(301),
});

export async function createRedirectAction(_prev: unknown, formData: FormData) {
  await requireUser();
  const parsed = redirectSchema.safeParse({
    fromPath: formData.get("fromPath"),
    toPath: formData.get("toPath"),
    status: Number(formData.get("status")) === 302 ? 302 : 301,
  });
  if (!parsed.success) return { error: "Invalid input" };
  if (parsed.data.fromPath === parsed.data.toPath) return { error: "From and To cannot be the same" };
  try {
    await db
      .insert(redirects)
      .values(parsed.data)
      .onConflictDoUpdate({
        target: redirects.fromPath,
        set: { toPath: parsed.data.toPath, status: parsed.data.status },
      });
    revalidatePath("/admin/redirects");
    return { ok: true };
  } catch (e) {
    return { error: (e as Error).message };
  }
}

export async function deleteRedirectAction(id: number) {
  await requireUser();
  await db.delete(redirects).where(eq(redirects.id, id));
  revalidatePath("/admin/redirects");
}
