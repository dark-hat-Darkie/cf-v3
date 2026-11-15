import Link from 'next/link';
import WorkGrid from './work/WorkGrid';
import { ArrowIcon } from './site/icons';

export default function Work() {
  return (
    <section id="work" className="cf-section cf-sf-cream">
      <div className="cf-container">
        <div className="cf-head">
          <div>
            <span className="cf-eyebrow">Selected work</span>
            <h2 className="cf-h2">Shipped. Tested. <span className="cf-dim">Loved.</span></h2>
          </div>
          <div className="cf-head-aside">
            <p className="cf-lead">A quick look at projects from the last two years.</p>
            <Link href="/case-studies" className="cf-link">
              All case studies <ArrowIcon size={13} className="" />
            </Link>
          </div>
        </div>
        <WorkGrid />
      </div>
    </section>
  );
}
