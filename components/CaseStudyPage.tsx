import Image from 'next/image';
import Link from 'next/link';
import type { CaseOutcomeStat, CaseScreenshotPage, CaseStudyData } from '@/lib/case-studies-data';
import { CASE_STUDIES } from '@/lib/case-studies-data';
import { SERVICES } from '@/lib/services-data';
import { FEATURED_PROJECTS } from '@/lib/featured-work';
import { DEMO_CASES } from '@/lib/demo-content';
import { contactHref, site } from '@/lib/site';
import ContactCta from './site/ContactCta';
import ShowcaseGallery from './case-study/ShowcaseGallery';
import WorkCard from './work/WorkCard';
import BrowserFrame, { displayUrl } from './ui/BrowserFrame';
import { ArrowIcon, CheckIcon } from './site/icons';

/** Unverified placeholders are never shown. */
function isReal(s: CaseOutcomeStat | undefined): s is CaseOutcomeStat {
  if (!s) return false;
  const v = s.value.trim();
  return v !== '' && v !== '-' && !s.label.trim().toUpperCase().startsWith('TODO');
}

/** Case-study service labels → the service page that covers them. */
const SERVICE_FOR_LABEL: Record<string, string> = {
  Web: 'web-development',
  Product: 'web-development',
  Design: 'ui-ux-design',
  Payments: 'ecommerce',
  Bookings: 'ecommerce',
};

export default function CaseStudyPage({ study: c, screenshots = [] }: { study: CaseStudyData; screenshots?: CaseScreenshotPage[] }) {
  const d = DEMO_CASES[c.slug];
  const heroStats = c.heroStats.filter(isReal);
  const outcomeStats = c.outcome.stats.filter(isReal);
  const heroStat = isReal(c.outcome.heroStat) ? c.outcome.heroStat : null;
  const hasOutcome = Boolean(heroStat) || outcomeStats.length > 0 || Boolean(d?.compare.length);
  const t = c.testimonial;
  const index = CASE_STUDIES.findIndex((x) => x.slug === c.slug);

  const serviceSlugs = [...new Set(c.services.map((l) => SERVICE_FOR_LABEL[l]).filter(Boolean))];
  const relatedServices = SERVICES.filter((s) => serviceSlugs.includes(s.slug));
  const more = FEATURED_PROJECTS.filter((p) => p.slug !== c.slug).slice(0, 2);

  const sections = [
    { id: 'summary', label: 'Summary' },
    ...(d ? [{ id: 'built', label: 'What we built' }] : []),
    { id: 'approach', label: 'Approach' },
    ...(screenshots.length ? [{ id: 'screens', label: 'Screens' }] : []),
    ...(hasOutcome ? [{ id: 'results', label: 'Results' }] : []),
    ...(d ? [{ id: 'takeaways', label: 'Takeaways' }] : []),
  ];
  const start = contactHref({ from: `case-study-${c.slug}` });

  return (
    <>
      {/* ───── Hero ───── */}
      <section className="cf-sv-hero cf-sf-cream">
        <div className="cf-container">
          <div className="cf-hero-meta cf-sv-meta">
            <span>(0{index + 1} / 0{CASE_STUDIES.length})</span>
            <span><Link href="/case-studies">Work</Link> / {c.client}</span>
            <span>{c.sector}</span>
            <span><i aria-hidden="true" />{c.year}</span>
          </div>

          <h1 className="cf-h1 cf-sv-title cf-cs-title">
            {c.headline1} <span className="cf-accent">{c.headline2}</span>
          </h1>

          <div className="cf-hero-foot">
            <p className="cf-lead">{c.sub}</p>
            <div className="cf-btn-row">
              {c.liveUrl && (
                <a href={c.liveUrl} className="cf-btn cf-btn--primary cf-btn--lg" target="_blank" rel="noopener noreferrer">
                  Visit live site
                  <ArrowIcon />
                </a>
              )}
              <Link href={start} className="cf-link cf-link--strong">
                Start a similar project <ArrowIcon size={13} className="" />
              </Link>
            </div>
          </div>

          <dl className="cf-sv-spec">
            <div><dt>Client</dt><dd>{c.client.length > 16 ? c.client.split(' ').slice(0, 2).join(' ') : c.client}</dd></div>
            <div><dt>Services</dt><dd>{c.services.join(' · ')}</dd></div>
            <div><dt>Duration</dt><dd>{d?.duration ?? '-'}</dd></div>
            <div><dt>Team</dt><dd>{d?.team ?? '-'}</dd></div>
            <div><dt>Year</dt><dd>{c.year}</dd></div>
          </dl>

          <div className="cf-cs-cover">
            <BrowserFrame
              src={c.heroImage}
              alt={`${c.client}, homepage`}
              url={displayUrl(c.liveUrl, `${c.slug}.com`)}
              sizes="(max-width: 1280px) 100vw, 1240px"
              preload
            />
          </div>

          {heroStats.length > 0 && (
            <dl className="cf-stats cf-cs-herostats">
              {heroStats.map((s) => (
                <div key={s.label} className="cf-stat">
                  <dd className="cf-stat-value">{s.value}</dd>
                  <dt className="cf-stat-desc">{s.label}</dt>
                </div>
              ))}
              {d && (
                <div className="cf-stat">
                  <dd className="cf-stat-value">{d.duration.replace(' weeks', '')}<sup>wks</sup></dd>
                  <dt className="cf-stat-desc">From kickoff to launch</dt>
                </div>
              )}
            </dl>
          )}
        </div>
      </section>

      {/* ───── In-page nav ───── */}
      <nav className="cf-sv-subnav" aria-label="On this page">
        <div className="cf-container">
          <ul>
            {sections.map((x) => (
              <li key={x.id}><a href={`#${x.id}`}>{x.label}</a></li>
            ))}
          </ul>
          <span className="cf-sv-subnav-price">{c.client}</span>
          <Link href={start} className="cf-btn cf-btn--primary cf-btn--sm">{site.cta.primary.label}</Link>
        </div>
      </nav>

      {/* ───── At a glance ───── */}
      <section className="cf-section cf-sf-cream" id="summary">
        <div className="cf-container">
          <div className="cf-head">
            <div>
              <span className="cf-eyebrow">At a glance</span>
              <h2 className="cf-h2">The project <span className="cf-dim">in one minute.</span></h2>
            </div>
            <p className="cf-lead">The short version, for anyone who needs the story before the detail.</p>
          </div>
          <div className="cf-cs-glance">
            <article>
              <span className="cf-cs-glance-k">Challenge</span>
              <p>{c.challenge.lead}</p>
            </article>
            <article>
              <span className="cf-cs-glance-k">Solution</span>
              <p>{d?.solution ?? c.sub}</p>
            </article>
            <article className="cf-sf-plum">
              <span className="cf-cs-glance-k">Result</span>
              <p>{c.outcome.lead}</p>
            </article>
          </div>
        </div>
      </section>

      {/* ───── Brief + goals ───── */}
      <section className="cf-section cf-sf-paper">
        <div className="cf-container cf-sv-overview">
          <div className="cf-sv-overview-lead">
            <span className="cf-eyebrow cf-numbered">The brief</span>
            <p className="cf-h2">{c.challenge.lead}</p>
          </div>
          <div className="cf-sv-overview-body">
            <p>{c.challenge.col1}</p>
            <p>{c.challenge.col2}</p>
            {d && (
              <div className="cf-cs-goals">
                <h3>What success looked like</h3>
                <ol>
                  {d.goals.map((g, i) => (
                    <li key={g}><span>0{i + 1}</span>{g}</li>
                  ))}
                </ol>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ───── What we built ───── */}
      {d && (
        <section className="cf-section cf-sf-cream" id="built">
          <div className="cf-container">
            <div className="cf-head">
              <div>
                <span className="cf-eyebrow">What we built</span>
                <h2 className="cf-h2">Six parts, <span className="cf-dim">one product.</span></h2>
              </div>
              <p className="cf-lead">{d.platform}. Everything below shipped in the first release.</p>
            </div>
            <ol className="cf-sv-deliver cf-cs-built">
              {d.features.map((f, i) => (
                <li key={f.title} data-rise="">
                  <span className="cf-sv-deliver-n">{String(i + 1).padStart(2, '0')}</span>
                  <h3>{f.title}</h3>
                  <p>{f.desc}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>
      )}

      {/* ───── Approach + timeline + team ───── */}
      <section className="cf-section cf-sf-plum cf-glow" id="approach">
        <div className="cf-container">
          <div className="cf-head">
            <div>
              <span className="cf-eyebrow">The approach</span>
              <h2 className="cf-h2">The decisions <span className="cf-dim">behind the work.</span></h2>
            </div>
            {d && (
              <p className="cf-sv-total">
                <strong>{d.duration}</strong>
                <span>from kickoff to launch, with a {d.team.replace(' people', '-person')} senior team.</span>
              </p>
            )}
          </div>
          <ol className="cf-sv-proc">
            {c.approach.map((a) => (
              <li key={a.n} data-rise="">
                <span className="cf-sv-proc-n">{a.n}</span>
                <h3 className="cf-h3">{a.title}</h3>
                <p>{a.desc}</p>
                <span className="cf-sv-proc-dur">{a.phase}</span>
              </li>
            ))}
          </ol>

          {d && (
            <div className="cf-cs-plan">
              <div>
                <h3 className="cf-cs-plan-title">Timeline</h3>
                <ol className="cf-cs-timeline">
                  {d.timeline.map((p) => (
                    <li key={p.phase}>
                      <span className="cf-cs-timeline-w">{p.weeks}</span>
                      <strong>{p.phase}</strong>
                      <p>{p.text}</p>
                    </li>
                  ))}
                </ol>
              </div>
              <div>
                <h3 className="cf-cs-plan-title">Who worked on it</h3>
                <ul className="cf-cs-roles">
                  {d.roles.map((r) => (
                    <li key={r.who + r.role}><span>{r.role}</span><strong>{r.who}</strong></li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ───── Screens ───── */}
      {screenshots.length > 0 && (
        <section className="cf-section cf-sf-cream" id="screens">
          <div className="cf-container">
            <div className="cf-head">
              <div>
                <span className="cf-eyebrow">In the wild</span>
                <h2 className="cf-h2">See the <span className="cf-dim">whole thing.</span></h2>
              </div>
              <p className="cf-lead">
                Each screen is the full page, top to bottom. Open any one to scroll the entire design.
              </p>
            </div>
            <ShowcaseGallery client={c.client} screenshots={screenshots} />
          </div>
        </section>
      )}

      {/* ───── Results ───── */}
      {hasOutcome && (
        <section className="cf-section cf-sf-paper" id="results">
          <div className="cf-container">
            <div className="cf-head">
              <div>
                <span className="cf-eyebrow">The result</span>
                <h2 className="cf-h2">{c.outcome.lead}</h2>
              </div>
            </div>
            <div className={`cf-cs-results${heroStat || outcomeStats.length > 0 ? '' : ' cf-cs-results--solo'}`}>
              {(heroStat || outcomeStats.length > 0) && (
              <div className="cf-cs-results-main cf-sf-plum">
                {heroStat && (
                  <p className="cf-cs-bigstat">
                    <strong>{heroStat.value}</strong>
                    <span>{heroStat.label}</span>
                  </p>
                )}
                {outcomeStats.length > 0 && (
                  <dl className="cf-cs-ledger">
                    {outcomeStats.map((s) => (
                      <div key={s.label}><dt>{s.label}</dt><dd>{s.value}</dd></div>
                    ))}
                  </dl>
                )}
              </div>
              )}
              {d && (
                <div className="cf-cs-ba" role="table" aria-label="Before and after">
                  <div className="cf-cs-ba-head" role="row">
                    <span role="columnheader">Measure</span><span role="columnheader">Before</span><span role="columnheader">After</span>
                  </div>
                  {d.compare.map((r) => (
                    <div className="cf-cs-ba-row" role="row" key={r.metric}>
                      <span role="cell">{r.metric}</span>
                      <span role="cell">{r.before}</span>
                      <span role="cell"><CheckIcon size={14} />{r.after}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* ───── Quote ───── */}
      <section className="cf-section cf-sf-cream">
        <div className="cf-container">
          <figure className="cf-cs-quote">
            <blockquote>&ldquo;{t.quote}&rdquo;</blockquote>
            <figcaption>
              {t.avatar && (
                <span className="cf-quote-avatar"><Image src={t.avatar} alt="" width={56} height={56} /></span>
              )}
              <span>
                <span className="cf-quote-name">{t.name}</span>
                <span className="cf-quote-role">{[t.role, t.company].filter(Boolean).join(' · ')}</span>
              </span>
            </figcaption>
          </figure>
        </div>
      </section>

      {/* ───── Takeaways ───── */}
      {d && (
        <section className="cf-section cf-sf-paper" id="takeaways">
          <div className="cf-container">
            <div className="cf-head">
              <div>
                <span className="cf-eyebrow">Takeaways</span>
                <h2 className="cf-h2">What we&apos;d tell <span className="cf-dim">another team.</span></h2>
              </div>
              <p className="cf-lead">Three things this project taught us that we now bring to every engagement.</p>
            </div>
            <ol className="cf-cs-takeaways">
              {d.takeaways.map((x, i) => (
                <li key={x.title} data-rise="">
                  <span>0{i + 1}</span>
                  <h3 className="cf-h3">{x.title}</h3>
                  <p>{x.text}</p>
                </li>
              ))}
            </ol>

            <div className="cf-cs-used">
              <div>
                <h3 className="cf-cs-plan-title">Services on this project</h3>
                <ul className="cf-cs-used-list">
                  {relatedServices.map((s) => (
                    <li key={s.slug}>
                      <Link href={`/services/${s.slug}`}>
                        <span>{s.n}</span>
                        <strong>{s.title}</strong>
                        <em>From {s.starting}</em>
                        <ArrowIcon size={14} className="" />
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="cf-cs-plan-title">Built with</h3>
                <ul className="cf-tag-row">
                  {c.tech.map((x) => (
                    <li key={x} className="cf-tag">{x}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ───── More work ───── */}
      <section className="cf-section cf-sf-cream">
        <div className="cf-container">
          <div className="cf-head">
            <div>
              <span className="cf-eyebrow">More work</span>
              <h2 className="cf-h2">Keep <span className="cf-dim">looking.</span></h2>
            </div>
            <div className="cf-head-aside">
              <Link href="/case-studies" className="cf-link">
                All case studies <ArrowIcon size={13} className="" />
              </Link>
            </div>
          </div>
          <div className="cf-work-grid">
            {more.map((p) => (
              <WorkCard key={p.slug} project={p} />
            ))}
          </div>
        </div>
      </section>

      <ContactCta
        from={`case-study-${c.slug}`}
        heading={<>Want results <span className="cf-dim">like these?</span></>}
        text={`Tell us what you're building. We reply ${site.replyTime}. No commitment, no sales pitch.`}
      />
    </>
  );
}
