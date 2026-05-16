"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";

const LINKS = [
  { href: "/#work", label: "Work" },
  { href: "/#services", label: "Services" },
  { href: "/#process", label: "Process" },
  { href: "/#pricing", label: "Pricing" },
  { href: "/blog", label: "Blog", current: true },
];

export function BlogHeader() {
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    let last = window.scrollY;
    const onScroll = () => {
      const cur = window.scrollY;
      setHidden(cur > 120 && cur > last);
      setScrolled(cur > 40);
      last = cur;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <nav className={`cf-blog-header${hidden ? " hidden" : ""}${scrolled ? " scrolled" : ""}`}>
        <Link href="/" aria-label="Codeflee home" className="cf-blog-header-logo" data-cursor="Home">
          <Image
            src="/assets/logo-white.svg"
            alt="Codeflee"
            width={120}
            height={24}
            priority
          />
        </Link>

        <div className="cf-blog-header-tabs">
          {LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="cf-blog-header-tab"
              data-current={l.current ? "true" : undefined}
            >
              {l.label}
            </Link>
          ))}
        </div>

        <Link
          href="/#contact"
          className="cf-blog-header-cta"
          data-cursor="Get in touch"
        >
          Book a call
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" aria-hidden>
            <path
              d="M7 17L17 7M17 7H7M17 7V17"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
            />
          </svg>
        </Link>

        <button
          type="button"
          className={`cf-blog-header-burger${mobileOpen ? " open" : ""}`}
          onClick={() => setMobileOpen((v) => !v)}
          aria-label="Toggle menu"
          aria-expanded={mobileOpen}
        >
          <span />
          <span />
          <span />
        </button>
      </nav>

      <div className={`cf-blog-header-drawer${mobileOpen ? " open" : ""}`} aria-hidden={!mobileOpen}>
        <div className="cf-blog-header-drawer-inner">
          {LINKS.map((l, i) => (
            <Link
              key={l.href}
              href={l.href}
              className="cf-blog-header-drawer-item"
              onClick={() => setMobileOpen(false)}
            >
              <span className="cf-blog-header-drawer-num">{String(i + 1).padStart(2, "0")}</span>
              {l.label}
            </Link>
          ))}
          <Link
            href="/#contact"
            className="cf-blog-header-drawer-cta"
            onClick={() => setMobileOpen(false)}
          >
            Book a call →
          </Link>
        </div>
      </div>
    </>
  );
}
