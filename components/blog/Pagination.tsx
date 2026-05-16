import Link from "next/link";

type Props = {
  page: number;
  totalPages: number;
  basePath: string;
  query?: Record<string, string>;
};

function buildHref(basePath: string, query: Record<string, string>, page: number): string {
  const params = new URLSearchParams(query);
  if (page > 1) params.set("page", String(page));
  else params.delete("page");
  const qs = params.toString();
  return qs ? `${basePath}?${qs}` : basePath;
}

function pageNumbers(current: number, total: number): (number | "…")[] {
  // Show first, last, current, current±1, with ellipses.
  const out = new Set<number>();
  out.add(1);
  out.add(total);
  for (let i = current - 1; i <= current + 1; i++) {
    if (i >= 1 && i <= total) out.add(i);
  }
  const sorted = [...out].sort((a, b) => a - b);
  const result: (number | "…")[] = [];
  for (let i = 0; i < sorted.length; i++) {
    result.push(sorted[i]);
    if (i < sorted.length - 1 && sorted[i + 1] - sorted[i] > 1) result.push("…");
  }
  return result;
}

export function Pagination({ page, totalPages, basePath, query = {} }: Props) {
  if (totalPages <= 1) return null;
  const nums = pageNumbers(page, totalPages);

  return (
    <nav className="cf-pagination" aria-label="Pagination">
      {page > 1 ? (
        <Link href={buildHref(basePath, query, page - 1)} className="cf-pagination-link" data-dir="prev" rel="prev">
          ← Previous
        </Link>
      ) : (
        <span className="cf-pagination-link" data-disabled="true" aria-disabled="true">
          ← Previous
        </span>
      )}
      <ol className="cf-pagination-list">
        {nums.map((n, i) =>
          n === "…" ? (
            <li key={`e-${i}`} className="cf-pagination-ellipsis" aria-hidden>
              …
            </li>
          ) : (
            <li key={n}>
              <Link
                href={buildHref(basePath, query, n)}
                className="cf-pagination-link"
                data-active={n === page ? "true" : undefined}
                aria-current={n === page ? "page" : undefined}
              >
                {n}
              </Link>
            </li>
          ),
        )}
      </ol>
      {page < totalPages ? (
        <Link href={buildHref(basePath, query, page + 1)} className="cf-pagination-link" data-dir="next" rel="next">
          Next →
        </Link>
      ) : (
        <span className="cf-pagination-link" data-disabled="true" aria-disabled="true">
          Next →
        </span>
      )}
    </nav>
  );
}
