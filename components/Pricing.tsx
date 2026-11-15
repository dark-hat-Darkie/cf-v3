import Link from 'next/link';
import { contactHref } from '@/lib/site';
import { ArrowIcon, CheckIcon } from './site/icons';

const tiers = [
  { name: 'Sprint', price: '$8K', sub: 'Fixed-scope, 2-week MVP', list: ['Landing page or micro-site', '2 design directions', 'Hand-off + deploy', '1 round of revisions'] },
  { name: 'Product', price: '$24K', sub: 'From 6 weeks, ships weekly', list: ['Full product build', 'Design system + motion', 'Analytics & QA', 'Weekly demos'], featured: true },
  { name: 'Retainer', price: '$12K', sub: 'Per month · rolling', list: ['Dedicated senior team', 'Roadmap + experiments', 'Async + weekly sync', 'Cancel anytime'] },
];

export default function Pricing() {
  return (
    <section className="cf-section cf-sf-paper" id="pricing">
      <div className="cf-container">
        <div className="cf-head">
          <div>
            <span className="cf-eyebrow">Transparent pricing</span>
            <h2 className="cf-h2">Pick the shape <span className="cf-dim">that fits.</span></h2>
          </div>
          <div className="cf-head-aside">
            <p className="cf-lead">
              All tiers include senior engineers, weekly shipped demos, and a dedicated project lead. No trial. No lock-in.
            </p>
            <Link href={contactHref({ from: 'pricing-quote' })} className="cf-link">
              Get a custom quote <ArrowIcon size={13} className="" />
            </Link>
          </div>
        </div>

        <div className="cf-tiers">
          {tiers.map((t) => (
            <div key={t.name} className={`cf-tier${t.featured ? ' cf-tier--featured' : ''}`} data-rise="">
              <div className="cf-tier-top">
                <h3 className="cf-tier-name">{t.name}</h3>
                {t.featured && <span className="cf-tier-flag">Most popular</span>}
              </div>
              <p className="cf-tier-price">
                <span className="cf-tier-from">from</span> {t.price}
              </p>
              <p className="cf-tier-sub">{t.sub}</p>
              <ul className="cf-tier-list">
                {t.list.map((l) => (
                  <li key={l}><CheckIcon size={16} />{l}</li>
                ))}
              </ul>
              <Link
                className={`cf-btn cf-btn--block ${t.featured ? 'cf-btn--primary' : 'cf-btn--secondary'}`}
                href={contactHref({ from: `pricing-${t.name.toLowerCase()}` })}
              >
                Start a project
              </Link>
            </div>
          ))}
        </div>
        <p className="cf-tiers-note">
          Every project is unique — these are starting points. Send a short brief and we&apos;ll scope yours.
        </p>
      </div>
    </section>
  );
}
