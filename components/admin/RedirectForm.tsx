"use client";

import { useActionState } from "react";
import { createRedirectAction } from "@/app/(admin)/admin/(app)/redirects/actions";

type State = { ok?: boolean; error?: string } | undefined;

export function RedirectForm() {
  const [state, action, pending] = useActionState<State, FormData>(createRedirectAction, undefined);
  return (
    <form action={action}>
      <div className="adm-grid-3" style={{ gap: 10, alignItems: "end" }}>
        <div className="adm-field" style={{ marginBottom: 0 }}>
          <label className="adm-label">From path</label>
          <input className="adm-input adm-mono" name="fromPath" placeholder="/blog/old-slug" required />
        </div>
        <div className="adm-field" style={{ marginBottom: 0 }}>
          <label className="adm-label">To path or URL</label>
          <input className="adm-input adm-mono" name="toPath" placeholder="/blog/new-slug" required />
        </div>
        <div className="adm-row" style={{ gap: 10 }}>
          <div className="adm-field" style={{ marginBottom: 0, flex: 1 }}>
            <label className="adm-label">Status</label>
            <select className="adm-select" name="status" defaultValue="301">
              <option value="301">301</option>
              <option value="302">302</option>
            </select>
          </div>
          <button className="adm-btn adm-btn-primary" disabled={pending}>
            {pending ? <span className="adm-spinner" /> : null} Add
          </button>
        </div>
      </div>
      {state?.error ? <p className="adm-error-text" style={{ marginTop: 8 }}>{state.error}</p> : null}
      {state?.ok ? <p className="adm-tiny" style={{ color: "var(--adm-success)", marginTop: 8 }}>Saved.</p> : null}
    </form>
  );
}
