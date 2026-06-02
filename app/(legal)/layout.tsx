import type { ReactNode } from 'react';
import Link from 'next/link';
import './legal.css';

const LEGAL_LINKS = [
  { href: '/privacy', label: 'Privacy Policy' },
  { href: '/terms', label: 'Terms of Service' },
  { href: '/cookies', label: 'Cookie Policy' },
];

export default function LegalLayout({ children }: { children: ReactNode }) {
  return (
    <div className="cf-legal">
      <header className="cf-legal-header">
        <Link href="/" className="cf-legal-logo" aria-label="CodeFlee — home">
          <span className="cf-legal-logo-dot" aria-hidden="true" />
          CodeFlee
        </Link>
        <Link href="/" className="cf-legal-back">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M19 12H5M5 12L12 19M5 12L12 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Back to site
        </Link>
      </header>

      <main className="cf-legal-main">{children}</main>

      <footer className="cf-legal-footer">
        <nav className="cf-legal-footer-nav" aria-label="Legal">
          {LEGAL_LINKS.map((l) => (
            <Link key={l.href} href={l.href}>
              {l.label}
            </Link>
          ))}
        </nav>
        <div className="cf-legal-footer-meta">© 2026 CodeFlee Studio · Dhaka, Bangladesh</div>
      </footer>
    </div>
  );
}
