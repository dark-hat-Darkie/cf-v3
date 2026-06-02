'use client';
import { useState, useEffect } from 'react';
import Loader from './Loader';
import Nav from './Nav';
import Hero from './Hero';
import Marquee from './Marquee';
import Services from './Services';
import Work from './Work';
import Process from './Process';
import Compare from './Compare';
import Stats from './Stats';
import Team from './Team';
import Testimonials from './Testimonials';
import Pricing from './Pricing';
import Contact from './Contact';
import type { ReactNode } from 'react';
import Footer from './Footer';
import BackToTop from './BackToTop';
import FloatingCTA from './FloatingCTA';
import { SMOOTH_SCROLL_EVENT } from '@/lib/smooth-scroll';

function useSmoothScroll(enabled: boolean) {
  useEffect(() => {
    const isTouch =
      window.matchMedia?.('(hover: none), (pointer: coarse)').matches ?? false;
    const useCustom = enabled && !isTouch;

    let target = window.scrollY, current = window.scrollY;
    let raf: number;

    const clamp = (y: number) =>
      Math.max(0, Math.min(document.body.scrollHeight - window.innerHeight, y));

    // Programmatic scroll requests (nav links, back-to-top, etc.). When the
    // custom loop is active we steer it via `target`; otherwise scroll natively.
    const onScrollTo = (e: Event) => {
      const y = (e as CustomEvent<number>).detail;
      if (useCustom) target = clamp(y);
      else window.scrollTo({ top: y, behavior: 'smooth' });
    };
    window.addEventListener(SMOOTH_SCROLL_EVENT, onScrollTo);

    if (!useCustom) {
      return () => window.removeEventListener(SMOOTH_SCROLL_EVENT, onScrollTo);
    }

    const ease = 0.08;
    const onWheel = (e: WheelEvent) => {
      if (document.body.classList.contains('cf-reduced-motion')) return;
      if ((e.target as Element).closest('input, textarea, select')) return;
      e.preventDefault();
      target += e.deltaY;
      target = clamp(target);
    };
    const loop = () => {
      current += (target - current) * ease;
      if (Math.abs(target - current) < 0.1) current = target;
      window.scrollTo(0, current);
      raf = requestAnimationFrame(loop);
    };
    target = window.scrollY; current = window.scrollY;
    window.addEventListener('wheel', onWheel, { passive: false });
    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('wheel', onWheel);
      window.removeEventListener(SMOOTH_SCROLL_EVENT, onScrollTo);
    };
  }, [enabled]);
}

export default function AppShell({ blogSection }: { blogSection: ReactNode }) {
  const [loading, setLoading] = useState(true);

  useSmoothScroll(!loading);

  return (
    <>
      {loading && <Loader done={() => setLoading(false)} />}
      <BackToTop />
      <FloatingCTA />
      <Nav />
      <main style={{ opacity: loading ? 0 : 1, transition: 'opacity .6s ease' }}>
        <Hero />
        <Marquee />
        <Services />
        <Work />
        <Process />
        <Compare />
        <Stats />
        <Team />
        <Testimonials />
        <Pricing />
        {blogSection}
        <Contact />
        <Footer />
      </main>
    </>
  );
}
