"use client";

import { motion } from "motion/react";
import Image from "next/image";

const socials = [
  { label: "Facebook", href: "https://facebook.com/codeflee.official" },
  { label: "Twitter", href: "https://x.com/codeflee" },
  { label: "LinkedIn", href: "https://linkedin.com/company/codeflee" },
  { label: "YouTube", href: "https://youtube.com/@codeflee" },
];

const links = [
  { label: "Services", href: "#services" },
  { label: "About", href: "#about" },
  { label: "Contact", href: "#contact" },
];

export default function Footer() {
  return (
    <motion.footer
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="border-t border-purple/5 px-6 py-16"
    >
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="lg:col-span-2">
            <a href="#" className="mb-4 inline-block">
              <Image src="/logo.svg" alt="CodeFlee" width={63} height={37} />
            </a>
            <p className="mb-4 max-w-xs text-sm leading-relaxed text-muted">
              A digital service provider offering advanced software development
              solutions from Dhaka, Bangladesh.
            </p>
            <p className="text-xs text-muted/60">
              House 21, Road 3, Mohammadpur
              <br />
              Dhaka 1207, Bangladesh
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="mb-4 text-sm font-semibold">Quick Links</h4>
            <div className="flex flex-col gap-3">
              {links.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="text-sm text-muted transition-colors hover:text-purple"
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>

          {/* Socials */}
          <div>
            <h4 className="mb-4 text-sm font-semibold">Follow Us</h4>
            <div className="flex flex-col gap-3">
              {socials.map((social) => (
                <a
                  key={social.href}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-muted transition-colors hover:text-purple"
                >
                  {social.label}
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-16 flex flex-col items-center justify-between gap-4 border-t border-purple/5 pt-8 sm:flex-row">
          <p className="text-xs text-muted/60">
            &copy; {new Date().getFullYear()} CodeFlee LLC. All rights reserved.
          </p>
          <p className="text-xs text-muted/60">
            Built with purpose.
          </p>
        </div>
      </div>
    </motion.footer>
  );
}
