'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { site } from '@/lib/site';
import { ArrowIcon, WhatsAppIcon } from './icons';

/** Phone-only bar that keeps the two fastest contact routes one tap away. */
export default function StickyContactBar() {
  const pathname = usePathname();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 480);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  if (pathname === '/contact') return null;

  return (
    <div className={`cf-sticky-bar${visible ? ' is-visible' : ''}`}>
      <Link href={site.cta.primary.href} className="cf-btn cf-btn--primary cf-btn--block" tabIndex={visible ? 0 : -1}>
        {site.cta.primary.label}
        <ArrowIcon />
      </Link>
      <a
        href={site.whatsapp.href}
        className="cf-sticky-bar-wa"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Message us on WhatsApp"
        tabIndex={visible ? 0 : -1}
      >
        <WhatsAppIcon size={22} />
      </a>
    </div>
  );
}
