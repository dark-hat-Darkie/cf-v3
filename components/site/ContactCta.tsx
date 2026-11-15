import Link from 'next/link';
import { contactHref, site } from '@/lib/site';
import { ArrowIcon } from './icons';

type Props = {
  eyebrow?: string;
  heading?: React.ReactNode;
  text?: string;
  /** Service slug to preselect on the contact form. */
  service?: string;
  /** Where the click came from, stored with the inquiry. */
  from?: string;
  label?: string;
};

/** The closing call-to-action band used at the bottom of every inner page. */
export default function ContactCta({
  eyebrow = "Let's build",
  heading = <>Have a project <span className="cf-dim">in mind?</span></>,
  text = `Tell us what you're building. We reply ${site.replyTime} with next steps and a rough estimate — no commitment.`,
  service,
  from,
  label = site.cta.primary.label,
}: Props) {
  return (
    <section className="cf-section cf-sf-plum cf-glow cf-cta-band">
      <div className="cf-container">
        <span className="cf-eyebrow">{eyebrow}</span>
        <h2 className="cf-h2">{heading}</h2>
        <p className="cf-lead">{text}</p>
        <div className="cf-btn-row">
          <Link href={contactHref({ service, from })} className="cf-btn cf-btn--primary cf-btn--lg">
            {label}
            <ArrowIcon />
          </Link>
          {site.bookingUrl && (
            <a href={site.bookingUrl} className="cf-btn cf-btn--secondary cf-btn--lg" target="_blank" rel="noopener noreferrer">
              {site.cta.booking.label}
            </a>
          )}
        </div>
        <p className="cf-cta-band-note">
          Prefer email? <a className="cf-link" href={`mailto:${site.email}`}>{site.email}</a>
          {' · '}
          <a className="cf-link" href={site.whatsapp.href} target="_blank" rel="noopener noreferrer">WhatsApp</a>
        </p>
      </div>
    </section>
  );
}
