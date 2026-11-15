import Link from 'next/link';
import type { FeaturedProject } from '@/lib/featured-work';
import { getCaseStudy } from '@/lib/case-studies-data';
import { DEMO_RESULTS } from '@/lib/demo-content';
import BrowserFrame, { displayUrl } from '@/components/ui/BrowserFrame';
import { ArrowIcon } from '@/components/site/icons';

type Props = {
  project: FeaturedProject;
  /** Wide, side-by-side layout for the lead project. */
  feature?: boolean;
  /** Load eagerly when the card is near the top of the page. */
  eager?: boolean;
  /** Small tile: image, name, tag and result only. */
  compact?: boolean;
  index?: number;
};

export default function WorkCard({ project: p, feature = false, eager = false, compact = false, index }: Props) {
  const client = p.meta[0]?.[1] ?? p.title;
  const result = DEMO_RESULTS[p.slug];

  if (compact) {
    return (
      <Link href={`/case-studies/${p.slug}`} className="cf-work-tile" data-cursor="View case study">
        <span className="cf-work-tile-img">
          <BrowserFrame
            src={p.card.src}
            alt={`${client} — website screenshot`}
            blurDataURL={p.card.blurDataURL}
            sizes="(max-width: 860px) 100vw, 420px"
            eager={eager}
            className="cf-frame--bare"
          />
        </span>
        <span className="cf-work-tile-body">
          {index ? <span className="cf-work-tile-n">0{index}</span> : null}
          <span className="cf-work-tile-name cf-h3">{client}</span>
          <span className="cf-work-tile-tag">{p.tag}</span>
          {result && <span className="cf-work-tile-stat"><strong>{result.value}</strong> {result.label}</span>}
        </span>
      </Link>
    );
  }
  return (
    <Link
      href={`/case-studies/${p.slug}`}
      className={`cf-work-card${feature ? ' cf-work-card--feature' : ''}`}
      data-cursor="View case study"
      data-rise=""
    >
      <span className="cf-work-card-stage">
        <BrowserFrame
          src={p.card.src}
          alt={`${client} — website screenshot`}
          url={displayUrl(getCaseStudy(p.slug)?.liveUrl, `${p.slug}.com`)}
          blurDataURL={p.card.blurDataURL}
          sizes={feature ? '(max-width: 900px) 100vw, 720px' : '(max-width: 900px) 100vw, 560px'}
          eager={eager}
        />
      </span>
      <span className="cf-work-card-body">
        <span className="cf-work-card-tag">{p.tag}</span>
        <span className="cf-work-card-title cf-h3">{p.title}</span>
        <span className="cf-work-card-desc">{p.desc}</span>
        {result && (
          <span className="cf-work-card-result">
            <strong>{result.value}</strong>
            <span>{result.label}</span>
          </span>
        )}
        <span className="cf-work-card-foot">
          <span className="cf-work-card-meta">
            {p.meta.slice(1).map(([k, v]) => (
              <span key={k}>{v}</span>
            ))}
          </span>
          <span className="cf-arrow-dot"><ArrowIcon size={15} className="" /></span>
        </span>
      </span>
    </Link>
  );
}
