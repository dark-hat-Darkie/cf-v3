import Link from "next/link";
import { connection } from "next/server";
import { countPostsByStatus, listPostsAdmin } from "@/lib/content/queries";
import { ScoreMeter } from "@/components/admin/ScoreMeter";
import { CreatePostButton } from "@/components/admin/CreatePostButton";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { Icon } from "@/components/admin/icons";

export default async function DashboardPage() {
  await connection();
  const [counts, recent] = await Promise.all([
    countPostsByStatus(),
    listPostsAdmin({ limit: 6 }),
  ]);

  return (
    <>
      <header className="adm-topbar">
        <div className="adm-topbar-title">Dashboard</div>
        <div className="adm-topbar-actions">
          <Link href="/blog" className="adm-btn adm-btn-ghost adm-btn-sm" target="_blank">
            <Icon.External width={14} height={14} />
            View site
          </Link>
          <CreatePostButton />
        </div>
      </header>

      <div className="adm-content">
        <div className="adm-grid-3" style={{ marginBottom: 24 }}>
          <div className="adm-stat">
            <div>
              <div className="adm-stat-label">Published</div>
              <div className="adm-stat-value">{counts.published}</div>
            </div>
            <div className="adm-stat-icon success">
              <Icon.Live width={18} height={18} />
            </div>
          </div>
          <div className="adm-stat">
            <div>
              <div className="adm-stat-label">Drafts</div>
              <div className="adm-stat-value">{counts.draft}</div>
            </div>
            <div className="adm-stat-icon muted">
              <Icon.Doc width={18} height={18} />
            </div>
          </div>
          <div className="adm-stat">
            <div>
              <div className="adm-stat-label">Scheduled</div>
              <div className="adm-stat-value">{counts.scheduled}</div>
            </div>
            <div className="adm-stat-icon info">
              <Icon.Clock width={18} height={18} />
            </div>
          </div>
        </div>

        <div className="adm-card">
          <div className="adm-row-between" style={{ marginBottom: 14 }}>
            <h3 style={{ margin: 0 }}>Recently updated</h3>
            <Link href="/admin/posts" className="adm-btn adm-btn-ghost adm-btn-sm">
              All posts
              <Icon.ChevronRight width={14} height={14} />
            </Link>
          </div>
          {recent.length === 0 ? (
            <div className="adm-table-empty">
              <div style={{ display: "grid", placeItems: "center", marginBottom: 12 }}>
                <div className="adm-stat-icon muted" style={{ width: 44, height: 44 }}>
                  <Icon.Doc width={22} height={22} />
                </div>
              </div>
              No posts yet — hit <strong>New post</strong> to start writing.
            </div>
          ) : (
            <div style={{ margin: "0 -22px -22px", borderTop: "1px solid var(--adm-border)" }}>
              <table className="adm-table">
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Status</th>
                    <th>SEO</th>
                    <th>Readability</th>
                    <th>Words</th>
                    <th>Updated</th>
                  </tr>
                </thead>
                <tbody>
                  {recent.map((p) => (
                    <tr key={p.id}>
                      <td>
                        <Link href={`/admin/posts/${p.id}`} style={{ fontWeight: 600 }}>
                          {p.title || <span className="adm-muted">Untitled</span>}
                        </Link>
                        {p.isCornerstone ? <span className="adm-tag adm-tag-primary" style={{ marginLeft: 8 }}>Cornerstone</span> : null}
                      </td>
                      <td><StatusBadge status={p.status} /></td>
                      <td><ScoreMeter score={p.seoScore} size={38} /></td>
                      <td><ScoreMeter score={p.readabilityScore} size={38} /></td>
                      <td className="adm-mono adm-dim">{p.wordCount.toLocaleString()}</td>
                      <td className="adm-dim">{new Date(p.updatedAt).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
