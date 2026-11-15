import Link from 'next/link';
import { SERVICES } from '@/lib/services-data';
import { ArrowIcon } from '@/components/site/icons';

/** One-line summaries for the service list, keyed by slug. */
export const SERVICE_SUMMARY: Record<string, string> = {
  'web-development': 'Next.js, TypeScript, edge-first stacks. Performance-obsessed.',
  'mobile-apps': 'Native iOS/Android and React Native. Shipped to the store.',
  'ui-ux-design': 'Research, wireframes, and high-fidelity design systems.',
  'brand-motion': 'Identity, visual systems, and motion principles that scale.',
  'webgl-3d': 'Interactive Three.js scenes for portfolios and product stories.',
  ecommerce: 'Shopify Plus, custom headless storefronts, and Stripe flows.',
};

/** All services as hairline-separated rows; each row links to its page. */
export default function ServiceRows({ exclude }: { exclude?: string }) {
  const items = SERVICES.filter((s) => s.slug !== exclude);
  return (
    <ol className="cf-svc-rows cf-rule-list">
      {items.map((s) => (
        <li key={s.slug} data-rise="">
          <Link href={`/services/${s.slug}`} className="cf-svc-row">
            <span className="cf-svc-row-n">{s.n}</span>
            <span className="cf-svc-row-title cf-h3">{s.title}</span>
            <span className="cf-svc-row-text">{SERVICE_SUMMARY[s.slug] ?? s.sub}</span>
            <span className="cf-svc-row-meta">
              <strong>From {s.starting}</strong>
              <span>{s.timeline}</span>
            </span>
            <span className="cf-arrow-dot"><ArrowIcon size={15} className="" /></span>
          </Link>
        </li>
      ))}
    </ol>
  );
}
