'use client';
import { MagneticButton } from './MagneticButton';

const tiers = [
  { name: 'Sprint', price: '$8K', sub: 'Fixed-scope, 2-week MVP', list: ['Landing page or micro-site', '2 design directions', 'Hand-off + deploy', '1 round of revisions'] },
  { name: 'Product', price: '$24K', sub: 'From 6 weeks, ships weekly', list: ['Full product build', 'Design system + motion', 'Analytics & QA', 'Weekly demos'], featured: true },
  { name: 'Retainer', price: '$12K', sub: 'Per month · rolling', list: ['Dedicated senior team', 'Roadmap + experiments', 'Async + weekly sync', 'Cancel anytime'] },
];

function scrollToContact() {
  document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
}

export default function Pricing() {
  return (
    <section className="cf-sec cf-sec-light" id="pricing">
      <div className="cf-wrap">
        <div className="cf-section-head">
          <div className="left">
            <div className="cf-eyebrow">Transparent pricing</div>
            <h2 className="cf-h2">Pick the <em className="grad">shape</em> that fits.</h2>
          </div>
          <div className="right">
            All tiers include senior engineers, weekly shipped demos, and a dedicated project lead. No trial. No lock-in.
          </div>
        </div>
        <div className="cf-pricing">
          <div className="cf-pricing-intro">
            <div className="cf-pricing-name">Starts from</div>
            <div style={{ fontFamily: 'var(--font-creato-display)', fontWeight: 100, fontSize: 64, letterSpacing: '-0.02em', marginTop: 16, lineHeight: 1 }}>$8K</div>
            <p style={{ fontSize: 14, color: 'var(--cf-muted)', marginTop: 18, lineHeight: 1.5 }}>
              Every project is unique — these are starting points. We&apos;ll scope yours in a 30-minute call.
            </p>
            <MagneticButton className="cf-pricing-cta" style={{ marginTop: 24 }} onClick={scrollToContact}>
              Get a custom quote <span>↗</span>
            </MagneticButton>
          </div>
          {tiers.map((t, i) => (
            <div key={i} className={`cf-pricing-tier ${t.featured ? 'featured' : ''}`}>
              {t.featured && <div className="cf-pricing-badge">Most popular</div>}
              <div className="cf-pricing-name">{t.name}</div>
              <div className="cf-pricing-price">{t.price}<small>{t.sub}</small></div>
              <ul className="cf-pricing-list">
                {t.list.map((l, j) => <li key={j}>{l}</li>)}
              </ul>
              <MagneticButton
                className={`cf-pricing-cta${t.featured ? ' cf-pricing-cta-featured' : ''}`}
                onClick={scrollToContact}
              >
                Book a call ↗
              </MagneticButton>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
