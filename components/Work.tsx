'use client';
import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';

interface Project {
  tag: string;
  title: string;
  desc: string;
  img: string;
  meta: [string, string][];
  slug?: string;
}

const projects: Project[] = [
  {
    tag: 'Fact-check platform',
    title: 'FactWatch — AI-assisted newsroom dashboard.',
    desc: "Built the editorial workflow, claim database, and LLM-powered verification pipeline for Bangladesh's leading fact-check organization.",
    img: '/assets/factwatch.png',
    meta: [['Client', 'FactWatch'], ['Role', 'Design · Web · ML'], ['Year', '2025']],
    slug: 'factwatch',
  },
  {
    tag: 'Travel booking',
    title: 'NextStop — end-to-end tour booking engine.',
    desc: 'Custom CMS, Stripe payments, and a design system that took the brand from spreadsheet to $1.2M GMV in year one.',
    img: '/assets/nextstop.png',
    meta: [['Client', 'NextStop Travel'], ['Role', 'Product · Web'], ['Year', '2024']],
    slug: 'nextstop',
  },
  {
    tag: 'Mobile · React Native',
    title: 'TripKing — cross-platform planner, shipped in 9 weeks.',
    desc: 'A React Native app with offline-first itineraries, live collaboration, and a custom map layer. 4.8★ on both stores.',
    img: '/assets/TripKing.png',
    meta: [['Client', 'TripKing'], ['Role', 'Mobile · Design'], ['Year', '2024']],
    slug: 'tripking',
  },
  {
    tag: 'WordPress',
    title: 'Nomadic — bespoke Gutenberg for a boutique agency.',
    desc: 'Custom blocks, a booking engine, and a conversion-tuned landing system. Organic bookings up 3.4× YoY.',
    img: '/assets/nomadic.webp',
    meta: [['Client', 'Nomadic Co.'], ['Role', 'WordPress · SEO'], ['Year', '2023']],
    slug: 'nomadic',
  },
];

export default function Work() {
  const [active, setActive] = useState(0);
  const stageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => {
      if (!stageRef.current) return;
      const cards = stageRef.current.querySelectorAll('.cf-work-card');
      let best = 0, bestScore = -Infinity;
      cards.forEach((c, i) => {
        const r = c.getBoundingClientRect();
        const center = r.top + r.height / 2;
        const target = window.innerHeight / 2;
        const score = -Math.abs(center - target);
        if (score > bestScore) { bestScore = score; best = i; }
      });
      setActive(best);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const p = projects[active];

  return (
    <section id="work" className="cf-work">
      <div className="cf-work-intro">
        <div className="cf-wrap">
          <div className="cf-section-head">
            <div className="left">
              <div className="cf-eyebrow" style={{ color: '#A5B4FC' }}>Selected work</div>
              <h2 className="cf-h2" style={{ color: '#fff' }}>Shipped. Tested. <em className="grad">Loved.</em></h2>
            </div>
            <div className="right" style={{ color: 'rgba(255,255,255,.55)' }}>
              A quick look at projects from the last two years. Scroll through the stack — details on the left update as you go.
            </div>
          </div>
        </div>
      </div>

      <div className="cf-work-stage" ref={stageRef}>
        <div className="cf-work-left">
          <div className="cf-work-left-inner">
            <div className="cf-work-count">{String(active + 1).padStart(2, '0')} / {String(projects.length).padStart(2, '0')}</div>
            <div className="cf-work-tag">{p.tag}</div>
            <h3 className="cf-work-title" key={active} style={{ animation: 'cfFadeUp .6s ease' }}>{p.title}</h3>
            <p className="cf-work-desc" key={active + 'd'} style={{ animation: 'cfFadeUp .6s ease .1s both' }}>{p.desc}</p>
            <div className="cf-work-meta">
              {p.meta.map(([k, v]) => (
                <div key={k}>
                  <div className="cf-work-meta-lbl">{k}</div>
                  <div className="cf-work-meta-val">{v}</div>
                </div>
              ))}
            </div>
            {p.slug ? (
              <Link href={`/case-studies/${p.slug}`} className="cf-work-link" data-cursor="Open case">
                Read the case study
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                  <path d="M7 17L17 7M17 7H7M17 7V17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </Link>
            ) : (
              <span className="cf-work-link" style={{ opacity: 0.55, cursor: 'default', pointerEvents: 'none' }}>
                Case study coming
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
                  <path d="M12 7v5l3 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </span>
            )}
          </div>
        </div>

        <div className="cf-work-right">
          {projects.map((pr, i) => {
            const inner = (
              <>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={pr.img} alt={pr.tag} />
                <div className="cf-work-card-info">
                  <div className="cf-work-card-tag">{pr.tag}</div>
                  <div className="cf-work-card-cta">
                    {pr.slug ? 'View case' : 'Coming soon'}
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                      {pr.slug ? (
                        <path d="M7 17L17 7M17 7H7M17 7V17" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
                      ) : (
                        <>
                          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2.2" />
                          <path d="M12 7v5l3 2" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
                        </>
                      )}
                    </svg>
                  </div>
                </div>
              </>
            );
            return pr.slug ? (
              <Link
                key={i}
                href={`/case-studies/${pr.slug}`}
                className="cf-work-card"
                data-cursor="View case"
              >
                {inner}
              </Link>
            ) : (
              <div key={i} className="cf-work-card" data-cursor="Soon">
                {inner}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
