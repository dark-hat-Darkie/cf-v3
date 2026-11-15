import Link from 'next/link';
import { FEATURED_PROJECTS } from '@/lib/featured-work';
import { DEMO_CLIENTS } from '@/lib/demo-content';
import { contactHref, site } from '@/lib/site';
import WorkCard from './work/WorkCard';
import { ArrowIcon } from './site/icons';

const STATS = [
  { value: '60+', label: 'Products shipped' },
  { value: '12', label: 'Countries' },
  { value: '98%', label: 'Repeat clients' },
  { value: '4.9', label: 'Clutch rating' },
];

/** Projects shown directly under the hero. */
const LEAD = ['factwatch', 'flipper', 'tripking'];

export default function Hero() {
  const lead = LEAD.map((slug) => FEATURED_PROJECTS.find((p) => p.slug === slug)).filter(
    (p): p is (typeof FEATURED_PROJECTS)[number] => Boolean(p),
  );

  return (
    <section className="cf-hero cf-sf-cream" id="hero">
      <div className="cf-container">
        <div className="cf-hero-meta">
          <span>(00)</span>
          <span>Design &amp; engineering studio</span>
          <span>Dhaka, worldwide</span>
          <span><i aria-hidden="true" />2 spots open · Q3 2026</span>
        </div>

        <h1 className="cf-h1 cf-hero-title">
          Products founders trust, built by a team that ships <span className="cf-accent">every week.</span>
        </h1>

        <div className="cf-hero-foot">
          <p className="cf-lead">{site.description}</p>
          <div className="cf-btn-row">
            <Link href={contactHref({ from: 'home-hero' })} className="cf-btn cf-btn--primary cf-btn--lg">
              {site.cta.primary.label}
              <ArrowIcon />
            </Link>
            <Link href="/case-studies" className="cf-link cf-link--strong">
              See our work <ArrowIcon size={13} className="" />
            </Link>
          </div>
        </div>

        <dl className="cf-stats cf-hero-stats">
          {STATS.map((s) => (
            <div key={s.label} className="cf-stat">
              <dd className="cf-stat-value">{s.value}</dd>
              <dt className="cf-stat-desc">{s.label}</dt>
            </div>
          ))}
        </dl>

        <div className="cf-hero-work">
          {lead.map((p, i) => (
            <WorkCard key={p.slug} project={p} eager compact index={i + 1} />
          ))}
        </div>

        <div className="cf-logos">
          <span className="cf-logos-label">Trusted by teams at</span>
          <ul>
            {DEMO_CLIENTS.map((c) => (
              <li key={c}>{c}</li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
