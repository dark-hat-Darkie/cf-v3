'use client';
import { useEffect } from 'react';

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main id="main" className="cf-page-hero cf-sf-cream cf-system-page">
      <div className="cf-container">
        <span className="cf-eyebrow">Something went wrong</span>
        <h1 className="cf-h1">We hit a snag <span className="cf-dim">loading this page.</span></h1>
        <p className="cf-lead">Please try again. If it keeps happening, email hello@codeflee.com and we&apos;ll sort it out.</p>
        <div className="cf-btn-row">
          <button type="button" className="cf-btn cf-btn--primary cf-btn--lg" onClick={() => reset()}>Try again</button>
          {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
          <a href="/" className="cf-btn cf-btn--secondary cf-btn--lg">Back to home</a>
        </div>
      </div>
    </main>
  );
}
