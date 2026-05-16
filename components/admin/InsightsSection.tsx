import type { ContentInsights } from "@/lib/seo/insights";

export function InsightsSection({ insights }: { insights: ContentInsights }) {
  return (
    <div className="adm-seo-section">
      <div className="adm-seo-section-title" style={{ marginBottom: 10 }}>Content insights</div>

      {/* Grade level */}
      <div className="adm-stack" style={{ gap: 8 }}>
        <Row label="Reading grade" value={`${insights.averageGradeLevel.toFixed(1)} / Gunning-Fog ${insights.gunningFog}`} hint={gradeHint(insights.averageGradeLevel)} />
        <Row label="Read time" value={`${insights.estimatedReadMinutes} min`} />
        <Row
          label="Sentence variety"
          value={`σ ${insights.sentenceVariety.stddev} · μ ${insights.sentenceVariety.meanLength}w`}
          tone={insights.sentenceVariety.rating === "varied" ? "good" : insights.sentenceVariety.rating === "ok" ? "warn" : "bad"}
        />
      </div>

      {insights.topWords.length > 0 ? (
        <Group title="Most-used terms">
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 6 }}>
            {insights.topWords.slice(0, 8).map((w) => (
              <span key={w.word} className="adm-tag">
                {w.word} <span className="adm-mono adm-muted">×{w.count}</span>
              </span>
            ))}
          </div>
        </Group>
      ) : null}

      {insights.overusedWord ? (
        <Group title="Overused word">
          <div className="adm-seo-check-msg">
            “{insights.overusedWord.word}” appears <strong>{insights.overusedWord.count}</strong> times ({insights.overusedWord.perThousand.toFixed(0)}/1k).
          </div>
          <div className="adm-seo-check-why">Vary your wording with synonyms.</div>
        </Group>
      ) : null}

      {insights.fillers.length > 0 ? (
        <Group title="Filler words">
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 6 }}>
            {insights.fillers.map((w) => (
              <span key={w.word} className="adm-tag" style={{ background: "rgba(180,83,9,.10)", borderColor: "rgba(180,83,9,.3)", color: "var(--adm-warn)" }}>
                {w.word} <span className="adm-mono">×{w.count}</span>
              </span>
            ))}
          </div>
        </Group>
      ) : null}

      {insights.weasel.length > 0 ? (
        <Group title="Vague qualifiers">
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 6 }}>
            {insights.weasel.map((w) => (
              <span key={w.word} className="adm-tag" style={{ background: "rgba(124,58,237,0.10)", borderColor: "rgba(124,58,237,0.3)", color: "#6D28D9" }}>
                {w.word} <span className="adm-mono">×{w.count}</span>
              </span>
            ))}
          </div>
        </Group>
      ) : null}

      {insights.cliches.length > 0 ? (
        <Group title="Clichés">
          <ul style={{ margin: "6px 0 0", padding: 0, listStyle: "none" }}>
            {insights.cliches.map((c) => (
              <li key={c.phrase} className="adm-tiny" style={{ marginBottom: 3 }}>
                <span style={{ color: "var(--adm-warn)" }}>•</span> “{c.phrase}” <span className="adm-muted">×{c.count}</span>
              </li>
            ))}
          </ul>
        </Group>
      ) : null}

      {insights.redundancies.length > 0 ? (
        <Group title="Redundant phrases">
          <ul style={{ margin: "6px 0 0", padding: 0, listStyle: "none" }}>
            {insights.redundancies.map((r) => (
              <li key={r.phrase} className="adm-tiny" style={{ marginBottom: 3 }}>
                “{r.phrase}” → “<span style={{ color: "var(--adm-success)" }}>{r.suggestion}</span>”
              </li>
            ))}
          </ul>
        </Group>
      ) : null}
    </div>
  );
}

function Group({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ marginTop: 14 }}>
      <div className="adm-tiny adm-muted" style={{ textTransform: "uppercase", letterSpacing: ".1em", marginBottom: 2 }}>{title}</div>
      {children}
    </div>
  );
}

function Row({ label, value, hint, tone }: { label: string; value: string; hint?: string; tone?: "good" | "warn" | "bad" }) {
  const color =
    tone === "good" ? "var(--adm-success)" :
    tone === "warn" ? "var(--adm-warn)" :
    tone === "bad" ? "var(--adm-error)" : undefined;
  return (
    <div className="adm-row-between" style={{ alignItems: "baseline" }}>
      <span className="adm-dim adm-tiny">{label}</span>
      <span style={{ color, fontVariantNumeric: "tabular-nums", fontSize: 12 }}>{value}</span>
      {hint ? <span className="adm-tiny adm-muted" style={{ marginLeft: 8 }}>{hint}</span> : null}
    </div>
  );
}

function gradeHint(g: number) {
  if (g < 7) return "Easy — wide audience";
  if (g < 10) return "Plain English";
  if (g < 13) return "High school";
  if (g < 16) return "College";
  return "Specialist";
}
