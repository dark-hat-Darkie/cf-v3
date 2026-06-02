'use client';
import Image from 'next/image';
import Link from 'next/link';
import { smoothScrollTo } from '@/lib/smooth-scroll';

const navCols = [
  {
    ttl: 'Services',
    items: [
      { label: 'Web Development', href: '/services/web-development' },
      { label: 'Mobile Apps', href: '/services/mobile-apps' },
      { label: 'UI / UX Design', href: '/services/ui-ux-design' },
      { label: 'Brand & Motion', href: '/services/brand-motion' },
      { label: 'WebGL / 3D', href: '/services/webgl-3d' },
      { label: 'E-Commerce', href: '/services/ecommerce' },
    ],
  },
  {
    ttl: 'Studio',
    items: [
      { label: 'About', href: '#team' },
      { label: 'Process', href: '#process' },
      { label: 'Work', href: '#work' },
      { label: 'Pricing', href: '#pricing' },
      { label: 'Blog', href: '/blog' },
    ],
  },
  {
    ttl: 'Connect',
    items: [
      { label: 'hello@codeflee.com', href: 'mailto:hello@codeflee.com' },
      { label: 'WhatsApp', href: 'https://wa.me/8801716778254' },
      { label: 'Instagram', href: '#' },
      { label: 'LinkedIn', href: '#' },
      { label: 'Dribbble', href: '#' },
    ],
  },
];

/**
 * The landing page runs a custom wheel-driven smooth-scroll loop (see
 * `useSmoothScroll` in AppShell) that continuously drives `window.scrollTo`.
 * A native in-page anchor jump is overwritten on the next animation frame, so
 * hash links must go through `smoothScrollTo` to actually move (and stick).
 */
function FooterLink({
  href,
  className,
  ariaLabel,
  children,
}: {
  href: string;
  className?: string;
  ariaLabel?: string;
  children: React.ReactNode;
}) {
  // In-page section anchor (e.g. "#work") → drive the site's smooth-scroll loop.
  if (href.startsWith('#') && href.length > 1) {
    const id = href.slice(1);
    return (
      <a
        href={href}
        className={className}
        aria-label={ariaLabel}
        onClick={(e) => {
          e.preventDefault();
          const el = document.getElementById(id);
          if (el) smoothScrollTo(el.offsetTop - 60);
        }}
      >
        {children}
      </a>
    );
  }

  // Internal route (e.g. "/blog", "/services/…") → client navigation.
  if (href.startsWith('/')) {
    return (
      <Link href={href} className={className} aria-label={ariaLabel}>
        {children}
      </Link>
    );
  }

  // External / mailto / tel.
  if (/^(https?:|mailto:|tel:)/.test(href)) {
    const external = href.startsWith('http');
    return (
      <a
        href={href}
        className={className}
        aria-label={ariaLabel}
        {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      >
        {children}
      </a>
    );
  }

  // Placeholder ("#") — destination not wired up yet. Stay inert instead of
  // jumping to the top of the page (which the smooth-scroll loop snaps back).
  return (
    <a
      href={href}
      className={className}
      aria-label={ariaLabel}
      aria-disabled="true"
      onClick={(e) => e.preventDefault()}
    >
      {children}
    </a>
  );
}

const socials = [
  {
    label: 'X',
    href: '#',
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.742l7.316-8.468L1.724 2.25H8.02l4.263 5.638 5.961-5.638zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
  },
  {
    label: 'Instagram',
    href: '#',
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
      </svg>
    ),
  },
  {
    label: 'LinkedIn',
    href: '#',
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    ),
  },
  {
    label: 'Dribbble',
    href: '#',
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M12 24C5.385 24 0 18.615 0 12S5.385 0 12 0s12 5.385 12 12-5.385 12-12 12zm10.12-10.358c-.35-.11-3.17-.953-6.384-.438 1.34 3.684 1.887 6.684 1.992 7.308 2.3-1.555 3.936-4.02 4.395-6.87zm-6.115 7.808c-.153-.9-.75-4.032-2.19-7.77l-.066.02c-5.79 2.015-7.86 6.017-8.04 6.4 1.73 1.358 3.92 2.166 6.29 2.166 1.42 0 2.77-.29 4.01-.814zm-9.77-7.317c.23-.388 3.25-5.475 8.56-7.157.188-.061.38-.112.57-.157-.364-.828-.75-1.638-1.157-2.403C9.17 6.05 4.723 6.15 4.295 6.154v.336c0 2.256.864 4.31 2.276 5.882zm3.965-12.14c.41.752.802 1.556 1.166 2.384.58-.09 1.166-.136 1.757-.136 1.09 0 2.14.168 3.133.474-.572-2.13-2.017-3.94-3.927-5.04-1.045.024-2.064.128-3.067.344l-.062-.026zm6.027 1.456c-1.036-.32-2.123-.495-3.25-.495-.525 0-1.05.04-1.57.11.43 1.016.852 2.086 1.247 3.16.058-.016.11-.036.17-.05 2.25-.776 4.072-2.02 5.17-3.61-.57-.39-1.16-.74-1.77-1.115z" />
      </svg>
    ),
  },
];

export default function Footer() {
  return (
    <footer className="cf-footer">
      <div className="cf-footer-grid">
        <div className="cf-footer-brand">
          <Image src="/assets/logo-white.svg" style={{ height: 28, width: 'auto' }} alt="CodeFlee" width={120} height={28} />
          <p className="cf-footer-brand-desc">
            A senior engineering studio in Dhaka, shipping work for founders who sweat the details.
          </p>
          <div className="cf-footer-status">
            <span className="cf-footer-status-dot" />
            Open for new projects
          </div>
          <div className="cf-footer-socials">
            {socials.map(s => (
              <FooterLink key={s.label} href={s.href} className="cf-footer-social-btn" ariaLabel={s.label}>
                {s.icon}
              </FooterLink>
            ))}
          </div>
          <div className="cf-footer-location">Mohammadpur · Dhaka 1207 · GMT+6</div>
        </div>

        {navCols.map((c, i) => (
          <div key={i} className="cf-footer-col">
            <div className="cf-footer-col-title">{c.ttl}</div>
            <ul>
              {c.items.map(it => (
                <li key={it.label}>
                  <FooterLink href={it.href}>{it.label}</FooterLink>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="cf-footer-bar">
        <div>© 2026 CodeFlee Studio · Dhaka, Bangladesh</div>
        <div className="cf-footer-bar-links">
          <FooterLink href="/privacy">Privacy</FooterLink>
          <FooterLink href="/terms">Terms</FooterLink>
          <FooterLink href="/cookies">Cookies</FooterLink>
        </div>
      </div>

      <h2 className="cf-footer-mega">CodeFlee.</h2>
    </footer>
  );
}
