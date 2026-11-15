import { Suspense } from 'react';
import Image from 'next/image';
import type { Metadata } from 'next';
import ContactForm from '@/components/contact/ContactForm';
import ContactChannels from '@/components/contact/ContactChannels';
import HomeFaq from '@/components/HomeFaq';
import { projectForService } from '@/lib/contact-options';
import { site } from '@/lib/site';

const TITLE = `Start a project | ${site.name}`;
const DESCRIPTION = `Tell us what you're building. We reply ${site.replyTime} with next steps and a rough estimate. No commitment.`;

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: '/contact' },
  openGraph: { title: TITLE, description: DESCRIPTION, url: '/contact', type: 'website' },
};

type SearchParams = Promise<{ service?: string | string[]; from?: string | string[] }>;

const first = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v);

/** Reads `?service=` / `?from=` at request time, so it sits inside <Suspense>. */
async function PrefilledForm({ searchParams }: { searchParams: SearchParams }) {
  const sp = await searchParams;
  const from = (first(sp.from) ?? '').replace(/[^a-z0-9-]/gi, '').slice(0, 80);
  return (
    <ContactForm
      defaultProject={projectForService(first(sp.service))}
      source={from ? `contact-page:${from}` : 'contact-page'}
    />
  );
}

const PROOF = [
  { value: '24h', label: 'to a real reply' },
  { value: '60+', label: 'products shipped' },
  { value: '4.9★', label: 'on Clutch' },
];

const STEPS = [
  { n: '01', when: 'Today', title: 'You send a brief', text: 'A few lines is enough. Links, references and rough timelines all help.' },
  { n: '02', when: `Within 24 hours`, title: 'We reply with a plan', text: 'Questions, a suggested approach and a rough estimate, written by the people who would build it.' },
  { n: '03', when: 'This week', title: 'A 30-minute call', text: 'We pressure-test the idea together and agree on what is in and out of scope.' },
  { n: '04', when: 'Within days', title: 'A fixed proposal', text: 'Scope, price and timeline in writing. No obligation at any point.' },
];

export default function ContactPage({ searchParams }: { searchParams: SearchParams }) {
  return (
    <>
      <section className="cf-contact-page cf-sf-cream">
        <div className="cf-container cf-contact-grid">
          <div className="cf-contact-intro">
            <span className="cf-badge">
              <span className="cf-badge-dot" aria-hidden="true" />
              Open for new projects
            </span>
            <h1 className="cf-h1">Let&apos;s build something <span className="cf-accent">worth using.</span></h1>
            <p className="cf-lead">{DESCRIPTION}</p>

            <dl className="cf-contact-proof">
              {PROOF.map((p) => (
                <div key={p.label}>
                  <dd>{p.value}</dd>
                  <dt>{p.label}</dt>
                </div>
              ))}
            </dl>

            <figure className="cf-contact-quote">
              <blockquote>
                &ldquo;We tried three agencies before. CodeFlee is the first that actually shipped weekly.&rdquo;
              </blockquote>
              <figcaption>
                <span className="cf-quote-avatar"><Image src="/assets/client.png" alt="" width={44} height={44} /></span>
                <span>
                  <span className="cf-quote-name">Michael Tran</span>
                  <span className="cf-quote-role">Head of Product · FactWatch</span>
                </span>
              </figcaption>
            </figure>

            <h2 className="cf-contact-direct-title">Prefer to talk directly?</h2>
            <ContactChannels />
            <p className="cf-contact-address">{site.address.line} · {site.address.timezone}</p>
          </div>

          <div className="cf-contact-card cf-sf-paper">
            <div className="cf-contact-card-head">
              <h2 className="cf-h3">Project brief</h2>
              <span>Takes about 2 minutes</span>
            </div>
            <Suspense fallback={<div className="cf-form-skeleton" aria-busy="true" />}>
              <PrefilledForm searchParams={searchParams} />
            </Suspense>
          </div>
        </div>
      </section>

      <section className="cf-section cf-sf-paper">
        <div className="cf-container">
          <div className="cf-head">
            <div>
              <span className="cf-eyebrow">What happens next</span>
              <h2 className="cf-h2">From first message <span className="cf-dim">to a fixed proposal.</span></h2>
            </div>
            <p className="cf-lead">No sales team, no automated sequences. You talk to the people who would do the work.</p>
          </div>
          <ol className="cf-next">
            {STEPS.map((s) => (
              <li key={s.n} data-rise="">
                <span className="cf-next-top">
                  <span className="cf-next-n">{s.n}</span>
                  <span className="cf-tag">{s.when}</span>
                </span>
                <h3 className="cf-h3">{s.title}</h3>
                <p>{s.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <HomeFaq />
    </>
  );
}
