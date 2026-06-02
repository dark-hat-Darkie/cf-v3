import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { CASE_STUDIES, getCaseStudy } from '@/lib/case-studies-data';
import { getScreenshotPages } from '@/lib/screenshots.server';
import CaseStudyPage from '@/components/CaseStudyPage';

type Params = Promise<{ slug: string }>;

export function generateStaticParams() {
  return CASE_STUDIES.map(c => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const study = getCaseStudy(slug);
  if (!study) return {};
  return {
    title: `${study.client} — Case study · CodeFlee Digital Studio`,
    description: study.sub,
    icons: { icon: '/assets/logo-head.svg' },
    alternates: { canonical: `/case-studies/${slug}` },
    openGraph: {
      title: `${study.client} — Case study`,
      description: study.sub,
      images: [{ url: study.heroImage }],
      type: 'article',
      url: `/case-studies/${slug}`,
    },
    twitter: {
      card: 'summary_large_image',
      title: `${study.client} — Case study`,
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
  return <CaseStudyPage study={study} screenshots={screenshots} />;
}
