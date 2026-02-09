"use client";

import { motion, useInView, useScroll, useTransform } from "motion/react";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { services } from "@/app/data/services";
import type { Service } from "@/app/data/services";

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

/* ── Hero ───────────────────────────────────────────────── */
function Hero({ service }: { service: Service }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <section ref={ref} className="relative min-h-[90vh] overflow-hidden">
      {/* Parallax background layer */}
      <motion.div className="pointer-events-none absolute inset-0" style={{ y: bgY }}>
        {/* Large gradient orbs */}
        <div
          className={`animate-blob absolute -left-40 -top-20 h-[700px] w-[700px] rounded-full bg-gradient-to-br ${service.accent} opacity-[0.08] blur-[120px]`}
        />
        <div className="animate-blob animation-delay-2000 absolute -right-20 top-1/3 h-[500px] w-[500px] rounded-full bg-pink/[0.06] blur-[100px]" />
        <div className="animate-blob animation-delay-4000 absolute bottom-0 left-1/3 h-[400px] w-[400px] rounded-full bg-purple-light/30 blur-[100px]" />

        {/* Dot grid */}
        <div
          className="absolute inset-0 opacity-[0.018]"
          style={{
            backgroundImage:
              "radial-gradient(circle, var(--purple) 1px, transparent 1px)",
            backgroundSize: "32px 32px",
          }}
        />
      </motion.div>

      {/* Content */}
      <motion.div
        style={{ opacity }}
        className="relative flex min-h-[90vh] items-center px-6"
      >
        <div className="mx-auto w-full max-w-6xl">
          {/* Top row: breadcrumb */}
          <motion.nav
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-12"
          >
            <div className="inline-flex items-center gap-2.5 rounded-full border border-purple/10 bg-white/60 px-4 py-2 text-xs font-medium backdrop-blur-md">
              <Link href="/" className="text-muted transition-colors hover:text-purple">
                Home
              </Link>
              <span className="h-3 w-px bg-purple/15" />
              <Link
                href="/#services"
                className="text-muted transition-colors hover:text-purple"
              >
                Services
              </Link>
              <span className="h-3 w-px bg-purple/15" />
              <span className="text-purple">{service.title}</span>
            </div>
          </motion.nav>

          {/* Main hero content — asymmetric layout */}
          <div className="grid items-end gap-12 lg:grid-cols-5">
            {/* Left: text content */}
            <div className="lg:col-span-3">
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="mb-6"
              >
                <span className="inline-flex items-center gap-2 text-sm font-medium tracking-wide text-purple">
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-purple/60" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-purple" />
                  </span>
                  {service.tagline.toUpperCase()}
                </span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 25 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.15 }}
                className="mb-6 text-5xl font-bold leading-[1.05] tracking-tight sm:text-6xl md:text-7xl"
              >
                {service.title.split(" ")[0]}{" "}
                <span className="animate-gradient-text bg-gradient-to-r from-purple via-pink to-purple bg-[length:200%_auto] bg-clip-text text-transparent">
                  {service.title.split(" ").slice(1).join(" ")}
                </span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.25 }}
                className="mb-10 max-w-xl text-lg leading-relaxed text-muted"
              >
                {service.heroDescription}
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.35 }}
                className="flex flex-wrap gap-4"
              >
                <Link
                  href="/#contact"
                  className="group relative overflow-hidden rounded-full bg-purple px-8 py-3.5 text-sm font-medium text-white shadow-lg shadow-purple/25 transition-shadow hover:shadow-xl hover:shadow-purple/30"
                >
                  <span className="relative z-10 flex items-center gap-2">
                    Start a Project
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={2.5}
                      stroke="currentColor"
                      className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"
                      />
                    </svg>
                  </span>
                  <motion.span
                    className="absolute inset-0 bg-purple-dark"
                    initial={{ x: "-100%" }}
                    whileHover={{ x: 0 }}
                    transition={{ duration: 0.3 }}
                  />
                </Link>
                <Link
                  href="/#services"
                  className="glow-border group relative rounded-full px-8 py-3.5 text-sm font-medium text-foreground"
                >
                  <span className="glow-line" />
                  <span className="glow-line-blur" />
                  <span className="absolute inset-[1px] z-[1] rounded-full bg-white/80 backdrop-blur-sm" />
                  <span className="relative z-10">All Services</span>
                </Link>
              </motion.div>
            </div>

            {/* Right: floating icon card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="hidden lg:col-span-2 lg:flex lg:justify-end"
            >
              <div className="relative">
                {/* Glow behind card */}
                <div
                  className={`absolute -inset-8 rounded-3xl bg-gradient-to-br ${service.accent} opacity-[0.12] blur-2xl`}
                />
                <div className="relative overflow-hidden rounded-3xl border border-white/50 bg-white/40 p-10 backdrop-blur-xl">
                  <div
                    className="absolute inset-0 opacity-[0.03]"
                    style={{
                      backgroundImage:
                        "radial-gradient(circle, var(--purple) 1px, transparent 1px)",
                      backgroundSize: "16px 16px",
                    }}
                  />
                  <div className="relative">
                    <div
                      className={`mb-6 inline-flex rounded-2xl bg-gradient-to-br ${service.accent} p-5 text-white shadow-lg`}
                    >
                      <ServiceIcon path={service.iconPath} className="h-10 w-10" />
                    </div>
                    <div className="space-y-3">
                      {service.features.slice(0, 4).map((f, i) => (
                        <div key={i} className="flex items-center gap-3">
                          <div className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-purple/10">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                              className="h-3 w-3 text-purple"
                            >
                              <path
                                fillRule="evenodd"
                                d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </div>
                          <span className="text-sm font-medium text-foreground/80">
                            {f.title}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Gradient fade to content */}
      <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
}

/* ── Features — Bento Grid ──────────────────────────────── */
function Features({ service }: { service: Service }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <section ref={ref} className="relative px-6 py-24">
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-16 max-w-2xl"
        >
          <span className="mb-4 inline-block text-sm font-medium tracking-wide text-purple">
            WHAT&apos;S INCLUDED
          </span>
          <h2 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
            Everything you need,{" "}
            <span className="text-muted">nothing you don&apos;t.</span>
          </h2>
        </motion.div>

        {/* Bento grid: first two cards span more */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {service.features.map((feature, i) => {
            const isLarge = i < 2;
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.08 + i * 0.07 }}
                className={`group relative overflow-hidden rounded-2xl border border-purple/[0.06] bg-white/60 backdrop-blur-sm transition-all duration-500 hover:border-purple/15 hover:bg-white/90 hover:shadow-2xl hover:shadow-purple/[0.06] ${
                  isLarge ? "sm:col-span-1 lg:row-span-1" : ""
                }`}
              >
                {/* Animated gradient border on hover */}
                <div
                  className={`pointer-events-none absolute -inset-px rounded-2xl bg-gradient-to-br ${service.accent} opacity-0 transition-opacity duration-500 group-hover:opacity-100`}
                  style={{ padding: "1px" }}
                >
                  <div className="h-full w-full rounded-2xl bg-white" />
                </div>

                {/* Glow */}
                <div
                  className={`pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-gradient-to-br ${service.accent} opacity-0 blur-3xl transition-opacity duration-700 group-hover:opacity-[0.12]`}
                />

                <div className={`relative ${isLarge ? "p-8" : "p-6"}`}>
                  {/* Number badge */}
                  <div className="mb-4 flex items-center gap-3">
                    <span
                      className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-purple/[0.06] font-mono text-xs font-semibold text-muted/40"
                    >
                      {String(i + 1).padStart(2, "0")}
                    </span>
                  </div>

                  <h3
                    className={`mb-2 font-bold ${isLarge ? "text-xl" : "text-base"}`}
                  >
                    {feature.title}
                  </h3>
                  <p
                    className={`leading-relaxed text-muted ${
                      isLarge ? "text-base" : "text-sm"
                    }`}
                  >
                    {feature.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ── Process — Vertical Timeline ────────────────────────── */
function TimelineStep({
  step,
  index,
  accent,
  total,
}: {
  step: { step: string; title: string; description: string };
  index: number;
  accent: string;
  total: number;
}) {
  const cardRef = useRef(null);
  const isInView = useInView(cardRef, { once: true, margin: "-100px" });
  const isRight = index % 2 === 1;

  return (
    <div
      ref={cardRef}
      className={`relative flex items-start gap-8 md:items-center ${
        isRight ? "md:flex-row-reverse" : ""
      }`}
    >
      {/* Timeline node */}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={isInView ? { scale: 1, opacity: 1 } : {}}
        transition={{ duration: 0.5, delay: 0.1, type: "spring", stiffness: 200 }}
        className="absolute left-6 z-10 md:left-1/2 md:-translate-x-1/2"
      >
        <div className="relative flex h-12 w-12 items-center justify-center">
          <motion.div
            initial={{ opacity: 0.08 }}
            animate={isInView ? { opacity: 0.2 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className={`absolute inset-0 rounded-full bg-gradient-to-br ${accent}`}
          />
          <div className="absolute inset-1 rounded-full bg-background" />
          <span className="relative font-mono text-xs font-bold text-purple">
            {step.step}
          </span>
        </div>
      </motion.div>

      {/* Card — slides in from the side */}
      <motion.div
        initial={{
          opacity: 0,
          x: isRight ? 60 : -60,
        }}
        animate={
          isInView
            ? { opacity: 1, x: 0 }
            : {}
        }
        transition={{ duration: 0.7, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
        className={`ml-20 flex-1 md:ml-0 ${
          isRight
            ? "md:mr-[calc(50%+2.5rem)] md:text-right"
            : "md:ml-[calc(50%+2.5rem)]"
        }`}
      >
        <div className="rounded-2xl border border-purple/[0.06] bg-white/60 p-6 backdrop-blur-sm transition-all duration-300 hover:bg-white/90 hover:shadow-lg hover:shadow-purple/[0.04] sm:p-8">
          <h3 className="mb-2 text-lg font-bold">{step.title}</h3>
          <p className="text-sm leading-relaxed text-muted">
            {step.description}
          </p>
        </div>
      </motion.div>
    </div>
  );
}

function Process({ service }: { service: Service }) {
  const sectionRef = useRef(null);
  const headingRef = useRef(null);
  const timelineRef = useRef<HTMLDivElement>(null);
  const headingInView = useInView(headingRef, { once: true, margin: "-60px" });

  // Scroll-driven fill for the center line
  const { scrollYProgress } = useScroll({
    target: timelineRef,
    offset: ["start 0.7", "end 0.7"],
  });
  const fillHeight = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <section ref={sectionRef} className="relative overflow-hidden px-6 py-24">
      {/* Background */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple/[0.015] to-transparent" />
      </div>

      <div className="relative mx-auto max-w-5xl">
        <motion.div
          ref={headingRef}
          initial={{ opacity: 0, y: 25 }}
          animate={headingInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-20 text-center"
        >
          <span className="mb-4 inline-block text-sm font-medium tracking-wide text-purple">
            OUR PROCESS
          </span>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
            From idea to{" "}
            <span className="animate-gradient-text bg-gradient-to-r from-purple via-pink to-purple bg-[length:200%_auto] bg-clip-text text-transparent">
              launch
            </span>
          </h2>
        </motion.div>

        {/* Timeline */}
        <div ref={timelineRef} className="relative">
          {/* Background line (muted track) */}
          <div className="absolute bottom-0 left-6 top-0 w-px bg-purple/[0.08] md:left-1/2 md:-translate-x-px" />

          {/* Scroll-driven fill line */}
          <motion.div
            style={{ height: fillHeight }}
            className="absolute left-6 top-0 w-px bg-gradient-to-b from-purple via-purple-mid to-pink md:left-1/2 md:-translate-x-px"
          />

          <div className="space-y-12 md:space-y-16">
            {service.process.map((step, i) => (
              <TimelineStep
                key={step.step}
                step={step}
                index={i}
                accent={service.accent}
                total={service.process.length}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── Tech Stack ─────────────────────────────────────────── */
function TechStack({ service }: { service: Service }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });

  if (!service.techStack || service.techStack.length === 0) return null;

  return (
    <section ref={ref} className="px-6 py-24">
      <div className="mx-auto max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-16 text-center"
        >
          <span className="mb-4 inline-block text-sm font-medium tracking-wide text-purple">
            TECH STACK
          </span>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Built with the best
          </h2>
        </motion.div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {service.techStack.map((tech, i) => (
            <motion.div
              key={tech}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.4, delay: 0.1 + i * 0.05 }}
              whileHover={{ y: -4 }}
              className="group relative overflow-hidden rounded-xl border border-purple/[0.06] bg-white/60 px-5 py-4 text-center backdrop-blur-sm transition-all duration-300 hover:border-purple/20 hover:bg-white hover:shadow-lg hover:shadow-purple/[0.06]"
            >
              <div
                className={`pointer-events-none absolute -right-6 -top-6 h-16 w-16 rounded-full bg-gradient-to-br ${service.accent} opacity-0 blur-xl transition-opacity duration-500 group-hover:opacity-15`}
              />
              <span className="relative text-sm font-semibold">{tech}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── FAQ ─────────────────────────────────────────────────── */
function FAQItem({
  question,
  answer,
  index,
  isInView,
  accent,
}: {
  question: string;
  answer: string;
  index: number;
  isInView: boolean;
  accent: string;
}) {
  const [open, setOpen] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.4, delay: 0.08 + index * 0.06 }}
      className={`group overflow-hidden rounded-xl border transition-all duration-300 ${
        open
          ? "border-purple/15 bg-white shadow-lg shadow-purple/[0.04]"
          : "border-purple/[0.06] bg-white/60 hover:border-purple/10 hover:bg-white/80"
      }`}
    >
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between p-5 text-left sm:p-6"
      >
        <div className="flex items-center gap-4 pr-4">
          <span
            className={`flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg font-mono text-[10px] font-bold transition-all duration-300 ${
              open
                ? `bg-gradient-to-br ${accent} text-white shadow-sm`
                : "bg-purple/5 text-purple/40"
            }`}
          >
            {String(index + 1).padStart(2, "0")}
          </span>
          <span className="text-[15px] font-medium">{question}</span>
        </div>
        <motion.div
          animate={{ rotate: open ? 45 : 0 }}
          transition={{ duration: 0.2 }}
          className={`flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full transition-colors duration-300 ${
            open ? "bg-purple text-white" : "bg-purple/5 text-purple"
          }`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="h-3.5 w-3.5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 4.5v15m7.5-7.5h-15"
            />
          </svg>
        </motion.div>
      </button>
      <motion.div
        initial={false}
        animate={
          open
            ? { height: "auto", opacity: 1 }
            : { height: 0, opacity: 0 }
        }
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="overflow-hidden"
      >
        <div className="px-5 pb-5 sm:px-6 sm:pb-6">
          <div className="ml-11 border-l-2 border-purple/10 pl-4">
            <p className="text-sm leading-relaxed text-muted">{answer}</p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

function FAQ({ service }: { service: Service }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <section ref={ref} className="px-6 py-24">
      <div className="mx-auto max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-16 text-center"
        >
          <span className="mb-4 inline-block text-sm font-medium tracking-wide text-purple">
            FAQ
          </span>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Got questions?
          </h2>
        </motion.div>

        <div className="space-y-3">
          {service.faqs.map((faq, i) => (
            <FAQItem
              key={faq.question}
              question={faq.question}
              answer={faq.answer}
              index={i}
              isInView={isInView}
              accent={service.accent}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── Other Services ─────────────────────────────────────── */
function OtherServices({ current }: { current: Service }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });
  const others = services.filter((s) => s.slug !== current.slug).slice(0, 3);

  return (
    <section ref={ref} className="relative px-6 py-24">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-purple/[0.015] to-transparent" />

      <div className="relative mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-16 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end"
        >
          <div>
            <span className="mb-4 inline-block text-sm font-medium tracking-wide text-purple">
              EXPLORE MORE
            </span>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Other services
            </h2>
          </div>
          <Link
            href="/#services"
            className="group flex items-center gap-2 text-sm font-medium text-purple"
          >
            View all
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"
              />
            </svg>
          </Link>
        </motion.div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {others.map((service, i) => (
            <motion.div
              key={service.slug}
              initial={{ opacity: 0, y: 25 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.1 + i * 0.08 }}
            >
              <Link href={`/services/${service.slug}`} className="group block">
                <div className="relative overflow-hidden rounded-2xl border border-purple/[0.06] bg-white/60 p-6 backdrop-blur-sm transition-all duration-500 hover:border-transparent hover:bg-white hover:shadow-2xl hover:shadow-purple/[0.06] sm:p-8">
                  {/* Animated gradient border */}
                  <div
                    className={`pointer-events-none absolute -inset-px rounded-2xl bg-gradient-to-br ${service.accent} opacity-0 transition-opacity duration-500 group-hover:opacity-100`}
                    style={{ padding: "1px" }}
                  >
                    <div className="h-full w-full rounded-2xl bg-white" />
                  </div>

                  <div
                    className={`pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full bg-gradient-to-br ${service.accent} opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-20`}
                  />

                  <div className="relative">
                    <div
                      className={`mb-5 inline-flex rounded-xl ${service.accentLight} p-3 text-purple transition-all duration-300 group-hover:bg-purple group-hover:text-white group-hover:shadow-lg group-hover:shadow-purple/15`}
                    >
                      <ServiceIcon path={service.iconPath} className="h-6 w-6" />
                    </div>
                    <h3 className="mb-2 text-lg font-bold">{service.title}</h3>
                    <p className="mb-5 text-sm leading-relaxed text-muted">
                      {service.description}
                    </p>
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
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── Bottom CTA — Full-width dark section ───────────────── */
function BottomCTA() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <section ref={ref} className="relative overflow-hidden bg-foreground px-6 py-24 sm:py-32">
      {/* Background decorations */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-40 -top-40 h-[500px] w-[500px] rounded-full bg-purple/20 blur-[120px]" />
        <div className="absolute -bottom-40 -right-40 h-[400px] w-[400px] rounded-full bg-pink/15 blur-[100px]" />
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "radial-gradient(circle, #fff 1px, transparent 1px)",
            backgroundSize: "24px 24px",
          }}
        />
      </div>

      <div className="relative mx-auto max-w-3xl text-center">
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <span className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-medium tracking-wide text-white/60 backdrop-blur-sm">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-purple-mid/80" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-purple-mid" />
            </span>
            READY TO START?
          </span>
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mb-5 text-3xl font-bold tracking-tight text-white sm:text-4xl md:text-5xl"
        >
          Let&apos;s build something{" "}
          <span className="animate-gradient-text bg-gradient-to-r from-purple-mid via-pink to-purple-mid bg-[length:200%_auto] bg-clip-text text-transparent">
            remarkable
          </span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mx-auto mb-10 max-w-md text-white/50"
        >
          Tell us about your project and we&apos;ll get back to you within 24 hours
          with a custom proposal.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex flex-col items-center justify-center gap-4 sm:flex-row"
        >
          <Link
            href="/#contact"
            className="group inline-flex items-center gap-2 rounded-full bg-white px-8 py-3.5 text-sm font-medium text-foreground shadow-lg transition-all hover:shadow-xl hover:shadow-white/10"
          >
            Get a Free Quote
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2.5}
              stroke="currentColor"
              className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"
              />
            </svg>
          </Link>
          <Link
            href="/#services"
            className="inline-flex items-center gap-2 rounded-full border border-white/10 px-8 py-3.5 text-sm font-medium text-white/70 transition-all hover:border-white/25 hover:text-white"
          >
            Explore Services
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

/* ── Footer ─────────────────────────────────────────────── */
function InternalFooter() {
  return (
    <footer className="border-t border-purple/5 px-6 py-10">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 sm:flex-row">
        <Link href="/">
          <Image src="/logo.svg" alt="CodeFlee" width={63} height={37} />
        </Link>
        <p className="text-xs text-muted/60">
          &copy; {new Date().getFullYear()} CodeFlee LLC. All rights reserved.
        </p>
      </div>
    </footer>
  );
}

/* ── Navbar ──────────────────────────────────────────────── */
function ServiceNavbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={`fixed left-0 right-0 top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "border-b border-purple/10 bg-white/70 shadow-sm backdrop-blur-xl"
          : "bg-transparent"
      }`}
    >
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/">
          <Image src="/logo.svg" alt="CodeFlee" width={63} height={37} priority />
        </Link>

        <div className="flex items-center gap-6">
          <Link
            href="/#services"
            className="text-sm font-medium text-muted transition-colors hover:text-purple"
          >
            Services
          </Link>
          <Link
            href="/#about"
            className="hidden text-sm font-medium text-muted transition-colors hover:text-purple sm:inline"
          >
            About
          </Link>
          <Link
            href="/#contact"
            className="group relative inline-flex items-center gap-1.5 rounded-full px-5 py-2 text-sm font-medium text-white"
          >
            <span className="pointer-events-none absolute -inset-1 animate-glow rounded-full bg-purple blur-md" />
            <span className="absolute inset-0 rounded-full bg-purple" />
            <span className="relative">Contact Us</span>
          </Link>
        </div>
      </nav>
    </motion.header>
  );
}

/* ── Main Layout ────────────────────────────────────────── */
export default function ServiceDetail({ service }: { service: Service }) {
  return (
    <>
      <ServiceNavbar />
      <Hero service={service} />
      <Features service={service} />
      <Process service={service} />
      <TechStack service={service} />
      <FAQ service={service} />
      <OtherServices current={service} />
      <BottomCTA />
      <InternalFooter />
    </>
  );
}
