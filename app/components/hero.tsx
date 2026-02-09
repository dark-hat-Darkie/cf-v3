"use client";

import { motion, useMotionValue, useTransform, animate } from "motion/react";
import { useEffect, useState } from "react";

const floatingItems = [
  { icon: "</>", x: "10%", y: "20%", delay: 0, duration: 6 },
  { icon: "{}", x: "85%", y: "15%", delay: 1, duration: 7 },
  { icon: "( )", x: "75%", y: "75%", delay: 2, duration: 5 },
  { icon: "[ ]", x: "15%", y: "70%", delay: 0.5, duration: 8 },
  { icon: "=>", x: "90%", y: "45%", delay: 1.5, duration: 6 },
  { icon: "//", x: "5%", y: "45%", delay: 3, duration: 7 },
];

function AnimatedCounter({ target }: { target: number }) {
  const count = useMotionValue(0);
  const rounded = useTransform(count, (v) => `${Math.round(v)}+`);
  const [display, setDisplay] = useState("0+");

  useEffect(() => {
    const controls = animate(count, target, { duration: 2, delay: 1.2 });
    const unsubscribe = rounded.on("change", (v) => setDisplay(v));
    return () => {
      controls.stop();
      unsubscribe();
    };
  }, [count, rounded, target]);

  return <span>{display}</span>;
}

export default function Hero() {
  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden px-6">
      {/* Animated dot grid */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "radial-gradient(circle, var(--purple) 1px, transparent 1px)",
            backgroundSize: "32px 32px",
          }}
        />
      </div>

      {/* Decorative blobs — more vibrant */}
      <div className="pointer-events-none absolute inset-0">
        <div className="animate-blob absolute -top-20 -left-20 h-96 w-96 rounded-full bg-purple/20 blur-3xl" />
        <div className="animate-blob animation-delay-2000 absolute top-40 right-10 h-80 w-80 rounded-full bg-pink/30 blur-3xl" />
        <div className="animate-blob animation-delay-4000 absolute -bottom-20 left-1/3 h-96 w-96 rounded-full bg-purple-light/50 blur-3xl" />
      </div>

      {/* Floating code symbols */}
      {floatingItems.map((item, i) => (
        <motion.span
          key={i}
          className="pointer-events-none absolute select-none font-mono text-sm font-semibold text-purple/10 md:text-base"
          style={{ left: item.x, top: item.y }}
          initial={{ opacity: 0, y: 20 }}
          animate={{
            opacity: [0, 0.6, 0.6, 0],
            y: [20, -20, -40, -60],
            rotate: [0, 5, -5, 0],
          }}
          transition={{
            duration: item.duration,
            delay: item.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          {item.icon}
        </motion.span>
      ))}

      <div className="relative mx-auto max-w-4xl text-center">
        {/* Badge with shimmer */}
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.2 }}
        >
          <span className="group relative mb-6 inline-flex items-center gap-2 overflow-hidden rounded-full border border-purple/15 bg-purple-light/40 px-4 py-1.5 text-xs font-medium tracking-wide text-purple">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-purple/60" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-purple" />
            </span>
            SOFTWARE DEVELOPMENT AGENCY
            {/* Shimmer sweep */}
            <span className="animate-shimmer absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent" />
          </span>
        </motion.div>

        {/* Heading with animated gradient keyword */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="mb-6 text-3xl font-bold leading-tight tracking-tight sm:text-5xl md:text-7xl"
        >
          We Build Digital{" "}
          <span className="animate-gradient-text relative bg-gradient-to-r from-purple via-pink to-purple bg-[length:200%_auto] bg-clip-text text-transparent">
            Experiences
          </span>{" "}
          That Matter
        </motion.h1>

        {/* Subheading */}
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.6 }}
          className="mx-auto mb-10 max-w-2xl text-base text-muted md:text-xl"
        >
          From web and mobile apps to full-scale digital solutions, we transform
          your ideas into elegant, high-performance products.
        </motion.p>

        {/* Buttons with playful hover */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.8 }}
          className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center"
        >
          <motion.a
            href="#services"
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.97 }}
            className="group relative overflow-hidden rounded-full bg-purple px-8 py-3.5 text-sm font-medium text-white shadow-lg shadow-purple/25 transition-shadow hover:shadow-xl hover:shadow-purple/30"
          >
            <span className="relative z-10">Our Services</span>
            <motion.span
              className="absolute inset-0 bg-purple-dark"
              initial={{ x: "-100%" }}
              whileHover={{ x: 0 }}
              transition={{ duration: 0.3 }}
            />
          </motion.a>
          <motion.a
            href="#contact"
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.97 }}
            className="glow-border group relative rounded-full px-8 py-3.5 text-sm font-medium text-foreground transition-all"
          >
            <span className="glow-line" />
            <span className="glow-line-blur" />
            <span className="absolute inset-[1px] z-[1] rounded-full bg-pink-light/80 backdrop-blur-sm" />
            <span className="relative z-10">Get in Touch</span>
          </motion.a>
        </motion.div>

        {/* Mini trust strip */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7, delay: 1.2 }}
          className="mt-16 flex items-center justify-center gap-6 text-sm text-muted/60 sm:gap-8 md:gap-12"
        >
          <div className="flex flex-col items-center">
            <span className="text-2xl font-bold text-foreground">
              <AnimatedCounter target={50} />
            </span>
            <span className="text-xs">Projects</span>
          </div>
          <div className="h-8 w-px bg-foreground/10" />
          <div className="flex flex-col items-center">
            <span className="text-2xl font-bold text-foreground">
              <AnimatedCounter target={30} />
            </span>
            <span className="text-xs">Happy Clients</span>
          </div>
          <div className="h-8 w-px bg-foreground/10" />
          <div className="flex flex-col items-center">
            <span className="text-2xl font-bold text-foreground">
              <AnimatedCounter target={5} />
            </span>
            <span className="text-xs">Years</span>
          </div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          className="flex h-10 w-6 items-start justify-center rounded-full border-2 border-foreground/15 p-1.5"
        >
          <motion.div className="h-1.5 w-1.5 rounded-full bg-purple" />
        </motion.div>
      </motion.div>
    </section>
  );
}
