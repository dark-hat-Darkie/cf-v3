type Status = "draft" | "scheduled" | "published" | "archived";

export function StatusBadge({ status }: { status: Status }) {
  return <span className={`adm-table-status ${status}`}>{status}</span>;
}
