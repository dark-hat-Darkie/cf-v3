import Link from 'next/link';
import type { ServiceData } from '@/lib/services-data';
import { SERVICES } from '@/lib/services-data';
import { FEATURED_PROJECTS } from '@/lib/featured-work';
import { contactHref, site } from '@/lib/site';
import ContactCta from './site/ContactCta';
import WorkCard from './work/WorkCard';
import ServiceRows from './services/ServiceRows';
import ServiceArt from './services/ServiceArt';
import BrowserFrame, { displayUrl } from './ui/BrowserFrame';
import { getCaseStudy } from '@/lib/case-studies-data';
import { ArrowIcon, CheckIcon } from './site/icons';

/** Case study that best shows each service. Services without one fall back to recent studio work. */
const CASE_FOR_SERVICE: Record<string, string> = {
  'web-development': 'factwatch',
  'ui-ux-design': 'iqqra',
  ecommerce: 'flipper',
};
const FALLBACK_CASE = 'tripking';

/** [CodeFlee, typical agency] */
const DIFFERENCE: [string, string][] = [
  ['Fixed-price scope, paid in milestones', 'Hourly billing surprises'],
  ['Senior engineers from kick-off to launch', 'Junior teams behind the proposal'],
  ['Bi-weekly demos and a Slack you actually want', 'Mid-project radio silence'],
  ['You own the code, repos, infra — day one', 'Locked codebase or vendor lock-in'],
  ['30 days of bug fixes baked in', '"Done" means deployed and ghosted'],
  ['One full-stack team — design through deploy', 'Sub-agencies stitched together'],
];

const PROMISES = [
  { title: 'Free discovery call', desc: 'A 30-min strategy call before you commit a dollar.' },
  { title: 'Fixed-price scope', desc: 'No hourly billing surprises. You see the number up front.' },
  { title: 'You own the code', desc: 'Source, repos, infrastructure — yours from day one.' },
  { title: '30-day post-launch', desc: 'Bug fixes and minor iterations included after we ship.' },
];

function faqs(s: ServiceData) {
  return [
    {
      q: 'How fast can you actually start?',
      a: 'Most projects kick off within 1–2 weeks of the discovery call. We accept a maximum of 2 new engagements per quarter so the team you meet is the team that ships your work — no bait-and-switch.',
    },
    {
      q: 'How is payment structured?',
      a: `50% to start, 25% at the mid-point demo, 25% at launch. We use Stripe invoices, in USD. For ${s.starting}+ engagements we can split into monthly retainers if it fits your runway better.`,
    },
    {
      q: 'What if scope changes mid-project?',
      a: 'It will. We re-scope in writing the moment something material shifts — you decide whether to extend the timeline, raise the budget, or trim. No silent meter running. No surprise invoices.',
    },
    {
      q: 'Do you sign NDAs and work in our repo?',
      a: 'Yes to both. We sign your NDA before the discovery call if needed, work directly in your GitHub/GitLab, follow your branching conventions, and join your Slack and stand-ups.',
    },
    {
      q: 'What happens after the project ships?',
      a: 'You get 30 days of included bug fixes and minor iterations. After that, we offer a flat-rate maintenance retainer or you can take it fully in-house — your code, your call. No vendor lock-in.',
    },
    {
      q: 'Can you work with our existing team?',
      a: 'That is most of what we do. We embed alongside your engineers, hand off cleanly, document everything, and pair on the parts your team wants to own going forward.',
    },
  ];
}

const SECTIONS = [
  { id: 'overview', label: 'Overview' },
  { id: 'deliverables', label: 'Deliverables' },
  { id: 'process', label: 'Process' },
  { id: 'work', label: 'Work' },
  { id: 'engagement', label: 'Engagement' },
  { id: 'faq', label: 'FAQ' },
];

export default function ServicePage({ service: s }: { service: ServiceData }) {
  const matched = CASE_FOR_SERVICE[s.slug];
  const project = FEATURED_PROJECTS.find((p) => p.slug === (matched ?? FALLBACK_CASE));
  const idx = SERVICES.findIndex((x) => x.slug === s.slug);
  const prev = SERVICES[(idx - 1 + SERVICES.length) % SERVICES.length];
  const next = SERVICES[(idx + 1) % SERVICES.length];
  const start = contactHref({ service: s.slug, from: 'service-hero' });

  return (
    <>
      {/* ───── Hero ───── */}
      <section className="cf-sv-hero cf-sf-cream">
        <div className="cf-container">
          <div className="cf-hero-meta cf-sv-meta">
            <span>({s.n} / 0{SERVICES.length})</span>
            <span><Link href="/services">Services</Link> / {s.title}</span>
            <span>{s.chip}</span>
            <span><i aria-hidden="true" />Booking now</span>
          </div>

          <h1 className="cf-h1 cf-sv-title">
            {s.headline1} <span className="cf-accent">{s.headline2}</span>
          </h1>

          <div className="cf-hero-foot">
            <p className="cf-lead">{s.sub}</p>
            <div className="cf-btn-row">
              <Link href={start} className="cf-btn cf-btn--primary cf-btn--lg">
                {site.cta.primary.label}
                <ArrowIcon />
              </Link>
              <Link href="#work" className="cf-link cf-link--strong">
                See it shipped <ArrowIcon size={13} className="" />
              </Link>
            </div>
          </div>

          <dl className="cf-sv-spec">
            <div>
              <dt>Starting from</dt>
              <dd>{s.starting}</dd>
            </div>
            <div>
              <dt>Typical timeline</dt>
              <dd>{s.timeline}</dd>
            </div>
            {s.stats.map((st) => (
              <div key={st.label}>
                <dt>{st.label}</dt>
                <dd>{st.value}</dd>
              </div>
            ))}
          </dl>

          <div className="cf-sv-visual">
            <div className="cf-sv-visual-art cf-sf-plum">
              <span className="cf-sv-visual-tag">{s.title}</span>
              <ServiceArt slug={s.slug} />
              <ul className="cf-sv-visual-tech">
                {s.tech.slice(0, 5).map((t) => (
                  <li key={t}>{t}</li>
                ))}
              </ul>
            </div>
            {project && (
              <Link href={`/case-studies/${project.slug}`} className="cf-sv-visual-shot" data-cursor="View case study">
                <BrowserFrame
                  src={project.card.src}
                  alt={`${project.meta[0][1]} — website screenshot`}
                  url={displayUrl(getCaseStudy(project.slug)?.liveUrl, `${project.slug}.com`)}
                  blurDataURL={project.card.blurDataURL}
                  sizes="(max-width: 900px) 100vw, 720px"
                  preload
                />
                <span className="cf-sv-visual-cap">
                  <strong>{project.meta[0][1]}</strong>
                  <span>{project.tag}</span>
                </span>
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* ───── In-page nav ───── */}
      <nav className="cf-sv-subnav" aria-label="On this page">
        <div className="cf-container">
          <ul>
            {SECTIONS.map((x) => (
              <li key={x.id}><a href={`#${x.id}`}>{x.label}</a></li>
            ))}
          </ul>
          <span className="cf-sv-subnav-price">From {s.starting}</span>
          <Link href={start} className="cf-btn cf-btn--primary cf-btn--sm">{site.cta.primary.label}</Link>
        </div>
      </nav>

      {/* ───── Overview ───── */}
      <section className="cf-section cf-sf-cream" id="overview">
        <div className="cf-container cf-sv-overview">
          <div className="cf-sv-overview-lead">
            <span className="cf-eyebrow cf-numbered">Overview</span>
            <p className="cf-h2">
              {s.opening.bold}
              <span className="cf-dim">{s.opening.rest}</span>
            </p>
          </div>
          <div className="cf-sv-overview-body">
            <p>{s.bodyCol1}</p>
            <p>{s.bodyCol2}</p>
            <figure className="cf-sv-pull">
              <blockquote>{s.insight}</blockquote>
              <figcaption>{s.insightSource}</figcaption>
            </figure>
          </div>
        </div>
      </section>

      {/* ───── Deliverables ───── */}
      <section className="cf-section cf-sf-paper" id="deliverables">
        <div className="cf-container">
          <div className="cf-head">
            <div>
              <span className="cf-eyebrow">What you get</span>
              <h2 className="cf-h2">Every deliverable. <span className="cf-dim">No ambiguity.</span></h2>
            </div>
            <p className="cf-lead">
              {s.deliverables.length} things you own at the end of the engagement — written into the proposal before work starts.
            </p>
          </div>
          <ol className="cf-sv-deliver">
            {s.deliverables.map((d, i) => (
              <li key={d.title} data-rise="">
                <span className="cf-sv-deliver-n">{String(i + 1).padStart(2, '0')}</span>
                <h3>{d.title}</h3>
                <p>{d.desc}</p>
              </li>
            ))}
          </ol>
          <div className="cf-sv-stack">
            <span>Technologies we work with</span>
            <ul className="cf-tag-row">
              {s.tech.map((t) => (
                <li key={t} className="cf-tag">{t}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ───── Process ───── */}
      <section className="cf-section cf-sf-plum cf-glow" id="process">
        <div className="cf-container">
          <div className="cf-head">
            <div>
              <span className="cf-eyebrow">How we work</span>
              <h2 className="cf-h2">A repeatable process. <span className="cf-dim">No surprises.</span></h2>
            </div>
            <p className="cf-sv-total">
              <strong>{s.timeline}</strong>
              <span>from kickoff to launch, with a demo at the end of every sprint.</span>
            </p>
          </div>
          <ol className="cf-sv-proc">
            {s.process.map((p) => (
              <li key={p.n} data-rise="">
                <span className="cf-sv-proc-n">{p.n}</span>
                <h3 className="cf-h3">{p.title}</h3>
                <p>{p.desc}</p>
                <span className="cf-sv-proc-dur">{p.duration}</span>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ───── Work ───── */}
      {project && (
        <section className="cf-section cf-sf-cream" id="work">
          <div className="cf-container">
            <div className="cf-head">
              <div>
                <span className="cf-eyebrow">{matched ? 'Featured work' : 'Recent work'}</span>
                <h2 className="cf-h2">
                  {matched ? <>What it looks like <span className="cf-dim">when shipped.</span></> : <>Recent work <span className="cf-dim">from the studio.</span></>}
                </h2>
              </div>
              <div className="cf-head-aside">
                <Link href="/case-studies" className="cf-link">
                  All case studies <ArrowIcon size={13} className="" />
                </Link>
              </div>
            </div>
            <div className="cf-work-grid">
              <WorkCard project={project} feature />
            </div>
          </div>
        </section>
      )}

      {/* ───── Engagement ───── */}
      <section className="cf-section cf-sf-paper" id="engagement">
        <div className="cf-container">
          <div className="cf-head">
            <div>
              <span className="cf-eyebrow">The engagement</span>
              <h2 className="cf-h2">Most agencies do this. <span className="cf-dim">We do the opposite.</span></h2>
            </div>
            <p className="cf-lead">Fixed scope, fixed price, senior people — and four promises that make this a safe yes.</p>
          </div>

          <div className="cf-sv-engage">
            <aside className="cf-sv-price cf-sf-plum">
              <span className="cf-sv-price-label">{s.title} · starting from</span>
              <p className="cf-sv-price-value">{s.starting}</p>
              <p className="cf-sv-price-sub">{s.timeline} · fixed scope · paid in milestones</p>
              <ul>
                {PROMISES.map((p) => (
                  <li key={p.title}>
                    <CheckIcon size={16} />
                    <span><strong>{p.title}</strong>{p.desc}</span>
                  </li>
                ))}
              </ul>
              <Link href={contactHref({ service: s.slug, from: 'service-engagement' })} className="cf-btn cf-btn--primary cf-btn--lg cf-btn--block">
                {site.cta.primary.label}
                <ArrowIcon />
              </Link>
              <p className="cf-sv-price-note">Final price confirmed after a free discovery call. We reply {site.replyTime}.</p>
            </aside>

            <div className="cf-compare cf-compare--flush" role="table" aria-label="CodeFlee compared with a typical agency">
              <div className="cf-compare-head" role="row">
                <span role="columnheader">CodeFlee</span>
                <span role="columnheader">Typical agency</span>
              </div>
              {DIFFERENCE.map(([us, them]) => (
                <div className="cf-compare-row" role="row" key={us}>
                  <span className="cf-compare-us" role="cell">
                    <span className="cf-compare-tick"><CheckIcon size={14} /></span>
                    {us}
                  </span>
                  <span className="cf-compare-them" role="cell">{them}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ───── FAQ ───── */}
      <section className="cf-section cf-sf-cream" id="faq">
        <div className="cf-container cf-faq-grid">
          <div className="cf-faq-intro">
            <span className="cf-eyebrow">Common questions</span>
            <h2 className="cf-h2">Let&rsquo;s answer <span className="cf-dim">the obvious ones first.</span></h2>
            <p className="cf-text">
              Direct answers to what every prospect asks before our first call. If yours isn&rsquo;t here, ask us.
            </p>
            <Link href={contactHref({ service: s.slug, from: 'service-faq' })} className="cf-link">
              Ask your own question <ArrowIcon size={13} className="" />
            </Link>
          </div>
          <div className="cf-faq">
            {faqs(s).map((f, i) => (
              <details key={f.q} open={i === 0}>
                <summary>{f.q}</summary>
                <p className="cf-faq-answer">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ───── Other services ───── */}
      <section className="cf-section cf-sf-paper">
        <div className="cf-container">
          <div className="cf-head">
            <div>
              <span className="cf-eyebrow">Explore more</span>
              <h2 className="cf-h2">Pair this with <span className="cf-dim">another discipline.</span></h2>
            </div>
            <div className="cf-head-aside">
              <Link href="/services" className="cf-link">
                View all six <ArrowIcon size={13} className="" />
              </Link>
            </div>
          </div>
          <ServiceRows exclude={s.slug} />
          <nav className="cf-sv-pager" aria-label="Other services">
            <Link href={`/services/${prev.slug}`}>
              <span>Previous service</span>
              <strong>{prev.title}</strong>
            </Link>
            <Link href={`/services/${next.slug}`}>
              <span>Next service</span>
              <strong>{next.title}</strong>
            </Link>
          </nav>
        </div>
      </section>

      <ContactCta
        service={s.slug}
        from="service-cta"
        heading={<>Ready to build something <span className="cf-dim">worth using?</span></>}
        text={`Tell us about your project. We reply ${site.replyTime} with an honest assessment and a rough scope — no sales pressure.`}
      />
    </>
  );
}
