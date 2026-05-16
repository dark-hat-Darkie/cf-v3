"use client";

export function OutlineView({
  headings,
  onJump,
}: {
  headings: { level: number; text: string }[];
  onJump?: (text: string) => void;
}) {
  // Detect hierarchy skips
  const flagged = new Set<number>();
  let prev = 1;
  headings.forEach((h, i) => {
    if (h.level > prev + 1) flagged.add(i);
    prev = h.level;
  });

  return (
    <div className="adm-seo-section">
      <div className="adm-seo-section-title" style={{ marginBottom: 6 }}>Outline · {headings.length}</div>
      <ul style={{ listStyle: "none", margin: 0, padding: 0, fontSize: 12.5, lineHeight: 1.5 }}>
        {headings.map((h, i) => (
          <li
            key={i}
            style={{
              paddingLeft: (h.level - 1) * 12,
              marginBottom: 2,
              color: flagged.has(i) ? "var(--adm-warn)" : "var(--adm-fg-dim)",
              cursor: onJump ? "pointer" : "default",
            }}
            onClick={() => onJump?.(h.text)}
            title={flagged.has(i) ? `Skips a level (jumps to H${h.level})` : h.text}
          >
            <span className="adm-mono adm-muted" style={{ marginRight: 6 }}>H{h.level}</span>
            <span>{h.text || <span className="adm-muted">(empty)</span>}</span>
            {flagged.has(i) ? <span style={{ marginLeft: 6, color: "var(--adm-warn)" }}>↯</span> : null}
          </li>
        ))}
      </ul>
    </div>
  );
}
