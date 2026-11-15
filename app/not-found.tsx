import Link from 'next/link';
import SiteHeader from '@/components/site/SiteHeader';
import SiteFooter from '@/components/site/SiteFooter';
import { Suspense } from 'react';
import { site } from '@/lib/site';

export const metadata = { title: `Page not found | ${site.name}` };

export default function NotFound() {
  return (
    <>
      <Suspense fallback={<div className="cf-header" style={{ height: 'var(--cf-header-h)' }} />}>
        <SiteHeader />
      </Suspense>
      <main id="main" className="cf-page-hero cf-sf-cream cf-system-page">
        <div className="cf-container">
          <span className="cf-eyebrow">404</span>
          <h1 className="cf-h1">This page <span className="cf-dim">doesn&apos;t exist.</span></h1>
          <p className="cf-lead">The link may be old, or the page may have moved. Here are the places people usually look for.</p>
          <div className="cf-btn-row">
            <Link href="/" className="cf-btn cf-btn--primary cf-btn--lg">Back to home</Link>
            <Link href="/case-studies" className="cf-btn cf-btn--secondary cf-btn--lg">See our work</Link>
            <Link href="/contact" className="cf-btn cf-btn--ghost cf-btn--lg">Contact us</Link>
          </div>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
