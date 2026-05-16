"use server";

import "server-only";
import { findDuplicateKeyword } from "@/lib/content/queries";
import { requireUser } from "@/lib/auth/session";

export async function findCannibalizationAction(postId: number, keyword: string) {
  await requireUser();
  if (!keyword.trim()) return [];
  return findDuplicateKeyword(keyword.trim(), postId);
}
