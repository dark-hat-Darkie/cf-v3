const posts = [
  { tag: 'Engineering', date: 'Apr 2026', title: 'Shipping weekly: the CodeFlee agile playbook.', img: '/assets/c1.webp' },
  { tag: 'Design', date: 'Mar 2026', title: 'Why we kill every feature on Fridays.', img: '/assets/c2.webp' },
  { tag: 'Studio', date: 'Feb 2026', title: 'Hiring senior-only: how our team stays small.', img: '/assets/c3.png' },
];

export default function Blog() {
  return (
    <section className="cf-sec cf-sec-white">
      <div className="cf-wrap">
        <div className="cf-section-head">
          <div className="left">
            <div className="cf-eyebrow">Field notes</div>
            <h2 className="cf-h2">From the <em className="grad">studio journal</em>.</h2>
          </div>
        </div>
        <div className="cf-blog-grid">
          {posts.map((p, i) => (
            <a key={i} href="#" className="cf-blog-card" data-cursor="Read">
              <div className="cf-blog-img">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={p.img} alt="" />
              </div>
              <div className="cf-blog-meta"><span>{p.tag}</span><span>·</span><span>{p.date}</span></div>
              <h3 className="cf-blog-title">{p.title}</h3>
              <div className="cf-blog-arrow">Read more →</div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
