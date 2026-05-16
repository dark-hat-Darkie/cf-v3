"use client";

import { useActionState } from "react";
import { bootstrapAdminAction, type AuthState } from "@/lib/auth/actions";

export function BootstrapAdminForm() {
  const [state, formAction, pending] = useActionState<AuthState, FormData>(
    bootstrapAdminAction,
    undefined,
  );

  return (
    <form action={formAction}>
      <div className="adm-field">
        <label className="adm-label" htmlFor="name">Name</label>
        <input id="name" name="name" type="text" className="adm-input" required />
      </div>
      <div className="adm-field">
        <label className="adm-label" htmlFor="email">Email</label>
        <input id="email" name="email" type="email" className="adm-input" required autoComplete="email" />
      </div>
      <div className="adm-field">
        <label className="adm-label" htmlFor="password">
          Password
          <span className="adm-label-hint">8+ characters</span>
        </label>
        <input
          id="password"
          name="password"
          type="password"
          className="adm-input"
          required
          minLength={8}
          autoComplete="new-password"
        />
      </div>
      {state?.error ? <p className="adm-error-text">{state.error}</p> : null}
      <button type="submit" className="adm-btn adm-btn-primary" style={{ width: "100%", justifyContent: "center" }} disabled={pending}>
        {pending ? <span className="adm-spinner" /> : null}
        {pending ? "Creating…" : "Create admin"}
      </button>
    </form>
  );
}
