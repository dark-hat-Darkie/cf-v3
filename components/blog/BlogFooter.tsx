import Link from "next/link";
import Image from "next/image";

const COLS = [
  {
    title: "Studio",
    items: [
      { label: "Work", href: "/#work" },
      { label: "Services", href: "/#services" },
      { label: "Process", href: "/#process" },
      { label: "Pricing", href: "/#pricing" },
      { label: "Blog", href: "/blog" },
    ],
  },
  {
    title: "Services",
    items: [
      { label: "Web development", href: "/#services" },
      { label: "Mobile apps", href: "/#services" },
      { label: "UI / UX", href: "/#services" },
      { label: "WordPress", href: "/#services" },
      { label: "WebGL · 3D", href: "/#services" },
    ],
  },
  {
    title: "Connect",
    items: [
      { label: "hello@codeflee.com", href: "mailto:hello@codeflee.com" },
      { label: "WhatsApp", href: "https://wa.me/8801700000000" },
      { label: "LinkedIn", href: "#" },
      { label: "X (Twitter)", href: "#" },
      { label: "RSS", href: "/blog/feed.xml" },
    ],
  },
];

export function BlogFooter() {
  return (
    <footer className="cf-blog-footer" aria-label="Site footer">
      <div className="cf-blog-footer-inner">
        <div className="cf-blog-footer-grid">
          <div className="cf-blog-footer-brand">
            <Image
              src="/assets/logo-white.svg"
              alt="Codeflee"
              width={130}
              height={28}
              style={{ height: 28, width: "auto" }}
            />
            <p className="cf-blog-footer-brand-desc">
              A senior engineering studio in Dhaka, shipping work for founders
              who sweat the details.
            </p>
            <div className="cf-blog-footer-status">
              <span className="cf-blog-footer-status-dot" aria-hidden />
              Open for new projects
            </div>
          </div>

          {COLS.map((c) => (
            <div key={c.title} className="cf-blog-footer-col">
              <div className="cf-blog-footer-col-title">{c.title}</div>
              <ul>
                {c.items.map((it) => (
                  <li key={it.label}>
                    <Link href={it.href}>{it.label}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="cf-blog-footer-bar">
          <div>© 2026 Codeflee Studio · Dhaka, Bangladesh</div>
          <div className="cf-blog-footer-bar-links">
            <Link href="/#contact">Get in touch</Link>
            <Link href="/blog/feed.xml">RSS</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
