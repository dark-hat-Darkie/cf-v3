"use client";

import { motion, useInView, useMotionValue, useTransform, animate, AnimatePresence } from "motion/react";
import { useRef, useEffect, useState, useCallback } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { projects } from "@/app/data/projects";
import { notFound } from "next/navigation";

/* ─── Animated counter ─── */
function AnimatedCounter({ target, suffix = "" }: { target: string; suffix?: string }) {
  const num = parseFloat(target.replace(/[^0-9.]/g, ""));
  const prefix = target.match(/^[^0-9.]*/)?.[0] || "";
  const afterSuffix = target.match(/[^0-9.]*$/)?.[0] || "";
  const hasDecimal = target.includes(".");
  const count = useMotionValue(0);
  const rounded = useTransform(count, (v) =>
    hasDecimal ? `${prefix}${v.toFixed(1)}${afterSuffix}${suffix}` : `${prefix}${Math.round(v)}${afterSuffix}${suffix}`
  );
  const [display, setDisplay] = useState(`${prefix}0${afterSuffix}${suffix}`);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (!isInView) return;
    const controls = animate(count, num, { duration: 2, delay: 0.3 });
    const unsub = rounded.on("change", (v) => setDisplay(v));
    return () => { controls.stop(); unsub(); };
  }, [count, rounded, num, isInView]);

  return <span ref={ref}>{display}</span>;
}

/* ─── Gallery Lightbox ─── */
function GalleryLightbox({
  items,
  activeIndex,
  onClose,
  onPrev,
  onNext,
}: {
  items: { label: string; gradient: string }[];
  activeIndex: number;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") onPrev();
      if (e.key === "ArrowRight") onNext();
    };
    window.addEventListener("keydown", handler);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", handler);
      document.body.style.overflow = "";
    };
  }, [onClose, onPrev, onNext]);

  const item = items[activeIndex];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-xl"
      onClick={onClose}
    >
      <motion.div
        key={activeIndex}
        initial={{ opacity: 0, scale: 0.92 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.92 }}
        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        className="relative mx-4 aspect-video w-full max-w-5xl overflow-hidden rounded-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className={`absolute inset-0 bg-gradient-to-br ${item.gradient}`} />
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)",
            backgroundSize: "24px 24px",
          }}
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="mb-3 inline-flex rounded-full bg-white/10 px-4 py-1.5 text-xs font-medium text-white/60 backdrop-blur-sm">
              {activeIndex + 1} / {items.length}
            </div>
            <p className="text-2xl font-bold text-white sm:text-3xl">{item.label}</p>
          </div>
        </div>
      </motion.div>

      {/* Nav buttons */}
      <button
        onClick={(e) => { e.stopPropagation(); onPrev(); }}
        className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-white/10 p-3 text-white backdrop-blur-sm transition-all hover:bg-white/20"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="h-5 w-5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
        </svg>
      </button>
      <button
        onClick={(e) => { e.stopPropagation(); onNext(); }}
        className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-white/10 p-3 text-white backdrop-blur-sm transition-all hover:bg-white/20"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="h-5 w-5">
          <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
        </svg>
      </button>

      {/* Close */}
      <button
        onClick={onClose}
        className="absolute right-4 top-4 rounded-full bg-white/10 p-2.5 text-white backdrop-blur-sm transition-all hover:bg-white/20"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="h-5 w-5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
        </svg>
      </button>
    </motion.div>
  );
}

/* ─── Section Label ─── */
function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <span className="mb-4 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-purple">
      <span className="h-px w-6 bg-purple/40" />
      {children}
    </span>
  );
}

export default function ProjectDetail() {
  const { slug } = useParams<{ slug: string }>();
  const projectIndex = projects.findIndex((p) => p.slug === slug);
  const project = projects[projectIndex];

  const overviewRef = useRef(null);
  const challengeRef = useRef(null);
  const solutionRef = useRef(null);
  const resultsRef = useRef(null);
  const galleryRef = useRef(null);

  const overviewInView = useInView(overviewRef, { once: true, margin: "-80px" });
  const challengeInView = useInView(challengeRef, { once: true, margin: "-80px" });
  const solutionInView = useInView(solutionRef, { once: true, margin: "-80px" });
  const resultsInView = useInView(resultsRef, { once: true, margin: "-80px" });
  const galleryInView = useInView(galleryRef, { once: true, margin: "-80px" });

  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const handlePrev = useCallback(() => {
    if (!project) return;
    setLightboxIndex((i) => (i === null ? null : (i - 1 + project.gallery.length) % project.gallery.length));
  }, [project]);

  const handleNext = useCallback(() => {
    if (!project) return;
    setLightboxIndex((i) => (i === null ? null : (i + 1) % project.gallery.length));
  }, [project]);

  if (!project) {
    notFound();
  }

  const nextProject = projects[(projectIndex + 1) % projects.length];

  return (
    <div className="min-h-screen bg-background">
      {/* ─── Navbar ─── */}
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="fixed left-0 right-0 top-0 z-50 border-b border-white/[0.06] bg-background/60 backdrop-blur-2xl"
      >
        <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link href="/">
            <Image src="/logo.svg" alt="CodeFlee" width={63} height={37} priority />
          </Link>
          <Link
            href="/#projects"
            className="group inline-flex items-center gap-2 rounded-full border border-purple/10 bg-white/80 px-4 py-2 text-xs font-semibold text-muted backdrop-blur-sm transition-all hover:border-purple/30 hover:text-purple hover:shadow-lg hover:shadow-purple/5"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-0.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
            </svg>
            All Projects
          </Link>
        </nav>
      </motion.header>

      {/* ─── Hero ─── */}
      <section className={`grain-overlay relative flex min-h-[90vh] items-end overflow-hidden bg-gradient-to-br ${project.gradient}`}>
        {/* Soft radial glow */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-1/2 top-1/3 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/[0.06] blur-[100px]" />
          <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-background/20 to-transparent" />
        </div>

        {/* Minimal grid lines */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)",
            backgroundSize: "80px 80px",
          }}
        />

        {/* Content */}
        <div className="relative z-[2] mx-auto w-full max-w-6xl px-6 pb-20 pt-44 sm:pb-28">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.15 }}
          >
            {/* Badge */}
            <span className="mb-8 inline-flex items-center gap-2.5 rounded-full border border-white/15 bg-white/[0.07] px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.15em] text-white/80 backdrop-blur-md">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white/60" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-white" />
              </span>
              Case Study &middot; {project.year}
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="max-w-4xl text-4xl font-extrabold leading-[1.05] tracking-tight text-white sm:text-5xl md:text-6xl lg:text-7xl"
          >
            {project.headline}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.45 }}
            className="mt-6 max-w-xl text-base leading-relaxed text-white/50 sm:text-lg"
          >
            {project.description}
          </motion.p>

          {/* Bottom row: categories + metric */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="mt-10 flex flex-wrap items-end justify-between gap-6"
          >
            <div className="flex flex-wrap gap-2">
              {project.categories.map((cat) => (
                <span
                  key={cat}
                  className="rounded-full border border-white/10 bg-white/[0.06] px-4 py-1.5 text-xs font-medium text-white/70 backdrop-blur-sm"
                >
                  {cat}
                </span>
              ))}
            </div>

            {project.metric && (
              <div className="flex items-baseline gap-2">
                <span className="text-5xl font-black tracking-tight text-white sm:text-6xl">{project.metric}</span>
                <span className="text-sm font-medium text-white/50">{project.metricLabel}</span>
              </div>
            )}
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-6 left-1/2 z-[2] -translate-x-1/2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
        >
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="flex h-9 w-5 items-start justify-center rounded-full border border-white/20 p-1.5"
          >
            <motion.div className="h-1.5 w-1.5 rounded-full bg-white/60" />
          </motion.div>
        </motion.div>
      </section>

      {/* ─── Meta strip ─── */}
      <section className="relative border-b border-purple/[0.04]">
        <div className="mx-auto grid max-w-6xl grid-cols-2 sm:grid-cols-4">
          {[
            { label: "Client", value: project.client, icon: "building" },
            { label: "Duration", value: project.duration, icon: "clock" },
            { label: "Team", value: project.teamSize, icon: "users" },
            { label: "Role", value: project.role, icon: "code" },
          ].map((item, i) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="relative px-6 py-8 sm:py-10"
            >
              {i > 0 && (
                <div className="absolute left-0 top-1/2 hidden h-8 w-px -translate-y-1/2 bg-gradient-to-b from-transparent via-purple/10 to-transparent sm:block" />
              )}
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-purple/40">
                {item.label}
              </p>
              <p className="mt-2 text-sm font-semibold text-foreground">
                {item.value}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ─── Overview + Scope ─── */}
      <section ref={overviewRef} className="relative overflow-hidden px-6 py-28">
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute right-0 top-1/3 h-[500px] w-[500px] rounded-full bg-purple/[0.02] blur-[120px]" />
        </div>

        <div className="mx-auto max-w-6xl">
          <div className="grid items-start gap-16 lg:grid-cols-5">
            {/* Left: Overview */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={overviewInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7 }}
              className="lg:col-span-3"
            >
              <SectionLabel>Overview</SectionLabel>
              <h2 className="mb-6 text-3xl font-bold tracking-tight sm:text-4xl">
                About the{" "}
                <span className="animate-gradient-text bg-gradient-to-r from-purple via-pink to-purple bg-[length:200%_auto] bg-clip-text text-transparent">
                  Project
                </span>
              </h2>
              <p className="text-base leading-[1.8] text-muted sm:text-lg">
                {project.description}
              </p>

              {/* Tech stack */}
              <div className="mt-12">
                <p className="mb-4 text-[10px] font-bold uppercase tracking-[0.2em] text-purple/40">
                  Tech Stack
                </p>
                <div className="flex flex-wrap gap-2">
                  {project.techStack.map((tech, i) => (
                    <motion.span
                      key={tech}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={overviewInView ? { opacity: 1, scale: 1 } : {}}
                      transition={{ duration: 0.4, delay: 0.3 + i * 0.06, type: "spring", stiffness: 300 }}
                      className="rounded-lg border border-purple/8 bg-purple/[0.04] px-3.5 py-2 text-xs font-semibold text-purple transition-all hover:border-purple/20 hover:bg-purple hover:text-white hover:shadow-lg hover:shadow-purple/10"
                    >
                      {tech}
                    </motion.span>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Right: Scope card */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={overviewInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.15 }}
              className="lg:col-span-2"
            >
              <div className="glow-border relative rounded-2xl p-px">
                <span className="glow-line" />
                <span className="glow-line-blur" />
                <div className="relative z-[1] rounded-2xl bg-white p-7">
                  <p className="mb-5 text-[10px] font-bold uppercase tracking-[0.2em] text-purple/40">
                    Project Scope
                  </p>
                  <div className="space-y-3.5">
                    {project.scope.map((item, i) => (
                      <motion.div
                        key={item}
                        initial={{ opacity: 0, x: 12 }}
                        animate={overviewInView ? { opacity: 1, x: 0 } : {}}
                        transition={{ duration: 0.3, delay: 0.35 + i * 0.06 }}
                        className="flex items-center gap-3"
                      >
                        <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-purple">
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="white" className="h-3 w-3">
                            <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                          </svg>
                        </div>
                        <span className="text-sm font-medium text-foreground/80">{item}</span>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className="mx-auto max-w-6xl px-6">
        <div className="gradient-rule" />
      </div>

      {/* ─── Challenge & Solution (combined bento) ─── */}
      <section ref={challengeRef} className="relative overflow-hidden px-6 py-28">
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute left-0 top-1/3 h-[400px] w-[400px] rounded-full bg-purple-light/20 blur-[120px]" />
        </div>

        <div className="mx-auto max-w-6xl">
          {/* Challenges */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={challengeInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="mb-14"
          >
            <SectionLabel>The Challenge</SectionLabel>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Problems We{" "}
              <span className="animate-gradient-text bg-gradient-to-r from-purple via-pink to-purple bg-[length:200%_auto] bg-clip-text text-transparent">
                Tackled
              </span>
            </h2>
          </motion.div>

          <div className="grid gap-4 sm:grid-cols-2">
            {project.challenges.map((challenge, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                animate={challengeInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.1 + i * 0.08 }}
                className="group relative overflow-hidden rounded-2xl border border-purple/[0.06] bg-white p-6 transition-all duration-300 hover:border-purple/15 hover:shadow-xl hover:shadow-purple/[0.06]"
              >
                <div className="flex items-start gap-4">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-purple/10 to-pink/10 font-mono text-xs font-bold text-purple transition-all duration-300 group-hover:from-purple group-hover:to-purple-mid group-hover:text-white">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <p className="text-sm leading-relaxed text-foreground/70">{challenge}</p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Solutions */}
          <motion.div
            ref={solutionRef}
            initial={{ opacity: 0, y: 30 }}
            animate={solutionInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="mb-14 mt-24"
          >
            <SectionLabel>The Solution</SectionLabel>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              How We{" "}
              <span className="animate-gradient-text bg-gradient-to-r from-purple via-pink to-purple bg-[length:200%_auto] bg-clip-text text-transparent">
                Delivered
              </span>
            </h2>
          </motion.div>

          <div className="grid gap-4 sm:grid-cols-2">
            {project.solutions.map((solution, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                animate={solutionInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.1 + i * 0.08 }}
                className="group relative overflow-hidden rounded-2xl border border-purple/[0.06] bg-white p-6 transition-all duration-300 hover:border-purple/15 hover:shadow-xl hover:shadow-purple/[0.06]"
              >
                <div className="flex items-start gap-4">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-purple to-purple-mid text-white font-mono text-xs font-bold transition-all duration-300 group-hover:shadow-lg group-hover:shadow-purple/20">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="h-3.5 w-3.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                    </svg>
                  </span>
                  <p className="text-sm leading-relaxed text-foreground/70">{solution}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Results ─── */}
      <section ref={resultsRef} className={`grain-overlay relative overflow-hidden bg-gradient-to-br ${project.gradient} px-6 py-28`}>
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-1/2 top-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/[0.04] blur-[100px]" />
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage:
                "linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)",
              backgroundSize: "80px 80px",
            }}
          />
        </div>

        <div className="relative z-[2] mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={resultsInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="mb-16 text-center"
          >
            <span className="mb-4 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-white/40">
              <span className="h-px w-6 bg-white/20" />
              Results
              <span className="h-px w-6 bg-white/20" />
            </span>
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl md:text-5xl">
              Impact & Outcomes
            </h2>
          </motion.div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {project.results.map((result, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30, scale: 0.95 }}
                animate={resultsInView ? { opacity: 1, y: 0, scale: 1 } : {}}
                transition={{ duration: 0.5, delay: 0.1 + i * 0.08, type: "spring", stiffness: 200 }}
                className="group relative overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.06] p-8 text-center backdrop-blur-md transition-all duration-300 hover:border-white/15 hover:bg-white/[0.1]"
              >
                <p className="relative text-4xl font-black tracking-tight text-white sm:text-5xl">
                  <AnimatedCounter target={result.value} />
                </p>
                <p className="relative mt-3 text-sm font-medium text-white/50">
                  {result.label}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Gallery ─── */}
      <section ref={galleryRef} className="relative overflow-hidden px-6 py-28">
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute right-1/4 top-1/3 h-[500px] w-[500px] rounded-full bg-purple/[0.02] blur-[120px]" />
        </div>

        <div className="mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={galleryInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="mb-14"
          >
            <SectionLabel>Gallery</SectionLabel>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Visual{" "}
              <span className="animate-gradient-text bg-gradient-to-r from-purple via-pink to-purple bg-[length:200%_auto] bg-clip-text text-transparent">
                Showcase
              </span>
            </h2>
            <p className="mt-3 max-w-lg text-muted">
              A glimpse into the screens, interfaces, and experiences we crafted.
            </p>
          </motion.div>

          {/* Bento gallery grid */}
          <div className="grid auto-rows-[200px] grid-cols-2 gap-3 sm:auto-rows-[220px] md:grid-cols-3 lg:auto-rows-[240px]">
            {project.gallery.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                animate={galleryInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.08 * i }}
                onClick={() => setLightboxIndex(i)}
                className={`group relative cursor-pointer overflow-hidden rounded-2xl transition-all duration-300 hover:shadow-2xl hover:shadow-purple/10 ${
                  item.span === "wide" ? "md:col-span-2" : ""
                } ${item.span === "tall" ? "row-span-2" : ""}`}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${item.gradient} transition-transform duration-500 group-hover:scale-105`} />

                {/* Grid overlay */}
                <div
                  className="absolute inset-0 opacity-[0.04] transition-opacity duration-300 group-hover:opacity-[0.08]"
                  style={{
                    backgroundImage:
                      "linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)",
                    backgroundSize: "40px 40px",
                  }}
                />

                {/* Decorative elements */}
                <div className="absolute inset-0 flex items-center justify-center opacity-[0.06]">
                  <div className="h-24 w-24 rounded-2xl border-2 border-white" />
                </div>

                {/* Label */}
                <div className="absolute inset-0 flex items-end p-5">
                  <div className="flex w-full items-center justify-between">
                    <span className="rounded-lg bg-black/20 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur-md">
                      {item.label}
                    </span>
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-white opacity-0 backdrop-blur-md transition-all duration-300 group-hover:opacity-100">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="h-3.5 w-3.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15" />
                      </svg>
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxIndex !== null && (
          <GalleryLightbox
            items={project.gallery}
            activeIndex={lightboxIndex}
            onClose={() => setLightboxIndex(null)}
            onPrev={handlePrev}
            onNext={handleNext}
          />
        )}
      </AnimatePresence>

      {/* Divider */}
      <div className="mx-auto max-w-6xl px-6">
        <div className="gradient-rule" />
      </div>

      {/* ─── Next Project CTA ─── */}
      <section className="relative overflow-hidden px-6 py-28">
        <div className="mx-auto max-w-6xl">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            {/* CTA */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
            >
              <SectionLabel>Like what you see?</SectionLabel>
              <h2 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl">
                Have a similar project{" "}
                <span className="text-purple">in mind?</span>
              </h2>
              <p className="mb-8 max-w-md text-muted">
                Let&apos;s talk about how we can help bring your vision to life
                with the same dedication and expertise.
              </p>
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                <Link
                  href="/#contact"
                  className="group relative inline-flex items-center gap-2.5 overflow-hidden rounded-full bg-purple px-8 py-3.5 text-sm font-semibold text-white shadow-lg shadow-purple/20 transition-shadow hover:shadow-xl hover:shadow-purple/30"
                >
                  <span className="relative z-10">Start a Conversation</span>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="relative z-10 h-4 w-4 transition-transform group-hover:translate-x-0.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                  </svg>
                  <span className="absolute inset-0 bg-gradient-to-r from-purple-dark to-purple opacity-0 transition-opacity group-hover:opacity-100" />
                </Link>
              </motion.div>
            </motion.div>

            {/* Next project card */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.15 }}
            >
              <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.2em] text-muted/40">
                Next Project
              </p>
              <Link href={`/projects/${nextProject.slug}`}>
                <div className={`grain-overlay group relative overflow-hidden rounded-2xl bg-gradient-to-br ${nextProject.gradient} p-8 transition-all duration-300 hover:shadow-2xl hover:shadow-purple/15 sm:p-10`}>
                  {/* Grid overlay */}
                  <div
                    className="pointer-events-none absolute inset-0 opacity-[0.03]"
                    style={{
                      backgroundImage:
                        "linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)",
                      backgroundSize: "60px 60px",
                    }}
                  />

                  <div className="relative z-[2]">
                    <div className="mb-4 flex flex-wrap gap-2">
                      {nextProject.categories.map((cat) => (
                        <span key={cat} className="rounded-full border border-white/10 bg-white/[0.06] px-3 py-1 text-xs font-medium text-white/70 backdrop-blur-sm">
                          {cat}
                        </span>
                      ))}
                    </div>
                    {nextProject.metric && (
                      <div className="mb-3 inline-flex items-baseline gap-2">
                        <span className="text-2xl font-black text-white">{nextProject.metric}</span>
                        <span className="text-xs text-white/50">{nextProject.metricLabel}</span>
                      </div>
                    )}
                    <h3 className="text-2xl font-bold text-white">{nextProject.name}</h3>
                    <p className="mt-1 text-sm text-white/50">{nextProject.tagline}</p>

                    <div className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-white/80 transition-all group-hover:gap-3 group-hover:text-white">
                      View Case Study
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="h-4 w-4 transition-transform group-hover:translate-x-1">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                      </svg>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ─── Footer ─── */}
      <footer className="border-t border-purple/[0.06] px-6 py-8">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <Link href="/">
            <Image src="/logo.svg" alt="CodeFlee" width={50} height={30} />
          </Link>
          <p className="text-xs text-muted/60">
            &copy; {new Date().getFullYear()} CodeFlee. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
