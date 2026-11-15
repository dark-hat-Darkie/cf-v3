const steps = [
  { n: '01', title: 'Discover', desc: 'Workshops, stakeholder interviews, competitive teardowns. We walk in curious and leave aligned.', dur: 'Week 1' },
  { n: '02', title: 'Design', desc: 'Wireframes → high-fidelity → motion. You review two directions, we refine together.', dur: 'Week 2–3' },
  { n: '03', title: 'Build', desc: 'Weekly shippable increments. Your PM joins stand-ups, demos, and QA from day one.', dur: 'Week 4–8' },
  { n: '04', title: 'Launch', desc: 'Performance tuning, analytics wiring, launch comms. We ride with you through go-live.', dur: 'Week 9' },
  { n: '05', title: 'Scale', desc: 'Ongoing retainers, experiments, and roadmap work. Your team or ours. Your call.', dur: 'Ongoing' },
];

export default function Process() {
  return (
    <section className="cf-section cf-sf-cream" id="process">
      <div className="cf-container">
        <div className="cf-head">
          <div>
            <span className="cf-eyebrow">How we work</span>
            <h2 className="cf-h2">Five steps from idea <span className="cf-dim">to in-market.</span></h2>
          </div>
          <p className="cf-lead">
            Every engagement follows the same rhythm. Predictable. Transparent. Shippable every single week.
          </p>
        </div>
        <ol className="cf-steps">
          {steps.map((s) => (
            <li key={s.n} className="cf-step" data-rise="">
              <span className="cf-step-n">{s.n}</span>
              <h3 className="cf-h3">{s.title}</h3>
              <p>{s.desc}</p>
              <span className="cf-step-dur">{s.dur}</span>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
