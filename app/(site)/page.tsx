import { Suspense } from 'react';
import type { Metadata } from 'next';
import Hero from '@/components/Hero';
import Pillars from '@/components/Pillars';
import HomeFaq from '@/components/HomeFaq';
import Services from '@/components/Services';
import Work from '@/components/Work';
import Process from '@/components/Process';
import WhyCodeFlee from '@/components/WhyCodeFlee';
import Team from '@/components/Team';
import Testimonials from '@/components/Testimonials';
import Pricing from '@/components/Pricing';
import BlogHomepage from '@/components/BlogHomepage';
import Contact from '@/components/Contact';

export const metadata: Metadata = {
  alternates: { canonical: '/' },
};

export default function Page() {
  return (
    <>
      <Hero />
      <Pillars />
      <Work />
      <Services />
      <WhyCodeFlee />
      <Process />
      <Testimonials />
      <Team />
      <Pricing />
      <HomeFaq />
      <Suspense fallback={null}>
        <BlogHomepage />
      </Suspense>
      <Contact />
    </>
  );
}
