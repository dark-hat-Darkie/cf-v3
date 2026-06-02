import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy — CodeFlee',
  description:
    'How CodeFlee collects, uses, and protects the personal information you share with us through our website, contact form, and newsletter.',
  alternates: { canonical: '/privacy' },
  openGraph: {
    title: 'Privacy Policy — CodeFlee',
    description:
      'How CodeFlee collects, uses, and protects the personal information you share with us.',
    type: 'website',
    url: '/privacy',
  },
};

export default function PrivacyPolicyPage() {
  return (
    <article>
      <div className="cf-legal-eyebrow">
        <span>Legal</span>
      </div>
      <h1 className="cf-legal-title">Privacy Policy</h1>
      <p className="cf-legal-updated">Last updated: June 1, 2026</p>
      <p className="cf-legal-lead">
        This policy explains what information CodeFlee (&ldquo;we&rdquo;, &ldquo;us&rdquo;,
        &ldquo;our&rdquo;) collects when you use our website, how we use it, and the choices you
        have. We keep data collection to the minimum needed to run our studio and respond to you.
      </p>

      <h2>1. Who we are</h2>
      <p>
        CodeFlee is a digital product studio based in Mohammadpur, Dhaka 1207, Bangladesh. For any
        privacy-related questions, contact us at{' '}
        <a href="mailto:hello@codeflee.com">hello@codeflee.com</a>. We are the data controller for
        the personal information described in this policy.
      </p>

      <h2>2. Information we collect</h2>
      <h3>Information you give us</h3>
      <ul>
        <li>
          <strong>Contact &amp; project enquiries.</strong> When you submit our contact form or
          email us, we collect your name, email address, and any project details or message you
          choose to share (such as project type, budget range, and timeline).
        </li>
        <li>
          <strong>Newsletter.</strong> If you subscribe to our blog newsletter, we collect your
          email address.
        </li>
      </ul>
      <h3>Information collected automatically</h3>
      <ul>
        <li>
          <strong>Technical &amp; usage data.</strong> Like most websites, our hosting provider
          records standard server logs — for example IP address, browser type, referring page, and
          the pages you visit — to keep the site secure and reliable.
        </li>
        <li>
          <strong>Cookies.</strong> We use a single essential cookie for the administrator
          dashboard only. We do not use analytics, advertising, or third-party tracking cookies.
          See our <a href="/cookies">Cookie Policy</a> for details.
        </li>
      </ul>

      <h2>3. How we use your information</h2>
      <ul>
        <li>To respond to your enquiries and discuss potential or ongoing work.</li>
        <li>To send the newsletter you subscribed to (you can unsubscribe at any time).</li>
        <li>To operate, secure, maintain, and improve our website.</li>
        <li>To comply with legal obligations and protect our rights.</li>
      </ul>
      <p>
        We rely on your consent (e.g. newsletter), our legitimate interest in running and
        protecting our business, and the steps needed to enter into or perform a contract as the
        legal bases for this processing. <strong>We never sell your personal information.</strong>
      </p>

      <h2>4. How we share information</h2>
      <p>
        We share personal information only with service providers that help us run the website, and
        only as needed for them to provide their service:
      </p>
      <ul>
        <li>
          <strong>Vercel</strong> — website hosting, content delivery, and server logs.
        </li>
        <li>
          <strong>Neon</strong> — managed PostgreSQL database where newsletter subscriptions and
          content are stored.
        </li>
        <li>
          <strong>Vercel Blob</strong> — storage for media assets used on the site.
        </li>
      </ul>
      <p>
        We may also disclose information if required by law, or to protect the rights, safety, and
        security of CodeFlee, our users, or the public.
      </p>

      <h2>5. International transfers</h2>
      <p>
        Our service providers may process and store data on servers located outside Bangladesh.
        Where that happens, we take reasonable steps to ensure your information remains protected in
        line with this policy.
      </p>

      <h2>6. Data retention</h2>
      <p>
        We keep personal information only as long as necessary for the purposes above — for example,
        we retain enquiry correspondence for as long as needed to serve you and for our records, and
        newsletter data until you unsubscribe. We delete or anonymise data when it is no longer
        needed.
      </p>

      <h2>7. Security</h2>
      <p>
        We use reasonable technical and organisational measures — including encryption in transit
        (HTTPS) and access controls — to protect your information. No method of transmission or
        storage is completely secure, so we cannot guarantee absolute security.
      </p>

      <h2>8. Your rights</h2>
      <p>
        Subject to applicable law, you may request to access, correct, or delete your personal
        information, object to or restrict certain processing, or withdraw consent. To exercise any
        of these rights, email <a href="mailto:hello@codeflee.com">hello@codeflee.com</a>. You can
        unsubscribe from the newsletter at any time using the link in any newsletter email.
      </p>

      <h2>9. Children&rsquo;s privacy</h2>
      <p>
        Our website is intended for businesses and adults. We do not knowingly collect personal
        information from children under 16. If you believe a child has provided us information,
        please contact us and we will delete it.
      </p>

      <h2>10. Third-party links</h2>
      <p>
        Our site may link to third-party websites and tools we don&rsquo;t control. This policy
        doesn&rsquo;t cover those sites, and we encourage you to review their privacy policies.
      </p>

      <h2>11. Changes to this policy</h2>
      <p>
        We may update this policy from time to time. When we do, we&rsquo;ll revise the &ldquo;Last
        updated&rdquo; date above, and material changes may be highlighted on the site.
      </p>

      <h2>12. Contact us</h2>
      <p>
        Questions about this policy or your data? Email{' '}
        <a href="mailto:hello@codeflee.com">hello@codeflee.com</a> or write to us at CodeFlee,
        Mohammadpur, Dhaka 1207, Bangladesh.
      </p>
    </article>
  );
}
