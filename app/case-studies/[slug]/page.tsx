import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { CASE_STUDIES, getCaseStudy } from '@/lib/case-studies-data';
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
    openGraph: {
      title: `${study.client} — Case study`,
      description: study.sub,
      images: [{ url: study.heroImage }],
      type: 'article',
    },
  };
}

export default async function Page({ params }: { params: Params }) {
  const { slug } = await params;
  const study = getCaseStudy(slug);
  if (!study) notFound();
  return <CaseStudyPage study={study} />;
}
