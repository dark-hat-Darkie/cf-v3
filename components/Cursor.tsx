'use client';
import { useRef, useEffect } from 'react';

export default function Cursor() {
  const ringRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLDivElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let mx = window.innerWidth / 2, my = window.innerHeight / 2;
    let rx = mx, ry = my, dx = mx, dy = my;
    let raf: number;

    const onMove = (e: MouseEvent) => { mx = e.clientX; my = e.clientY; };
    const loop = () => {
      rx += (mx - rx) * 0.18;
      ry += (my - ry) * 0.18;
      dx += (mx - dx) * 0.5;
      dy += (my - dy) * 0.5;
      if (ringRef.current) ringRef.current.style.transform = `translate(${rx}px, ${ry}px)`;
      if (dotRef.current) dotRef.current.style.transform = `translate(${dx}px, ${dy}px)`;
      raf = requestAnimationFrame(loop);
    };
    window.addEventListener('mousemove', onMove);
    raf = requestAnimationFrame(loop);

    const onOver = (e: MouseEvent) => {
      const target = e.target as Element;
      const t = target.closest('[data-cursor]') as HTMLElement | null;
      const hover = target.closest('a, button, [data-hover]');
      if (wrapRef.current) {
        if (t && t.dataset.cursor) {
          wrapRef.current.classList.add('has-label', 'hover');
          if (labelRef.current) labelRef.current.textContent = t.dataset.cursor;
        } else if (hover) {
          wrapRef.current.classList.add('hover');
          wrapRef.current.classList.remove('has-label');
        } else {
          wrapRef.current.classList.remove('hover', 'has-label');
        }
      }
    };
    document.addEventListener('mouseover', onOver);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseover', onOver);
    };
  }, []);

  return (
    <div className="cf-cursor" ref={wrapRef}>
      <div className="cf-cursor-ring" ref={ringRef}>
        <div className="cf-cursor-label" ref={labelRef}>VIEW</div>
      </div>
      <div className="cf-cursor-dot" ref={dotRef} />
    </div>
  );
}
