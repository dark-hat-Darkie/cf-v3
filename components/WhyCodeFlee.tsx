import { CheckIcon } from './site/icons';

const STATS = [
  { value: '60', suffix: '+', label: 'Products shipped', desc: 'From MVPs to Series-B platforms.' },
  { value: '12', suffix: '', label: 'Countries served', desc: 'US · UK · UAE · AU · CA · DE · BD.' },
  { value: '98', suffix: '%', label: 'Repeat client rate', desc: 'We keep showing up for the next phase.' },
  { value: '4.9', suffix: '★', label: 'Clutch rating', desc: 'Based on 42 verified reviews.' },
];

/** [CodeFlee, typical studio] */
const ROWS: [string, string][] = [
  ['Tailored, from scratch solutions', 'Pre-made themes & templates'],
  ['Senior engineers only (6+ yrs)', 'Juniors on your account'],
  ['True agile — weekly shipped demos', 'So-called "agile" with no demos'],
  ['Fixed-scope, transparent pricing', 'Hidden costs on change requests'],
  ['Dedicated project lead, always on', 'Account manager churn every 6 mo.'],
];

/** Proof numbers plus the "us vs typical studio" comparison, in one section. */
export default function WhyCodeFlee() {
  return (
    <section className="cf-section cf-sf-plum cf-glow" id="why">
      <div className="cf-container">
        <div className="cf-head">
          <div>
            <span className="cf-eyebrow">Why CodeFlee</span>
            <h2 className="cf-h2">We do the boring things <span className="cf-dim">other studios skip.</span></h2>
          </div>
          <p className="cf-lead">
            The difference is never the deck. It&apos;s the 400 small decisions made well between kickoff and launch.
          </p>
        </div>

        <dl className="cf-stats" data-rise="">
          {STATS.map((s) => (
            <div key={s.label} className="cf-stat">
              <dd className="cf-stat-value">{s.value}{s.suffix && <sup>{s.suffix}</sup>}</dd>
              <dt className="cf-stat-label">{s.label}</dt>
              <dd className="cf-stat-desc">{s.desc}</dd>
            </div>
          ))}
        </dl>
        <p className="cf-why-note">
          Five years in. Every number is verifiable — ask for references and we&apos;ll hand them over.
        </p>

        <div className="cf-compare" role="table" aria-label="CodeFlee compared with a typical studio" data-rise="">
          <div className="cf-compare-head" role="row">
            <span role="columnheader">CodeFlee</span>
            <span role="columnheader">Typical studio</span>
          </div>
          {ROWS.map(([us, them]) => (
            <div className="cf-compare-row" role="row" key={us}>
              <span className="cf-compare-us" role="cell">
                <span className="cf-compare-tick"><CheckIcon size={14} /></span>
                {us}
              </span>
              <span className="cf-compare-them" role="cell">{them}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
