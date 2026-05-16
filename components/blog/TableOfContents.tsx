"use client";

import { useEffect, useState } from "react";
import type { TocHeading } from "@/lib/editor/toc";

type Props = {
  headings: TocHeading[];
};

export function TableOfContents({ headings }: Props) {
  const [activeId, setActiveId] = useState<string | null>(headings[0]?.id ?? null);

  useEffect(() => {
    if (!headings.length) return;
    const elements = headings
      .map((h) => document.getElementById(h.id))
      .filter((el): el is HTMLElement => el != null);
    if (!elements.length) return;

    let lastActive: string | null = activeId;
    const visible = new Map<string, number>(); // id → intersectionRatio

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const id = entry.target.id;
          if (entry.isIntersecting) {
            visible.set(id, entry.intersectionRatio);
          } else {
            visible.delete(id);
          }
        }

        if (visible.size > 0) {
          // Pick the topmost visible heading (matches document order).
          for (const h of headings) {
            if (visible.has(h.id)) {
              if (h.id !== lastActive) {
                lastActive = h.id;
                setActiveId(h.id);
              }
              return;
            }
          }
        }
      },
      { rootMargin: "-30% 0px -60% 0px", threshold: [0, 0.5, 1] },
    );

    for (const el of elements) observer.observe(el);
    return () => observer.disconnect();
  }, [headings, activeId]);

  if (headings.length === 0) return null;

  const reducedMotion =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const onClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    e.preventDefault();
    el.scrollIntoView({ behavior: reducedMotion ? "auto" : "smooth", block: "start" });
    history.replaceState(null, "", `#${id}`);
  };

  return (
    <nav className="cf-toc" aria-label="Table of contents">
      <div className="cf-toc-title">On this page</div>
      <ol className="cf-toc-list">
        {headings.map((h) => (
          <li
            key={h.id}
            className="cf-toc-item"
            data-level={h.level}
          >
            <a
              href={`#${h.id}`}
              className="cf-toc-link"
              aria-current={activeId === h.id ? "location" : undefined}
              onClick={(e) => onClick(e, h.id)}
            >
              {h.text}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
