"use client";

import { motion, useInView, useAnimationControls } from "motion/react";
import { useRef, useState, useEffect, useCallback } from "react";

const testimonials = [
  {
    quote:
      "CodeFlee transformed our outdated platform into a modern, high-performance product. Their team delivered ahead of schedule and the results exceeded our expectations.",
    name: "Sarah Chen",
    role: "CTO",
    company: "FactWatch",
    initials: "SC",
  },
  {
    quote:
      "Working with CodeFlee cut our development costs by nearly 30%. They understood our vision from day one and executed flawlessly. Truly a game-changer for our startup.",
    name: "Rakib Hasan",
    role: "Founder",
    company: "TripKing",
    initials: "RH",
  },
  {
    quote:
      "The UI/UX work CodeFlee delivered for our e-commerce platform was phenomenal. User engagement increased dramatically and our customers love the new experience.",
    name: "Fatima Noor",
    role: "Product Lead",
    company: "Lomba Shop",
    initials: "FN",
  },
  {
    quote:
      "From branding to full-stack development, CodeFlee handled everything with professionalism. Their agile approach kept us in the loop at every stage.",
    name: "David Park",
    role: "CEO",
    company: "iQQra",
    initials: "DP",
  },
  {
    quote:
      "CodeFlee transformed our outdated platform into a modern, high-performance product. Their team delivered ahead of schedule and the results exceeded our expectations.",
    name: "Sarah Chen",
    role: "CTO",
    company: "FactWatch",
    initials: "SC",
  },
  {
    quote:
      "Working with CodeFlee cut our development costs by nearly 30%. They understood our vision from day one and executed flawlessly. Truly a game-changer for our startup.",
    name: "Rakib Hasan",
    role: "Founder",
    company: "TripKing",
    initials: "RH",
  },
  {
    quote:
      "The UI/UX work CodeFlee delivered for our e-commerce platform was phenomenal. User engagement increased dramatically and our customers love the new experience.",
    name: "Fatima Noor",
    role: "Product Lead",
    company: "Lomba Shop",
    initials: "FN",
  },
  {
    quote:
      "From branding to full-stack development, CodeFlee handled everything with professionalism. Their agile approach kept us in the loop at every stage.",
    name: "David Park",
    role: "CEO",
    company: "iQQra",
    initials: "DP",
  },
];

const accents = [
  "from-purple to-purple-mid",
  "from-pink to-purple",
  "from-purple-mid to-pink",
  "from-purple-dark to-purple",
];

const CARD_WIDTH = 280;
const GAP = 24;
const STEP = CARD_WIDTH + GAP;
const SCROLL_COUNT = 3;

function TestimonialCard({
  testimonial,
  index,
}: {
  testimonial: (typeof testimonials)[0];
  index: number;
}) {
  return (
    <div
      className="flex w-[280px] shrink-0 flex-col rounded-2xl border border-purple/5 bg-white/60 p-6 backdrop-blur-sm transition-all duration-300 hover:border-purple/15 hover:shadow-xl hover:shadow-purple/5 sm:w-[320px] sm:p-8"
    >
      {/* Stars */}
      <div className="mb-5 flex gap-1">
        {Array.from({ length: 5 }).map((_, i) => (
          <svg
            key={i}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="h-4 w-4 text-purple"
          >
            <path
              fillRule="evenodd"
              d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z"
              clipRule="evenodd"
            />
          </svg>
        ))}
      </div>

      {/* Quote */}
      <blockquote className="mb-8 flex-1 text-sm leading-relaxed text-muted">
        &ldquo;{testimonial.quote}&rdquo;
      </blockquote>

      {/* Author */}
      <div className="flex items-center gap-3">
        <div className={`rounded-full bg-gradient-to-br ${accents[index % accents.length]} p-px`}>
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-xs font-bold text-purple">
            {testimonial.initials}
          </div>
        </div>
        <div>
          <p className="text-sm font-semibold">{testimonial.name}</p>
          <p className="text-xs text-muted">
            {testimonial.role}, {testimonial.company}
          </p>
        </div>
      </div>
    </div>
  );
}

function ArrowButton({
  direction,
  onClick,
}: {
  direction: "left" | "right";
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="flex h-11 w-11 items-center justify-center rounded-full border border-purple/10 bg-white/80 text-purple backdrop-blur-sm transition-all hover:bg-purple hover:text-white hover:shadow-lg hover:shadow-purple/20"
      aria-label={`Scroll ${direction}`}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={2}
        stroke="currentColor"
        className="h-4 w-4"
      >
        {direction === "left" ? (
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
        ) : (
          <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
        )}
      </svg>
    </button>
  );
}

export default function Testimonials() {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-50px" });

  const scrollRef = useRef<HTMLDivElement>(null);
  const controls = useAnimationControls();
  const [isPaused, setIsPaused] = useState(false);
  const xRef = useRef(0);

  // Double the cards for seamless loop
  const cards = [...testimonials, ...testimonials];
  const halfWidth = testimonials.length * STEP;

  // Infinite scroll animation
  const startScroll = useCallback(() => {
    const remaining = halfWidth - Math.abs(xRef.current % halfWidth);
    const speed = 40; // px per second
    const duration = remaining / speed;

    controls.start({
      x: xRef.current - remaining,
      transition: { duration, ease: "linear" },
    }).then(() => {
      // Reset position seamlessly
      xRef.current = 0;
      controls.set({ x: 0 });
      if (!isPaused) startScroll();
    });
  }, [controls, halfWidth, isPaused]);

  useEffect(() => {
    if (isInView && !isPaused) {
      startScroll();
    }
    return () => {
      controls.stop();
    };
  }, [isInView, isPaused, controls, startScroll]);

  const handlePause = () => {
    setIsPaused(true);
    controls.stop();
  };

  const handleResume = () => {
    setIsPaused(false);
  };

  const handleNav = (direction: "left" | "right") => {
    controls.stop();
    const shift = direction === "right" ? -STEP * SCROLL_COUNT : STEP * SCROLL_COUNT;
    xRef.current += shift;
    controls.start({
      x: xRef.current,
      transition: { duration: 0.5, ease: "easeInOut" },
    });
  };

  return (
    <section id="testimonials" className="relative py-20">
      {/* Background accents */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute right-1/4 top-0 h-72 w-72 rounded-full bg-pink/15 blur-3xl" />
        <div className="absolute bottom-0 left-1/4 h-72 w-72 rounded-full bg-purple-light/40 blur-3xl" />
      </div>

      <div className="mx-auto max-w-6xl px-6">
        <motion.div
          ref={sectionRef}
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-16 flex flex-col items-center justify-between gap-6 text-center md:flex-row md:text-left"
        >
          <div>
            <span className="mb-4 inline-block text-sm font-medium tracking-wide text-purple">
              TESTIMONIALS
            </span>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
              What Our Clients
              <br />
              <span className="text-purple">Say About Us</span>
            </h2>
          </div>

          {/* Navigation arrows */}
          <div className="flex gap-3">
            <ArrowButton direction="left" onClick={() => handleNav("left")} />
            <ArrowButton direction="right" onClick={() => handleNav("right")} />
          </div>
        </motion.div>
      </div>

      {/* Scrolling track — full width, no overflow hidden on section */}
      <div
        className="relative overflow-hidden"
        onMouseEnter={handlePause}
        onMouseLeave={handleResume}
      >
        {/* Fade edges */}
        <div className="pointer-events-none absolute left-0 top-0 z-10 h-full w-12 bg-gradient-to-r from-background to-transparent sm:w-24" />
        <div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-12 bg-gradient-to-l from-background to-transparent sm:w-24" />

        <motion.div
          ref={scrollRef}
          animate={controls}
          className="flex gap-6 pl-6"
        >
          {cards.map((t, i) => (
            <TestimonialCard key={i} testimonial={t} index={i} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
