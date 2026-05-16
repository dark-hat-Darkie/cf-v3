"use client";

import type { AnalysisResult } from "@/lib/seo/analyzer";
import type { CheckResult } from "@/lib/seo/types";

function groupBySeverity(results: CheckResult[]) {
  const bad: CheckResult[] = [];
  const warn: CheckResult[] = [];
  for (const r of results) {
    if (r.severity === "bad") bad.push(r);
    else if (r.severity === "warn") warn.push(r);
  }
  return { bad, warn };
}

export function PrePublishChecklist({
  analysis,
  onClose,
  onPublish,
  publishing,
}: {
  analysis: AnalysisResult;
  onClose: () => void;
  onPublish: () => void;
  publishing: boolean;
}) {
  const all = [...analysis.seo.results, ...analysis.readability.results, ...analysis.schema.results];
  const { bad, warn } = groupBySeverity(all);
  const hasBlockers = bad.length > 0;

  return (
    <div className="adm-modal-backdrop" onClick={onClose}>
      <div className="adm-modal" style={{ maxWidth: 620 }} onClick={(e) => e.stopPropagation()}>
        <div className="adm-row-between" style={{ marginBottom: 4 }}>
          <h2 className="adm-modal-title">Pre-publish checklist</h2>
          <div className="adm-row" style={{ gap: 12 }}>
            <Score label="SEO" value={analysis.seo.score} />
            <Score label="Read" value={analysis.readability.score} />
            <Score label="Schema" value={analysis.schema.score} />
          </div>
        </div>

        {bad.length === 0 && warn.length === 0 ? (
          <div style={{ padding: "30px 0", textAlign: "center" }}>
            <div style={{ fontSize: 22, marginBottom: 4 }}>✓</div>
            <div>Everything looks good. You&apos;re cleared to publish.</div>
          </div>
        ) : null}

        {bad.length > 0 ? (
          <div style={{ marginTop: 14 }}>
            <div className="adm-row" style={{ gap: 8, marginBottom: 4 }}>
              <span className="adm-seo-check-dot bad" style={{ marginTop: 0 }} />
              <strong>Blockers ({bad.length})</strong>
            </div>
            <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
              {bad.map((r) => (
                <li key={r.id} className="adm-seo-check-msg" style={{ padding: "6px 0", borderBottom: "1px solid var(--adm-border)" }}>
                  <span className="adm-mono adm-muted adm-tiny" style={{ marginRight: 8 }}>{r.id}</span>
                  {r.message}
                </li>
              ))}
            </ul>
          </div>
        ) : null}

        {warn.length > 0 ? (
          <div style={{ marginTop: 14 }}>
            <div className="adm-row" style={{ gap: 8, marginBottom: 4 }}>
              <span className="adm-seo-check-dot warn" style={{ marginTop: 0 }} />
              <strong>Warnings ({warn.length})</strong>
            </div>
            <ul style={{ listStyle: "none", margin: 0, padding: 0, maxHeight: 220, overflowY: "auto" }}>
              {warn.map((r) => (
                <li key={r.id} className="adm-seo-check-msg adm-dim" style={{ padding: "6px 0", borderBottom: "1px solid var(--adm-border)" }}>
                  <span className="adm-mono adm-muted adm-tiny" style={{ marginRight: 8 }}>{r.id}</span>
                  {r.message}
                </li>
              ))}
            </ul>
          </div>
        ) : null}

        <div className="adm-modal-actions">
          <button className="adm-btn adm-btn-ghost" onClick={onClose} disabled={publishing}>
            {hasBlockers ? "Fix first" : "Cancel"}
          </button>
          <button
            className={`adm-btn ${hasBlockers ? "adm-btn-danger" : "adm-btn-primary"}`}
            onClick={onPublish}
            disabled={publishing}
          >
            {publishing ? <span className="adm-spinner" /> : null}
            {publishing
              ? "Publishing…"
              : hasBlockers
                ? `Publish anyway (${bad.length} blocker${bad.length === 1 ? "" : "s"})`
                : "Publish"}
          </button>
        </div>
      </div>
    </div>
  );
}

function Score({ label, value }: { label: string; value: number }) {
  const tone =
    value >= 75 ? "var(--adm-success)" :
    value >= 45 ? "var(--adm-warn)" :
    "var(--adm-error)";
  return (
    <span className="adm-tag" style={{ borderColor: tone, color: tone }}>
      {label} <span className="adm-mono">{value}</span>
    </span>
  );
}
