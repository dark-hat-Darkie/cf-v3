"use client";

import { useState, useTransition } from "react";
import { subscribeNewsletterAction } from "@/app/blog/actions";

type Props = {
  variant?: "wide" | "compact";
  eyebrow?: string;
  title?: string;
  description?: string;
  source?: string;
};

export function NewsletterSignup({
  variant = "wide",
  eyebrow = "Studio dispatch",
  title = "Engineering writeups, every other Friday.",
  description = "Short essays on shipping software well — architecture, design systems, performance. No spam, easy unsubscribe.",
  source = "blog",
}: Props) {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<{ status: "idle" | "ok" | "err"; message: string }>({
    status: "idle",
    message: "",
  });
  const [pending, startTransition] = useTransition();

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    startTransition(async () => {
      const res = await subscribeNewsletterAction({ email, source });
      if (res.ok) {
        const message =
          res.status === "already"
            ? `${res.email} is already on the list. Welcome back.`
            : res.status === "resubscribed"
              ? `Welcome back — ${res.email} is subscribed again.`
              : `You're on the list. We'll be in touch at ${res.email}.`;
        setState({ status: "ok", message });
        setEmail("");
      } else {
        setState({ status: "err", message: res.error });
      }
    });
  };

  return (
    <section className="cf-newsletter" data-variant={variant} aria-label="Newsletter signup">
      <div className="cf-newsletter-body">
        <div className="cf-newsletter-eyebrow">{eyebrow}</div>
        <h2 className="cf-newsletter-title">{title}</h2>
        <p className="cf-newsletter-desc">{description}</p>
      </div>
      <form className="cf-newsletter-form" onSubmit={onSubmit} noValidate>
        <label className="cf-newsletter-field">
          <span className="cf-newsletter-field-label">Work email</span>
          <input
            type="email"
            inputMode="email"
            autoComplete="email"
            required
            placeholder="you@studio.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            aria-invalid={state.status === "err" ? "true" : undefined}
            aria-describedby={state.message ? "cf-newsletter-msg" : undefined}
            disabled={pending}
          />
        </label>
        <button type="submit" className="cf-newsletter-submit" disabled={pending}>
          {pending ? "Subscribing…" : "Subscribe"}
          {!pending ? <span aria-hidden>→</span> : null}
        </button>
        {state.message ? (
          <p
            id="cf-newsletter-msg"
            className="cf-newsletter-msg"
            data-state={state.status}
            role={state.status === "err" ? "alert" : "status"}
          >
            {state.message}
          </p>
        ) : null}
        <p className="cf-newsletter-fineprint">
          We send one email every other week. Unsubscribe in a click.
        </p>
      </form>
    </section>
  );
}
