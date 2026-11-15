import { DEMO_PILLARS } from '@/lib/demo-content';

/** The studio in one statement, then the three disciplines behind it. */
export default function Pillars() {
  return (
    <section className="cf-section cf-sf-paper" id="studio">
      <div className="cf-container">
        <span className="cf-eyebrow cf-numbered">The studio</span>
        <p className="cf-h2 cf-pillars-statement">
          One senior team for strategy, design and engineering,{' '}
          <span className="cf-dim">so nothing gets lost between the idea and the launch.</span>
        </p>
        <div className="cf-pillars">
          {DEMO_PILLARS.map((p, i) => (
            <div key={p.title} className="cf-pillar" data-rise="">
              <span className="cf-pillar-n">0{i + 1}</span>
              <h3 className="cf-h3">{p.title}</h3>
              <p>{p.text}</p>
              <ul>
                {p.items.map((it) => (
                  <li key={it}>{it}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
