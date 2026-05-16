import { NextResponse, type NextRequest } from "next/server";
import { revalidatePath, revalidateTag } from "next/cache";

/**
 * Dev-only cache-busting endpoint.
 *
 * Hit this from seed scripts (or curl) after writing data directly to the
 * database — those writes bypass the admin actions that normally call
 * updateTag / revalidatePath. Production publish/unpublish/delete go through
 * `publishAction` etc., which already invalidate correctly.
 *
 * Gated to non-production. Returns 404 in production.
 */
export async function POST(req: NextRequest) {
  if (process.env.NODE_ENV === "production") {
    return new NextResponse("Not found", { status: 404 });
  }

  const { tags, paths } = await req.json().catch(() => ({ tags: [], paths: [] }));

  const tagList = Array.isArray(tags) ? (tags as string[]) : [];
  const pathList = Array.isArray(paths) ? (paths as string[]) : [];

  for (const tag of tagList) revalidateTag(tag, "max");
  for (const p of pathList) revalidatePath(p);

  return NextResponse.json({ ok: true, tags: tagList, paths: pathList });
}

export async function GET() {
  if (process.env.NODE_ENV === "production") {
    return new NextResponse("Not found", { status: 404 });
  }
  // Convenience: GET busts the default blog tags + root.
  revalidateTag("posts:index", "max");
  revalidatePath("/");
  revalidatePath("/blog");
  return NextResponse.json({ ok: true, defaults: true });
}
