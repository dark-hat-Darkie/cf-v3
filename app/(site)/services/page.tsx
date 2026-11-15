import type { Metadata } from 'next';
import ServiceRows from '@/components/services/ServiceRows';
import ContactCta from '@/components/site/ContactCta';
import { site } from '@/lib/site';

const TITLE = `Services — ${site.name}`;
const DESCRIPTION =
  'From brand to backend — we run the full stack of a digital studio so you never have to stitch agencies together.';

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: '/services' },
  openGraph: { title: TITLE, description: DESCRIPTION, url: '/services', type: 'website' },
};

export default function ServicesIndexPage() {
  return (
    <>
      <section className="cf-page-hero cf-sf-cream">
        <div className="cf-container">
          <span className="cf-eyebrow">What we do</span>
          <h1 className="cf-h1">Six ways we help you <span className="cf-dim">ship work that matters.</span></h1>
          <p className="cf-lead">{DESCRIPTION}</p>
        </div>
      </section>
      <section className="cf-section cf-section--flush-top cf-sf-cream">
        <div className="cf-container">
          <ServiceRows />
        </div>
      </section>
      <ContactCta from="services-index" />
    </>
  );
}
