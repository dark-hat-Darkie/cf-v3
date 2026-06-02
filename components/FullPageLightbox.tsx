'use client';
import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import type { CaseScreenshotPage } from '@/lib/case-studies-data';

/**
 * Full-screen, vertically-scrollable preview of a project's full-page
 * screenshots. The pages are stacked into one scroll container so the user can
 * scroll through the entire design; a thumbnail rail jumps between pages and a
 * counter tracks the page currently in view.
 *
 * Distinct from the case study bento `Lightbox` (which fits a single image to
 * the viewport) — this one is built for tall, full-page captures.
 */
export default function FullPageLightbox({
  pages,
  startIndex = 0,
  title,
  onClose,
}: {
  pages: CaseScreenshotPage[];
  startIndex?: number;
  title: string;
  onClose: () => void;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const pageRefs = useRef<(HTMLElement | null)[]>([]);
  const [active, setActive] = useState(startIndex);

  // Esc to close + lock the page behind the overlay.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [onClose]);

  // Jump to the clicked page instantly when the lightbox opens.
  useEffect(() => {
    pageRefs.current[startIndex]?.scrollIntoView({ block: 'start' });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Track which page is centered in the scroll container.
  useEffect(() => {
    const root = scrollRef.current;
    if (!root) return;
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            const idx = Number((e.target as HTMLElement).dataset.idx);
            if (!Number.isNaN(idx)) setActive(idx);
          }
        });
      },
      { root, rootMargin: '-45% 0px -45% 0px', threshold: 0 },
    );
    pageRefs.current.forEach((el) => el && obs.observe(el));
    return () => obs.disconnect();
  }, [pages.length]);

  const jump = (i: number) => {
    const smooth = !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    pageRefs.current[i]?.scrollIntoView({ behavior: smooth ? 'smooth' : 'auto', block: 'start' });
  };

  if (pages.length === 0 || typeof document === 'undefined') return null;

  // Portal to <body> so the fixed, scrollable overlay can never be trapped or
  // clipped by an ancestor that establishes a containing block (transform /
  // will-change / contain on the case study page's animated sections).
  return createPortal(
    <div
      className="cf-fp"
      role="dialog"
      aria-modal="true"
      aria-label={`${title} — full design preview`}
      onClick={onClose}
    >
      <div className="cf-fp-veil" aria-hidden="true" />

      <div className="cf-fp-header" onClick={(e) => e.stopPropagation()}>
        <span className="cf-fp-title">{title}</span>
        <span className="cf-fp-spacer" aria-hidden="true" />
        <span className="cf-fp-counter">
          {String(active + 1).padStart(2, '0')} <span aria-hidden="true">/</span>{' '}
          {String(pages.length).padStart(2, '0')}
        </span>
        <button
          type="button"
          className="cf-fp-close"
          aria-label="Close preview"
          onClick={(e) => { e.stopPropagation(); onClose(); }}
          data-cursor="Close"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path d="M6 6L18 18M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </button>
      </div>

      <div className="cf-fp-scroll" ref={scrollRef}>
        {pages.map((p, i) => (
          <figure
            key={p.src}
            className="cf-fp-page"
            data-idx={i}
            ref={(el) => { pageRefs.current[i] = el; }}
            style={{ aspectRatio: `${p.width} / ${p.height}` }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              className="cf-fp-page-lqip"
              aria-hidden="true"
              style={p.blurDataURL ? { backgroundImage: `url(${p.blurDataURL})` } : undefined}
            />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={p.src}
              alt={`${title} — ${p.label ?? `page ${i + 1}`}`}
              width={p.width}
              height={p.height}
              loading={i === 0 ? 'eager' : 'lazy'}
              decoding="async"
              onLoad={(e) => e.currentTarget.parentElement?.classList.add('is-loaded')}
            />
            {p.label && <figcaption className="cf-fp-page-label">{p.label}</figcaption>}
          </figure>
        ))}
      </div>

      {pages.length > 1 && (
        <nav className="cf-fp-rail" aria-label="Pages" onClick={(e) => e.stopPropagation()}>
          {pages.map((p, i) => (
            <button
              key={p.src}
              type="button"
              className={`cf-fp-thumb${i === active ? ' is-active' : ''}`}
              onClick={() => jump(i)}
              data-cursor="Jump"
              aria-label={`Jump to ${p.label ?? `page ${i + 1}`}`}
              aria-current={i === active}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={p.src} alt="" width={p.width} height={p.height} loading="lazy" decoding="async" />
            </button>
          ))}
        </nav>
      )}
    </div>,
    document.body,
  );
}
