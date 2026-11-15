import Image from 'next/image';

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
      <>&ldquo;Design system delivered in week two. Store went live in week eight: <em>$180K revenue in the first month.</em> We&apos;re already planning phase two.&rdquo;</>
    ),
    name: 'Amir Hussain',
    role: 'Founder · Nomadic Store',
    img: '/assets/ferdous.png',
  },
];

function Stars() {
  return (
    <span className="cf-stars" role="img" aria-label="Rated 5 out of 5">
      {'★★★★★'}
    </span>
  );
}

export default function Testimonials() {
  const [lead, ...rest] = items;
  return (
    <section className="cf-section cf-sf-paper" id="testimonials">
      <div className="cf-container">
        <div className="cf-head">
          <div>
            <span className="cf-eyebrow">In their words</span>
            <h2 className="cf-h2">Clients talk. <span className="cf-dim">We listen.</span></h2>
          </div>
          <div className="cf-head-aside">
            <p className="cf-rating">
              <strong>4.9</strong>
              <span><Stars /><br />42 verified reviews on Clutch</span>
            </p>
          </div>
        </div>

        <div className="cf-tgrid">
          <figure className="cf-tcard cf-tcard--lead cf-sf-plum" data-rise="">
            <Stars />
            <blockquote>{lead.quote}</blockquote>
            <figcaption>
              <span className="cf-quote-avatar"><Image src={lead.img} alt="" width={56} height={56} /></span>
              <span>
                <span className="cf-quote-name">{lead.name}</span>
                <span className="cf-quote-role">{lead.role}</span>
              </span>
            </figcaption>
          </figure>
          {rest.map((it) => (
            <figure key={it.name} className="cf-tcard" data-rise="">
              <Stars />
              <blockquote>{it.quote}</blockquote>
              <figcaption>
                <span className="cf-quote-avatar"><Image src={it.img} alt="" width={48} height={48} /></span>
                <span>
                  <span className="cf-quote-name">{it.name}</span>
                  <span className="cf-quote-role">{it.role}</span>
                </span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
