import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { SERVICES, getService } from '@/lib/services-data';
import ServicePage from '@/components/ServicePage';

type Params = Promise<{ slug: string }>;

export function generateStaticParams() {
  return SERVICES.map(s => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const service = getService(slug);
  if (!service) return {};
  const title = `${service.title} — CodeFlee Digital Studio`;
  return {
    title,
    description: service.sub,
    icons: { icon: '/assets/logo-head.svg' },
    alternates: { canonical: `/services/${slug}` },
    openGraph: {
      title,
      description: service.sub,
      type: 'website',
      url: `/services/${slug}`,
    },
    twitter: { card: 'summary_large_image', title, description: service.sub },
  };
}

export default async function Page({ params }: { params: Params }) {
  const { slug } = await params;
  const service = getService(slug);
  if (!service) notFound();
  return <ServicePage service={service} />;
}
