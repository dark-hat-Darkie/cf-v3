"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";

type Props = {
  src: string;
  alt: string;
  width: number;
  height: number;
  blurDataURL?: string;
  caption?: string;
};

export function PostHero({ src, alt, width, height, blurDataURL, caption }: Props) {
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let raf = 0;
    const update = () => {
      raf = 0;
      const rect = el.getBoundingClientRect();
      const viewportTop = -rect.top;
      const distance = Math.max(0, viewportTop);
      // 0 → 1 over the first 600 px of scroll past hero top
      const t = Math.min(1, distance / 600);
      const zoom = 1 + 0.05 * t;
      el.style.setProperty("--cf-hero-zoom", zoom.toFixed(4));
    };

    const onScroll = () => {
      if (raf) return;
      raf = window.requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <figure ref={wrapRef} className="cf-post-featured">
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        priority
        sizes="(max-width: 1100px) 100vw, 1100px"
        {...(blurDataURL ? { placeholder: "blur" as const, blurDataURL } : {})}
      />
      {caption ? <figcaption className="cf-post-featured-caption">{caption}</figcaption> : null}
    </figure>
  );
}
