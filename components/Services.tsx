'use client';
import { useState } from 'react';
import type { ReactNode } from 'react';
import Link from 'next/link';

interface Service {
  n: string;
  title: ReactNode;
  desc: string;
  chip: string;
  img: string;
  accent?: boolean;
  slug: string;
}

const services: Service[] = [
  { n: '01', title: 'Web Development', desc: 'Next.js, TypeScript, edge-first stacks. Performance-obsessed.', chip: 'Flagship service', img: '/assets/web-dev.png', slug: 'web-development' },
  { n: '02', title: 'Mobile Apps', desc: 'Native iOS/Android and React Native. Shipped to the store.', chip: 'Cross-platform', img: '/assets/app-dev.png', slug: 'mobile-apps' },
  { n: '03', title: 'UI / UX Design', desc: 'Research, wireframes, and high-fidelity design systems.', chip: 'Figma native', img: '/assets/ui-dev.png', slug: 'ui-ux-design' },
  { n: '04', title: <>Brand <em>&amp; Motion</em></>, desc: 'Identity, visual systems, and motion principles that scale.', chip: 'Signature work', img: '/assets/clean.png', accent: true, slug: 'brand-motion' },
  { n: '05', title: 'WebGL / 3D', desc: 'Interactive Three.js scenes for portfolios and product stories.', chip: 'Experimental', img: '/assets/tech.png', slug: 'webgl-3d' },
  { n: '06', title: 'E-Commerce', desc: 'Shopify Plus, custom headless storefronts, and Stripe flows.', chip: 'Revenue-focused', img: '/assets/solutions.png', slug: 'ecommerce' },
];

function ServiceCard({ s, i }: { s: Service; i: number }) {
  const [hovered, setHovered] = useState(false);

  return (
    <Link
      href={`/services/${s.slug}`}
      key={i}
      className={`cf-service-cell ${s.accent ? 'accent' : ''} ${hovered ? 'is-hovered' : ''}`}
      data-cursor="Learn more"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{ textDecoration: 'none', color: 'inherit' }}
    >
      <div>
        <div className="cf-service-num">— {s.n}</div>
        <h3 className="cf-service-title" style={{ marginTop: 28 }}>{s.title}</h3>
        <p className="cf-service-desc">{s.desc}</p>
      </div>
      <div className="cf-service-foot">
        <div className="cf-service-chip">{s.chip}</div>
        <div
          className="cf-service-arrow"
          style={hovered ? {
            background: 'var(--cf-primary)',
            borderColor: 'var(--cf-primary)',
            color: '#fff',
            transform: 'rotate(-45deg)',
            boxShadow: '0 0 22px rgba(131,51,235,.5)',
          } : {}}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d="M7 17L17 7M17 7H7M17 7V17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </div>
      </div>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={s.img} alt="" className="cf-service-image" />
    </Link>
  );
}

export default function Services() {
  return (
    <section className="cf-sec cf-sec-warm" id="services">
      <div className="cf-hero-v2-grid-lines" />
      <div className="cf-grain" />
      <div className="cf-wrap">
        <div className="cf-section-head">
          <div className="left">
            <div className="cf-eyebrow">What we do</div>
            <h2 className="cf-h2">Six ways we help<br />you <em className="grad">ship work</em> that matters.</h2>
          </div>
          <div className="right">
            From brand to backend — we run the full stack of a digital studio so you never have to stitch agencies together.
          </div>
        </div>
        <div className="cf-services-grid">
          {services.map((s, i) => (
            <ServiceCard key={i} s={s} i={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
