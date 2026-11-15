"use server";

import "server-only";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { db } from "@/db/client";
import { inquiries } from "@/db/schema";
import { requireUser } from "@/lib/auth/session";

const statusSchema = z.enum(["new", "replied", "archived"]);

export async function setInquiryStatusAction(id: number, status: string) {
  await requireUser();
  const parsed = statusSchema.safeParse(status);
  if (!parsed.success || !Number.isInteger(id)) return;
  await db.update(inquiries).set({ status: parsed.data }).where(eq(inquiries.id, id));
  revalidatePath("/admin/inquiries");
}
