export const SMOOTH_SCROLL_EVENT = 'cf-scrollto';

/**
 * Request a smooth scroll to an absolute Y position.
 *
 * The landing page runs a custom wheel-driven smooth-scroll loop (see
 * `useSmoothScroll` in AppShell) that continuously drives `window.scrollTo`,
 * which would otherwise override a native `scrollTo({ behavior: 'smooth' })`.
 * Dispatching this event lets that loop perform the scroll instead; when the
 * loop isn't active (touch devices / before mount) it falls back to native.
 */
export function smoothScrollTo(top: number) {
  if (typeof window === 'undefined') return;
  window.dispatchEvent(new CustomEvent<number>(SMOOTH_SCROLL_EVENT, { detail: top }));
}
