import Link from "next/link";
import { connection } from "next/server";
import { listPostsAdmin } from "@/lib/content/queries";
import { ScoreMeter } from "@/components/admin/ScoreMeter";
import { CreatePostButton } from "@/components/admin/CreatePostButton";
import { StatusBadge } from "@/components/admin/StatusBadge";

export default async function PostsPage() {
  await connection();
  const items = await listPostsAdmin({ limit: 100 });

  return (
    <>
      <header className="adm-topbar">
        <div className="adm-topbar-title">Posts</div>
        <div className="adm-topbar-actions">
          <CreatePostButton />
        </div>
      </header>
      <div className="adm-content">
        <div className="adm-card" style={{ padding: 0, overflow: "hidden" }}>
          {items.length === 0 ? (
            <div className="adm-table-empty">
              No posts yet — start your first one.
            </div>
          ) : (
            <table className="adm-table">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Status</th>
                  <th>Focus keyword</th>
                  <th>SEO</th>
                  <th>Readability</th>
                  <th>Words</th>
                  <th>Updated</th>
                </tr>
              </thead>
              <tbody>
                {items.map((p) => (
                  <tr key={p.id}>
                    <td>
                      <Link href={`/admin/posts/${p.id}`} style={{ fontWeight: 500 }}>
                        {p.title || <span className="adm-muted">Untitled</span>}
                      </Link>
                      <div className="adm-muted adm-tiny adm-mono adm-truncate" style={{ maxWidth: 320 }}>/{p.slug}</div>
                    </td>
                    <td><StatusBadge status={p.status} /></td>
                    <td className="adm-dim">{p.focusKeyword || <span className="adm-muted">—</span>}</td>
                    <td><ScoreMeter score={p.seoScore} size={36} /></td>
                    <td><ScoreMeter score={p.readabilityScore} size={36} /></td>
                    <td className="adm-mono adm-dim">{p.wordCount.toLocaleString()}</td>
                    <td className="adm-dim">{new Date(p.updatedAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </>
  );
}
