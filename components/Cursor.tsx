'use client';
import { useEffect, useRef } from 'react';

/**
 * A small label that follows the pointer while it is over an element with a
 * `data-cursor="…"` attribute (work cards). The system cursor is never hidden.
 */
export default function Cursor() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia?.('(hover: none), (pointer: coarse)').matches) return;

    let raf = 0;
    let x = 0, y = 0;
    const paint = () => {
      raf = 0;
      el.style.transform = `translate(${x + 16}px, ${y + 18}px)`;
    };
    const onMove = (e: MouseEvent) => {
      x = e.clientX; y = e.clientY;
      const target = (e.target as Element | null)?.closest?.('[data-cursor]') as HTMLElement | null;
      const label = target?.dataset.cursor;
      if (label) {
        if (el.textContent !== label) el.textContent = label;
        el.classList.add('visible');
        if (!raf) raf = requestAnimationFrame(paint);
      } else {
        el.classList.remove('visible');
      }
    };
    const hide = () => el.classList.remove('visible');

    window.addEventListener('mousemove', onMove, { passive: true });
    window.addEventListener('scroll', hide, { passive: true });
    document.addEventListener('mouseleave', hide);
    return () => {
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('scroll', hide);
      document.removeEventListener('mouseleave', hide);
      hide();
    };
  }, []);

  return <div className="cf-cursor-label" ref={ref} aria-hidden="true" />;
}
