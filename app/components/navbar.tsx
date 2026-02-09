"use client";

import { motion } from "motion/react";
import { useState, useEffect } from "react";
import Image from "next/image";

const navLinks = [
  { label: "Services", href: "#services" },
  { label: "About", href: "#about" },
  { label: "Projects", href: "#projects" },
  { label: "Testimonials", href: "#testimonials" },
  { label: "Pricing", href: "#pricing" },
  { label: "Contact", href: "#contact" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleMobileLink = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setMobileOpen(false);
    const id = href.replace("#", "");
    const el = document.getElementById(id);
    if (el) {
      setTimeout(() => {
        el.scrollIntoView({ behavior: "smooth" });
      }, 300);
    }
  };

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/70 backdrop-blur-xl shadow-sm border-b border-purple/10"
          : "bg-transparent"
      }`}
    >
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <a href="#">
          <Image src="/logo.svg" alt="CodeFlee" width={63} height={37} priority />
        </a>

        <div className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-muted transition-colors hover:text-purple"
            >
              {link.label}
            </a>
          ))}
          <motion.a
            href="#contact"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            className="group/cta relative rounded-full px-5 py-2 text-sm font-medium text-white"
          >
            {/* Pulsing glow */}
            <span className="pointer-events-none absolute -inset-1 animate-glow rounded-full bg-purple blur-md" />
            <span className="absolute inset-0 rounded-full bg-purple" />
            <span className="relative flex items-center gap-1.5">
              Get Started
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="h-3.5 w-3.5 transition-transform duration-300 group-hover/cta:translate-x-0.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
              </svg>
            </span>
          </motion.a>
        </div>

        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="flex flex-col gap-1.5 md:hidden"
          aria-label="Toggle menu"
        >
          <motion.span
            animate={mobileOpen ? { rotate: 45, y: 6 } : { rotate: 0, y: 0 }}
            className="block h-0.5 w-6 bg-foreground"
          />
          <motion.span
            animate={mobileOpen ? { opacity: 0 } : { opacity: 1 }}
            className="block h-0.5 w-6 bg-foreground"
          />
          <motion.span
            animate={mobileOpen ? { rotate: -45, y: -6 } : { rotate: 0, y: 0 }}
            className="block h-0.5 w-6 bg-foreground"
          />
        </button>
      </nav>

      {/* Mobile menu */}
      <motion.div
        initial={false}
        animate={mobileOpen ? { height: "auto", opacity: 1 } : { height: 0, opacity: 0 }}
        className="overflow-hidden bg-white/90 backdrop-blur-xl md:hidden"
      >
        <div className="flex flex-col gap-4 px-6 pb-6">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={(e) => handleMobileLink(e, link.href)}
              className="text-sm font-medium text-muted transition-colors hover:text-purple"
            >
              {link.label}
            </a>
          ))}
          <a
            href="#contact"
            onClick={(e) => handleMobileLink(e, "#contact")}
            className="inline-flex w-fit rounded-full bg-purple px-5 py-2 text-sm font-medium text-white"
          >
            Get Started
          </a>
        </div>
      </motion.div>
    </motion.header>
  );
}
