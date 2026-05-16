"use client";

import { useActionState } from "react";
import { loginAction, type AuthState } from "@/lib/auth/actions";

export function LoginForm({ fromPath }: { fromPath: string | null }) {
  const [state, formAction, pending] = useActionState<AuthState, FormData>(
    loginAction,
    undefined,
  );

  return (
    <form action={formAction}>
      {fromPath ? <input type="hidden" name="from" value={fromPath} /> : null}
      <div className="adm-field">
        <label className="adm-label" htmlFor="email">Email</label>
        <input
          id="email"
          name="email"
          type="email"
          className="adm-input"
          autoComplete="email"
          required
          placeholder="you@example.com"
        />
      </div>
      <div className="adm-field">
        <label className="adm-label" htmlFor="password">Password</label>
        <input
          id="password"
          name="password"
          type="password"
          className="adm-input"
          autoComplete="current-password"
          required
          minLength={8}
        />
      </div>
      {state?.error ? <p className="adm-error-text">{state.error}</p> : null}
      <button type="submit" className="adm-btn adm-btn-primary" style={{ width: "100%", justifyContent: "center" }} disabled={pending}>
        {pending ? <span className="adm-spinner" /> : null}
        {pending ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}
