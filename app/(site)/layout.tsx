import { Suspense, type ReactNode } from 'react';
import SiteHeader from '@/components/site/SiteHeader';
import SiteFooter from '@/components/site/SiteFooter';
import StickyContactBar from '@/components/site/StickyContactBar';
import { activeSocials, site } from '@/lib/site';

const organizationJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: site.name,
  url: site.url,
  logo: `${site.url}/assets/logo-head.svg`,
  description: site.description,
  email: site.email,
  address: {
    '@type': 'PostalAddress',
    addressLocality: site.address.locality,
    addressCountry: site.address.country,
  },
  contactPoint: {
    '@type': 'ContactPoint',
    contactType: 'sales',
    email: site.email,
    url: `${site.url}/contact`,
  },
  sameAs: activeSocials().map((s) => s.href),
};

/** Shared chrome for every public page: one header, one footer, one contact bar. */
export default function SiteLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
      />
      <a href="#main" className="cf-skip-link">Skip to content</a>
      <Suspense fallback={<div className="cf-header" style={{ height: 'var(--cf-header-h)' }} />}>
        <SiteHeader />
      </Suspense>
      <main id="main">{children}</main>
      <SiteFooter />
      <Suspense fallback={null}>
        <StickyContactBar />
      </Suspense>
    </>
  );
}
