import { FEATURED_PROJECTS } from '@/lib/featured-work';
import WorkCard from './WorkCard';

/** Editorial grid of case studies: the first is a wide feature, the rest pair up. */
export default function WorkGrid({ eager = false }: { eager?: boolean }) {
  return (
    <div className="cf-work-grid">
      {FEATURED_PROJECTS.map((p, i) => (
        <WorkCard key={p.slug} project={p} feature={i === 0} eager={eager && i === 0} />
      ))}
    </div>
  );
}
