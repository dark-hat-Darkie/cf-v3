import { desc } from "drizzle-orm";
import { connection } from "next/server";
import { db, hasDatabase } from "@/db/client";
import { inquiries, type Inquiry } from "@/db/schema";
import { requireUser } from "@/lib/auth/session";
import { InquiryStatusButtons } from "@/components/admin/InquiryStatusButtons";

const STATUS_CLASS: Record<Inquiry["status"], string> = {
  new: "scheduled",
  replied: "published",
  archived: "archived",
};

async function loadInquiries(): Promise<{ items: Inquiry[]; error: string | null }> {
  if (!hasDatabase()) return { items: [], error: "DATABASE_URL is not set." };
  try {
    const items = await db.select().from(inquiries).orderBy(desc(inquiries.createdAt)).limit(200);
    return { items, error: null };
  } catch {
    return { items: [], error: "The inquiries table is not available yet. Run the database migration (npm run db:migrate)." };
  }
}

export default async function InquiriesPage() {
  await connection();
  await requireUser();
  const { items, error } = await loadInquiries();
  const fresh = items.filter((i) => i.status === "new").length;

  return (
    <>
      <header className="adm-topbar">
        <div className="adm-topbar-title">Inquiries{fresh > 0 ? ` · ${fresh} new` : ""}</div>
      </header>
      <div className="adm-content">
        <p className="adm-page-sub">
          Project briefs sent through the website contact form. Every brief is saved here even if the notification email fails.
        </p>

        <div className="adm-card" style={{ padding: 0, overflow: "hidden" }}>
          {error ? (
            <div className="adm-table-empty">{error}</div>
          ) : items.length === 0 ? (
            <div className="adm-table-empty">No inquiries yet.</div>
          ) : (
            <table className="adm-table">
              <thead>
                <tr>
                  <th>From</th>
                  <th>Brief</th>
                  <th>Project</th>
                  <th>Status</th>
                  <th>Received</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {items.map((i) => (
                  <tr key={i.id} style={{ verticalAlign: "top" }}>
                    <td>
                      <strong>{i.name}</strong>
                      <div>
                        <a href={`mailto:${i.email}?subject=${encodeURIComponent("Re: your project brief")}`}>{i.email}</a>
                      </div>
                      {!i.emailSent ? <div className="adm-dim">Email notification not sent</div> : null}
                    </td>
                    <td style={{ maxWidth: 440, whiteSpace: "pre-wrap" }}>{i.message}</td>
                    <td>
                      <div>{i.project || "—"}</div>
                      <div className="adm-dim">{i.budget || "No budget given"}</div>
                      {i.source ? <div className="adm-dim adm-mono">{i.source}</div> : null}
                    </td>
                    <td><span className={`adm-table-status ${STATUS_CLASS[i.status]}`}>{i.status}</span></td>
                    <td className="adm-dim">{new Date(i.createdAt).toLocaleString()}</td>
                    <td><InquiryStatusButtons id={i.id} status={i.status} /></td>
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
