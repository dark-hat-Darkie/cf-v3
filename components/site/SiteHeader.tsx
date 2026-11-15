'use client';
import { useEffect, useLayoutEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { site } from '@/lib/site';
import { ArrowIcon } from './icons';

function isActive(pathname: string, href: string) {
  if (href.includes('#')) return false;
  return pathname === href || pathname.startsWith(`${href}/`);
}

export default function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  // Routes are kept alive (hidden) across navigations, so close the drawer
  // whenever this header is hidden or the route changes.
  useLayoutEffect(() => () => setOpen(false), []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false); };
    document.documentElement.classList.add('cf-no-scroll');
    window.addEventListener('keydown', onKey);
    return () => {
      document.documentElement.classList.remove('cf-no-scroll');
      window.removeEventListener('keydown', onKey);
    };
  }, [open]);

  const close = () => setOpen(false);

  return (
    <header className={`cf-header${open ? ' is-open' : ''}`}>
      <div className="cf-header-inner">
        <Link href="/" className="cf-header-logo" aria-label={`${site.name} — home`} onClick={close}>
          <Image src="/assets/logo.svg" alt={site.name} width={157} height={26} preload />
        </Link>

        <nav className="cf-header-nav" aria-label="Main">
          {site.nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="cf-header-link"
              aria-current={isActive(pathname, item.href) ? 'page' : undefined}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="cf-header-actions">
          <Link href={site.cta.primary.href} className="cf-btn cf-btn--primary cf-btn--sm cf-header-cta">
            {site.cta.primary.label}
            <ArrowIcon />
          </Link>
          <button
            type="button"
            className="cf-header-burger"
            aria-expanded={open}
            aria-controls="cf-mobile-menu"
            aria-label={open ? 'Close menu' : 'Open menu'}
            onClick={() => setOpen((v) => !v)}
          >
            <span /><span />
          </button>
        </div>
      </div>

      <div id="cf-mobile-menu" className="cf-drawer cf-sf-plum" hidden={!open}>
        <nav className="cf-drawer-nav" aria-label="Mobile">
          {site.nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="cf-drawer-link"
              aria-current={isActive(pathname, item.href) ? 'page' : undefined}
              onClick={close}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="cf-drawer-foot">
          <Link href={site.cta.primary.href} className="cf-btn cf-btn--primary cf-btn--lg cf-btn--block" onClick={close}>
            {site.cta.primary.label}
            <ArrowIcon />
          </Link>
          <div className="cf-drawer-direct">
            <a href={`mailto:${site.email}`}>{site.email}</a>
            <a href={site.whatsapp.href} target="_blank" rel="noopener noreferrer">WhatsApp {site.whatsapp.display}</a>
          </div>
        </div>
      </div>
    </header>
  );
}
