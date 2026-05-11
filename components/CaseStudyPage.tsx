'use client';
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import type { CaseStudyData } from '@/lib/case-studies-data';
import { CASE_STUDIES, getNextCaseStudy } from '@/lib/case-studies-data';
import Cursor from './Cursor';

const ROMAN = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X'];

/* ── Scroll reveal for non-interactive elements ── */
function useScrollReveal() {
  useEffect(() => {
    const els = document.querySelectorAll('[data-reveal]');
    const obs = new IntersectionObserver(
      entries => {
        entries.forEach(e => {
          if (e.isIntersecting) {
            e.target.classList.add('cf-reveal-visible');
            obs.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    els.forEach(el => obs.observe(el));
    return () => obs.disconnect();
  }, []);
}

/* ── Top scroll progress bar ── */
function useScrollProgress() {
  const barRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const update = () => {
      const doc = document.documentElement;
      const pct = window.scrollY / (doc.scrollHeight - doc.clientHeight);
      if (barRef.current) barRef.current.style.transform = `scaleX(${Math.min(pct, 1)})`;
    };
    update();
    window.addEventListener('scroll', update, { passive: true });
    return () => window.removeEventListener('scroll', update);
  }, []);
  return barRef;
}

/* ── Magnetic pull toward cursor ── */
function useMagnetic<T extends HTMLElement>(strength = 0.3) {
  const ref = useRef<T>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia('(pointer: coarse)').matches) return;

    let raf = 0;
    const onMove = (e: MouseEvent) => {
      const r = el.getBoundingClientRect();
      const cx = r.left + r.width / 2;
      const cy = r.top + r.height / 2;
      const dx = (e.clientX - cx) * strength;
      const dy = (e.clientY - cy) * strength;
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        el.style.transform = `translate(${dx}px, ${dy}px)`;
      });
    };
    const onLeave = () => {
      cancelAnimationFrame(raf);
      el.style.transform = '';
    };
    el.addEventListener('mousemove', onMove);
    el.addEventListener('mouseleave', onLeave);
    return () => {
      el.removeEventListener('mousemove', onMove);
      el.removeEventListener('mouseleave', onLeave);
      cancelAnimationFrame(raf);
    };
  }, [strength]);
  return ref;
}

/* ── Y parallax ── */
function useParallaxY<T extends HTMLElement>(speed = 0.18) {
  const ref = useRef<T>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let raf = 0;
    const update = () => {
      const r = el.getBoundingClientRect();
      const center = r.top + r.height / 2 - window.innerHeight / 2;
      el.style.transform = `translate3d(0, ${center * -speed}px, 0)`;
    };
    update();
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(update);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', update);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', update);
      cancelAnimationFrame(raf);
    };
  }, [speed]);
  return ref;
}

/* ── Scroll-driven line-by-line left→right fill (gray → ink) ── */
function ScrollFillP({ text, className }: { text: string; className?: string }) {
  const ref = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const words = Array.from(el.querySelectorAll<HTMLElement>('.cf-cs-fill-word'));
    if (!words.length) return;

    type Line = { ref: HTMLElement; words: HTMLElement[]; minLeft: number; maxRight: number };
    let lines: Line[] = [];

    const recompute = () => {
      lines = [];
      let cur: Line | null = null;
      let curTop = -Infinity;
      for (const w of words) {
        const top = w.offsetTop;
        const left = w.offsetLeft;
        const right = left + w.offsetWidth;
        if (cur === null || Math.abs(top - curTop) > 4) {
          cur = { ref: w, words: [], minLeft: left, maxRight: right };
          lines.push(cur);
          curTop = top;
        }
        cur.words.push(w);
        if (left < cur.minLeft) cur.minLeft = left;
        if (right > cur.maxRight) cur.maxRight = right;
      }
    };

    recompute();

    let raf = 0;
    let listening = false;

    const SWEEP = 0.6;          // fraction of line progress used to sweep across the line
    const REMAINING = 1 - SWEEP; // each word's own ramp width

    const update = () => {
      const vh = window.innerHeight;
      const start = vh * 0.82;
      const end = vh * 0.34;
      const range = start - end || 1;

      for (const line of lines) {
        const r = line.ref.getBoundingClientRect();
        const wc = r.top + r.height / 2;
        const lp = (start - wc) / range;
        const lineProgress = lp <= 0 ? 0 : lp >= 1 ? 1 : lp;
        const lineWidth = line.maxRight - line.minLeft;

        for (const word of line.words) {
          const frac = lineWidth > 0 ? (word.offsetLeft - line.minLeft) / lineWidth : 0;
          const t = (lineProgress - frac * SWEEP) / REMAINING;
          const p = t <= 0 ? 0 : t >= 1 ? 1 : t;
          word.style.setProperty('--p', p.toFixed(3));
        }
      }
    };

    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(update);
    };
    const onResize = () => {
      recompute();
      update();
    };

    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !listening) {
          listening = true;
          window.addEventListener('scroll', onScroll, { passive: true });
          window.addEventListener('resize', onResize);
          recompute();
          update();
        } else if (!entry.isIntersecting && listening) {
          listening = false;
          window.removeEventListener('scroll', onScroll);
          window.removeEventListener('resize', onResize);
        }
      },
      { rootMargin: '60% 0px 60% 0px' }
    );
    obs.observe(el);
    update();

    return () => {
      obs.disconnect();
      if (listening) {
        window.removeEventListener('scroll', onScroll);
        window.removeEventListener('resize', onResize);
      }
      cancelAnimationFrame(raf);
    };
  }, [text]);

  const parts = text.split(/(\s+)/);
  return (
    <p ref={ref} className={className}>
      {parts.map((part, i) =>
        /^\s+$/.test(part)
          ? <span key={i}>{part}</span>
          : <span key={i} className="cf-cs-fill-word">{part}</span>
      )}
    </p>
  );
}

/* ── Number that animates on view ── */
function AnimatedNumber({ value, className }: { value: string; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [shown, setShown] = useState(value);
  const playedRef = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const match = value.match(/^(\D*)(\d+(?:\.\d+)?)(\D*)$/);
    if (!match) { setShown(value); return; }
    const [, prefix, numStr, suffix] = match;
    const target = parseFloat(numStr);
    const decimals = (numStr.split('.')[1] || '').length;

    const obs = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting || playedRef.current) return;
      playedRef.current = true;
      const duration = 1400;
      const start = performance.now();
      const tick = (now: number) => {
        const t = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - t, 4);
        const current = (target * eased).toFixed(decimals);
        setShown(`${prefix}${current}${suffix}`);
        if (t < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
      obs.disconnect();
    }, { threshold: 0.5 });
    obs.observe(el);
    return () => obs.disconnect();
  }, [value]);

  return <span ref={ref} className={className}>{shown}</span>;
}

/* ── Top nav (matches the services page chrome) ── */
function CaseStudyNav({ title }: { title: string }) {
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    let last = 0;
    const handler = () => {
      const y = window.scrollY;
      setScrolled(y > 40);
      setHidden(y > 120 && y > last);
      last = y;
    };
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

  return (
    <nav
      className={`cf-svc-nav${scrolled ? ' scrolled' : ''}${hidden ? ' hidden' : ''}`}
      aria-label="Case study navigation"
    >
      <Link href="/#work" className="cf-svc-nav-back" aria-label="Back to work">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
          <path d="M19 12H5M5 12L12 19M5 12L12 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <span>Back</span>
      </Link>

      <span className="cf-svc-nav-title">{title}</span>

      <Link href="/#contact" className="cf-svc-nav-cta" data-cursor="Let's talk">
        Book a call
        <svg width="11" height="11" viewBox="0 0 24 24" fill="none">
          <path d="M7 17L17 7M17 7H7M17 7V17" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
        </svg>
      </Link>
    </nav>
  );
}

/* ── Sticky bottom conversion bar (matches the services page) ── */
function StickyConvertBar({ c }: { c: CaseStudyData }) {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      const h = window.innerHeight;
      const docH = document.documentElement.scrollHeight - h;
      setShow(y > h * 0.85 && y < docH - h * 0.6);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div className={`cf-svc-stickybar${show ? ' show' : ''}`} aria-hidden={!show}>
      <div className="cf-svc-stickybar-meta">
        <div className="cf-svc-stickybar-svc">Want results like {c.client}&rsquo;s?</div>
        <div className="cf-svc-stickybar-price">
          <span>{c.sector}</span>
          <span className="cf-svc-stickybar-dot" />
          <span>{c.year}</span>
        </div>
      </div>
      <Link href="/#contact" className="cf-svc-stickybar-cta" data-cursor="Let's talk">
        Book a free 30-min call
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
          <path d="M7 17L17 7M17 7H7M17 7V17" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
        </svg>
      </Link>
    </div>
  );
}

/* ── Hero (light, editorial, big type) ── */
function CaseStudyHero({ c, index, total }: { c: CaseStudyData; index: number; total: number }) {
  const heroImgRef = useParallaxY<HTMLDivElement>(0.08);

  return (
    <section className="cf-cs-hero">
      <div className="cf-grain" />

      <div className="cf-cs-hero-top cf-wrap">
        <div className="cf-cs-hero-eyebrow">
          <span className="cf-cs-hero-eyebrow-dot" />
          <span className="cf-cs-hero-eyebrow-label">Case study</span>
          <span className="cf-cs-hero-eyebrow-sep" aria-hidden="true">·</span>
          <span className="cf-cs-hero-eyebrow-roman">{ROMAN[index] ?? `${index + 1}`} / {ROMAN[total - 1] ?? total}</span>
        </div>
        <Link href="/#work" className="cf-cs-hero-back" aria-label="Back to work">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
            <path d="M19 12H5M5 12L12 19M5 12L12 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span>All work</span>
        </Link>
      </div>

      <div className="cf-cs-hero-stage cf-wrap">
        <h1 className="cf-cs-hero-title">
          <span className="cf-cs-hero-title-row" data-reveal>
            <em className="cf-cs-hero-title-em">{c.headline1}</em>
          </span>
          <span className="cf-cs-hero-title-row" data-reveal style={{ '--reveal-delay': '.1s' } as React.CSSProperties}>
            {c.headline2}
          </span>
        </h1>

        <div className="cf-cs-hero-bottom">
          <div className="cf-cs-hero-sub-wrap" data-reveal style={{ '--reveal-delay': '.22s' } as React.CSSProperties}>
            <p className="cf-cs-hero-sub">{c.sub}</p>
            {c.liveUrl && (
              <a
                href={c.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="cf-cs-hero-live"
                data-cursor="Visit"
              >
                <span>Visit live site</span>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
                  <path d="M14 3h7v7M21 3l-9 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </a>
            )}
          </div>

          <dl className="cf-cs-hero-meta" data-reveal style={{ '--reveal-delay': '.28s' } as React.CSSProperties}>
            <div className="cf-cs-hero-meta-row">
              <dt>Client</dt><dd>{c.client}</dd>
            </div>
            <div className="cf-cs-hero-meta-row">
              <dt>Sector</dt><dd>{c.sector}</dd>
            </div>
            <div className="cf-cs-hero-meta-row">
              <dt>Year</dt><dd>{c.year}</dd>
            </div>
            <div className="cf-cs-hero-meta-row">
              <dt>Services</dt><dd>{c.services.join(' · ')}</dd>
            </div>
          </dl>
        </div>
      </div>

      <div className="cf-cs-hero-bleed">
        <div className="cf-cs-hero-bleed-img" ref={heroImgRef}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={c.heroImage} alt={`${c.client} — hero`} />
        </div>
        <div className="cf-cs-hero-stats-strip">
          {c.heroStats.map((s, i) => (
            <div key={i} className="cf-cs-hero-stat">
              <AnimatedNumber value={s.value} className="cf-cs-hero-stat-val" />
              <span className="cf-cs-hero-stat-lbl">{s.label}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="cf-cs-hero-scroll" aria-hidden="true">
        <span>Read the story</span>
        <span className="cf-cs-hero-scroll-line" />
      </div>
    </section>
  );
}

/* ── Chapter mark (Roman numeral + label) ── */
function ChapterMark({ roman, label, dark = false }: { roman: string; label: string; dark?: boolean }) {
  return (
    <div className={`cf-cs-mark${dark ? ' is-dark' : ''}`} data-reveal>
      <span className="cf-cs-mark-roman">{roman}.</span>
      <span className="cf-cs-mark-label">{label}</span>
    </div>
  );
}

/* ── Brief (big numeral + editorial body, scroll-fill text) ── */
function CaseStudyBrief({ c }: { c: CaseStudyData }) {
  return (
    <section className="cf-cs-brief">
      <div className="cf-wrap">
        <ChapterMark roman="I" label="The brief" />

        <div className="cf-cs-brief-grid">
          <ScrollFillP text={c.challenge.lead} className="cf-cs-brief-lead" />
          <div className="cf-cs-brief-body">
            <ScrollFillP text={c.challenge.col1} />
            <ScrollFillP text={c.challenge.col2} />
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── Chapters (zigzag approach with giant decorative numerals) ── */
function CaseStudyChapters({ c }: { c: CaseStudyData }) {
  return (
    <section className="cf-cs-chapters">
      <div className="cf-grain" />
      <div className="cf-wrap">
        <ChapterMark roman="II" label="The approach" dark />

        <h2 className="cf-cs-chapters-headline" data-reveal>
          The decisions <em>behind the work.</em>
        </h2>

        <div className="cf-cs-chapter-list">
          {c.approach.map((step, i) => (
            <article
              key={i}
              className={`cf-cs-chapter${i % 2 === 1 ? ' is-flip' : ''}`}
              data-reveal
              style={{ '--reveal-delay': `${(i % 2) * 0.08}s` } as React.CSSProperties}
            >
              <div className="cf-cs-chapter-num" aria-hidden="true">
                <span>{step.n}</span>
              </div>
              <div className="cf-cs-chapter-text">
                <span className="cf-cs-chapter-phase">{step.phase}</span>
                <h3 className="cf-cs-chapter-title">{step.title}</h3>
                <p className="cf-cs-chapter-desc">{step.desc}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── Lightbox (click-to-preview modal) ── */
function Lightbox({
  items,
  index,
  onClose,
  onPrev,
  onNext,
}: {
  items: CaseStudyData['gallery'];
  index: number;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      else if (e.key === 'ArrowLeft') onPrev();
      else if (e.key === 'ArrowRight') onNext();
    };
    document.addEventListener('keydown', onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [onClose, onPrev, onNext]);

  const item = items[index];
  if (!item) return null;

  return (
    <div
      className="cf-cs-lightbox"
      role="dialog"
      aria-modal="true"
      aria-label="Image preview"
      onClick={onClose}
    >
      <div className="cf-cs-lightbox-veil" aria-hidden="true" />

      <button
        type="button"
        className="cf-cs-lightbox-close"
        aria-label="Close preview"
        onClick={(e) => { e.stopPropagation(); onClose(); }}
        data-cursor="Close"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
          <path d="M6 6L18 18M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </button>

      {items.length > 1 && (
        <>
          <button
            type="button"
            className="cf-cs-lightbox-nav cf-cs-lightbox-prev"
            aria-label="Previous image"
            onClick={(e) => { e.stopPropagation(); onPrev(); }}
            data-cursor="Prev"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <button
            type="button"
            className="cf-cs-lightbox-nav cf-cs-lightbox-next"
            aria-label="Next image"
            onClick={(e) => { e.stopPropagation(); onNext(); }}
            data-cursor="Next"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <path d="M9 6L15 12L9 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </>
      )}

      <div
        key={index}
        className="cf-cs-lightbox-stage"
        onClick={(e) => e.stopPropagation()}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={item.src} alt={item.alt} />
      </div>

      <div className="cf-cs-lightbox-foot" onClick={(e) => e.stopPropagation()}>
        <span className="cf-cs-lightbox-counter">
          {String(index + 1).padStart(2, '0')} <span aria-hidden="true">/</span> {String(items.length).padStart(2, '0')}
        </span>
        {item.caption && <span className="cf-cs-lightbox-cap">{item.caption}</span>}
      </div>
    </div>
  );
}

/* ── Showcase: bento grid with click-to-preview lightbox ── */
function CaseStudyShowcase({ c }: { c: CaseStudyData }) {
  const [openIdx, setOpenIdx] = useState<number | null>(null);
  const total = c.gallery.length;

  const close = () => setOpenIdx(null);
  const prev = () =>
    setOpenIdx((i) => (i === null ? null : (i - 1 + total) % total));
  const next = () =>
    setOpenIdx((i) => (i === null ? null : (i + 1) % total));

  return (
    <section className="cf-cs-showcase">
      <div className="cf-wrap">
        <ChapterMark roman="III" label="In the wild" />
        <h2 className="cf-cs-showcase-headline" data-reveal>
          What it <em>looks like.</em>
        </h2>

        <div
          className="cf-cs-bento"
          data-count={total}
          data-reveal
        >
          {c.gallery.map((g, i) => (
            <button
              key={i}
              type="button"
              className="cf-cs-bento-item"
              onClick={() => setOpenIdx(i)}
              data-cursor="Preview"
              aria-label={`Preview: ${g.caption || g.alt}`}
            >
              <div className="cf-cs-bento-img">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={g.src} alt={g.alt} loading={i === 0 ? 'eager' : 'lazy'} />
              </div>
              <span className="cf-cs-bento-num">{String(i + 1).padStart(2, '0')}</span>
              {g.caption && (
                <span className="cf-cs-bento-cap">{g.caption}</span>
              )}
              <span className="cf-cs-bento-zoom" aria-hidden="true">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                  <path d="M8 3H3v5M16 3h5v5M16 21h5v-5M8 21H3v-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
            </button>
          ))}
        </div>
      </div>

      {openIdx !== null && (
        <Lightbox
          items={c.gallery}
          index={openIdx}
          onClose={close}
          onPrev={prev}
          onNext={next}
        />
      )}
    </section>
  );
}

/* ── Scoreboard (ledger-style outcome) ── */
function CaseStudyScoreboard({ c }: { c: CaseStudyData }) {
  return (
    <section className="cf-cs-scoreboard">
      <div className="cf-wrap">
        <ChapterMark roman="IV" label="The result" />

        <div className="cf-cs-scoreboard-head">
          <h2 className="cf-cs-scoreboard-headline" data-reveal>
            The <em>receipts.</em>
          </h2>
          <p className="cf-cs-scoreboard-lead" data-reveal style={{ '--reveal-delay': '.08s' } as React.CSSProperties}>
            {c.outcome.lead}
          </p>
        </div>

        <div className="cf-cs-scoreboard-hero" data-reveal>
          <AnimatedNumber value={c.outcome.heroStat.value} className="cf-cs-scoreboard-hero-val" />
          <span className="cf-cs-scoreboard-hero-lbl">{c.outcome.heroStat.label}</span>
        </div>

        <ol className="cf-cs-ledger" aria-label="Outcome metrics">
          {c.outcome.stats.map((s, i) => (
            <li
              key={i}
              className="cf-cs-ledger-row"
              data-reveal
              style={{ '--reveal-delay': `${i * 0.06}s` } as React.CSSProperties}
            >
              <span className="cf-cs-ledger-idx">{String(i + 1).padStart(2, '0')}</span>
              <span className="cf-cs-ledger-label">{s.label}</span>
              <span className="cf-cs-ledger-dots" aria-hidden="true" />
              <AnimatedNumber value={s.value} className="cf-cs-ledger-value" />
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

/* ── Quote (inline panel, side-by-side) ── */
function CaseStudyQuote({ c }: { c: CaseStudyData }) {
  const t = c.testimonial;
  return (
    <section className="cf-cs-quote-section">
      <div className="cf-wrap">
        <article className="cf-cs-quote">
          <div className="cf-cs-quote-side">
            {t.avatar && (
              <div className="cf-cs-quote-avatar">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={t.avatar} alt="" />
              </div>
            )}
            <div className="cf-cs-quote-who">
              <div className="cf-cs-quote-name">{t.name}</div>
              <div className="cf-cs-quote-role">{t.role}</div>
              <div className="cf-cs-quote-co">{t.company}</div>
            </div>
            <div className="cf-cs-quote-stars" aria-label="5 of 5">★★★★★</div>
          </div>
          <div className="cf-cs-quote-body">
            <span className="cf-cs-quote-mark" aria-hidden="true">“</span>
            <blockquote className="cf-cs-quote-text" data-reveal>
              {t.quote}
            </blockquote>
          </div>
        </article>
      </div>
    </section>
  );
}

/* ── Tech (chip cloud, no marquee) ── */
function CaseStudyTech({ c }: { c: CaseStudyData }) {
  return (
    <section className="cf-cs-tech">
      <div className="cf-wrap">
        <ChapterMark roman="V" label="Built with" />
        <div className="cf-cs-tech-cloud">
          {c.tech.map((t, i) => (
            <span
              key={i}
              className="cf-cs-tech-chip"
              data-reveal
              style={{ '--reveal-delay': `${(i % 6) * 0.04}s` } as React.CSSProperties}
            >
              {t}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── Next case (full-bleed cinematic reveal) ── */
function CaseStudyNext({ c }: { c: CaseStudyData }) {
  const next = getNextCaseStudy(c.slug);
  const ref = useMagnetic<HTMLAnchorElement>(0.12);
  if (!next) return null;
  const nextIndex = CASE_STUDIES.findIndex(x => x.slug === next.slug);

  return (
    <section className="cf-cs-next">
      <Link
        href={`/case-studies/${next.slug}`}
        ref={ref}
        className="cf-cs-next-stage cf-svc-magnetic"
        data-cursor="Open case"
      >
        <div className="cf-cs-next-bg">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={next.heroImage} alt={next.client} />
        </div>
        <div className="cf-cs-next-veil" aria-hidden="true" />

        <div className="cf-cs-next-frame cf-wrap">
          <div className="cf-cs-next-mark">
            <span className="cf-cs-next-mark-arrow" aria-hidden="true">↓</span>
            <span>Continue · Case {ROMAN[nextIndex] ?? nextIndex + 1}</span>
          </div>

          <div className="cf-cs-next-meta">
            <span className="cf-cs-next-meta-client">{next.client}</span>
            <span className="cf-cs-next-meta-sep" aria-hidden="true">/</span>
            <span className="cf-cs-next-meta-sector">{next.sector}</span>
          </div>

          <h2 className="cf-cs-next-title">
            <em>{next.headline1}</em><br />
            {next.headline2}
          </h2>

          <span className="cf-cs-next-go" aria-hidden="true">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <path d="M7 17L17 7M17 7H7M17 7V17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
            <span>Open case</span>
          </span>
        </div>
      </Link>
    </section>
  );
}

/* ── Close (restrained final CTA) ── */
function CaseStudyClose() {
  const ctaRef = useMagnetic<HTMLAnchorElement>(0.34);
  return (
    <section className="cf-cs-close">
      <div className="cf-wrap">
        <p className="cf-cs-close-eyebrow" data-reveal>
          <span className="cf-cs-close-eyebrow-dot" />
          P.S. · One final note
        </p>

        <h2 className="cf-cs-close-headline" data-reveal>
          Want results <em>like these?</em>
        </h2>

        <div className="cf-cs-close-action" data-reveal>
          <Link
            href="/#contact"
            ref={ctaRef}
            className="cf-btn-pill-primary cf-svc-magnetic"
            data-cursor="Let's talk"
          >
            <span>Start your project</span>
            <span className="cf-btn-pill-arrow">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <path d="M7 17L17 7M17 7H7M17 7V17" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
              </svg>
            </span>
          </Link>
        </div>

        <p className="cf-cs-close-note" data-reveal>
          Replies in &lt; 24 hours · Free 30-min discovery call · No sales pitch.
        </p>
      </div>
    </section>
  );
}

/* ── Root ── */
export default function CaseStudyPage({ study }: { study: CaseStudyData }) {
  const progressRef = useScrollProgress();
  useScrollReveal();

  const index = CASE_STUDIES.findIndex(c => c.slug === study.slug);
  const total = CASE_STUDIES.length;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [study.slug]);

  return (
    <>
      <div className="cf-scroll-bar" ref={progressRef} />
      <Cursor />
      <CaseStudyNav title={study.client} />
      <main className="cf-cs-main">
        <CaseStudyHero c={study} index={index} total={total} />
        <CaseStudyBrief c={study} />
        <CaseStudyChapters c={study} />
        <CaseStudyShowcase c={study} />
        <CaseStudyScoreboard c={study} />
        <CaseStudyQuote c={study} />
        <CaseStudyTech c={study} />
        <CaseStudyNext c={study} />
        <CaseStudyClose />
      </main>
      <StickyConvertBar c={study} />
    </>
  );
}
