const steps = [
  {
    n: "01",
    title: "Discover",
    desc: "Workshops, stakeholder interviews, competitive teardowns. We walk in curious and leave aligned.",
    dur: "Week 1",
  },
  {
    n: "02",
    title: "Design",
    desc: "Wireframes → high-fidelity → motion. You review two directions, we refine together.",
    dur: "Week 2–3",
  },
  {
    n: "03",
    title: "Build",
    desc: "Weekly shippable increments. Your PM joins stand-ups, demos, and QA from day one.",
    dur: "Week 4–8",
  },
  {
    n: "04",
    title: "Launch",
    desc: "Performance tuning, analytics wiring, launch comms. We ride with you through go-live.",
    dur: "Week 9",
  },
  {
    n: "05",
    title: "Scale",
    desc: "Ongoing retainers, experiments, and roadmap work. Your team or ours — your call.",
    dur: "Ongoing",
  },
];

export default function Process() {
  return (
    <section className="cf-sec cf-sec-white" id="process">
      <div className="cf-wrap">
        <div className="cf-section-head">
          <div className="left">
            <div className="cf-eyebrow">How we work</div>
            <h2 className="cf-h2">
              Five steps from <em className="grad">idea</em>
              <br />
              to in-market.
            </h2>
          </div>
          <div className="right">
            Every engagement follows the same rhythm. Predictable. Transparent.
            Shippable every single week.
          </div>
        </div>
        <div className="cf-process-list">
          {steps.map((s) => (
            <div key={s.n} className="cf-process-row" data-hover="">
              <div className="cf-process-num">{s.n}</div>
              <h3 className="cf-process-title">{s.title}</h3>
              <p className="cf-process-desc">{s.desc}</p>
              <div className="cf-process-dur">{s.dur}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
