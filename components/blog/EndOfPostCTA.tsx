import Link from "next/link";

type Props = {
  title?: string;
  description?: string;
};

export function EndOfPostCTA({
  title = "Want this kind of work on your team?",
  description = "We partner with a small number of product teams each quarter — engineering, design, and content under one roof.",
}: Props) {
  return (
    <aside className="cf-eop-cta" aria-label="Work with the studio">
      <div className="cf-eop-cta-body">
        <div className="cf-eop-cta-eyebrow">Studio · Open for projects</div>
        <h2 className="cf-eop-cta-title">{title}</h2>
        <p className="cf-eop-cta-desc">{description}</p>
        <div className="cf-eop-cta-actions">
          <Link
            href="/#contact"
            className="cf-eop-cta-primary"
            data-cursor="Get in touch"
          >
            Book a discovery call
            <span aria-hidden>→</span>
          </Link>
          <Link href="/#services" className="cf-eop-cta-secondary" data-cursor="Explore">
            See how we work
          </Link>
        </div>
      </div>
      <div className="cf-eop-cta-meta">
        <div className="cf-eop-cta-meta-row">
          <span className="cf-eop-cta-meta-dot" />
          <span>Available · May 2026</span>
        </div>
        <div className="cf-eop-cta-meta-row">
          <strong>Dhaka · Remote globally</strong>
        </div>
        <div className="cf-eop-cta-meta-row cf-eop-cta-meta-muted">
          Typical engagement: 4–12 weeks, fixed price, two senior engineers minimum.
        </div>
      </div>
    </aside>
  );
}
