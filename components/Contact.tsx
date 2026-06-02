'use client';
import { useState, useTransition } from 'react';
import { MagneticButton } from './MagneticButton';
import { submitContactAction } from '@/app/actions/contact';

const projectTypes = ['Web app', 'Mobile app', 'Brand & design', 'WebGL / 3D', 'E-commerce', 'Not sure yet'];
const budgets = ['< $10K', '$10K–$25K', '$25K–$75K', '$75K+', "Let's discuss"];

export default function Contact() {
  const [data, setData] = useState({ project: '', budget: '', name: '', email: '', message: '' });
  // Honeypot — kept off-screen; bots fill it, humans don't.
  const [company, setCompany] = useState('');
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const setField = (k: keyof typeof data) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setData(d => ({ ...d, [k]: e.target.value }));

  const toggle = (k: keyof typeof data, v: string) =>
    setData(d => ({ ...d, [k]: d[k] === v ? '' : v }));

  const submit = () => {
    if (pending) return;
    setError(null);
    startTransition(async () => {
      const res = await submitContactAction({ ...data, company });
      if (res.ok) {
        setSent(true);
      } else {
        setError(res.error);
      }
    });
  };

  return (
    <section id="contact" className="cf-contact">
      <div className="cf-contact-left">
        <div>
          <div className="cf-eyebrow" style={{ color: 'var(--cf-indigo)' }}>Let&apos;s build</div>
          <h2 className="cf-h2" style={{ color: '#fff', fontSize: 'clamp(36px, 4.5vw, 64px)' }}>
            Tell us about<br />your <em className="grad">project.</em>
          </h2>
          <div className="cf-reply-badge" style={{ marginTop: 20 }}>
            <span className="cf-reply-dot" />
            Avg. reply: 4 hours
          </div>
          <p style={{ fontSize: 16, color: 'rgba(255,255,255,.6)', lineHeight: 1.6, marginTop: 18, maxWidth: 420 }}>
            Or skip the form and reach us directly — whichever is easier.
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 18, marginTop: 48 }}>
          <a href="mailto:hello@codeflee.com" style={{ display: 'flex', alignItems: 'center', gap: 14, color: '#fff', fontSize: 16 }}>
            <span style={{ width: 44, height: 44, borderRadius: 9999, border: '1px solid rgba(255,255,255,.15)', display: 'grid', placeItems: 'center' }}>@</span>
            hello@codeflee.com
          </a>
          <a href="https://wa.me/8801716778254" style={{ display: 'flex', alignItems: 'center', gap: 14, color: '#fff', fontSize: 16 }}>
            <span style={{ width: 44, height: 44, borderRadius: 9999, border: '1px solid rgba(255,255,255,.15)', display: 'grid', placeItems: 'center' }}>W</span>
            WhatsApp +880 1716778254
          </a>
          <a href="#" style={{ display: 'flex', alignItems: 'center', gap: 14, color: '#fff', fontSize: 16 }}>
            <span style={{ width: 44, height: 44, borderRadius: 9999, border: '1px solid rgba(255,255,255,.15)', display: 'grid', placeItems: 'center' }}>→</span>
            Book a 30-minute intro call
          </a>
        </div>

        <div style={{ fontSize: 11, letterSpacing: '.25em', textTransform: 'uppercase', color: 'rgba(255,255,255,.3)', marginTop: 32 }}>
          Mohammadpur · Dhaka 1207 · BD
        </div>
      </div>

      <div className="cf-contact-right">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/assets/globe.svg" alt="" aria-hidden="true" />

        <div className="inner" style={{ maxWidth: 500, width: '100%' }}>
          {sent ? (
            <div className="cf-success">
              Thanks — we got it.<br />
              <span style={{ fontSize: 14, fontWeight: 400, color: 'rgba(255,255,255,.7)', display: 'block', marginTop: 14 }}>
                You&apos;ll hear back from us within 4 hours. Meanwhile, drop any links you want us to see.
              </span>
            </div>
          ) : (
            <div className="cf-contact-form">
              <div className="cf-form-section">
                <div className="cf-form-section-label">What are we building?</div>
                <div className="cf-chip-group">
                  {projectTypes.map(t => (
                    <button key={t} type="button" className={`cf-chip ${data.project === t ? 'selected' : ''}`} onClick={() => toggle('project', t)}>{t}</button>
                  ))}
                </div>
              </div>

              <div className="cf-form-section">
                <div className="cf-form-section-label">Budget range</div>
                <div className="cf-chip-group">
                  {budgets.map(b => (
                    <button key={b} type="button" className={`cf-chip ${data.budget === b ? 'selected' : ''}`} onClick={() => toggle('budget', b)}>{b}</button>
                  ))}
                </div>
              </div>

              <div className="cf-form-row">
                <div className="cf-form-section" style={{ flex: 1 }}>
                  <div className="cf-form-section-label">Your name</div>
                  <input
                    className="cf-input"
                    placeholder="Jane Smith"
                    value={data.name}
                    onChange={setField('name')}
                  />
                </div>
                <div className="cf-form-section" style={{ flex: 1 }}>
                  <div className="cf-form-section-label">Work email</div>
                  <input
                    className="cf-input"
                    type="email"
                    placeholder="jane@company.com"
                    value={data.email}
                    onChange={setField('email')}
                  />
                </div>
              </div>

              <div className="cf-form-section">
                <div className="cf-form-section-label">Tell us more <span style={{ color: 'rgba(255,255,255,.35)', fontWeight: 400 }}>— links, timeline, anything useful</span></div>
                <textarea
                  className="cf-input cf-textarea"
                  placeholder="We're building a marketplace for X. We need help with design and frontend. Launch is Q3…"
                  rows={4}
                  value={data.message}
                  onChange={setField('message')}
                />
              </div>

              {/* Honeypot: visually hidden, off the tab order, ignored by humans. */}
              <input
                type="text"
                name="company"
                tabIndex={-1}
                autoComplete="off"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                aria-hidden="true"
                style={{ position: 'absolute', left: '-9999px', width: 1, height: 1, opacity: 0 }}
              />

              <MagneticButton
                type="button"
                className="cf-btn-primary"
                style={{ width: '100%', justifyContent: 'center', padding: '16px 24px', marginTop: 8, opacity: pending ? 0.7 : 1 }}
                onClick={submit}
                disabled={pending}
              >
                <span>{pending ? 'Sending…' : 'Send brief'}</span>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                  <path d="M7 17L17 7M17 7H7M17 7V17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </MagneticButton>

              {error && (
                <p role="alert" style={{ fontSize: 13, color: '#ff9db8', marginTop: 14, textAlign: 'center', letterSpacing: '.02em' }}>
                  {error}
                </p>
              )}

              <p style={{ fontSize: 12, color: 'rgba(255,255,255,.35)', marginTop: 14, textAlign: 'center', letterSpacing: '.02em' }}>
                No commitment. We&apos;ll scope the work and send an estimate first.
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
