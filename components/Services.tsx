import Link from 'next/link';
import { SERVICES } from '@/lib/services-data';
import { SERVICE_SUMMARY } from './services/ServiceRows';
import ServiceArt from './services/ServiceArt';
import { ArrowIcon } from './site/icons';

export default function Services() {
  return (
    <section className="cf-section cf-sf-paper" id="services">
      <div className="cf-container">
        <div className="cf-head">
          <div>
            <span className="cf-eyebrow">What we do</span>
            <h2 className="cf-h2">Six ways we help you <span className="cf-dim">ship work that matters.</span></h2>
          </div>
          <div className="cf-head-aside">
            <p className="cf-lead">
              From brand to backend — we run the full stack of a digital studio so you never have to stitch agencies together.
            </p>
            <Link href="/services" className="cf-link">
              All services <ArrowIcon size={13} className="" />
            </Link>
          </div>
        </div>

        <div className="cf-bento">
          {SERVICES.map((s) => (
            <Link key={s.slug} href={`/services/${s.slug}`} className="cf-bento-card" data-rise="">
              <span className="cf-bento-art"><ServiceArt slug={s.slug} /></span>
              <span className="cf-bento-body">
                <span className="cf-bento-top">
                  <span className="cf-h3">{s.title}</span>
                  <span className="cf-arrow-dot"><ArrowIcon size={15} className="" /></span>
                </span>
                <span className="cf-bento-text">{SERVICE_SUMMARY[s.slug] ?? s.sub}</span>
                <span className="cf-bento-meta">
                  <strong>From {s.starting}</strong>
                  <span>{s.timeline}</span>
                </span>
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
