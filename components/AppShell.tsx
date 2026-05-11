'use client';
import { useState, useEffect } from 'react';
import Loader from './Loader';
import Cursor from './Cursor';
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
import Blog from './Blog';
import Contact from './Contact';
import Footer from './Footer';
import BackToTop from './BackToTop';
import FloatingCTA from './FloatingCTA';

function useSmoothScroll(enabled: boolean) {
  useEffect(() => {
    if (!enabled) return;
    let target = window.scrollY, current = window.scrollY;
    let raf: number;

    const ease = 0.08;
    const onWheel = (e: WheelEvent) => {
      if (document.body.classList.contains('cf-reduced-motion')) return;
      if ((e.target as Element).closest('input, textarea, select')) return;
      e.preventDefault();
      target += e.deltaY;
      target = Math.max(0, Math.min(document.body.scrollHeight - window.innerHeight, target));
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
    return () => { cancelAnimationFrame(raf); window.removeEventListener('wheel', onWheel); };
  }, [enabled]);
}

export default function AppShell() {
  const [loading, setLoading] = useState(true);

  useSmoothScroll(!loading);

  return (
    <>
      {loading && <Loader done={() => setLoading(false)} />}
      <Cursor />
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
        <Blog />
        <Contact />
        <Footer />
      </main>
    </>
  );
}
