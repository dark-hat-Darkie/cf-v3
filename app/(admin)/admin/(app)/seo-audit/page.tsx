import Link from "next/link";
import { connection } from "next/server";
import { listPostsAdmin } from "@/lib/content/queries";
import { ScoreMeter } from "@/components/admin/ScoreMeter";
import { StatusBadge } from "@/components/admin/StatusBadge";

export default async function SeoAuditPage() {
  await connection();
  const items = await listPostsAdmin({ limit: 200 });
  const sorted = items.slice().sort((a, b) => a.seoScore - b.seoScore);

  return (
    <>
      <header className="adm-topbar">
        <div className="adm-topbar-title">SEO audit</div>
      </header>
      <div className="adm-content">
        <p className="adm-page-sub">All posts sorted by lowest SEO score — fix the bottom of this list first.</p>
        <div className="adm-card" style={{ padding: 0, overflow: "hidden" }}>
          {sorted.length === 0 ? (
            <div className="adm-table-empty">No posts yet.</div>
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
                </tr>
              </thead>
              <tbody>
                {sorted.map((p) => (
                  <tr key={p.id}>
                    <td>
                      <Link href={`/admin/posts/${p.id}`} style={{ fontWeight: 500 }}>
                        {p.title || <span className="adm-muted">Untitled</span>}
                      </Link>
                    </td>
                    <td><StatusBadge status={p.status} /></td>
                    <td className="adm-dim">{p.focusKeyword || <span className="adm-muted">—</span>}</td>
                    <td><ScoreMeter score={p.seoScore} size={36} /></td>
                    <td><ScoreMeter score={p.readabilityScore} size={36} /></td>
                    <td className="adm-mono adm-dim">{p.wordCount.toLocaleString()}</td>
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
