'use client';
import { useEffect, useState } from 'react';
import { MagneticButton } from './MagneticButton';
import { smoothScrollTo } from '@/lib/smooth-scroll';

export default function FloatingCTA() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let last = window.scrollY;
    const onScroll = () => {
      const cur = window.scrollY;
      setVisible(cur > 120 && cur > last);
      last = cur;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const go = () => {
    const el = document.getElementById('contact');
    if (el) smoothScrollTo(el.offsetTop - 60);
  };

  return (
    <div className={`cf-floating-cta-wrap${visible ? ' visible' : ''}`}>
      <MagneticButton
        className="cf-floating-cta"
        onClick={go}
        aria-label="Book a call"
      >
        Book a call
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
          <path d="M7 17L17 7M17 7H7M17 7V17" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
        </svg>
      </MagneticButton>
    </div>
  );
}
