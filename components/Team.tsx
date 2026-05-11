const people = [
  {
    name: "Ferdous Rahman",
    role: "Founder · Engineering",
    img: "/assets/ferdous.png",
  },
  { name: "Zahid Hasan", role: "Design Lead", img: "/assets/zahid.png" },
  { name: "Shakil Ahmed", role: "Mobile Engineer", img: "/assets/shakil.png" },
  { name: "Mohon Das", role: "Full-stack Engineer", img: "/assets/mohon.png" },
];

export default function Team() {
  return (
    <section className="cf-sec cf-sec-light" id="team">
      <div className="cf-wrap">
        <div className="cf-section-head">
          <div className="left">
            <div className="cf-eyebrow">The humans</div>
            <h2 className="cf-h2">
              A small team. <em className="grad">Every hire, senior.</em>
            </h2>
          </div>
          <div className="right">
            No juniors sold as seniors, no agency bait-and-switch. The people in
            your Slack channel are the ones who ship.
          </div>
        </div>
        <div className="cf-team-grid">
          {people.map((p, i) => (
            <div
              key={i}
              className="cf-team-card"
              data-cursor={p.name.split(" ")[0]}
            >
              <div className="cf-team-img">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={p.img} alt={p.name} />
              </div>
              <div className="cf-team-info">
                <div>
                  <h4 className="cf-team-name">{p.name}</h4>
                  <div className="cf-team-role">{p.role}</div>
                </div>
                <div className="cf-team-idx">— 0{i + 1}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
