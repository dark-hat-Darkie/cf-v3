import { site } from '@/lib/site';
import { CalendarIcon, MailIcon, WhatsAppIcon } from '@/components/site/icons';

/** The direct ways to reach the studio, for visitors who'd rather skip the form. */
export default function ContactChannels() {
  return (
    <ul className="cf-channels">
      <li>
        <a className="cf-channel" href={`mailto:${site.email}`}>
          <span className="cf-channel-icon"><MailIcon /></span>
          <span>
            <span className="cf-channel-label">Email</span>
            <span className="cf-channel-value">{site.email}</span>
          </span>
        </a>
      </li>
      <li>
        <a className="cf-channel" href={site.whatsapp.href} target="_blank" rel="noopener noreferrer">
          <span className="cf-channel-icon"><WhatsAppIcon /></span>
          <span>
            <span className="cf-channel-label">WhatsApp</span>
            <span className="cf-channel-value">{site.whatsapp.display}</span>
          </span>
        </a>
      </li>
      {site.bookingUrl && (
        <li>
          <a className="cf-channel" href={site.bookingUrl} target="_blank" rel="noopener noreferrer">
            <span className="cf-channel-icon"><CalendarIcon /></span>
            <span>
              <span className="cf-channel-label">Prefer to talk?</span>
              <span className="cf-channel-value">{site.cta.booking.label}</span>
            </span>
          </a>
        </li>
      )}
    </ul>
  );
}
