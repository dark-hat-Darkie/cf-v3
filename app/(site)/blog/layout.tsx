import { Suspense, type ReactNode } from "react";

export default function BlogLayout({ children }: { children: ReactNode }) {
  return (
    <Suspense
      fallback={
        <div className="cf-blog-shell">
          <div className="cf-blog-container">
            <div className="cf-empty-state">Loading…</div>
          </div>
        </div>
      }
    >
      {children}
    </Suspense>
  );
}
