/**
 * Single source of truth for site-wide facts: identity, contact channels,
 * navigation and call-to-action labels. Import from here instead of typing
 * an email address, phone number or CTA label into a component.
 */

const env = (v: string | undefined) => (v && v.trim() !== '' ? v.trim() : null);

const DEFAULT_SITE_URL = 'https://codeflee.com';

/**
 * SITE_URL comes from hosting env and is easy to get subtly wrong (empty,
 * wrapped in quotes, or a bare domain with no scheme). Any of those makes
 * `new URL()` throw at build time, so coerce it into a valid origin here.
 */
function siteUrl(raw: string | undefined): string {
  const value = (raw ?? '').trim().replace(/^['"]|['"]$/g, '').trim();
  if (!value) return DEFAULT_SITE_URL;
  const withScheme = /^https?:\/\//i.test(value) ? value : `https://${value}`;
  try {
    return new URL(withScheme).origin;
  } catch {
    console.warn(`[site] SITE_URL is not a valid URL; falling back to ${DEFAULT_SITE_URL}`);
    return DEFAULT_SITE_URL;
  }
}

const whatsappNumber = '8801716778254';

export const site = {
  name: process.env.SITE_NAME ?? 'CodeFlee',
  url: siteUrl(process.env.SITE_URL),
  title: 'CodeFlee | Digital Studio · Dhaka',
  description:
    'A senior engineering & design studio in Dhaka. From product thinking to launch-day comms, we sweat the details so your team can move.',
  tagline: 'A senior engineering studio in Dhaka, shipping work for founders who sweat the details.',

  email: 'hello@codeflee.com',
  whatsapp: {
    number: whatsappNumber,
    display: '+880 1716 778254',
    href: `https://wa.me/${whatsappNumber}`,
  },
  /** Scheduling page (Cal.com, Calendly…). Booking CTAs render only when set. */
  bookingUrl: env(process.env.NEXT_PUBLIC_BOOKING_URL),
  /** The one reply-time promise used everywhere on the site. */
  replyTime: 'within 24 hours',

  address: {
    line: 'Mohammadpur · Dhaka 1207',
    locality: 'Dhaka',
    country: 'BD',
    timezone: 'GMT+6',
  },

  /** Social profiles. Leave a value null until the real URL exists; links render only when set. */
  socials: {
    linkedin: null,
    x: null,
    instagram: null,
    dribbble: null,
  } as Record<'linkedin' | 'x' | 'instagram' | 'dribbble', string | null>,

  cta: {
    primary: { label: 'Start a project', href: '/contact' },
    booking: { label: 'Book a 30-min call' },
  },

  nav: [
    { label: 'Work', href: '/case-studies' },
    { label: 'Services', href: '/services' },
    { label: 'Process', href: '/#process' },
    { label: 'Pricing', href: '/#pricing' },
    { label: 'Blog', href: '/blog' },
  ],
} as const;

export const SOCIAL_LABELS: Record<keyof typeof site.socials, string> = {
  linkedin: 'LinkedIn',
  x: 'X (Twitter)',
  instagram: 'Instagram',
  dribbble: 'Dribbble',
};

/** Social links that actually have a URL, in display order. */
export function activeSocials() {
  return (Object.keys(site.socials) as (keyof typeof site.socials)[])
    .filter((k) => site.socials[k])
    .map((k) => ({ key: k, label: SOCIAL_LABELS[k], href: site.socials[k] as string }));
}

/** `/contact`, optionally preselecting a service and recording where the click came from. */
export function contactHref(opts: { service?: string; from?: string } = {}) {
  const q = new URLSearchParams();
  if (opts.service) q.set('service', opts.service);
  if (opts.from) q.set('from', opts.from);
  const qs = q.toString();
  return qs ? `/contact?${qs}` : '/contact';
}
