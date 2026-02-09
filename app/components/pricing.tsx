"use client";

import { motion, useInView, useMotionValue, useTransform } from "motion/react";
import { useRef, useState } from "react";

const plans = [
  {
    name: "Web Development",
    tagline: "From Concept to Code",
    price: 700,
    accent: "from-blue-400 to-purple",
    accentBg: "bg-blue-400/5",
    highlight: false,
    features: [
      "Custom responsive website",
      "Modern UI/UX design",
      "SEO-optimized codebase",
      "30 days average delivery",
      "Post-launch support",
    ],
  },
  {
    name: "App Development",
    tagline: "Mobile & Cross-Platform",
    price: 1000,
    accent: "from-purple to-pink",
    accentBg: "bg-purple/5",
    highlight: true,
    features: [
      "iOS & Android apps",
      "Cross-platform development",
      "Intuitive user experience",
      "30 days average delivery",
      "Post-launch support",
    ],
  },
  {
    name: "SaaS Development",
    tagline: "Scale Your Business",
    price: 5000,
    accent: "from-pink to-orange-400",
    accentBg: "bg-pink/5",
    highlight: false,
    features: [
      "Full SaaS platform build",
      "Scalable architecture",
      "Payment & auth integrations",
      "Custom admin dashboard",
      "Post-launch support",
    ],
  },
];

function AnimatedPrice({ price, isInView }: { price: number; isInView: boolean }) {
  const value = useMotionValue(0);
  const display = useTransform(value, (v) =>
    `$${Math.round(v).toLocaleString()}`
  );
  const [text, setText] = useState("$0");

  if (isInView && value.get() === 0) {
    value.set(0);
    import("motion/react").then(({ animate }) => {
      animate(value, price, { duration: 1.2, ease: "easeOut" });
    });
  }

  value.on("change", (v) => setText(`$${Math.round(v).toLocaleString()}`));

  return <span>{text}</span>;
}

function FeatureItem({
  feature,
  index,
  isInView,
  highlight,
}: {
  feature: string;
  index: number;
  isInView: boolean;
  highlight: boolean;
}) {
  return (
    <motion.li
      initial={{ opacity: 0, x: -10 }}
      animate={isInView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.3, delay: 0.5 + index * 0.08 }}
      className="flex items-center gap-3"
    >
      <motion.span
        initial={{ scale: 0 }}
        animate={isInView ? { scale: 1 } : {}}
        transition={{ type: "spring", delay: 0.6 + index * 0.08, stiffness: 300 }}
        className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full ${
          highlight ? "bg-white/20" : "bg-purple/10"
        }`}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={3}
          stroke="currentColor"
          className={`h-3 w-3 ${highlight ? "text-white" : "text-purple"}`}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
        </svg>
      </motion.span>
      <span className={`text-sm ${highlight ? "text-white/85" : "text-muted"}`}>
        {feature}
      </span>
    </motion.li>
  );
}

function PricingCard({
  plan,
  index,
  isInView,
}: {
  plan: (typeof plans)[0];
  index: number;
  isInView: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.15 }}
      className={`group relative flex flex-col overflow-hidden rounded-3xl transition-all duration-500 ${
        plan.highlight
          ? "bg-purple shadow-2xl shadow-purple/25 md:scale-105"
          : "border border-purple/8 bg-white hover:border-transparent hover:shadow-2xl hover:shadow-purple/10"
      }`}
    >
      {/* Animated gradient border glow on hover (non-highlight cards) */}
      {!plan.highlight && (
        <motion.div
          className={`pointer-events-none absolute -inset-px rounded-3xl bg-gradient-to-br ${plan.accent} opacity-0 transition-opacity duration-500 group-hover:opacity-100`}
          style={{ padding: "1px" }}
        >
          <div className="h-full w-full rounded-3xl bg-white" />
        </motion.div>
      )}

      {/* Highlight card glow effect */}
      {plan.highlight && (
        <>
          <div className="pointer-events-none absolute -inset-1 rounded-3xl bg-gradient-to-br from-purple-mid via-purple to-pink opacity-60 blur-xl" />
          <div className="pointer-events-none absolute inset-0 rounded-3xl bg-purple" />
        </>
      )}

      <div className="relative flex flex-1 flex-col p-6 sm:p-8 md:p-9">
        {/* Popular badge */}
        {plan.highlight && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.4, delay: 0.4 }}
            className="mb-6 self-start"
          >
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3.5 py-1 text-[11px] font-semibold tracking-wider text-white backdrop-blur-sm">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-pink opacity-75" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-pink" />
              </span>
              MOST POPULAR
            </span>
          </motion.div>
        )}

        {/* Name */}
        <div className="mb-6">
          <h3
            className={`text-xl font-bold ${plan.highlight ? "text-white" : "text-foreground"}`}
          >
            {plan.name}
          </h3>
          <p
            className={`mt-1 text-sm ${plan.highlight ? "text-white/60" : "text-muted"}`}
          >
            {plan.tagline}
          </p>
        </div>

        {/* Price */}
        <div className="mb-8">
          <div className="flex items-baseline gap-1">
            <span
              className={`text-4xl font-extrabold tracking-tight sm:text-5xl ${
                plan.highlight ? "text-white" : "text-foreground"
              }`}
            >
              <AnimatedPrice price={plan.price} isInView={isInView} />
            </span>
          </div>
          <span
            className={`mt-1 block text-xs font-medium tracking-wide ${
              plan.highlight ? "text-white/50" : "text-muted/60"
            }`}
          >
            STARTING PRICE
          </span>
        </div>

        {/* Divider */}
        <div
          className={`mb-6 h-px ${
            plan.highlight
              ? "bg-gradient-to-r from-transparent via-white/20 to-transparent"
              : "bg-gradient-to-r from-transparent via-purple/10 to-transparent"
          }`}
        />

        {/* Features */}
        <ul className="mb-8 flex flex-1 flex-col gap-3.5">
          {plan.features.map((feature, i) => (
            <FeatureItem
              key={feature}
              feature={feature}
              index={i}
              isInView={isInView}
              highlight={plan.highlight}
            />
          ))}
        </ul>

        {/* CTA button */}
        <motion.a
          href="#contact"
          whileHover={{ scale: 1.03, y: -1 }}
          whileTap={{ scale: 0.98 }}
          className={`group/btn relative mt-auto flex items-center justify-center gap-2 overflow-hidden rounded-xl py-3.5 text-sm font-semibold transition-all duration-300 ${
            plan.highlight
              ? "bg-white text-purple shadow-lg shadow-black/5 hover:shadow-xl"
              : "bg-purple/5 text-purple hover:bg-purple hover:text-white hover:shadow-lg hover:shadow-purple/20"
          }`}
        >
          <span className="relative z-10">Get Started</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2.5}
            stroke="currentColor"
            className="relative z-10 h-4 w-4 transition-transform duration-300 group-hover/btn:translate-x-1"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
          </svg>
        </motion.a>
      </div>

      {/* Corner decoration */}
      {!plan.highlight && (
        <div
          className={`pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full bg-gradient-to-br ${plan.accent} opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-20`}
        />
      )}
      {plan.highlight && (
        <>
          <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-pink/20 blur-2xl" />
          <div className="pointer-events-none absolute -bottom-10 -left-10 h-32 w-32 rounded-full bg-purple-mid/30 blur-2xl" />
        </>
      )}
    </motion.div>
  );
}

export default function Pricing() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <section id="pricing" className="relative overflow-hidden px-6 py-20">
      {/* Background decorations */}
      <div className="pointer-events-none absolute inset-0">
        <div className="animate-blob absolute -left-40 top-20 h-[400px] w-[400px] rounded-full bg-purple/[0.03] blur-3xl" />
        <div className="animate-blob animation-delay-4000 absolute -right-40 bottom-20 h-[400px] w-[400px] rounded-full bg-pink/[0.03] blur-3xl" />
        <div
          className="absolute inset-0 opacity-[0.015]"
          style={{
            backgroundImage:
              "radial-gradient(circle, var(--purple) 1px, transparent 1px)",
            backgroundSize: "32px 32px",
          }}
        />
      </div>

      <div ref={ref} className="relative mx-auto max-w-6xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-6 text-center"
        >
          <span className="mb-4 inline-block text-sm font-medium tracking-wide text-purple">
            PRICING
          </span>
          <h2 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
            Simple,{" "}
            <span className="animate-gradient-text bg-gradient-to-r from-purple via-pink to-purple bg-[length:200%_auto] bg-clip-text text-transparent">
              Transparent
            </span>{" "}
            Pricing
          </h2>
          <p className="mx-auto max-w-lg text-muted">
            No hidden fees. No surprises. Just clear pricing that scales with
            your ambitions.
          </p>
        </motion.div>

        {/* Guarantee badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-16 flex justify-center"
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-purple/10 bg-white px-5 py-2 text-xs font-medium text-muted shadow-sm">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-4 w-4 text-purple">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z" />
            </svg>
            100% satisfaction guarantee — money back if not happy
          </span>
        </motion.div>

        {/* Cards grid */}
        <div className="grid items-center gap-6 md:grid-cols-3 md:gap-5 lg:gap-8">
          {plans.map((plan, i) => (
            <PricingCard
              key={plan.name}
              plan={plan}
              index={i}
              isInView={isInView}
            />
          ))}
        </div>

        {/* Trust signals */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.7 }}
          className="mt-16 grid grid-cols-2 gap-6 md:grid-cols-4"
        >
          {[
            {
              icon: (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-5 w-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.53 16.122a3 3 0 0 0-5.78 1.128 2.25 2.25 0 0 1-2.4 2.245 4.5 4.5 0 0 0 8.4-2.245c0-.399-.078-.78-.22-1.128Zm0 0a15.998 15.998 0 0 0 3.388-1.62m-5.043-.025a15.994 15.994 0 0 1 1.622-3.395m3.42 3.42a15.995 15.995 0 0 0 4.764-4.648l3.876-5.814a1.151 1.151 0 0 0-1.597-1.597L14.146 6.32a15.996 15.996 0 0 0-4.649 4.763m3.42 3.42a6.776 6.776 0 0 0-3.42-3.42" />
                </svg>
              ),
              label: "Custom Solutions",
              desc: "Tailored to you",
            },
            {
              icon: (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-5 w-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 0 1-.825-.242m9.345-8.334a2.126 2.126 0 0 0-.476-.095 48.64 48.64 0 0 0-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0 0 11.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155" />
                </svg>
              ),
              label: "Free Consultation",
              desc: "No commitment",
            },
            {
              icon: (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-5 w-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m3.75 13.5 10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75Z" />
                </svg>
              ),
              label: "Fast Delivery",
              desc: "On-time, every time",
            },
            {
              icon: (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-5 w-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z" />
                </svg>
              ),
              label: "Post-Launch Care",
              desc: "We've got your back",
            },
          ].map((item, i) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 15 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.4, delay: 0.8 + i * 0.1 }}
              className="flex flex-col items-center gap-1.5 text-center"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple/5 text-purple">{item.icon}</span>
              <span className="text-sm font-semibold">{item.label}</span>
              <span className="text-xs text-muted">{item.desc}</span>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
