import type { Metadata } from 'next';
import WorkGrid from '@/components/work/WorkGrid';
import ContactCta from '@/components/site/ContactCta';
import { site } from '@/lib/site';

const TITLE = `Work | ${site.name}`;
const DESCRIPTION = 'Case studies from the studio: what we were asked to build, the decisions behind it, and how it shipped.';

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: '/case-studies' },
  openGraph: { title: TITLE, description: DESCRIPTION, url: '/case-studies', type: 'website' },
};

export default function CaseStudiesIndexPage() {
  return (
    <>
      <section className="cf-page-hero cf-sf-cream">
        <div className="cf-container">
          <span className="cf-eyebrow">Selected work</span>
          <h1 className="cf-h1">Shipped. Tested. <span className="cf-dim">Loved.</span></h1>
          <p className="cf-lead">{DESCRIPTION}</p>
        </div>
      </section>
      <section className="cf-section cf-section--flush-top cf-sf-cream">
        <div className="cf-container">
          <WorkGrid eager />
        </div>
      </section>
      <ContactCta from="case-studies-index" />
    </>
  );
}
