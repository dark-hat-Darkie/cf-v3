import Link from "next/link";

type Props = {
  tags: { slug: string; name: string; count: number }[];
  current: string | null;
};

export function TagFilterChips({ tags, current }: Props) {
  if (!tags || tags.length === 0) return null;

  return (
    <nav className="cf-tag-chips" aria-label="Filter by tag">
      <Link
        href="/blog"
        className="cf-tag-chip"
        data-active={current == null ? "true" : undefined}
      >
        All
      </Link>
      {tags.map((t) => (
        <Link
          key={t.slug}
          href={`/blog?tag=${encodeURIComponent(t.slug)}`}
          className="cf-tag-chip"
          data-active={current === t.slug ? "true" : undefined}
        >
          {t.name}
          <span className="cf-tag-chip-count" aria-hidden>
            {t.count}
          </span>
        </Link>
      ))}
    </nav>
  );
}
