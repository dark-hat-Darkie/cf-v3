import Image from 'next/image';

const people = [
  { name: 'Ferdous Rahman', role: 'Founder · Engineering', img: '/assets/ferdous.png' },
  { name: 'Zahid Hasan', role: 'Design Lead', img: '/assets/zahid.png' },
  { name: 'Shakil Ahmed', role: 'Mobile Engineer', img: '/assets/shakil.png' },
  { name: 'Mohon Das', role: 'Full-stack Engineer', img: '/assets/mohon.png' },
];

export default function Team() {
  return (
    <section className="cf-section cf-sf-cream" id="team">
      <div className="cf-container">
        <div className="cf-head">
          <div>
            <span className="cf-eyebrow">The humans</span>
            <h2 className="cf-h2">A small team. <span className="cf-dim">Every hire, senior.</span></h2>
          </div>
          <p className="cf-lead">
            No juniors sold as seniors, no agency bait-and-switch. The people in your Slack channel are the ones who ship.
          </p>
        </div>
        <ul className="cf-team">
          {people.map((p) => (
            <li key={p.name} className="cf-team-card" data-rise="">
              <span className="cf-media cf-media--portrait">
                <Image src={p.img} alt={p.name} fill sizes="(max-width: 760px) 50vw, 300px" />
              </span>
              <h3 className="cf-team-name">{p.name}</h3>
              <p className="cf-team-role">{p.role}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
