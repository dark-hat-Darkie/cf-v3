"use client";

import { useTransition } from "react";
import { deleteRedirectAction } from "@/app/(admin)/admin/(app)/redirects/actions";

export function DeleteRedirectButton({ id }: { id: number }) {
  const [pending, start] = useTransition();
  return (
    <button
      type="button"
      className="adm-btn adm-btn-ghost adm-btn-sm"
      disabled={pending}
      onClick={() => {
        if (!confirm("Delete this redirect?")) return;
        start(async () => {
          await deleteRedirectAction(id);
        });
      }}
    >
      Delete
    </button>
  );
}
