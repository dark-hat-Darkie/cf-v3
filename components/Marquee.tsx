const items = [
  { txt: 'Web Development', em: false },
  { txt: 'Brand & Identity', em: true },
  { txt: 'Mobile Apps', em: false },
  { txt: 'UI / UX Design', em: true },
  { txt: 'WebGL Experiences', em: false },
  { txt: 'E-Commerce', em: true },
];

function MarqueeRow() {
  return (
    <div className="cf-marquee-item">
      {items.map((it, i) => (
        <span key={i} style={{ display: 'inline-flex', alignItems: 'center', gap: 56 }}>
          <span>{it.em ? <em>{it.txt}</em> : it.txt}</span>
          <span className="cf-marquee-dot" />
        </span>
      ))}
    </div>
  );
}

export default function Marquee() {
  return (
    <section className="cf-marquee-section" aria-hidden="true">
      <div className="cf-marquee-track">
        <MarqueeRow /><MarqueeRow />
      </div>
      <div className="cf-marquee-track outline reverse" style={{ marginTop: 18 }}>
        <MarqueeRow /><MarqueeRow />
      </div>
    </section>
  );
}
