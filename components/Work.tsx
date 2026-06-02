'use client';
import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { FEATURED_PROJECTS } from '@/lib/featured-work';

const projects = FEATURED_PROJECTS;

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
            <Link href={`/case-studies/${p.slug}`} className="cf-work-link" data-cursor="Open case">
              Read the case study
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <path d="M7 17L17 7M17 7H7M17 7V17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </Link>
          </div>
        </div>

        <div className="cf-work-right">
          {projects.map((pr, i) => (
            <Link
              key={pr.slug}
              href={`/case-studies/${pr.slug}`}
              className="cf-work-card is-16x9"
              data-cursor="View case"
            >
              <div
                className="cf-card-lqip"
                aria-hidden="true"
                style={pr.card.blurDataURL ? { backgroundImage: `url(${pr.card.blurDataURL})` } : undefined}
              />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={pr.card.src}
                alt={pr.title}
                width={pr.card.width}
                height={pr.card.height}
                loading={i === 0 ? 'eager' : 'lazy'}
                decoding="async"
                onLoad={(e) => e.currentTarget.parentElement?.classList.add('is-loaded')}
              />
              <div className="cf-work-card-info">
                <div className="cf-work-card-tag">{pr.tag}</div>
                <div className="cf-work-card-cta">
                  View case
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                    <path d="M7 17L17 7M17 7H7M17 7V17" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
                  </svg>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
