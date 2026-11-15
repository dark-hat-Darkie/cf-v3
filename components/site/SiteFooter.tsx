import Image from 'next/image';
import Link from 'next/link';
import { SERVICES } from '@/lib/services-data';
import { activeSocials, site } from '@/lib/site';

const STUDIO_LINKS = [
  { label: 'Work', href: '/case-studies' },
  { label: 'Process', href: '/#process' },
  { label: 'Team', href: '/#team' },
  { label: 'Pricing', href: '/#pricing' },
  { label: 'Blog', href: '/blog' },
  { label: 'Contact', href: '/contact' },
];

const LEGAL_LINKS = [
  { label: 'Privacy', href: '/privacy' },
  { label: 'Terms', href: '/terms' },
  { label: 'Cookies', href: '/cookies' },
];

export default function SiteFooter() {
  const socials = activeSocials();
  return (
    <footer className="cf-site-footer cf-sf-plum-deep">
      <div className="cf-container">
        <div className="cf-site-footer-grid">
          <div className="cf-site-footer-brand">
            <Link href="/" aria-label={`${site.name} — home`}>
              <Image src="/assets/logo-white.svg" alt={site.name} width={145} height={24} />
            </Link>
            <p>{site.tagline}</p>
            <span className="cf-badge">
              <span className="cf-badge-dot" aria-hidden="true" />
              Open for new projects
            </span>
          </div>

          <nav className="cf-site-footer-col" aria-label="Services">
            <h2>Services</h2>
            <ul>
              {SERVICES.map((s) => (
                <li key={s.slug}><Link href={`/services/${s.slug}`}>{s.title}</Link></li>
              ))}
            </ul>
          </nav>

          <nav className="cf-site-footer-col" aria-label="Studio">
            <h2>Studio</h2>
            <ul>
              {STUDIO_LINKS.map((l) => (
                <li key={l.href}><Link href={l.href}>{l.label}</Link></li>
              ))}
            </ul>
          </nav>

          <div className="cf-site-footer-col">
            <h2>Get in touch</h2>
            <ul>
              <li><a href={`mailto:${site.email}`}>{site.email}</a></li>
              <li>
                <a href={site.whatsapp.href} target="_blank" rel="noopener noreferrer">
                  WhatsApp {site.whatsapp.display}
                </a>
              </li>
              {site.bookingUrl && (
                <li>
                  <a href={site.bookingUrl} target="_blank" rel="noopener noreferrer">{site.cta.booking.label}</a>
                </li>
              )}
              {socials.map((s) => (
                <li key={s.key}>
                  <a href={s.href} target="_blank" rel="noopener noreferrer">{s.label}</a>
                </li>
              ))}
            </ul>
            <p className="cf-site-footer-address">
              {site.address.line} · {site.address.timezone}
            </p>
          </div>
        </div>

        <div className="cf-site-footer-bar">
          <span>© 2026 {site.name} Studio · Dhaka, Bangladesh</span>
          <nav aria-label="Legal">
            {LEGAL_LINKS.map((l) => (
              <Link key={l.href} href={l.href}>{l.label}</Link>
            ))}
          </nav>
        </div>
      </div>
    </footer>
  );
}
