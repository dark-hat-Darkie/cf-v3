'use client';
import { startTransition, useActionState, useId, useLayoutEffect, useRef } from 'react';
import { submitContactAction } from '@/app/actions/contact';
import { BUDGETS, PROJECT_TYPES } from '@/lib/contact-options';
import { site } from '@/lib/site';
import { CONTACT_INITIAL_STATE, type ContactState } from '@/lib/validation/contact';
import { ArrowIcon, CheckIcon } from '@/components/site/icons';

type Action = { type: 'SUBMIT'; data: FormData } | { type: 'RESET' };

type Props = {
  /** Project type to preselect (see `projectForService`). */
  defaultProject?: string;
  /** Where the form sits / where the visitor came from; saved with the inquiry. */
  source: string;
};

export default function ContactForm({ defaultProject = '', source }: Props) {
  const id = useId();
  const sentRef = useRef(false);

  const [state, dispatch, pending] = useActionState(
    async (_prev: ContactState, action: Action): Promise<ContactState> => {
      if (action.type === 'RESET') return CONTACT_INITIAL_STATE;
      const next = await submitContactAction(action.data);
      if (next.status === 'success') sentRef.current = true;
      return next;
    },
    CONTACT_INITIAL_STATE,
  );

  // Pages stay mounted (hidden) across navigations. Clear a finished
  // submission when this one is hidden so a later visit starts fresh.
  useLayoutEffect(() => {
    return () => {
      if (sentRef.current) {
        sentRef.current = false;
        startTransition(() => dispatch({ type: 'RESET' }));
      }
    };
  }, [dispatch]);

  if (state.status === 'success') {
    return (
      <div className="cf-form-success" role="status">
        <span className="cf-form-success-icon"><CheckIcon size={22} /></span>
        <h3 className="cf-h3">Thanks — we got it.</h3>
        <p>
          We&apos;ll reply {site.replyTime} with next steps and a rough estimate. If it&apos;s urgent,
          message us on{' '}
          <a className="cf-link" href={site.whatsapp.href} target="_blank" rel="noopener noreferrer">WhatsApp</a>.
        </p>
        <button type="button" className="cf-btn cf-btn--secondary cf-btn--sm" onClick={() => {
          sentRef.current = false;
          startTransition(() => dispatch({ type: 'RESET' }));
        }}>
          Send another message
        </button>
      </div>
    );
  }

  const v = state.values ?? {};
  const err = state.fieldErrors ?? {};
  const project = v.project ?? defaultProject;
  const budget = v.budget ?? '';

  return (
    <form
      className="cf-form"
      noValidate
      // Re-key on each failed attempt so defaultValue/defaultChecked pick up what was typed.
      key={state.status === 'error' ? JSON.stringify(state.values) : 'fresh'}
      action={(data) => dispatch({ type: 'SUBMIT', data })}
    >
      <input type="hidden" name="source" value={source} />

      <fieldset className="cf-fieldset">
        <legend className="cf-label"><span className="cf-step-no">1</span>What are we building?</legend>
        <div className="cf-choice-group">
          {PROJECT_TYPES.map((t) => (
            <label key={t} className="cf-choice">
              <input type="radio" name="project" value={t} defaultChecked={project === t} />
              <span>{t}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <fieldset className="cf-fieldset">
        <legend className="cf-label"><span className="cf-step-no">2</span>Budget range <span className="cf-label-hint">optional</span></legend>
        <div className="cf-choice-group">
          {BUDGETS.map((b) => (
            <label key={b} className="cf-choice">
              <input type="radio" name="budget" value={b} defaultChecked={budget === b} />
              <span>{b}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <p className="cf-label cf-label--section"><span className="cf-step-no">3</span>About you and the project</p>
      <div className="cf-form-row">
        <div className="cf-field">
          <label className="cf-label" htmlFor={`${id}-name`}>Your name</label>
          <input
            id={`${id}-name`} name="name" type="text" className="cf-input" autoComplete="name"
            placeholder="Jane Smith" required maxLength={120} defaultValue={v.name ?? ''}
            aria-invalid={err.name ? true : undefined}
            aria-describedby={err.name ? `${id}-name-err` : undefined}
          />
          {err.name && <p className="cf-field-error" id={`${id}-name-err`}>{err.name}</p>}
        </div>
        <div className="cf-field">
          <label className="cf-label" htmlFor={`${id}-email`}>Work email</label>
          <input
            id={`${id}-email`} name="email" type="email" className="cf-input" autoComplete="email"
            placeholder="jane@company.com" required maxLength={255} defaultValue={v.email ?? ''}
            aria-invalid={err.email ? true : undefined}
            aria-describedby={err.email ? `${id}-email-err` : undefined}
          />
          {err.email && <p className="cf-field-error" id={`${id}-email-err`}>{err.email}</p>}
        </div>
      </div>

      <div className="cf-field">
        <label className="cf-label" htmlFor={`${id}-message`}>
          Tell us about the project <span className="cf-label-hint">links, timeline, anything useful</span>
        </label>
        <textarea
          id={`${id}-message`} name="message" className="cf-input cf-textarea" rows={5}
          placeholder="We're building a marketplace for X. We need help with design and frontend. Launch is in Q3…"
          required maxLength={5000} defaultValue={v.message ?? ''}
          aria-invalid={err.message ? true : undefined}
          aria-describedby={err.message ? `${id}-message-err` : undefined}
        />
        {err.message && <p className="cf-field-error" id={`${id}-message-err`}>{err.message}</p>}
      </div>

      {/* Honeypot: hidden from people and assistive tech; bots fill it in. */}
      <div className="cf-hp" aria-hidden="true">
        <label>Company<input type="text" name="company" tabIndex={-1} autoComplete="off" /></label>
      </div>

      {state.status === 'error' && state.message && (
        <p className="cf-form-error" role="alert">{state.message}</p>
      )}

      <button type="submit" className="cf-btn cf-btn--primary cf-btn--lg cf-btn--block" disabled={pending}>
        {pending ? 'Sending…' : 'Send project brief'}
        {!pending && <ArrowIcon />}
      </button>
      <p className="cf-form-note">
        No commitment. We reply {site.replyTime}. Your details are only used to answer this message —{' '}
        <a className="cf-link" href="/privacy">privacy policy</a>.
      </p>
    </form>
  );
}
