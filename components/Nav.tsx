'use client';
import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { MagneticButton } from './MagneticButton';
import { smoothScrollTo } from '@/lib/smooth-scroll';

const TABS = [
  { id: 'work', label: 'Work' },
  { id: 'services', label: 'Services' },
  { id: 'process', label: 'Process' },
  { id: 'stats', label: 'Impact' },
  { id: 'team', label: 'Team' },
  { id: 'pricing', label: 'Pricing' },
];

export default function Nav() {
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState('work');
  const [mobileOpen, setMobileOpen] = useState(false);
  const [ready, setReady] = useState(false);
  const tabsRef = useRef<HTMLDivElement>(null);
  const [indicator, setIndicator] = useState({ left: 0, width: 0 });

  useEffect(() => { setReady(true); }, []);

  useEffect(() => {
    let last = window.scrollY;
    const onScroll = () => {
      const cur = window.scrollY;
      setHidden(cur > 120 && cur > last);
      setScrolled(cur > 40);
      last = cur;
      for (const { id } of TABS) {
        const el = document.getElementById(id);
        if (!el) continue;
        const r = el.getBoundingClientRect();
        if (r.top < 200 && r.bottom > 200) { setActive(id); break; }
      }
    };
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (!tabsRef.current) return;
    const activeEl = tabsRef.current.querySelector('.cf-nav-tab.active') as HTMLElement;
    if (!activeEl) return;
    const tabsRect = tabsRef.current.getBoundingClientRect();
    const activeRect = activeEl.getBoundingClientRect();
    setIndicator({ left: activeRect.left - tabsRect.left, width: activeRect.width });
  }, [active]);

  const go = (id: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    setMobileOpen(false);
    const el = document.getElementById(id);
    if (el) smoothScrollTo(el.offsetTop - 60);
  };

  const goTop = (e: React.MouseEvent) => {
    e.preventDefault();
    setMobileOpen(false);
    smoothScrollTo(0);
  };

  return (
    <>
      <nav className={`cf-nav${hidden ? ' hidden' : ''}${scrolled ? ' scrolled' : ''}`}>
        <Link href="/" className="cf-nav-logo-link" onClick={goTop} aria-label="CodeFlee — back to top">
          <Image src="/assets/logo-white.svg" className="cf-nav-logo" alt="CodeFlee" width={120} height={24} />
        </Link>

        <div className="cf-nav-tabs" ref={tabsRef}>
          <span
            className="cf-nav-indicator"
            style={{
              left: indicator.left,
              width: indicator.width,
              transition: ready
                ? 'left .35s cubic-bezier(.4,0,.2,1), width .35s cubic-bezier(.4,0,.2,1)'
                : 'none',
            }}
          />
          {TABS.map(t => (
            <button
              key={t.id}
              className={`cf-nav-tab${active === t.id ? ' active' : ''}`}
              onClick={go(t.id)}
            >
              {t.label}
            </button>
          ))}
        </div>

        <MagneticButton className="cf-nav-cta" onClick={go('contact')}>
          Book a call
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
            <path d="M7 17L17 7M17 7H7M17 7V17" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
          </svg>
        </MagneticButton>

        <button
          className={`cf-nav-burger${mobileOpen ? ' open' : ''}`}
          onClick={() => setMobileOpen(v => !v)}
          aria-label="Toggle menu"
        >
          <span /><span /><span />
        </button>
      </nav>

      <div className={`cf-nav-drawer${mobileOpen ? ' open' : ''}`}>
        <div className="cf-nav-drawer-inner">
          {TABS.map((t, i) => (
            <button key={t.id} className="cf-nav-drawer-item" onClick={go(t.id)}>
              <span className="cf-nav-drawer-num">{String(i + 1).padStart(2, '0')}</span>
              {t.label}
            </button>
          ))}
          <MagneticButton className="cf-nav-drawer-cta" onClick={go('contact')}>
            Book a call
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <path d="M7 17L17 7M17 7H7M17 7V17" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
            </svg>
          </MagneticButton>
        </div>
      </div>
    </>
  );
}
