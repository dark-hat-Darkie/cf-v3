const items = [
  {
    quote: (
      <>&ldquo;CodeFlee rebuilt our booking flow in six weeks and <em>doubled conversion.</em> The hand-off to our team was the smoothest I&apos;ve seen in ten years.&rdquo;</>
    ),
    name: 'Sarah Khan',
    role: 'CEO · NextStop Travel',
    img: '/assets/avatar.jpg',
  },
  {
    quote: (
      <>&ldquo;We tried three agencies before. CodeFlee is the first that <em>actually shipped weekly.</em> Quality is insane for the price.&rdquo;</>
    ),
    name: 'Michael Tran',
    role: 'Head of Product · FactWatch',
    img: '/assets/client.png',
  },
  {
    quote: (
      <>&ldquo;Design system delivered in week two. Store went live in week eight — <em>$180K revenue in the first month.</em> We&apos;re already planning phase two.&rdquo;</>
    ),
    name: 'Amir Hussain',
    role: 'Founder · Nomadic Store',
    img: '/assets/ferdous.png',
  },
];

export default function Testimonials() {
  return (
    <section className="cf-sec cf-sec-ink">
      <div className="cf-wrap">
        <div className="cf-section-head">
          <div className="left">
            <div className="cf-eyebrow">In their words</div>
            <h2 className="cf-h2">Clients talk. <em className="grad">We listen.</em></h2>
          </div>
        </div>
        <div className="cf-testimonials">
          {items.map((it, i) => (
            <div key={i} className="cf-testimonial" data-hover="">
              <div className="cf-testimonial-mark">&ldquo;</div>
              <div className="cf-testimonial-quote">{it.quote}</div>
              <div className="cf-testimonial-author">
                <div className="cf-testimonial-avatar">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={it.img} alt="" />
                </div>
                <div>
                  <div className="cf-testimonial-name">{it.name}</div>
                  <div className="cf-testimonial-role">{it.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
