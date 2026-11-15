import ContactForm from './contact/ContactForm';
import ContactChannels from './contact/ContactChannels';
import { site } from '@/lib/site';

/** Homepage contact band: the same form as /contact, on plum. */
export default function Contact() {
  return (
    <section id="contact" className="cf-section cf-sf-plum cf-glow">
      <div className="cf-container cf-home-contact-grid">
        <div className="cf-home-contact-intro">
          <span className="cf-eyebrow">Let&apos;s build</span>
          <h2 className="cf-h2">Tell us about your <span className="cf-dim">project.</span></h2>
          <p className="cf-lead">
            Send a short brief and we&apos;ll reply {site.replyTime} with next steps and a rough estimate.
            Or skip the form and reach us directly, whichever is easier.
          </p>
          <ContactChannels />
        </div>
        <div className="cf-home-contact-form">
          <ContactForm source="home" />
        </div>
      </div>
    </section>
  );
}
