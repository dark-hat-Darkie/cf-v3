import Link from "next/link";

type Adjacent = { slug: string; title: string } | null;

type Props = {
  prev: Adjacent;
  next: Adjacent;
};

export function PostNavigation({ prev, next }: Props) {
  if (!prev && !next) return null;

  return (
    <nav className="cf-post-nav" aria-label="Previous and next post">
      {prev ? (
        <Link href={`/blog/${prev.slug}`} className="cf-post-nav-cell" data-dir="prev">
          <span className="cf-post-nav-eyebrow">← Previous</span>
          <span className="cf-post-nav-title">{prev.title}</span>
        </Link>
      ) : (
        <span className="cf-post-nav-cell cf-post-nav-cell-empty" aria-hidden />
      )}
      {next ? (
        <Link href={`/blog/${next.slug}`} className="cf-post-nav-cell" data-dir="next">
          <span className="cf-post-nav-eyebrow">Next →</span>
          <span className="cf-post-nav-title">{next.title}</span>
        </Link>
      ) : (
        <span className="cf-post-nav-cell cf-post-nav-cell-empty" aria-hidden />
      )}
    </nav>
  );
}
