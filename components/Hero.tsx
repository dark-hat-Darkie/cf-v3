"use client";
import { useState, useEffect, useLayoutEffect, useRef } from "react";
import { MagneticButton } from "./MagneticButton";

function HeroClock() {
  const [time, setTime] = useState(new Date());
  useEffect(() => {
    const i = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(i);
  }, []);
  const dhaka = new Date(
    time.getTime() + (time.getTimezoneOffset() + 360) * 60000,
  );
  const hh = String(dhaka.getHours()).padStart(2, "0");
  const mm = String(dhaka.getMinutes()).padStart(2, "0");
  const ss = String(dhaka.getSeconds()).padStart(2, "0");
  return (
    <span className="cf-meta-time">
      {hh}
      <span className="cf-meta-colon">:</span>
      {mm}
      <span className="cf-meta-colon">:</span>
      {ss}
    </span>
  );
}

function HeadlineWord({
  words,
  interval = 2800,
}: {
  words: string[];
  interval?: number;
}) {
  const [idx, setIdx] = useState(0);
  const [measured, setMeasured] = useState(0);
  const measureRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const i = setInterval(
      () => setIdx((x) => (x + 1) % words.length),
      interval,
    );
    return () => clearInterval(i);
  }, [words, interval]);

  useLayoutEffect(() => {
    if (measureRef.current) {
      const rect = measureRef.current.getBoundingClientRect();
      setMeasured(Math.ceil(rect.width) + 12);
    }
  }, [idx]);

  return (
    <span
      className="cf-word-rotator"
      style={{ width: measured ? measured + "px" : "auto" }}
    >
      <span ref={measureRef} className="cf-word-measure" aria-hidden="true">
        {words[idx]}
      </span>
      <span key={idx} className="cf-word-active">
        {words[idx]}
      </span>
    </span>
  );
}

function HeroVisual() {
  const ref = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      const dx = (e.clientX / window.innerWidth - 0.5) * 2;
      const dy = (e.clientY / window.innerHeight - 0.5) * 2;
      setTilt({ x: dx * 6, y: -dy * 6 });
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  return (
    <div className="cf-hero-visual-wrap">
      <div
        className="cf-hero-visual"
        ref={ref}
        data-cursor="Interactive"
        style={{
          transform: `perspective(1200px) rotateY(${tilt.x}deg) rotateX(${tilt.y}deg)`,
        }}
      >
        <div className="cf-vis-chip cf-vis-chip-tr">
          <span className="cf-vis-chip-dot" />
          <div>
            <div className="cf-vis-chip-label">Now shipping</div>
            <div className="cf-vis-chip-value">FactWatch v2</div>
          </div>
        </div>

        <div className="cf-vis-chip cf-vis-chip-bl">
          <div className="cf-vis-chip-grid">
            <div>
              <div className="cf-vis-chip-label">Uptime</div>
              <div className="cf-vis-chip-value">
                99.98<sup>%</sup>
              </div>
            </div>
            <div>
              <div className="cf-vis-chip-label">Lighthouse</div>
              <div className="cf-vis-chip-value">100</div>
            </div>
          </div>
        </div>

        <div className="cf-vis-orbit-tag t1">TypeScript</div>
        <div className="cf-vis-orbit-tag t2">Next.js</div>
        <div className="cf-vis-orbit-tag t3">React Native</div>
        <div className="cf-vis-orbit-tag t4">Figma</div>

        <div className="cf-vis-ring cf-vis-ring-1" />
        <div className="cf-vis-ring cf-vis-ring-2" />
        <div className="cf-vis-ring cf-vis-ring-3" />

        <div className="cf-vis-sphere">
          <div className="cf-vis-sphere-highlight" />
          <div className="cf-vis-sphere-noise" />
          <div className="cf-vis-sphere-logo">
            <svg
              width="54"
              height="31"
              viewBox="0 0 154 88"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M74.5569 72.1509C74.5569 32.304 41.179 0 0 0V25.0024C26.2251 26.5431 47.225 46.8011 48.9269 72.1509H74.5569Z"
                fill="rgba(255,255,255,0.92)"
              />
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M105.279 15.6744H79.4429C79.4429 55.5245 112.824 87.8253 154 87.8253V63.0223C127.805 61.3755 106.871 41.05 105.279 15.6744Z"
                fill="#FF80AE"
              />
            </svg>
          </div>
        </div>

        <div className="cf-vis-halo" />
      </div>
    </div>
  );
}

function scrollTo(id: string) {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: "smooth" });
}

export default function Hero() {
  return (
    <div className="cf-light">
      <section className="cf-hero-v2" id="hero">
        <div className="cf-hero-v2-bg" />
        <div className="cf-hero-v2-grid-lines" />
        <div className="cf-grain" />

        <div className="cf-hero-v2-top">
          <div className="cf-meta-item">
            <span className="cf-meta-key">CF</span>
            <span className="cf-meta-sep" />
            <span className="cf-meta-val">Studio · Est. 2020</span>
          </div>
          <div className="cf-meta-item">
            <span className="cf-meta-key">LOC</span>
            <span className="cf-meta-sep" />
            <span className="cf-meta-val">23.74°N · 90.38°E</span>
          </div>
          <div className="cf-meta-item cf-meta-item-time">
            <span className="cf-meta-key">TIME</span>
            <span className="cf-meta-sep" />
            <HeroClock />
            <span className="cf-meta-val-muted">DHK</span>
          </div>
        </div>

        <div className="cf-hero-v2-inner">
          <div className="cf-hero-v2-left">
            <div className="cf-hero-v2-eyebrow">
              <span className="cf-hero-v2-eyebrow-pulse">
                <span />
              </span>
              <span>2 spots open · Q3 2026</span>
            </div>

            <h1 className="cf-hero-v2-h1">
              <span className="cf-line">
                <span>Digital studio</span>
              </span>
              <span className="cf-line">
                <span>
                  building{" "}
                  <HeadlineWord
                    words={["products", "platforms", "experiences"]}
                  />
                </span>
              </span>
              <span className="cf-line">
                <span>
                  founders <i>trust.</i>
                </span>
              </span>
            </h1>

            <p className="cf-hero-v2-sub">
              A senior engineering &amp; design studio in Dhaka. From product
              thinking to launch-day comms — we sweat the details so your team
              can move.
            </p>

            <div className="cf-hero-v2-actions">
              <MagneticButton
                className="cf-btn-pill-primary"
                data-cursor="Let's talk"
                onClick={() => scrollTo("contact")}
              >
                <span>Start a project</span>
                <span className="cf-btn-pill-arrow">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M7 17L17 7M17 7H7M17 7V17"
                      stroke="currentColor"
                      strokeWidth="2.2"
                      strokeLinecap="round"
                    />
                  </svg>
                </span>
              </MagneticButton>
              <MagneticButton
                className="cf-btn-pill-ghost"
                onClick={() => scrollTo("work")}
              >
                <span className="cf-play-tri" />
                <span>Watch reel</span>
                <span className="cf-btn-pill-duration">01:42</span>
              </MagneticButton>
            </div>

            <div className="cf-hero-v2-trust">
              <span>60+ products shipped</span>
              <span className="cf-dot-sep" />
              <span>98% repeat rate</span>
              <span className="cf-dot-sep" />
              <span>12 countries</span>
            </div>
          </div>

          <div className="cf-hero-v2-right">
            <HeroVisual />
          </div>
        </div>

        <div className="cf-hero-v2-bottom">
          <div className="cf-hero-v2-clients">
            <div className="cf-meta-key cf-meta-key-dim">
              Trusted by teams at
            </div>
            <div className="cf-hero-v2-clients-logos">
              <span>FactWatch</span>
              <span className="cf-dot-sep" />
              <span>NextStop</span>
              <span className="cf-dot-sep" />
              <span>Nomadic</span>
              <span className="cf-dot-sep" />
              <span>TripKing</span>
              <span className="cf-dot-sep" />
              <span>+ 56 more</span>
            </div>
          </div>
          <div className="cf-hero-v2-scroll">
            <span className="cf-hero-v2-scroll-line" />
            <span>Scroll</span>
          </div>
        </div>
      </section>
    </div>
  );
}
