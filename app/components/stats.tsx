"use client";

import { motion, useInView } from "motion/react";
import { useRef } from "react";

const stats = [
  { value: "50+", label: "Projects Delivered" },
  { value: "100+", label: "Team Members" },
  { value: "24/7", label: "Dedicated Support" },
  { value: "2024", label: "Year Founded" },
];

export default function Stats() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <section className="px-6 py-20">
      <div
        ref={ref}
        className="mx-auto max-w-6xl rounded-3xl border border-purple/10 bg-pink-light/30"
      >
        <div className="grid grid-cols-2 divide-x divide-purple/5 sm:grid-cols-4">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="flex flex-col items-center justify-center px-4 py-8 text-center sm:px-6 sm:py-10"
            >
              <span className="mb-1 text-2xl font-bold text-purple sm:text-3xl md:text-4xl">
                {stat.value}
              </span>
              <span className="text-xs font-medium text-muted">
                {stat.label}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
