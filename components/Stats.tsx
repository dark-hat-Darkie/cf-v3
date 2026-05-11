'use client';
import { useState, useEffect, useRef } from 'react';

function useCounter(target: number, ref: React.RefObject<HTMLDivElement | null>, duration = 2000) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!ref.current) return;
    let started = false;
    let raf: number;
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting && !started) {
          started = true;
          const t0 = performance.now();
          const tick = (t: number) => {
            const p = Math.min(1, (t - t0) / duration);
            const eased = 1 - Math.pow(1 - p, 3);
            setVal(target * eased);
            if (p < 1) raf = requestAnimationFrame(tick);
          };
          raf = requestAnimationFrame(tick);
        }
      });
    }, { threshold: 0.3 });
    io.observe(ref.current);
    return () => { io.disconnect(); if (raf) cancelAnimationFrame(raf); };
  }, [target, duration, ref]);
  return val;
}

function Stat({ value, suffix, label, desc, decimals = 0 }: {
  value: number; suffix: string; label: string; desc: string; decimals?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const v = useCounter(value, ref);
  const shown = decimals ? v.toFixed(decimals) : Math.round(v).toLocaleString();
  return (
    <div className="cf-stat" ref={ref}>
      <div className="cf-stat-val">{shown}<sup>{suffix}</sup></div>
      <div className="cf-stat-lbl">{label}</div>
      <div className="cf-stat-desc">{desc}</div>
    </div>
  );
}

export default function Stats() {
  return (
    <section className="cf-sec cf-sec-white" id="stats">
      <div className="cf-wrap">
        <div className="cf-section-head">
          <div className="left">
            <div className="cf-eyebrow">Impact by numbers</div>
            <h2 className="cf-h2">Measured in <em className="grad">shipped work</em>, not promises.</h2>
          </div>
          <div className="right">
            Five years in. Every number is verifiable — ask for references and we&apos;ll hand them over.
          </div>
        </div>
        <div className="cf-stats-grid">
          <Stat value={60} suffix="+" label="Products shipped" desc="From MVPs to Series-B platforms." />
          <Stat value={12} suffix="" label="Countries served" desc="US · UK · UAE · AU · CA · DE · BD." />
          <Stat value={98} suffix="%" label="Repeat client rate" desc="We keep showing up for the next phase." />
          <Stat value={4.9} decimals={1} suffix="★" label="Clutch rating" desc="Based on 42 verified reviews." />
        </div>
      </div>
    </section>
  );
}
