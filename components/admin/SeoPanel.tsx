"use client";

import { useMemo, useState } from "react";
import type { CheckResult } from "@/lib/seo/types";
import type { AnalysisResult } from "@/lib/seo/analyzer";
import { ScoreMeter } from "./ScoreMeter";
import { CheckRow } from "./CheckRow";
import { SerpPreview } from "./SerpPreview";
import { SocialPreview } from "./SocialPreview";
import { InsightsSection } from "./InsightsSection";
import { OutlineView } from "./OutlineView";
import { InternalLinkSuggestions } from "./InternalLinkSuggestions";

type Tab = "seo" | "readability" | "schema";

const SEO_SECTIONS: { id: string; title: string; prefixes: string[] }[] = [
  { id: "keyphrase", title: "Focus keyphrase", prefixes: ["kw-"] },
  { id: "meta", title: "Title & meta", prefixes: ["title-", "meta-", "slug-"] },
  { id: "content", title: "Content structure", prefixes: ["word-", "single-", "heading-", "subheading-presence"] },
  { id: "links", title: "Links", prefixes: ["link-", "anchor-"] },
  { id: "images", title: "Images", prefixes: ["img-"] },
];

function sectionFor(id: string) {
  for (const s of SEO_SECTIONS) {
    if (s.prefixes.some((p) => id.startsWith(p))) return s.id;
  }
  return "other";
}

function severitySummary(results: CheckResult[]) {
  let bad = 0, warn = 0, good = 0;
  for (const r of results) {
    if (r.severity === "bad") bad++;
    else if (r.severity === "warn") warn++;
    else if (r.severity === "good") good++;
  }
  return { bad, warn, good };
}

export function SeoPanel({
  analysis,
  title,
  slug,
  description,
  ogTitle,
  ogDescription,
  ogImageUrl,
  siteOrigin,
  headings,
  postId,
  focusKeyword,
  onFix,
  onJumpToHeading,
  onInsertInternalLink,
}: {
  analysis: AnalysisResult;
  title: string;
  slug: string;
  description: string;
  ogTitle: string;
  ogDescription: string;
  ogImageUrl: string | null;
  siteOrigin: string;
  headings: { level: number; text: string }[];
  postId: number;
  focusKeyword: string;
  onFix: (intent: string) => void;
  onJumpToHeading?: (text: string) => void;
  onInsertInternalLink?: (slug: string, title: string) => void;
}) {
  const [tab, setTab] = useState<Tab>("seo");
  const [expanded, setExpanded] = useState<Record<string, boolean>>({ keyphrase: true, meta: true, content: true });

  const grouped = useMemo(() => {
    const map: Record<string, CheckResult[]> = {};
    for (const r of analysis.seo.results) {
      const sec = sectionFor(r.id);
      (map[sec] ||= []).push(r);
    }
    return map;
  }, [analysis.seo.results]);

  return (
    <div className="adm-editor-side">
      <div className="adm-seo-scores">
        <div className="adm-seo-score-item">
          <ScoreMeter score={analysis.seo.score} size={64} />
          <div className="adm-seo-score-label">SEO</div>
        </div>
        <div className="adm-seo-score-item">
          <ScoreMeter score={analysis.readability.score} size={64} />
          <div className="adm-seo-score-label">Readability</div>
        </div>
        <div className="adm-seo-score-item">
          <ScoreMeter score={analysis.schema.score} size={64} />
          <div className="adm-seo-score-label">Schema</div>
        </div>
      </div>

      <div className="adm-seo-tabs">
        <button type="button" className={`adm-seo-tab ${tab === "seo" ? "active" : ""}`} onClick={() => setTab("seo")}>SEO</button>
        <button type="button" className={`adm-seo-tab ${tab === "readability" ? "active" : ""}`} onClick={() => setTab("readability")}>Readability</button>
        <button type="button" className={`adm-seo-tab ${tab === "schema" ? "active" : ""}`} onClick={() => setTab("schema")}>Schema</button>
      </div>

      {tab === "seo" ? (
        <>
          {SEO_SECTIONS.map((section) => {
            const rs = grouped[section.id] ?? [];
            if (rs.length === 0) return null;
            const sum = severitySummary(rs);
            const open = expanded[section.id] ?? false;
            return (
              <div key={section.id} className="adm-seo-section">
                <div className="adm-seo-section-head" onClick={() => setExpanded((e) => ({ ...e, [section.id]: !open }))}>
                  <div className="adm-seo-section-title">{section.title}</div>
                  <div className="adm-seo-section-meta">
                    {sum.bad ? <span style={{ color: "var(--adm-error)" }}>● {sum.bad}</span> : null}
                    {sum.warn ? <span style={{ color: "var(--adm-warn)", marginLeft: 6 }}>● {sum.warn}</span> : null}
                    {sum.good ? <span style={{ color: "var(--adm-success)", marginLeft: 6 }}>● {sum.good}</span> : null}
                    <span style={{ marginLeft: 8 }}>{open ? "▾" : "▸"}</span>
                  </div>
                </div>
                {open ? rs.map((r) => <CheckRow key={r.id} result={r} onFix={onFix} />) : null}
              </div>
            );
          })}

          {headings.length > 0 ? (
            <OutlineView headings={headings} onJump={onJumpToHeading} />
          ) : null}

          {onInsertInternalLink ? (
            <InternalLinkSuggestions
              postId={postId}
              focusKeyword={focusKeyword}
              onInsert={onInsertInternalLink}
            />
          ) : null}

          <div className="adm-seo-section">
            <div className="adm-seo-section-title" style={{ marginBottom: 8 }}>SERP preview</div>
            <SerpPreview title={title} slug={slug} description={description} siteOrigin={siteOrigin} />
          </div>

          <div className="adm-seo-section">
            <div className="adm-seo-section-title" style={{ marginBottom: 8 }}>Facebook preview</div>
            <SocialPreview kind="facebook" title={ogTitle || title} description={ogDescription || description} imageUrl={ogImageUrl} siteOrigin={siteOrigin} />
          </div>

          <div className="adm-seo-section">
            <div className="adm-seo-section-title" style={{ marginBottom: 8 }}>Twitter preview</div>
            <SocialPreview kind="twitter" title={ogTitle || title} description={ogDescription || description} imageUrl={ogImageUrl} siteOrigin={siteOrigin} />
          </div>
        </>
      ) : null}

      {tab === "readability" ? (
        <>
          <div className="adm-seo-section">
            {analysis.readability.results.map((r) => <CheckRow key={r.id} result={r} />)}
          </div>
          <InsightsSection insights={analysis.insights} />
        </>
      ) : null}

      {tab === "schema" ? (
        <div className="adm-seo-section">
          {analysis.schema.results.map((r) => <CheckRow key={r.id} result={r} />)}
        </div>
      ) : null}
    </div>
  );
}
