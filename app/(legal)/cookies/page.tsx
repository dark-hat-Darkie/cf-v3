import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Cookie Policy — CodeFlee',
  description:
    'Which cookies the CodeFlee website uses. In short: only one essential cookie for the admin dashboard — no analytics or tracking.',
  alternates: { canonical: '/cookies' },
  openGraph: {
    title: 'Cookie Policy — CodeFlee',
    description:
      'Which cookies the CodeFlee website uses — only one essential cookie, no analytics or tracking.',
    type: 'website',
    url: '/cookies',
  },
};

export default function CookiePolicyPage() {
  return (
    <article>
      <div className="cf-legal-eyebrow">
        <span>Legal</span>
      </div>
      <h1 className="cf-legal-title">Cookie Policy</h1>
      <p className="cf-legal-updated">Last updated: June 1, 2026</p>
      <p className="cf-legal-lead">
        We keep cookies to an absolute minimum. As a regular visitor browsing the public site, you
        are not given any analytics, advertising, or tracking cookies — we use a single essential
        cookie only for the password-protected admin dashboard.
      </p>

      <h2>1. What are cookies?</h2>
      <p>
        Cookies are small text files a website can store in your browser. They&rsquo;re commonly used
        to keep you signed in, remember preferences, or measure usage. Cookies can be
        &ldquo;essential&rdquo; (needed for the site to function) or &ldquo;non-essential&rdquo; (for
        analytics, personalisation, or advertising).
      </p>

      <h2>2. Cookies we use</h2>
      <p>
        We use only one cookie, and only for our internal administrator area. It is not set when you
        browse the public website.
      </p>
      <table className="cf-legal-table">
        <thead>
          <tr>
            <th>Cookie</th>
            <th>Purpose</th>
            <th>Type</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <code>cf_session</code>
            </td>
            <td>
              Keeps a CodeFlee administrator securely signed in to the content dashboard. It is an
              <strong> HTTP-only</strong> cookie (not readable by JavaScript) and expires when the
              session ends or after a short period.
            </td>
            <td>Essential</td>
          </tr>
        </tbody>
      </table>

      <h2>3. What we don&rsquo;t use</h2>
      <p>
        We do <strong>not</strong> use analytics cookies (such as Google Analytics), advertising or
        retargeting cookies, social-media tracking pixels, or any third-party cookies that profile
        you across sites.
      </p>

      <h2>4. Managing cookies</h2>
      <p>
        You can control or delete cookies through your browser settings, and set your browser to
        block them. Because the only cookie we use is the essential admin sign-in cookie, blocking
        cookies won&rsquo;t affect your experience as a regular visitor — it would only prevent an
        administrator from logging in.
      </p>

      <h2>5. Changes to this policy</h2>
      <p>
        If we introduce new cookies in the future (for example, privacy-friendly analytics),
        we&rsquo;ll update this page and the &ldquo;Last updated&rdquo; date, and where required ask
        for your consent first.
      </p>

      <h2>6. Contact us</h2>
      <p>
        Questions about cookies? Email{' '}
        <a href="mailto:hello@codeflee.com">hello@codeflee.com</a>. For more on how we handle
        personal data, see our <a href="/privacy">Privacy Policy</a>.
      </p>
    </article>
  );
}
