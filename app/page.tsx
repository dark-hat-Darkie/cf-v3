import { Suspense } from 'react';
import type { Metadata } from 'next';
import AppShell from '@/components/AppShell';
import BlogHomepage from '@/components/BlogHomepage';

const SITE_URL = (process.env.SITE_URL ?? 'https://codeflee.com').replace(/\/$/, '');
const SITE_NAME = process.env.SITE_NAME ?? 'CodeFlee';

export const metadata: Metadata = {
  alternates: { canonical: '/' },
};

const organizationJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: SITE_NAME,
  url: SITE_URL,
  logo: `${SITE_URL}/assets/logo-head.svg`,
  description:
    'A senior engineering & design studio in Dhaka. From product thinking to launch-day comms — we sweat the details so your team can move.',
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Dhaka',
    addressCountry: 'BD',
  },
};

export default function Page() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
      />
      <Suspense fallback={null}>
        <AppShell blogSection={<BlogHomepage />} />
      </Suspense>
    </>
  );
}
