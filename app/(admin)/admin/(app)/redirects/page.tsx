import { connection } from "next/server";
import { listRedirects } from "@/lib/content/queries";
import { RedirectForm } from "@/components/admin/RedirectForm";
import { DeleteRedirectButton } from "@/components/admin/DeleteRedirectButton";

export default async function RedirectsPage() {
  await connection();
  const items = await listRedirects();
  return (
    <>
      <header className="adm-topbar">
        <div className="adm-topbar-title">Redirects</div>
      </header>
      <div className="adm-content">
        <p className="adm-page-sub">301/302 redirects. When a published post&apos;s slug changes, a 301 is created automatically.</p>

        <div className="adm-card" style={{ marginBottom: 22 }}>
          <h3>Add a redirect</h3>
          <RedirectForm />
        </div>

        <div className="adm-card" style={{ padding: 0, overflow: "hidden" }}>
          {items.length === 0 ? (
            <div className="adm-table-empty">No redirects yet.</div>
          ) : (
            <table className="adm-table">
              <thead>
                <tr>
                  <th>From</th>
                  <th>To</th>
                  <th>Status</th>
                  <th>Created</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {items.map((r) => (
                  <tr key={r.id}>
                    <td className="adm-mono">{r.fromPath}</td>
                    <td className="adm-mono">{r.toPath}</td>
                    <td>{r.status}</td>
                    <td className="adm-dim">{new Date(r.createdAt).toLocaleDateString()}</td>
                    <td><DeleteRedirectButton id={r.id} /></td>
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
