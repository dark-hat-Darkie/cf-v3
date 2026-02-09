"use client";

import { motion, useInView } from "motion/react";
import { useRef } from "react";
import Link from "next/link";
import { projects } from "@/app/data/projects";

function ProjectCard({
  project,
  index,
  isInView,
}: {
  project: (typeof projects)[0];
  index: number;
  isInView: boolean;
}) {
  return (
    <Link href={`/projects/${project.slug}`}>
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6, delay: index * 0.12 }}
        className={`group relative overflow-hidden rounded-3xl ${
          project.size === "large" ? "md:col-span-1 row-span-1" : ""
        }`}
      >
      {/* Gradient visual */}
      <div
        className={`relative aspect-[4/3] bg-gradient-to-br ${project.gradient} p-5 flex flex-col justify-between sm:p-8`}
      >
        {/* Decorative elements */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -right-12 -top-12 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
          <div className="absolute -bottom-8 -left-8 h-32 w-32 rounded-full bg-white/5 blur-xl" />
          {/* Grid pattern */}
          <div
            className="absolute inset-0 opacity-[0.04]"
            style={{
              backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)",
              backgroundSize: "24px 24px",
            }}
          />
        </div>

        {/* Top: Categories */}
        <div className="relative flex flex-wrap gap-2">
          {project.categories.map((cat) => (
            <span
              key={cat}
              className="rounded-full bg-white/15 px-3 py-1 text-xs font-medium text-white backdrop-blur-sm"
            >
              {cat}
            </span>
          ))}
        </div>

        {/* Bottom: Info */}
        <div className="relative">
          {project.metric && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.4 + index * 0.12 }}
              className="mb-3 inline-flex items-center gap-2 rounded-full bg-white/20 px-3 py-1.5 backdrop-blur-sm"
            >
              <span className="text-lg font-bold text-white">{project.metric}</span>
              <span className="text-xs text-white/80">{project.metricLabel}</span>
            </motion.div>
          )}
          <h3 className="text-2xl font-bold text-white">{project.name}</h3>
          <p className="mt-1 text-sm text-white/60">{project.tagline}</p>
        </div>

        {/* Hover overlay */}
        <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition-all duration-300 group-hover:bg-black/20">
          <motion.div
            className="flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-foreground opacity-0 shadow-xl transition-all duration-300 group-hover:opacity-100"
            style={{ transform: "translateY(10px)" }}
          >
            View Project
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="h-4 w-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 19.5 15-15m0 0H8.25m11.25 0v11.25" />
            </svg>
          </motion.div>
        </div>
      </div>
      </motion.div>
    </Link>
  );
}

export default function Projects() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <section id="projects" className="relative px-6 py-20">
      {/* Background accent */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-0 top-1/3 h-96 w-96 rounded-full bg-purple-light/40 blur-3xl" />
      </div>

      <div className="mx-auto max-w-6xl">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-16 flex flex-col items-center text-center md:flex-row md:items-end md:justify-between md:text-left"
        >
          <div>
            <span className="mb-4 inline-block text-sm font-medium tracking-wide text-purple">
              OUR WORK
            </span>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
              Projects That
              <br />
              <span className="text-purple">Speak Results</span>
            </h2>
          </div>
          <p className="mt-4 max-w-sm text-muted md:mt-0">
            Real outcomes for real businesses. Here&apos;s a look at what we&apos;ve
            built and the impact we&apos;ve delivered.
          </p>
        </motion.div>

        {/* Bento grid */}
        <div className="grid gap-6 md:grid-cols-2">
          {projects.map((project, i) => (
            <ProjectCard
              key={project.name}
              project={project}
              index={i}
              isInView={isInView}
            />
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="mt-12 text-center"
        >
          <Link
            href="/projects/factwatch"
            className="inline-flex items-center gap-2 rounded-full border border-purple/15 bg-purple-light/30 px-7 py-3 text-sm font-medium text-purple transition-all hover:bg-purple hover:text-white hover:shadow-lg hover:shadow-purple/20"
          >
            View All Projects
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="h-4 w-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
            </svg>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
