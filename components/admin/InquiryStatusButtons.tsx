"use client";

import { useTransition } from "react";
import { setInquiryStatusAction } from "@/app/(admin)/admin/(app)/inquiries/actions";

type Status = "new" | "replied" | "archived";

const NEXT: Record<Status, { to: Status; label: string }[]> = {
  new: [{ to: "replied", label: "Mark replied" }, { to: "archived", label: "Archive" }],
  replied: [{ to: "new", label: "Mark new" }, { to: "archived", label: "Archive" }],
  archived: [{ to: "new", label: "Restore" }],
};

export function InquiryStatusButtons({ id, status }: { id: number; status: Status }) {
  const [pending, start] = useTransition();
  return (
    <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
      {NEXT[status].map((n) => (
        <button
          key={n.to}
          type="button"
          className="adm-btn adm-btn-ghost adm-btn-sm"
          disabled={pending}
          onClick={() => start(async () => { await setInquiryStatusAction(id, n.to); })}
        >
          {n.label}
        </button>
      ))}
    </div>
  );
}
