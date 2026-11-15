import Link from 'next/link';
import { DEMO_FAQ } from '@/lib/demo-content';
import { contactHref } from '@/lib/site';
import { ArrowIcon } from './site/icons';

export default function HomeFaq() {
  return (
    <section className="cf-section cf-sf-cream" id="faq">
      <div className="cf-container cf-faq-grid">
        <div className="cf-faq-intro">
          <span className="cf-eyebrow">Questions</span>
          <h2 className="cf-h2">Before you <span className="cf-dim">get in touch.</span></h2>
          <p className="cf-text">The things founders usually ask us on the first call, answered up front.</p>
          <Link href={contactHref({ from: 'home-faq' })} className="cf-link">
            Ask something else <ArrowIcon size={13} className="" />
          </Link>
        </div>
        <div className="cf-faq">
          {DEMO_FAQ.map((f, i) => (
            <details key={f.q} open={i === 0}>
              <summary>{f.q}</summary>
              <p className="cf-faq-answer">{f.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
