"use client";

import { motion, useInView } from "motion/react";
import { useRef } from "react";
import Link from "next/link";
import { services } from "@/app/data/services";

function ServiceIcon({ path, className }: { path: string; className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className={className}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d={path} />
    </svg>
  );
}

function ServiceCard({
  service,
  index,
}: {
  service: (typeof services)[0];
  index: number;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const num = String(index + 1).padStart(2, "0");

  return (
    <Link href={`/services/${service.slug}`}>
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 40 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5, delay: index * 0.1 }}
        whileHover={{ y: -6 }}
        className="group relative overflow-hidden rounded-2xl border border-purple/5 bg-white/70 p-6 backdrop-blur-sm transition-all duration-500 hover:border-transparent hover:shadow-2xl hover:shadow-purple/10 sm:p-8"
      >
        {/* Animated gradient border on hover */}
        <motion.div
          className={`pointer-events-none absolute -inset-px rounded-2xl bg-gradient-to-br ${service.accent} opacity-0 transition-opacity duration-500 group-hover:opacity-100`}
          style={{ padding: "1px" }}
        >
          <div className="h-full w-full rounded-2xl bg-white" />
        </motion.div>

        {/* Corner accents */}
        <div className="pointer-events-none absolute -right-px -top-px h-12 w-12 rounded-tr-2xl border-r-2 border-t-2 border-purple/20 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        <div className="pointer-events-none absolute -bottom-px -left-px h-12 w-12 rounded-bl-2xl border-b-2 border-l-2 border-purple/20 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

        {/* Hover glow blob */}
        <div
          className={`pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full bg-gradient-to-br ${service.accent} opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-20`}
        />

        {/* Large background number */}
        <span className="pointer-events-none absolute -bottom-3 right-3 select-none font-mono text-7xl font-black leading-none text-purple/[0.03] transition-all duration-500 group-hover:text-purple/[0.07]">
          {num}
        </span>

        {/* Content */}
        <div className="relative">
          {/* Icon + number row */}
          <div className="mb-5 flex items-center justify-between">
            <div
              className={`inline-flex rounded-xl ${service.accentLight} p-3 text-purple transition-all duration-300 group-hover:bg-purple group-hover:text-white group-hover:shadow-lg group-hover:shadow-purple/15`}
            >
              <ServiceIcon path={service.iconPath} className="h-6 w-6" />
            </div>
            <span className="font-mono text-xs font-semibold tracking-widest text-muted/30 transition-colors duration-300 group-hover:text-purple/40">
              {num}
            </span>
          </div>

          <h3 className="mb-2 text-lg font-bold">{service.title}</h3>
          <p className="mb-5 text-sm leading-relaxed text-muted">
            {service.description}
          </p>

          {/* Learn more link */}
          <div className="flex items-center gap-2 text-sm font-medium text-purple/50 transition-all duration-300 group-hover:text-purple">
            <span>Learn more</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2.5}
              stroke="currentColor"
              className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"
              />
            </svg>
          </div>
        </div>
      </motion.div>
    </Link>
  );
}

export default function Services() {
  const headingRef = useRef(null);
  const isInView = useInView(headingRef, { once: true, margin: "-50px" });

  return (
    <section id="services" className="relative overflow-hidden px-6 py-20">
      {/* Background decorations */}
      <div className="pointer-events-none absolute inset-0">
        <div className="animate-blob absolute -right-40 top-20 h-[500px] w-[500px] rounded-full bg-purple/[0.04] blur-3xl" />
        <div className="animate-blob animation-delay-2000 absolute -left-40 bottom-0 h-[400px] w-[400px] rounded-full bg-pink/[0.04] blur-3xl" />
        <div className="animate-blob animation-delay-4000 absolute left-1/2 top-1/2 h-[300px] w-[300px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-purple-light/20 blur-3xl" />
        <div
          className="absolute inset-0 opacity-[0.015]"
          style={{
            backgroundImage:
              "radial-gradient(circle, var(--purple) 1px, transparent 1px)",
            backgroundSize: "24px 24px",
          }}
        />
      </div>

      <div ref={headingRef} className="relative mx-auto max-w-6xl">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-6 text-center"
        >
          <span className="mb-4 inline-block text-sm font-medium tracking-wide text-purple">
            WHAT WE DO
          </span>
          <h2 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
            Services We{" "}
            <span className="animate-gradient-text bg-gradient-to-r from-purple via-pink to-purple bg-[length:200%_auto] bg-clip-text text-transparent">
              Offer
            </span>
          </h2>
        </motion.div>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="mx-auto mb-16 max-w-lg text-center text-muted"
        >
          End-to-end digital solutions crafted to elevate your brand and
          accelerate your growth.
        </motion.p>

        {/* Cards grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service, i) => (
            <ServiceCard key={service.slug} service={service} index={i} />
          ))}
        </div>

        {/* Bottom decorative wave */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 1, delay: 0.8 }}
          className="mt-16 flex justify-center"
        >
          <svg
            width="200"
            height="30"
            viewBox="0 0 200 30"
            fill="none"
            className="text-purple/10"
          >
            <path
              d="M0 15 C 25 0, 50 0, 75 15 S 125 30, 150 15 S 175 0, 200 15"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              fill="none"
            />
            <circle cx="0" cy="15" r="3" fill="currentColor" />
            <circle cx="75" cy="15" r="3" fill="currentColor" />
            <circle cx="150" cy="15" r="3" fill="currentColor" />
            <circle cx="200" cy="15" r="3" fill="currentColor" />
          </svg>
        </motion.div>
      </div>
    </section>
  );
}
