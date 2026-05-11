'use client';
import { useState, useEffect } from 'react';

export default function Loader({ done }: { done: () => void }) {
  const [pct, setPct] = useState(0);
  const [phase, setPhase] = useState<'loading' | 'hiding'>('loading');

  useEffect(() => {
    let v = 0;
    const tick = () => {
      v += Math.max(1, (100 - v) * 0.08);
      if (v >= 100) {
        v = 100;
        setPct(100);
        setTimeout(() => { setPhase('hiding'); setTimeout(done, 800); }, 400);
        return;
      }
      setPct(Math.round(v));
      setTimeout(tick, 40 + Math.random() * 40);
    };
    tick();
  }, [done]);

  const letters = 'CODEFLEE'.split('');
  return (
    <div className={`cf-loader ${phase === 'hiding' ? 'hidden' : ''}`}>
      <div className="cf-loader-top">
        <span>Studio · Est. 2020</span>
        <span>Dhaka · {new Date().getFullYear()}</span>
      </div>
      <div>
        <h1 className="cf-loader-wordmark">
          {letters.map((l, i) => (
            <span key={i} style={{ animationDelay: `${i * 0.06}s` }}>{l}</span>
          ))}
        </h1>
        <div className="cf-loader-bottom">
          <div className="cf-loader-count">{String(pct).padStart(3, '0')}<sup>%</sup></div>
          <div className="cf-loader-hint">Preparing canvas</div>
        </div>
      </div>
      <div className="cf-loader-bar" style={{ width: `${pct}%` }} />
    </div>
  );
}
