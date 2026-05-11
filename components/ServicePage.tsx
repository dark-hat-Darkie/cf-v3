'use client';
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import type { ServiceData } from '@/lib/services-data';
import { SERVICES } from '@/lib/services-data';
import Cursor from './Cursor';

/* ── Scroll reveal (only for non-interactive elements) ── */
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
      { threshold: 0.1 }
    );
    els.forEach(el => obs.observe(el));
    return () => obs.disconnect();
  }, []);
}

/* ── Scroll-tracked reveal for interactive items (React state) ── */
function useStepReveal(count: number) {
  const refs = useRef<(HTMLDivElement | null)[]>([]);
  const [visible, setVisible] = useState<boolean[]>(Array(count).fill(false));

  useEffect(() => {
    const obs = new IntersectionObserver(
      entries => {
        entries.forEach(e => {
          if (e.isIntersecting) {
            const idx = Number(e.target.getAttribute('data-step-idx'));
            setVisible(prev => {
              const next = [...prev];
              next[idx] = true;
              return next;
            });
            obs.unobserve(e.target);
          }
        });
      },
      { threshold: 0.1 }
    );
    refs.current.forEach(el => { if (el) obs.observe(el); });
    return () => obs.disconnect();
  }, []);

  return { refs, visible };
}

/* ── Scroll progress bar ── */
function useScrollProgress() {
  const barRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const update = () => {
      const doc = document.documentElement;
      const pct = window.scrollY / (doc.scrollHeight - doc.clientHeight);
      if (barRef.current) barRef.current.style.transform = `scaleX(${Math.min(pct, 1)})`;
    };
    window.addEventListener('scroll', update, { passive: true });
    return () => window.removeEventListener('scroll', update);
  }, []);
  return barRef;
}

/* ── Magnetic pull toward cursor (awwwards-style) ── */
function useMagnetic<T extends HTMLElement>(strength = 0.32) {
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

/* ── Mouse spotlight: tracks cursor inside a section ── */
function useMouseSpotlight<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia('(pointer: coarse)').matches) return;

    const onMove = (e: MouseEvent) => {
      const r = el.getBoundingClientRect();
      el.style.setProperty('--mx', `${((e.clientX - r.left) / r.width) * 100}%`);
      el.style.setProperty('--my', `${((e.clientY - r.top) / r.height) * 100}%`);
    };
    el.addEventListener('mousemove', onMove);
    return () => el.removeEventListener('mousemove', onMove);
  }, []);
  return ref;
}

/* ── Parallax on Y for an element (transforms based on element-center distance from viewport center) ── */
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

/* ── Animated number counter on view ── */
function AnimatedStat({ value, label }: { value: string; label: string }) {
  const ref = useRef<HTMLDivElement>(null);
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

  return (
    <div ref={ref} className="cf-svc-stat">
      <div className="cf-svc-stat-val">{shown}</div>
      <div className="cf-svc-stat-label">{label}</div>
    </div>
  );
}

/* ── Split title into individual character spans for hover stagger ── */
function SplitTitle({ text }: { text: string }) {
  let charIdx = 0;
  return (
    <>
      {text.split(' ').map((word, wi) => (
        <span key={wi} className="cf-svc-step-word-wrap">
          {word.split('').map((char) => {
            const ci = charIdx++;
            return (
              <span
                key={ci}
                className="cf-svc-step-char"
                style={{ '--ci': ci } as React.CSSProperties}
              >
                {char}
              </span>
            );
          })}
          {' '}
        </span>
      ))}
    </>
  );
}

/* ── Service-page nav ── */
function ServiceNav({ title }: { title: string }) {
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
      aria-label="Service navigation"
    >
      <Link href="/" className="cf-svc-nav-back" aria-label="Back to home">
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

/* ── Sticky bottom conversion bar (appears after hero) ── */
function StickyConvertBar({ s }: { s: ServiceData }) {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      const h = window.innerHeight;
      const docH = document.documentElement.scrollHeight - h;
      // Show after hero, hide near final CTA
      setShow(y > h * 0.85 && y < docH - h * 0.6);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div className={`cf-svc-stickybar${show ? ' show' : ''}`} aria-hidden={!show}>
      <div className="cf-svc-stickybar-meta">
        <div className="cf-svc-stickybar-svc">{s.title}</div>
        <div className="cf-svc-stickybar-price">
          <span>From {s.starting}</span>
          <span className="cf-svc-stickybar-dot" />
          <span>{s.timeline}</span>
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

/* ── Hero ── */
function ServiceHero({ s }: { s: ServiceData }) {
  const heroRef = useMouseSpotlight<HTMLElement>();
  const numRef = useParallaxY<HTMLDivElement>(0.1);
  const primaryRef = useMagnetic<HTMLAnchorElement>(0.28);

  return (
    <section className="cf-svc-hero" ref={heroRef}>
      <div
        className="cf-hero-v2-bg"
        style={{
          background:
            'radial-gradient(ellipse 70% 55% at 75% 20%, rgba(131,51,235,.22), transparent 62%), radial-gradient(ellipse 50% 40% at 15% 85%, rgba(255,128,174,.1), transparent 60%), linear-gradient(180deg,#0B0B0B 0%,#110818 100%)',
        }}
      />
      <div className="cf-svc-hero-spotlight" aria-hidden="true" />
      <div className="cf-hero-v2-grid-lines" />
      <div className="cf-grain" />
      <div className="cf-svc-hero-bg-num" ref={numRef} aria-hidden="true">{s.n}</div>

      <div className="cf-svc-hero-inner cf-wrap">
        <div className="cf-svc-hero-eyebrow">
          <span className="cf-svc-hero-eyebrow-dot" />
          <span>{s.title}</span>
          <span style={{ color: 'rgba(255,255,255,.22)', margin: '0 2px' }}>·</span>
          <span>{s.chip}</span>
        </div>

        <h1 className="cf-svc-hero-h1">
          <span className="cf-line"><span>{s.headline1}</span></span>
          <span className="cf-line"><span>{s.headline2}</span></span>
        </h1>

        <p className="cf-svc-hero-sub">{s.sub}</p>

        <div className="cf-svc-hero-actions">
          <Link
            href="/#contact"
            ref={primaryRef}
            className="cf-btn-pill-primary cf-svc-magnetic"
            data-cursor="Let's talk"
          >
            <span>Start this project</span>
            <span className="cf-btn-pill-arrow">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <path d="M7 17L17 7M17 7H7M17 7V17" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
              </svg>
            </span>
          </Link>
          <Link href="/#work" className="cf-btn-pill-ghost">
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              style={{ opacity: 0.6 }}
            >
              <path d="M3 12h18M12 3l9 9-9 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span>See our work</span>
          </Link>
          <span className="cf-svc-hero-reply">
            <span className="cf-svc-hero-reply-dot" />
            Replies in &lt; 24 hours
          </span>
        </div>

        <div className="cf-svc-hero-stats">
          {s.stats.map((st, i) => (
            <AnimatedStat key={i} value={st.value} label={st.label} />
          ))}
        </div>
      </div>

      <div className="cf-svc-scroll-ind" aria-hidden="true">
        <span className="cf-svc-scroll-line" />
        <span>Scroll</span>
      </div>
    </section>
  );
}

/* ── Overview ── */
function ServiceOverview({ s }: { s: ServiceData }) {
  return (
    <section className="cf-svc-overview">
      <div className="cf-hero-v2-grid-lines" style={{ opacity: 0.6 }} />
      <div className="cf-grain" />
      <div className="cf-wrap">
        <div className="cf-svc-section-meta" data-reveal>
          <span>01</span>
          <span className="cf-svc-section-meta-label">Overview</span>
        </div>

        <p className="cf-svc-opening" data-reveal>
          <strong>{s.opening.bold}</strong>
          <em>{s.opening.rest}</em>
        </p>

        <div className="cf-svc-two-col">
          <p data-reveal className="cf-svc-body-text">{s.bodyCol1}</p>
          <p
            data-reveal
            style={{ '--reveal-delay': '.14s' } as React.CSSProperties}
            className="cf-svc-body-text"
          >
            {s.bodyCol2}
          </p>
        </div>

        <blockquote className="cf-svc-insight" data-reveal>
          <p className="cf-svc-insight-text">{s.insight}</p>
          <cite className="cf-svc-insight-source">— {s.insightSource}</cite>
        </blockquote>
      </div>
    </section>
  );
}

/* ── Process with vertical scroll-progress rail ── */
function ServiceProcess({ s }: { s: ServiceData }) {
  const { refs, visible } = useStepReveal(s.process.length);
  const stepsWrapRef = useRef<HTMLDivElement>(null);
  const railRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const wrap = stepsWrapRef.current;
    const rail = railRef.current;
    if (!wrap || !rail) return;

    const update = () => {
      const r = wrap.getBoundingClientRect();
      const total = r.height;
      const seen = Math.min(Math.max(window.innerHeight * 0.55 - r.top, 0), total);
      const pct = total ? seen / total : 0;
      rail.style.setProperty('--rail', `${(pct * 100).toFixed(2)}%`);

      // Determine which step is active (closest to the trigger line)
      const triggerY = window.innerHeight * 0.45;
      let nextActive = 0;
      refs.current.forEach((el, idx) => {
        if (!el) return;
        const top = el.getBoundingClientRect().top;
        if (top < triggerY) nextActive = idx;
      });
      setActive(nextActive);
    };

    update();
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    return () => {
      window.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
    };
  }, [refs]);

  return (
    <section className="cf-svc-process">
      <div className="cf-grain" />
      <div className="cf-wrap">
        <div className="cf-svc-section-meta cf-svc-section-meta-dark" data-reveal>
          <span>02</span>
          <span className="cf-svc-section-meta-label">How we work</span>
        </div>

        <h2 className="cf-svc-process-headline" data-reveal>
          A repeatable process.<br />
          <em>No surprises.</em>
        </h2>

        <div className="cf-svc-steps-shell">
          <div className="cf-svc-rail" ref={railRef} aria-hidden="true">
            <div className="cf-svc-rail-fill" />
          </div>

          <div className="cf-svc-steps" role="list" ref={stepsWrapRef}>
            {s.process.map((step, i) => (
              <div
                key={i}
                ref={el => { refs.current[i] = el; }}
                data-step-idx={i}
                className={[
                  'cf-svc-step',
                  visible[i] ? 'cf-reveal-visible' : '',
                  active === i ? 'is-active' : '',
                ]
                  .filter(Boolean)
                  .join(' ')}
                style={{ '--step-delay': `${i * 0.07}s` } as React.CSSProperties}
                role="listitem"
              >
                <div className="cf-svc-step-header" data-cursor="View">
                  <div className="cf-svc-step-n" aria-hidden="true">{step.n}</div>
                  <h3 className="cf-svc-step-title">
                    <SplitTitle text={step.title} />
                  </h3>
                  <span className="cf-svc-step-tag">{step.duration}</span>
                  <div className="cf-svc-step-arrow" aria-hidden="true">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                      <path d="M5 9L12 16L19 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                </div>

                <div className="cf-svc-step-expand">
                  <div className="cf-svc-step-expand-inner">
                    <p className="cf-svc-step-desc">{step.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── Deliverables (with embedded social proof card) ── */
function ServiceDeliverables({ s }: { s: ServiceData }) {
  const startRef = useMagnetic<HTMLAnchorElement>(0.25);
  return (
    <section className="cf-svc-deliverables">
      <div className="cf-hero-v2-grid-lines" style={{ opacity: 0.5 }} />
      <div className="cf-grain" />
      <div className="cf-wrap">
        <div className="cf-svc-section-meta" data-reveal>
          <span>03</span>
          <span className="cf-svc-section-meta-label">What you get</span>
        </div>

        <div className="cf-svc-del-header">
          <div data-reveal>
            <h2 className="cf-h2" style={{ color: '#0B0B0B' }}>
              Every deliverable.<br />
              <em className="grad">No ambiguity.</em>
            </h2>
          </div>
          <div
            className="cf-svc-del-price-block"
            data-reveal
            style={{ '--reveal-delay': '.12s' } as React.CSSProperties}
          >
            <div className="cf-svc-del-price">{s.starting}</div>
            <div className="cf-svc-del-price-label">Starting investment</div>
            <div className="cf-svc-del-timeline">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
                <path d="M12 6v6l4 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
              {s.timeline}
            </div>
          </div>
        </div>

        <div className="cf-svc-del-grid">
          {s.deliverables.map((d, i) => (
            <div
              key={i}
              className="cf-svc-del-item"
              data-reveal
              style={{ '--reveal-delay': `${(i % 3) * 0.08}s` } as React.CSSProperties}
            >
              <div className="cf-svc-del-check" aria-hidden="true">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
                  <path d="M5 13L9 17L19 7" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <h3 className="cf-svc-del-title">{d.title}</h3>
              <p className="cf-svc-del-desc">{d.desc}</p>
            </div>
          ))}
        </div>

        {/* Embedded social proof — keeps users engaged near the price */}
        <div className="cf-svc-proof-card" data-reveal>
          <div className="cf-svc-proof-quote" aria-hidden="true">&ldquo;</div>
          <p className="cf-svc-proof-text">
            CodeFlee shipped what three previous agencies couldn&rsquo;t — on time,
            without drama, and with code our team actually wants to work in.
          </p>
          <div className="cf-svc-proof-meta">
            <div className="cf-svc-proof-avatar" aria-hidden="true" />
            <div>
              <div className="cf-svc-proof-name">Founder, Series A startup</div>
              <div className="cf-svc-proof-role">Verified client · 2024</div>
            </div>
            <div className="cf-svc-proof-stars" aria-label="5 out of 5">
              {'★★★★★'}
            </div>
          </div>
        </div>

        <div className="cf-svc-del-footer" data-reveal>
          <Link
            href="/#contact"
            ref={startRef}
            className="cf-svc-start-btn cf-svc-magnetic"
            data-cursor="Let's talk"
          >
            Start a conversation
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <path d="M7 17L17 7M17 7H7M17 7V17" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
            </svg>
          </Link>
          <span className="cf-svc-scope-note">
            Scope varies by project. Final investment confirmed after a free discovery call.
          </span>
        </div>
      </div>
    </section>
  );
}

/* ── Tech marquee ── */
function ServiceTech({ s }: { s: ServiceData }) {
  const doubled = [...s.tech, ...s.tech];
  return (
    <div className="cf-svc-tech">
      <div className="cf-svc-tech-label">Technologies we work with</div>
      <div className="cf-svc-tech-track-wrap">
        <div className="cf-svc-tech-track">
          {doubled.map((t, i) => (
            <span key={i} className="cf-svc-tech-item">
              {t}
              <span className="cf-marquee-dot" aria-hidden="true" />
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ── Risk-reversal / guarantee strip (lowers buying friction) ── */
function ServiceGuarantee() {
  const items = [
    {
      title: 'Free discovery call',
      desc: 'A 30-min strategy call before you commit a dollar.',
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
          <path d="M5 13L9 17L19 7" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ),
    },
    {
      title: 'Fixed-price scope',
      desc: 'No hourly billing surprises. You see the number up front.',
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
          <path d="M12 1v22M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ),
    },
    {
      title: 'You own the code',
      desc: 'Source, repos, infrastructure — yours from day one.',
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
          <path d="M16 18l6-6-6-6M8 6l-6 6 6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ),
    },
    {
      title: '30-day post-launch',
      desc: 'Bug fixes and minor iterations included after we ship.',
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
          <path d="M3 12a9 9 0 1 0 9-9M3 4v5h5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ),
    },
  ];

  return (
    <section className="cf-svc-guarantee">
      <div className="cf-grain" />
      <div className="cf-wrap">
        <div className="cf-svc-guarantee-inner">
          <div className="cf-svc-guarantee-lead" data-reveal>
            <span className="cf-svc-guarantee-eyebrow">
              <span className="cf-svc-hero-eyebrow-dot" />
              The promise
            </span>
            <h2 className="cf-svc-guarantee-h2">
              Four reasons<br /><em>this is a safe yes.</em>
            </h2>
          </div>
          <div className="cf-svc-guarantee-grid">
            {items.map((it, i) => (
              <div
                key={i}
                className="cf-svc-guarantee-card"
                data-reveal
                style={{ '--reveal-delay': `${i * 0.08}s` } as React.CSSProperties}
              >
                <div className="cf-svc-guarantee-icon">{it.icon}</div>
                <h3 className="cf-svc-guarantee-title">{it.title}</h3>
                <p className="cf-svc-guarantee-desc">{it.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── FAQ accordion (objection handling) ── */
function ServiceFAQ({ s }: { s: ServiceData }) {
  const items = [
    {
      q: 'How fast can you actually start?',
      a: `Most projects kick off within 1–2 weeks of the discovery call. We accept a maximum of 2 new engagements per quarter so the team you meet is the team that ships your work — no bait-and-switch.`,
    },
    {
      q: 'How is payment structured?',
      a: `50% to start, 25% at the mid-point demo, 25% at launch. We use Stripe invoices, in USD. For ${s.starting}+ engagements we can split into monthly retainers if it fits your runway better.`,
    },
    {
      q: 'What if scope changes mid-project?',
      a: `It will. We re-scope in writing the moment something material shifts — you decide whether to extend the timeline, raise the budget, or trim. No silent meter running. No surprise invoices.`,
    },
    {
      q: 'Do you sign NDAs and work in our repo?',
      a: `Yes to both. We sign your NDA before the discovery call if needed, work directly in your GitHub/GitLab, follow your branching conventions, and join your Slack and stand-ups.`,
    },
    {
      q: 'What happens after the project ships?',
      a: `You get 30 days of included bug fixes and minor iterations. After that, we offer a flat-rate maintenance retainer or you can take it fully in-house — your code, your call. No vendor lock-in.`,
    },
    {
      q: 'Can you work with our existing team?',
      a: `That is most of what we do. We embed alongside your engineers, hand off cleanly, document everything, and pair on the parts your team wants to own going forward.`,
    },
  ];

  const [open, setOpen] = useState<number | null>(0);

  return (
    <section className="cf-svc-faq">
      <div className="cf-hero-v2-grid-lines" style={{ opacity: 0.5 }} />
      <div className="cf-grain" />
      <div className="cf-wrap">
        <div className="cf-svc-faq-grid">
          <div className="cf-svc-faq-lead" data-reveal>
            <div className="cf-svc-section-meta">
              <span>04</span>
              <span className="cf-svc-section-meta-label">Common questions</span>
            </div>
            <h2 className="cf-svc-faq-h2">
              Let&rsquo;s answer<br /><em>the obvious ones first.</em>
            </h2>
            <p className="cf-svc-faq-sub">
              Direct answers to what every prospect asks before our first call.
              If yours isn&rsquo;t here, ask us on the call.
            </p>
            <Link href="/#contact" className="cf-svc-faq-cta" data-cursor="Let's talk">
              Ask your own question →
            </Link>
          </div>

          <div className="cf-svc-faq-list">
            {items.map((it, i) => {
              const isOpen = open === i;
              return (
                <div
                  key={i}
                  className="cf-svc-faq-item-wrap"
                  data-reveal
                  style={{ '--reveal-delay': `${i * 0.05}s` } as React.CSSProperties}
                >
                  <button
                    type="button"
                    className={`cf-svc-faq-item${isOpen ? ' open' : ''}`}
                    aria-expanded={isOpen}
                    onClick={() => setOpen(isOpen ? null : i)}
                  >
                    <div className="cf-svc-faq-q">
                      <span className="cf-svc-faq-q-num">0{i + 1}</span>
                      <span className="cf-svc-faq-q-text">{it.q}</span>
                      <span className="cf-svc-faq-q-toggle" aria-hidden="true">
                        <span /><span />
                      </span>
                    </div>
                    <div className="cf-svc-faq-a">
                      <div className="cf-svc-faq-a-inner">
                        <p>{it.a}</p>
                      </div>
                    </div>
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── CTA ── */
function ServiceCTA() {
  const ctaRef = useMagnetic<HTMLAnchorElement>(0.32);
  return (
    <section className="cf-svc-cta-section">
      <div className="cf-grain" />
      <div className="cf-wrap" style={{ position: 'relative', zIndex: 2 }}>
        <div className="cf-svc-urgency" data-reveal>
          <span className="cf-svc-urgency-dot" />
          <span>2 spots open this quarter</span>
        </div>

        <h2 className="cf-svc-cta-headline" data-reveal>
          Ready to build something<br />
          <em>worth using?</em>
        </h2>

        <p className="cf-svc-cta-sub" data-reveal>
          Tell us about your project. We reply within 24 hours with an honest assessment and a rough scope — no sales pressure.
        </p>

        <div className="cf-svc-cta-actions" data-reveal>
          <Link
            href="/#contact"
            ref={ctaRef}
            className="cf-btn-pill-primary cf-svc-magnetic"
            data-cursor="Let's talk"
          >
            <span>Start a project</span>
            <span className="cf-btn-pill-arrow">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <path d="M7 17L17 7M17 7H7M17 7V17" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
              </svg>
            </span>
          </Link>
          <Link href="/#work" className="cf-btn-pill-ghost">
            <span>See our work first</span>
          </Link>
        </div>

        <div className="cf-svc-trust" data-reveal>
          {[
            { value: '60+', label: 'Products shipped' },
            { value: '98%', label: 'Repeat rate' },
            { value: '12', label: 'Countries' },
          ].map((t, i) => (
            <div key={i} className="cf-svc-trust-item">
              <div className="cf-svc-trust-val">{t.value}</div>
              <div className="cf-svc-trust-label">{t.label}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="cf-svc-cta-all-services" data-reveal>
        <span>Other services:</span>
        <Link href="/#services">View all six →</Link>
      </div>
    </section>
  );
}

/* ── Featured work showcase (parallax image + floating metrics) ── */
const SHOWCASE_IMG: Record<string, string> = {
  'web-development': '/assets/factwatch.png',
  'mobile-apps': '/assets/nomadic.webp',
  'ui-ux-design': '/assets/c1.webp',
  'brand-motion': '/assets/c2.webp',
  'webgl-3d': '/assets/c3.png',
  'ecommerce': '/assets/TripKing.png',
};

function ServiceShowcase({ s }: { s: ServiceData }) {
  const imgRef = useParallaxY<HTMLDivElement>(0.12);
  const ctaRef = useMagnetic<HTMLAnchorElement>(0.28);
  const img = SHOWCASE_IMG[s.slug] ?? s.img;

  return (
    <section className="cf-svc-showcase">
      <div className="cf-grain" />
      <div className="cf-wrap">
        <div className="cf-svc-showcase-head">
          <div className="cf-svc-section-meta cf-svc-section-meta-dark" data-reveal>
            <span aria-hidden="true">—</span>
            <span className="cf-svc-section-meta-label">Featured work</span>
          </div>
          <h2 className="cf-svc-showcase-h2" data-reveal>
            What it looks like<br /><em>when shipped.</em>
          </h2>
          <p className="cf-svc-showcase-sub" data-reveal style={{ '--reveal-delay': '.08s' } as React.CSSProperties}>
            A real {s.title.toLowerCase()} engagement — built end-to-end in {s.timeline.toLowerCase()}.
          </p>
        </div>

        <div className="cf-svc-showcase-card" data-reveal>
          <div className="cf-svc-showcase-img-wrap" data-cursor="View case">
            <div className="cf-svc-showcase-img" ref={imgRef}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={img} alt="" />
            </div>
            <div className="cf-svc-showcase-overlay" />
            <div className="cf-svc-showcase-tag">
              <span className="cf-svc-showcase-tag-dot" />
              Live · 2024
            </div>
          </div>

          <div className="cf-svc-showcase-meta">
            <div className="cf-svc-showcase-metrics">
              {s.stats.map((m, i) => (
                <div
                  key={i}
                  className="cf-svc-showcase-metric"
                  data-reveal
                  style={{ '--reveal-delay': `${0.1 + i * 0.08}s` } as React.CSSProperties}
                >
                  <div className="cf-svc-showcase-metric-v">{m.value}</div>
                  <div className="cf-svc-showcase-metric-l">{m.label}</div>
                </div>
              ))}
            </div>

            <Link
              href="/#work"
              ref={ctaRef}
              className="cf-svc-showcase-cta cf-svc-magnetic"
              data-cursor="View case"
            >
              See the case
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <path d="M7 17L17 7M17 7H7M17 7V17" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── Comparison ladder (typical agency vs CodeFlee) ── */
function ServiceComparison() {
  const rows = [
    { typical: 'Hourly billing surprises', us: 'Fixed-price scope, paid in milestones' },
    { typical: 'Junior teams behind the proposal', us: 'Senior engineers from kick-off to launch' },
    { typical: 'Mid-project radio silence', us: 'Bi-weekly demos and a Slack you actually want' },
    { typical: 'Locked codebase or vendor lock-in', us: 'You own the code, repos, infra — day one' },
    { typical: '"Done" means deployed and ghosted', us: '30 days of bug fixes baked in' },
    { typical: 'Sub-agencies stitched together', us: 'One full-stack team — design through deploy' },
  ];
  return (
    <section className="cf-svc-compare">
      <div className="cf-hero-v2-grid-lines" style={{ opacity: 0.4 }} />
      <div className="cf-grain" />
      <div className="cf-wrap">
        <div className="cf-svc-section-meta cf-svc-section-meta-dark" data-reveal>
          <span aria-hidden="true">—</span>
          <span className="cf-svc-section-meta-label">The difference</span>
        </div>

        <h2 className="cf-svc-compare-h2" data-reveal>
          Most agencies do this.<br /><em>We do the opposite.</em>
        </h2>

        <div className="cf-svc-compare-table" data-reveal>
          <div className="cf-svc-compare-head">
            <div className="cf-svc-compare-head-typical">Typical agency</div>
            <div className="cf-svc-compare-head-us">CodeFlee</div>
          </div>
          {rows.map((r, i) => (
            <div
              key={i}
              className="cf-svc-compare-row"
              data-reveal
              style={{ '--reveal-delay': `${i * 0.06}s` } as React.CSSProperties}
            >
              <div className="cf-svc-compare-typical">
                <span className="cf-svc-compare-x" aria-hidden="true">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                    <path d="M6 6L18 18M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                </span>
                <span>{r.typical}</span>
              </div>
              <div className="cf-svc-compare-us">
                <span className="cf-svc-compare-check" aria-hidden="true">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                    <path d="M5 13L9 17L19 7" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
                <span>{r.us}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── Related services (cross-link before the final CTA) ── */
function ServiceRelated({ current }: { current: string }) {
  const others = SERVICES.filter(x => x.slug !== current).slice(0, 3);
  return (
    <section className="cf-svc-related">
      <div className="cf-grain" />
      <div className="cf-wrap">
        <div className="cf-svc-related-head">
          <div className="cf-svc-section-meta" data-reveal>
            <span aria-hidden="true">—</span>
            <span className="cf-svc-section-meta-label">Explore more</span>
          </div>
          <h2 className="cf-svc-related-h2" data-reveal>
            Pair this with<br /><em>another discipline.</em>
          </h2>
        </div>

        <div className="cf-svc-related-grid">
          {others.map((o, i) => (
            <RelatedCard key={o.slug} s={o} delay={i * 0.08} />
          ))}
        </div>
      </div>
    </section>
  );
}

function RelatedCard({ s, delay }: { s: ServiceData; delay: number }) {
  const ref = useMagnetic<HTMLAnchorElement>(0.18);
  return (
    <Link
      href={`/services/${s.slug}`}
      ref={ref}
      className="cf-svc-related-card cf-svc-magnetic"
      data-cursor="Open"
      data-reveal
      style={{ '--reveal-delay': `${delay}s` } as React.CSSProperties}
    >
      <div className="cf-svc-related-num">{s.n}</div>
      <h3 className="cf-svc-related-title">{s.title}</h3>
      <p className="cf-svc-related-desc">{s.sub}</p>
      <div className="cf-svc-related-foot">
        <span className="cf-svc-related-chip">{s.chip}</span>
        <span className="cf-svc-related-arrow" aria-hidden="true">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
            <path d="M7 17L17 7M17 7H7M17 7V17" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
          </svg>
        </span>
      </div>
    </Link>
  );
}

/* ── Root export ── */
export default function ServicePage({ service }: { service: ServiceData }) {
  const progressRef = useScrollProgress();
  useScrollReveal();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [service.slug]);

  return (
    <>
      <div className="cf-scroll-bar" ref={progressRef} />
      <Cursor />
      <ServiceNav title={service.title} />
      <main>
        <ServiceHero s={service} />
        <ServiceOverview s={service} />
        <ServiceProcess s={service} />
        <ServiceShowcase s={service} />
        <ServiceDeliverables s={service} />
        <ServiceTech s={service} />
        <ServiceComparison />
        <ServiceGuarantee />
        <ServiceFAQ s={service} />
        <ServiceRelated current={service.slug} />
        <ServiceCTA />
      </main>
      <StickyConvertBar s={service} />
    </>
  );
}
