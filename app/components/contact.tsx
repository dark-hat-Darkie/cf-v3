"use client";

import { motion, useInView, AnimatePresence } from "motion/react";
import { useRef, useState } from "react";

const contactInfo = [
  {
    label: "Email",
    value: "contact@codeflee.com",
    href: "mailto:contact@codeflee.com",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-5 w-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
      </svg>
    ),
  },
  {
    label: "Phone",
    value: "+880 1716-778254",
    href: "tel:+8801716778254",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-5 w-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z" />
      </svg>
    ),
  },
  {
    label: "Location",
    value: "Dhaka, Bangladesh",
    href: null,
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-5 w-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
      </svg>
    ),
  },
];

function FloatingLabelInput({
  label,
  name,
  type = "text",
  required = false,
  textarea = false,
  delay = 0,
  isInView,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  textarea?: boolean;
  delay?: number;
  isInView: boolean;
}) {
  const [focused, setFocused] = useState(false);
  const [hasValue, setHasValue] = useState(false);
  const active = focused || hasValue;

  const inputProps = {
    name,
    type,
    required,
    onFocus: () => setFocused(true),
    onBlur: (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setFocused(false);
      setHasValue(e.target.value.length > 0);
    },
    className:
      "peer w-full rounded-xl border bg-white/80 px-4 pt-6 pb-2 text-sm text-foreground outline-none transition-all duration-300 " +
      (focused
        ? "border-purple shadow-[0_0_0_3px_rgba(131,51,235,0.1)]"
        : "border-purple/10 hover:border-purple/25"),
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay }}
      className="relative"
    >
      {textarea ? (
        <textarea {...inputProps} rows={4} className={inputProps.className + " resize-none"} />
      ) : (
        <input {...inputProps} />
      )}
      <label
        className={
          "pointer-events-none absolute left-4 transition-all duration-300 " +
          (active
            ? "top-2 text-[10px] font-semibold tracking-wider text-purple"
            : "top-4 text-sm text-muted")
        }
      >
        {label}
      </label>

      {/* Animated underline accent */}
      <motion.div
        className="absolute bottom-0 left-1/2 h-[2px] -translate-x-1/2 rounded-full bg-gradient-to-r from-purple via-pink to-purple"
        initial={{ width: 0 }}
        animate={{ width: focused ? "90%" : 0 }}
        transition={{ duration: 0.3 }}
      />
    </motion.div>
  );
}

export default function Contact() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSending(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get("name"),
      email: formData.get("email"),
      subject: formData.get("subject"),
      message: formData.get("message"),
      budget: formData.get("budget"),
    };

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const result = await res.json();
        throw new Error(result.error || "Failed to send message.");
      }

      setSubmitted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setSending(false);
    }
  };

  return (
    <section id="contact" className="relative overflow-hidden px-6 py-20">
      {/* Background decorations */}
      <div className="pointer-events-none absolute inset-0">
        <div className="animate-blob absolute -top-40 right-0 h-[500px] w-[500px] rounded-full bg-purple/5 blur-3xl" />
        <div className="animate-blob animation-delay-2000 absolute -bottom-40 -left-20 h-[400px] w-[400px] rounded-full bg-pink/5 blur-3xl" />
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage:
              "radial-gradient(circle, var(--purple) 1px, transparent 1px)",
            backgroundSize: "24px 24px",
          }}
        />
      </div>

      <div ref={ref} className="relative mx-auto max-w-6xl">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-16 text-center"
        >
          <span className="mb-4 inline-block text-sm font-medium tracking-wide text-purple">
            GET IN TOUCH
          </span>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
            Let&apos;s Start a{" "}
            <span className="animate-gradient-text bg-gradient-to-r from-purple via-pink to-purple bg-[length:200%_auto] bg-clip-text text-transparent">
              Conversation
            </span>
          </h2>
        </motion.div>

        <div className="grid items-start gap-12 lg:grid-cols-5 lg:gap-16">
          {/* Left column — Info */}
          <div className="lg:col-span-2">
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="mb-10 text-muted"
            >
              Have a project in mind or just want to say hello? Fill out the form
              and we&apos;ll get back to you within 24 hours.
            </motion.p>

            <div className="space-y-6">
              {contactInfo.map((item, i) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, x: -20 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.2 + i * 0.1 }}
                >
                  {item.href ? (
                    <a
                      href={item.href}
                      className="group flex items-center gap-4 rounded-xl p-3 transition-all hover:bg-purple-light/30"
                    >
                      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-pink-light text-purple transition-all group-hover:bg-purple group-hover:text-white">
                        {item.icon}
                      </span>
                      <div>
                        <p className="text-xs font-medium tracking-wide text-muted">
                          {item.label}
                        </p>
                        <p className="text-sm font-semibold">{item.value}</p>
                      </div>
                    </a>
                  ) : (
                    <div className="group flex items-center gap-4 rounded-xl p-3">
                      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-pink-light text-purple">
                        {item.icon}
                      </span>
                      <div>
                        <p className="text-xs font-medium tracking-wide text-muted">
                          {item.label}
                        </p>
                        <p className="text-sm font-semibold">{item.value}</p>
                      </div>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>

            {/* Decorative line art */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ duration: 1, delay: 0.6 }}
              className="mt-10 hidden lg:block"
            >
              <svg width="200" height="120" viewBox="0 0 200 120" fill="none" className="text-purple/10">
                <path
                  d="M10 60 C 40 10, 65 10, 95 60 S 150 110, 190 60"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  fill="none"
                />
                <circle cx="10" cy="60" r="4" fill="currentColor" />
                <circle cx="95" cy="60" r="4" fill="currentColor" />
                <circle cx="190" cy="60" r="4" fill="currentColor" />
              </svg>
            </motion.div>
          </div>

          {/* Right column — Form card */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="lg:col-span-3"
          >
            <div className="relative rounded-3xl border border-purple/10 bg-white/70 p-5 shadow-xl shadow-purple/5 backdrop-blur-lg sm:p-8 md:p-10">
              {/* Card corner accents */}
              <div className="pointer-events-none absolute -right-px -top-px h-16 w-16 rounded-tr-3xl border-r-2 border-t-2 border-purple/20" />
              <div className="pointer-events-none absolute -bottom-px -left-px h-16 w-16 rounded-bl-3xl border-b-2 border-l-2 border-purple/20" />

              <AnimatePresence mode="wait">
                {submitted ? (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                    className="flex min-h-[400px] flex-col items-center justify-center text-center"
                  >
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", delay: 0.2, stiffness: 200 }}
                      className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-purple/10"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="h-10 w-10 text-purple">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                      </svg>
                    </motion.div>
                    <h3 className="mb-2 text-2xl font-bold">Message Sent!</h3>
                    <p className="mb-8 max-w-xs text-sm text-muted">
                      Thanks for reaching out. We&apos;ll get back to you within 24 hours.
                    </p>
                    <button
                      onClick={() => setSubmitted(false)}
                      className="text-sm font-medium text-purple underline-offset-4 transition-colors hover:underline"
                    >
                      Send another message
                    </button>
                  </motion.div>
                ) : (
                  <motion.form
                    key="form"
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0, y: -20 }}
                    onSubmit={handleSubmit}
                    className="space-y-5"
                  >
                    <div className="grid gap-5 sm:grid-cols-2">
                      <FloatingLabelInput
                        label="YOUR NAME"
                        name="name"
                        required
                        delay={0.3}
                        isInView={isInView}
                      />
                      <FloatingLabelInput
                        label="EMAIL ADDRESS"
                        name="email"
                        type="email"
                        required
                        delay={0.35}
                        isInView={isInView}
                      />
                    </div>
                    <FloatingLabelInput
                      label="SUBJECT"
                      name="subject"
                      delay={0.4}
                      isInView={isInView}
                    />
                    <FloatingLabelInput
                      label="YOUR MESSAGE"
                      name="message"
                      textarea
                      required
                      delay={0.45}
                      isInView={isInView}
                    />

                    {/* Budget selector */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={isInView ? { opacity: 1, y: 0 } : {}}
                      transition={{ duration: 0.5, delay: 0.5 }}
                    >
                      <p className="mb-3 text-[10px] font-semibold tracking-wider text-muted">
                        PROJECT BUDGET
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {["< $1k", "$1k – $5k", "$5k – $15k", "$15k+"].map(
                          (budget) => (
                            <label key={budget} className="cursor-pointer">
                              <input
                                type="radio"
                                name="budget"
                                value={budget}
                                className="peer sr-only"
                              />
                              <span className="inline-block rounded-full border border-purple/10 px-4 py-2 text-xs font-medium text-muted transition-all peer-checked:border-purple peer-checked:bg-purple peer-checked:text-white hover:border-purple/30">
                                {budget}
                              </span>
                            </label>
                          )
                        )}
                      </div>
                    </motion.div>

                    {error && (
                      <p className="text-sm text-red-500">{error}</p>
                    )}

                    {/* Submit button */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={isInView ? { opacity: 1, y: 0 } : {}}
                      transition={{ duration: 0.5, delay: 0.55 }}
                      className="pt-2"
                    >
                      <motion.button
                        type="submit"
                        disabled={sending}
                        whileHover={{ scale: 1.02, y: -1 }}
                        whileTap={{ scale: 0.98 }}
                        className="group relative w-full overflow-hidden rounded-xl bg-purple px-8 py-4 text-sm font-semibold text-white shadow-lg shadow-purple/25 transition-shadow hover:shadow-xl hover:shadow-purple/30 disabled:opacity-70"
                      >
                        <span className="relative z-10 flex items-center justify-center gap-2">
                          {sending ? (
                            <>
                              <motion.span
                                animate={{ rotate: 360 }}
                                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                className="inline-block h-4 w-4 rounded-full border-2 border-white/30 border-t-white"
                              />
                              Sending...
                            </>
                          ) : (
                            <>
                              Send Message
                              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="h-4 w-4 transition-transform group-hover:translate-x-1">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5" />
                              </svg>
                            </>
                          )}
                        </span>

                        {/* Hover gradient sweep */}
                        <motion.span
                          className="absolute inset-0 bg-gradient-to-r from-purple-dark to-purple"
                          initial={{ x: "-100%" }}
                          whileHover={{ x: 0 }}
                          transition={{ duration: 0.4 }}
                        />
                      </motion.button>
                    </motion.div>
                  </motion.form>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
