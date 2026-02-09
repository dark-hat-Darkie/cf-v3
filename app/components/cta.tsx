"use client";

import { motion, useInView } from "motion/react";
import { useRef } from "react";

export default function CTA() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <section id="contact" className="px-6 py-20">
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 40 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.7 }}
        className="relative mx-auto max-w-4xl overflow-hidden rounded-3xl bg-purple px-5 py-16 text-center text-white sm:px-8 md:px-16 md:py-20"
      >
        {/* Background decorations */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -right-20 -top-20 h-60 w-60 rounded-full bg-purple-mid/40 blur-2xl" />
          <div className="absolute -bottom-20 -left-20 h-60 w-60 rounded-full bg-pink/20 blur-2xl" />
        </div>

        <div className="relative">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-4 text-2xl font-bold tracking-tight sm:text-3xl md:text-5xl"
          >
            Ready to Bring Your
            <br />
            Ideas to Life?
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mx-auto mb-10 max-w-lg text-white/70"
          >
            Let&apos;s discuss your project and create something amazing
            together. Reach out and we&apos;ll get back to you within 24 hours.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center"
          >
            <a
              href="mailto:contact@codeflee.com"
              className="rounded-full bg-white px-8 py-3.5 text-sm font-semibold text-purple transition-all hover:shadow-xl hover:shadow-black/10"
            >
              contact@codeflee.com
            </a>
            <a
              href="tel:+8801716778254"
              className="rounded-full border border-white/20 px-8 py-3.5 text-sm font-medium text-white transition-all hover:bg-white/10"
            >
              +880 1716-778254
            </a>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
