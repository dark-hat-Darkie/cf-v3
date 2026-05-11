'use client';
import { useState, useEffect } from 'react';
import { MagneticButton } from './MagneticButton';

export default function BackToTop() {
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const scrolled = window.scrollY;
      const total = document.documentElement.scrollHeight - window.innerHeight;
      const pct = total > 0 ? scrolled / total : 0;
      setProgress(pct);
      setVisible(scrolled > 300);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const r = 20;
  const circumference = 2 * Math.PI * r;
  const dash = circumference * progress;
  const gap = circumference - dash;

  return (
    <>
      {/* Top progress bar */}
      <div className="cf-scroll-bar" style={{ transform: `scaleX(${progress})` }} />

      {/* Back-to-top button */}
      <MagneticButton
        className={`cf-btt${visible ? ' cf-btt--visible' : ''}`}
        onClick={scrollToTop}
        aria-label="Back to top"
      >
        <svg className="cf-btt-ring" viewBox="0 0 48 48" fill="none">
          <circle cx="24" cy="24" r={r} stroke="rgba(255,255,255,0.12)" strokeWidth="2" />
          <circle
            cx="24" cy="24" r={r}
            stroke="url(#btt-grad)"
            strokeWidth="2"
            strokeLinecap="round"
            strokeDasharray={`${dash} ${gap}`}
            transform="rotate(-90 24 24)"
          />
          <defs>
            <linearGradient id="btt-grad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#8333EB" />
              <stop offset="100%" stopColor="#FF80AE" />
            </linearGradient>
          </defs>
        </svg>
        <svg className="cf-btt-arrow" viewBox="0 0 16 16" fill="none">
          <path d="M8 12V4M4 8l4-4 4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </MagneticButton>
    </>
  );
}
