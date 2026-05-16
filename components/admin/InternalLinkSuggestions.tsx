"use client";

import { useEffect, useState, useTransition } from "react";
import { suggestInternalLinksAction, type InternalLinkSuggestion } from "@/app/(admin)/admin/(app)/posts/internal-links";

export function InternalLinkSuggestions({
  postId,
  focusKeyword,
  onInsert,
}: {
  postId: number;
  focusKeyword: string;
  onInsert: (slug: string, title: string) => void;
}) {
  const [items, setItems] = useState<InternalLinkSuggestion[]>([]);
  const [pending, start] = useTransition();

  useEffect(() => {
    if (!focusKeyword.trim()) {
      setItems([]);
      return;
    }
    const t = setTimeout(() => {
      start(async () => {
        const list = await suggestInternalLinksAction(postId, focusKeyword);
        setItems(list);
      });
    }, 500);
    return () => clearTimeout(t);
  }, [postId, focusKeyword]);

  if (!focusKeyword.trim()) return null;

  return (
    <div className="adm-seo-section">
      <div className="adm-row-between" style={{ marginBottom: 6 }}>
        <div className="adm-seo-section-title">Internal link suggestions</div>
        {pending ? <span className="adm-spinner" /> : null}
      </div>
      {items.length === 0 ? (
        <div className="adm-seo-check-why" style={{ marginLeft: 0 }}>
          No other published posts mention this keyphrase yet.
        </div>
      ) : (
        <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
          {items.map((it) => (
            <li key={it.id} className="adm-row" style={{ justifyContent: "space-between", padding: "6px 0", borderBottom: "1px solid var(--adm-border)" }}>
              <div className="adm-flex1 adm-truncate" style={{ fontSize: 12.5 }}>
                {it.title || it.slug}
                <div className="adm-tiny adm-muted adm-truncate adm-mono">/blog/{it.slug}</div>
              </div>
              <button
                type="button"
                className="adm-btn adm-btn-sm"
                onClick={() => onInsert(it.slug, it.title || it.slug)}
                title="Insert link at cursor"
              >
                Link →
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
