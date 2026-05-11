const brand = [
  'Tailored, from scratch solutions',
  'Senior engineers only (6+ yrs)',
  'True agile — weekly shipped demos',
  'Fixed-scope, transparent pricing',
  'Dedicated project lead, always on',
];

const other = [
  'Pre-made themes & templates',
  'Juniors on your account',
  'So-called "agile" with no demos',
  'Hidden costs on change requests',
  'Account manager churn every 6 mo.',
];

export default function Compare() {
  return (
    <section className="cf-sec cf-sec-ink">
      <div className="cf-wrap">
        <div className="cf-section-head">
          <div className="left">
            <div className="cf-eyebrow">Why CodeFlee</div>
            <h2 className="cf-h2">We do the <em className="grad">boring things</em> other studios skip.</h2>
          </div>
          <div className="right" style={{ color: 'rgba(255,255,255,.55)' }}>
            The difference is never the deck. It&apos;s the 400 small decisions made well between kickoff and launch.
          </div>
        </div>
        <div className="cf-compare-grid">
          <div className="cf-compare-col brand">
            <div className="cf-compare-tag">The CodeFlee standard</div>
            <h3 className="cf-compare-heading">CodeFlee</h3>
            <ul className="cf-compare-list">
              {brand.map((b, i) => (
                <li key={i}><span className="cf-compare-icon">✓</span>{b}</li>
              ))}
            </ul>
          </div>
          <div className="cf-compare-col generic">
            <div className="cf-compare-tag">Generic agencies</div>
            <h3 className="cf-compare-heading">Typical studio</h3>
            <ul className="cf-compare-list">
              {other.map((b, i) => (
                <li key={i}><span className="cf-compare-icon">✕</span>{b}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
