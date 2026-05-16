import { Suspense } from "react";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Unsubscribed — CodeFlee",
  robots: { index: false, follow: false },
};

const COPY: Record<string, { heading: string; body: string }> = {
  ok: {
    heading: "You're unsubscribed.",
    body: "We won't email you again. If this was a mistake, you can resubscribe any time from the blog.",
  },
  already: {
    heading: "You're already unsubscribed.",
    body: "No further action needed — we removed you from the list earlier.",
  },
  notfound: {
    heading: "We couldn't find that subscription.",
    body: "The link may be expired or already used. If you keep getting emails, reply directly and we'll handle it.",
  },
  invalid: {
    heading: "That unsubscribe link is invalid.",
    body: "Please use the link from the email footer, or contact us at hello@codeflee.com.",
  },
  error: {
    heading: "Something went wrong.",
    body: "Please try again in a moment, or email hello@codeflee.com and we'll remove you manually.",
  },
};

type SearchParams = Promise<{ status?: string }>;

async function Card({ searchParams }: { searchParams: SearchParams }) {
  const sp = await searchParams;
  const key = sp.status && COPY[sp.status] ? sp.status : "ok";
  const { heading, body } = COPY[key];
  return (
    <div className="cf-unsub-card">
      <div className="cf-unsub-eyebrow">CodeFlee · Newsletter</div>
      <h1 className="cf-unsub-h1">{heading}</h1>
      <p className="cf-unsub-body">{body}</p>
      <div className="cf-unsub-actions">
        <Link href="/blog" className="cf-unsub-btn">
          Back to the blog
        </Link>
        <Link href="/" className="cf-unsub-link">
          codeflee.com →
        </Link>
      </div>
    </div>
  );
}

function CardFallback() {
  return (
    <div className="cf-unsub-card" aria-busy="true">
      <div className="cf-unsub-eyebrow">CodeFlee · Newsletter</div>
      <h1 className="cf-unsub-h1">Updating your preferences…</h1>
      <p className="cf-unsub-body">One moment.</p>
    </div>
  );
}

export default function UnsubscribedPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  return (
    <main className="cf-unsub">
      <Suspense fallback={<CardFallback />}>
        <Card searchParams={searchParams} />
      </Suspense>
    </main>
  );
}
