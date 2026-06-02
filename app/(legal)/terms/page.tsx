import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Service — CodeFlee',
  description:
    'The terms that govern your use of the CodeFlee website and its content.',
  alternates: { canonical: '/terms' },
  openGraph: {
    title: 'Terms of Service — CodeFlee',
    description: 'The terms that govern your use of the CodeFlee website and its content.',
    type: 'website',
    url: '/terms',
  },
};

export default function TermsOfServicePage() {
  return (
    <article>
      <div className="cf-legal-eyebrow">
        <span>Legal</span>
      </div>
      <h1 className="cf-legal-title">Terms of Service</h1>
      <p className="cf-legal-updated">Last updated: June 1, 2026</p>
      <p className="cf-legal-lead">
        These terms govern your use of the CodeFlee website (the &ldquo;Site&rdquo;). By accessing or
        using the Site, you agree to these terms. If you don&rsquo;t agree, please don&rsquo;t use
        the Site.
      </p>

      <h2>1. Who we are</h2>
      <p>
        CodeFlee (&ldquo;we&rdquo;, &ldquo;us&rdquo;, &ldquo;our&rdquo;) is a digital product studio
        based in Dhaka, Bangladesh. The Site is an informational and marketing website for our
        studio.
      </p>

      <h2>2. Using the Site</h2>
      <p>You agree to use the Site lawfully and not to:</p>
      <ul>
        <li>Use it in any way that breaches applicable laws or regulations.</li>
        <li>
          Attempt to gain unauthorised access to the Site, its servers, or any connected system or
          database.
        </li>
        <li>
          Introduce malware, attempt to disrupt the Site, or place excessive automated load on it
          (e.g. scraping or denial-of-service activity).
        </li>
        <li>
          Copy, reproduce, or redistribute Site content beyond what these terms or applicable law
          permit.
        </li>
      </ul>

      <h2>3. Intellectual property</h2>
      <p>
        Unless stated otherwise, the Site and its content — including text, design, graphics, code,
        and the CodeFlee name and logo — are owned by CodeFlee or our licensors and are protected by
        intellectual property laws. You may view and share the content for personal,
        non-commercial use, but you may not reuse it commercially without our written permission.
      </p>
      <p>
        Client names, logos, screenshots, and project work shown in case studies remain the property
        of their respective owners and are used for portfolio and identification purposes.
      </p>

      <h2>4. Submissions you send us</h2>
      <p>
        When you send us an enquiry, project brief, or other message, you grant us permission to use
        that information to respond to you and evaluate a potential engagement. Please don&rsquo;t
        send confidential or sensitive information you don&rsquo;t want shared, and make sure
        anything you submit is accurate and that you have the right to share it.
      </p>

      <h2>5. Professional services</h2>
      <p>
        The Site describes services we offer, but nothing on it is a binding offer, quote, or
        contract. Any engagement is governed by a separate written agreement or statement of work
        signed by both parties — which will control in the event of any conflict with these terms.
      </p>

      <h2>6. Third-party links and services</h2>
      <p>
        The Site may link to third-party websites or services we don&rsquo;t control. We&rsquo;re
        not responsible for their content, policies, or practices, and including a link doesn&rsquo;t
        imply endorsement.
      </p>

      <h2>7. Disclaimer</h2>
      <p>
        The Site and its content are provided &ldquo;as is&rdquo; and &ldquo;as available&rdquo;
        without warranties of any kind, whether express or implied, including fitness for a
        particular purpose and non-infringement. We don&rsquo;t warrant that the Site will be
        uninterrupted, error-free, or free of harmful components, or that the information on it is
        complete or current.
      </p>

      <h2>8. Limitation of liability</h2>
      <p>
        To the maximum extent permitted by law, CodeFlee will not be liable for any indirect,
        incidental, special, consequential, or punitive damages, or for any loss of data, revenue,
        or profits, arising from your use of (or inability to use) the Site.
      </p>

      <h2>9. Indemnification</h2>
      <p>
        You agree to indemnify and hold CodeFlee harmless from any claims, losses, or expenses
        arising out of your misuse of the Site or your breach of these terms.
      </p>

      <h2>10. Governing law</h2>
      <p>
        These terms are governed by the laws of Bangladesh, and any disputes will be subject to the
        exclusive jurisdiction of the courts of Dhaka, Bangladesh.
      </p>

      <h2>11. Changes to these terms</h2>
      <p>
        We may update these terms from time to time. Changes take effect when posted, and the
        &ldquo;Last updated&rdquo; date above will reflect the latest version. Your continued use of
        the Site means you accept the updated terms.
      </p>

      <h2>12. Contact us</h2>
      <p>
        Questions about these terms? Email{' '}
        <a href="mailto:hello@codeflee.com">hello@codeflee.com</a> or write to us at CodeFlee,
        Mohammadpur, Dhaka 1207, Bangladesh.
      </p>
    </article>
  );
}
