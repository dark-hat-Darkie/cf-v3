type Props = {
  score: number; // 0..100
  size?: number;
  label?: string;
};

function tier(score: number): "good" | "warn" | "bad" {
  if (score >= 75) return "good";
  if (score >= 45) return "warn";
  return "bad";
}

export function ScoreMeter({ score, size = 56, label }: Props) {
  const r = (size - 6) / 2;
  const c = 2 * Math.PI * r;
  const clamped = Math.max(0, Math.min(100, Math.round(score)));
  const dash = c * (1 - clamped / 100);
  const cls = tier(clamped);

  return (
    <div className={`adm-score ${cls}`} style={{ width: size, height: size, fontSize: size > 60 ? 18 : 13 }}>
      <svg width={size} height={size}>
        <circle className="adm-score-track" cx={size / 2} cy={size / 2} r={r} />
        <circle
          className="adm-score-bar"
          cx={size / 2}
          cy={size / 2}
          r={r}
          strokeDasharray={c}
          strokeDashoffset={dash}
        />
      </svg>
      <span>{clamped}</span>
      {label ? <span className="adm-tiny adm-muted" style={{ marginTop: 2 }}>{label}</span> : null}
    </div>
  );
}
