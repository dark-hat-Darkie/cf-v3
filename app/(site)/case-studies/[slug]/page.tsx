import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { CASE_STUDIES, getCaseStudy } from '@/lib/case-studies-data';
import { getScreenshotPages } from '@/lib/screenshots.server';
import CaseStudyPage from '@/components/CaseStudyPage';
import { site } from '@/lib/site';

type Params = Promise<{ slug: string }>;

export function generateStaticParams() {
  return CASE_STUDIES.map(c => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const study = getCaseStudy(slug);
  if (!study) return {};
  return {
    title: `${study.client} | Case study · CodeFlee Digital Studio`,
    description: study.sub,
    alternates: { canonical: `/case-studies/${slug}` },
    openGraph: {
      title: `${study.client} | Case study`,
      description: study.sub,
      images: [{ url: study.heroImage }],
      type: 'article',
      url: `/case-studies/${slug}`,
    },
    twitter: {
      card: 'summary_large_image',
      title: `${study.client} | Case study`,
      description: study.sub,
      images: [study.heroImage],
    },
  };
}

export default async function Page({ params }: { params: Params }) {
  const { slug } = await params;
  const study = getCaseStudy(slug);
  if (!study) notFound();
  const screenshots = getScreenshotPages(slug);
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    name: `${study.client}, case study`,
    headline: `${study.headline1} ${study.headline2}`,
    description: study.sub,
    url: `${site.url}/case-studies/${study.slug}`,
    image: `${site.url}${study.heroImage}`,
    creator: { '@type': 'Organization', name: site.name, url: site.url },
  };
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <CaseStudyPage study={study} screenshots={screenshots} />
    </>
  );
}
