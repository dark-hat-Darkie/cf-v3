"use client";

import { motion, useInView } from "motion/react";
import { useRef } from "react";
import Image from "next/image";

const highlights = [
  "End-to-end product development",
  "Dedicated team of 100+ professionals",
  "24/7 support and maintenance",
  "Agile methodology for rapid delivery",
];

const techStack = [
  {
    name: "React",
    color: "#61DAFB",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
        <path d="M12 10.11c1.03 0 1.87.84 1.87 1.89 0 1-.84 1.85-1.87 1.85S10.13 13 10.13 12c0-1.05.84-1.89 1.87-1.89M7.37 20c.63.38 2.01-.2 3.6-1.7-.52-.59-1.03-1.23-1.51-1.9a22.7 22.7 0 0 1-2.4-.36c-.51 2.14-.32 3.61.31 3.96m.71-5.74-.29-.51c-.11.29-.22.58-.29.86.27.06.57.11.88.16l-.3-.51m6.54-.76.81-1.5-.81-1.5c-.3-.53-.62-1-.91-1.47C13.17 9 12.6 9 12 9s-1.17 0-1.71.03c-.29.47-.61.94-.91 1.47L8.57 12l.81 1.5c.3.53.62 1 .91 1.47.54.03 1.11.03 1.71.03s1.17 0 1.71-.03c.29-.47.61-.94.91-1.47M12 6.78c-.19.22-.39.45-.59.72h1.18c-.2-.27-.4-.5-.59-.72m0 10.44c.19-.22.39-.45.59-.72h-1.18c.2.27.4.5.59.72M16.62 4c-.62-.38-2 .2-3.59 1.7.52.59 1.03 1.23 1.51 1.9.82.08 1.63.2 2.4.36.51-2.14.32-3.61-.32-3.96m-.7 5.74.29.51c.11-.29.22-.58.29-.86-.27-.06-.57-.11-.88-.16l.3.51m1.45-7.05c1.47.84 1.63 3.05 1.01 5.63 2.54.75 4.37 1.99 4.37 3.68s-1.83 2.93-4.37 3.68c.62 2.58.46 4.79-1.01 5.63-1.46.84-3.45-.12-5.37-1.95-1.92 1.83-3.91 2.79-5.38 1.95-1.46-.84-1.62-3.05-1-5.63-2.54-.75-4.37-1.99-4.37-3.68s1.83-2.93 4.37-3.68c-.62-2.58-.46-4.79 1-5.63 1.47-.84 3.46.12 5.38 1.95 1.92-1.83 3.91-2.79 5.37-1.95M17.08 12c.34.75.64 1.5.89 2.26 2.1-.63 3.28-1.53 3.28-2.26s-1.18-1.63-3.28-2.26c-.25.76-.55 1.51-.89 2.26M6.92 12c-.34-.75-.64-1.5-.89-2.26-2.1.63-3.28 1.53-3.28 2.26s1.18 1.63 3.28 2.26c.25-.76.55-1.51.89-2.26m9 2.26-.3.51c.31-.05.61-.1.88-.16-.07-.28-.18-.57-.29-.86l-.29.51m-2.89 4.04c1.59 1.5 2.97 2.08 3.59 1.7.64-.35.83-1.82.32-3.96-.77.16-1.58.28-2.4.36-.48.67-.99 1.31-1.51 1.9M8.08 9.74l.3-.51c-.31.05-.61.1-.88.16.07.28.18.57.29.86l.29-.51m2.89-4.04C9.38 4.2 8 3.62 7.37 4c-.63.35-.82 1.82-.31 3.96a22.7 22.7 0 0 1 2.4-.36c.48-.67.99-1.31 1.51-1.9" />
      </svg>
    ),
  },
  {
    name: "Node.js",
    color: "#339933",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
        <path d="M11.998 24c-.321 0-.641-.084-.922-.247l-2.936-1.737c-.438-.245-.224-.332-.08-.383.585-.203.703-.25 1.328-.604.065-.037.151-.023.218.017l2.256 1.339a.29.29 0 0 0 .272 0l8.795-5.076a.277.277 0 0 0 .134-.238V6.921a.28.28 0 0 0-.137-.242l-8.791-5.072a.278.278 0 0 0-.271 0L3.075 6.68a.284.284 0 0 0-.139.241v10.15a.27.27 0 0 0 .138.236l2.409 1.392c1.307.654 2.108-.116 2.108-.89V7.787c0-.142.114-.253.256-.253h1.115c.139 0 .255.112.255.253v10.021c0 1.745-.95 2.745-2.604 2.745-.508 0-.909 0-2.026-.551L2.28 18.675A1.857 1.857 0 0 1 1.36 17.07V6.921c0-.645.344-1.248.921-1.569l8.795-5.082a1.93 1.93 0 0 1 1.846 0l8.794 5.082c.577.322.922.924.922 1.569v10.15c0 .645-.345 1.245-.922 1.57l-8.795 5.076c-.28.163-.6.247-.923.247" />
      </svg>
    ),
  },
  {
    name: "Java",
    color: "#ED8B00",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
        <path d="M8.851 18.56s-.917.534.653.714c1.902.218 2.874.187 4.969-.211 0 0 .552.346 1.321.646-4.699 2.013-10.633-.118-6.943-1.149M8.276 15.933s-1.028.762.542.924c2.032.209 3.636.227 6.413-.308 0 0 .384.389.987.602-5.679 1.661-12.007.13-7.942-1.218M13.116 11.475c1.158 1.333-.304 2.533-.304 2.533s2.939-1.518 1.589-3.418c-1.261-1.772-2.228-2.652 3.007-5.688 0-.001-8.216 2.051-4.292 6.573M19.33 20.504s.679.559-.747.991c-2.712.822-11.288 1.069-13.669.033-.856-.373.75-.89 1.254-.998.527-.114.828-.093.828-.093-.953-.671-6.156 1.317-2.643 1.887 9.58 1.553 17.462-.7 14.977-1.82M9.292 13.21s-4.362 1.036-1.544 1.412c1.189.159 3.561.123 5.77-.062 1.806-.152 3.618-.477 3.618-.477s-.637.272-1.098.587c-4.429 1.165-12.986.623-10.522-.568 2.082-1.006 3.776-.892 3.776-.892M17.116 17.584c4.503-2.34 2.421-4.589.968-4.285-.355.074-.515.138-.515.138s.132-.207.385-.297c2.875-1.011 5.086 2.981-.928 4.562 0 0 .07-.062.09-.118M14.401 0s2.494 2.494-2.365 6.33c-3.896 3.077-.889 4.832 0 6.836-2.274-2.053-3.943-3.858-2.824-5.539 1.644-2.469 6.197-3.665 5.189-7.627M9.734 23.924c4.322.277 10.959-.154 11.116-2.198 0 0-.302.775-3.572 1.391-3.688.694-8.239.613-10.937.168 0 0 .553.457 3.393.639" />
      </svg>
    ),
  },
  {
    name: "WordPress",
    color: "#21759B",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
        <path d="M12.158 12.786l-2.698 7.84c.806.236 1.657.365 2.54.365 1.047 0 2.051-.18 2.986-.511a.6.6 0 0 1-.049-.085l-2.779-7.609zM3.009 12c0 3.56 2.07 6.634 5.068 8.092L3.788 8.341A8.946 8.946 0 0 0 3.009 12zm17.159-1.395c0-1.112-.399-1.881-.742-2.48-.456-.742-.884-1.37-.884-2.112 0-.828.627-1.6 1.513-1.6.04 0 .078.005.116.007A8.963 8.963 0 0 0 12 3.009a8.996 8.996 0 0 0-7.559 4.114c.212.007.413.011.587.011.954 0 2.431-.116 2.431-.116.491-.028.549.694.058.751 0 0-.494.058-1.044.086l3.323 9.884 1.997-5.99-1.421-3.894c-.491-.029-.957-.087-.957-.087-.492-.029-.434-.78.057-.751 0 0 1.506.116 2.403.116.954 0 2.431-.116 2.431-.116.492-.028.55.694.058.751 0 0-.495.058-1.044.086l3.297 9.806.91-3.043c.394-1.265.695-2.173.695-2.957zM20.991 12c0 3.325-1.812 6.227-4.503 7.787l2.766-7.999c.516-1.291.688-2.322.688-3.24 0-.333-.022-.642-.063-.928A8.924 8.924 0 0 1 20.991 12zM12 22.167C6.393 22.167 1.833 17.607 1.833 12S6.393 1.833 12 1.833 22.167 6.393 22.167 12 17.607 22.167 12 22.167zM12 1C5.935 1 1 5.935 1 12s4.935 11 11 11 11-4.935 11-11S18.065 1 12 1z" />
      </svg>
    ),
  },
  {
    name: ".NET",
    color: "#512BD4",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
        <path d="M24 8.77h-2.468v7.565h-1.425V8.77h-2.462V7.53H24zm-6.852 7.565h-4.821V7.53h4.63v1.24h-3.205v2.494h2.953v1.234h-2.953v2.604h3.396zm-6.708 0H8.882L4.78 9.863a3.5 3.5 0 0 1-.227-.543h-.032c.032.36.047.86.047 1.5v5.515H3.2V7.53h1.7l3.96 6.345c.14.22.236.4.29.54h.025c-.04-.39-.055-.9-.055-1.53V7.53H10.44zM2.126 16.335H.472a.47.47 0 0 1-.472-.467v-.028a.47.47 0 0 1 .472-.467h1.654a.47.47 0 0 1 .472.467v.028a.47.47 0 0 1-.472.467" />
      </svg>
    ),
  },
  {
    name: "Next.js",
    color: "#000000",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
        <path d="M11.572 0c-.176 0-.31.001-.358.007a19.76 19.76 0 0 1-.364.033C7.443.346 4.25 2.185 2.228 5.012a11.875 11.875 0 0 0-2.119 5.243c-.096.659-.108.854-.108 1.747s.012 1.089.108 1.748c.652 4.506 3.86 8.292 8.209 9.695.779.25 1.6.422 2.534.525.363.04 1.935.04 2.299 0 1.611-.178 2.977-.577 4.323-1.264.207-.106.247-.134.219-.158-.02-.013-.9-1.193-1.955-2.62l-1.919-2.592-2.404-3.558a338.739 338.739 0 0 0-2.422-3.556c-.009-.002-.018 1.579-.023 3.51-.007 3.38-.01 3.515-.052 3.595a.426.426 0 0 1-.206.214c-.075.037-.14.044-.495.044H7.81l-.108-.068a.44.44 0 0 1-.157-.171l-.049-.106.006-4.703.007-4.705.073-.091a.637.637 0 0 1 .174-.143c.096-.047.134-.052.54-.052.478 0 .558.018.682.154.035.038 1.337 1.999 2.895 4.361a10760.433 10760.433 0 0 0 4.735 7.17l1.9 2.879.096-.063a12.317 12.317 0 0 0 2.466-2.163 11.944 11.944 0 0 0 2.824-6.134c.096-.66.108-.854.108-1.748 0-.893-.012-1.088-.108-1.747-.652-4.506-3.86-8.292-8.208-9.695a12.597 12.597 0 0 0-2.499-.523A33.119 33.119 0 0 0 11.572 0zm4.069 7.217c.347 0 .408.005.486.047a.473.473 0 0 1 .237.277c.018.06.023 1.365.018 4.304l-.006 4.218-.744-1.14-.746-1.14v-3.066c0-1.982.01-3.097.023-3.15a.478.478 0 0 1 .233-.296c.096-.05.13-.054.5-.054z" />
      </svg>
    ),
  },
  {
    name: "Flutter",
    color: "#02569B",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
        <path d="M14.314 0L2.3 12 6.13 15.83 22.15 0zM14.314 11.147L8.15 17.3 6.13 15.28 14.31 7.1l3.83 3.83zM8.15 17.3l6.163 6.174h7.837L14.314 15.6z" />
      </svg>
    ),
  },
  {
    name: "Python",
    color: "#3776AB",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
        <path d="M14.25.18l.9.2.73.26.59.3.45.32.34.34.25.34.16.33.1.3.04.26.02.2-.01.13V8.5l-.05.63-.13.55-.21.46-.26.38-.3.31-.33.25-.35.19-.35.14-.33.1-.3.07-.26.04-.21.02H8.77l-.69.05-.59.14-.5.22-.41.27-.33.32-.27.35-.2.36-.15.37-.1.35-.07.32-.04.27-.02.21v3.06H3.17l-.21-.03-.28-.07-.32-.12-.35-.18-.36-.26-.36-.36-.35-.46-.32-.59-.28-.73-.21-.88-.14-1.05-.05-1.23.06-1.22.16-1.04.24-.87.32-.71.36-.57.4-.44.42-.33.42-.24.4-.16.36-.1.32-.05.24-.01h.16l.06.01h8.16v.62H6.34l-.01 2.98.01.2.03.21.04.18.06.16.07.13.08.1.09.08.1.06.11.04.11.02.12.01h5.76l.39-.05.36-.1.32-.17.27-.24.21-.32.17-.4.11-.49.07-.59.03-.69v-.06l.01-.13V.62l-.01-.12zM11.39 1.04c-.31 0-.55.24-.55.55 0 .32.24.56.55.56.31 0 .54-.24.54-.56 0-.31-.23-.55-.54-.55zM9.75 23.82l-.9-.2-.73-.26-.59-.3-.45-.32-.34-.34-.25-.34-.16-.33-.1-.3-.04-.26-.02-.2V13.5l.05-.63.13-.55.21-.46.26-.38.3-.31.33-.25.35-.19.35-.14.33-.1.3-.07.26-.04.21-.02h5.49l.69-.05.59-.14.5-.22.41-.27.33-.32.27-.35.2-.36.15-.37.1-.35.07-.32.04-.27.02-.21V3.94h3.25l.21.03.28.07.32.12.35.18.36.26.36.36.35.46.32.59.28.73.21.88.14 1.05.05 1.23-.06 1.22-.16 1.04-.24.87-.32.71-.36.57-.4.44-.42.33-.42.24-.4.16-.36.1-.32.05-.24.01h-.16l-.06-.01H7.84v-.62h7.69l.01-2.98-.01-.2-.03-.21-.04-.18-.06-.16-.07-.13-.08-.1-.09-.08-.1-.06-.11-.04-.11-.02-.12-.01H9.2l-.39.05-.36.1-.32.17-.27.24-.21.32-.17.4-.11.49-.07.59-.03.69v.06l-.01.13v8.39l.01.12zM12.61 22.96c.31 0 .55-.24.55-.55 0-.32-.24-.56-.55-.56-.31 0-.54.24-.54.56 0 .31.23.55.54.55z" />
      </svg>
    ),
  },
];

function TechBadge({
  tech,
  index,
  total,
  isInView,
}: {
  tech: (typeof techStack)[0];
  index: number;
  total: number;
  isInView: boolean;
}) {
  // Place badges in a circle around center
  const angle = (index / total) * 2 * Math.PI - Math.PI / 2;
  const radius = 42; // % from center
  const x = 50 + radius * Math.cos(angle);
  const y = 50 + radius * Math.sin(angle);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0 }}
      animate={isInView ? { opacity: 1, scale: 1 } : {}}
      transition={{
        duration: 0.5,
        delay: 0.3 + index * 0.1,
        type: "spring",
        stiffness: 200,
      }}
      style={{ left: `${x}%`, top: `${y}%` }}
      className="absolute z-10 -translate-x-1/2 -translate-y-1/2"
    >
      <motion.div
        animate={{
          y: [0, -4, 0, 3, 0],
          x: [0, 3, 0, -3, 0],
        }}
        transition={{
          duration: 5 + index * 0.7,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="flex items-center gap-2 rounded-full border border-white/60 bg-white/80 px-3 py-1.5 shadow-lg shadow-purple/5 backdrop-blur-md"
      >
        <span style={{ color: tech.color }}>{tech.icon}</span>
        <span className="text-xs font-medium text-foreground/80 whitespace-nowrap">{tech.name}</span>
      </motion.div>
    </motion.div>
  );
}

export default function About() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="about" className="relative px-6 py-20">
      {/* Background accent */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute right-0 top-1/4 h-96 w-96 rounded-full bg-pink/30 blur-3xl" />
      </div>

      <div className="mx-auto max-w-6xl">
        <div ref={ref} className="grid items-center gap-16 lg:grid-cols-2">
          {/* Visual — Tech Universe */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7 }}
            className="relative"
          >
            <div className="relative mx-auto aspect-square max-w-[400px] flex items-center justify-center lg:max-w-none">
              {/* Soft circular glow backdrop */}
              <div className="absolute inset-[10%] rounded-full bg-gradient-to-br from-purple-light/60 via-pink-light/40 to-purple-light/30" />
              <motion.div
                animate={{ scale: [1, 1.15, 1], opacity: [0.4, 0.7, 0.4] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                className="absolute inset-[18%] rounded-full bg-white/50 blur-2xl"
              />

              {/* Orbit rings */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
                className="absolute inset-[12%] rounded-full border border-dashed border-purple/8"
              />
              <motion.div
                animate={{ rotate: -360 }}
                transition={{ duration: 70, repeat: Infinity, ease: "linear" }}
                className="absolute inset-[25%] rounded-full border border-dashed border-purple/6"
              />

              {/* Center logo with glow */}
              <div className="relative z-10">
                <motion.div
                  animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.5, 0.2] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute -inset-10 rounded-full bg-purple/10 blur-2xl"
                />
                <motion.div
                  animate={{ y: [0, -6, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                >
                  <Image src="/logo.svg" alt="CodeFlee" width={100} height={58} />
                </motion.div>
              </div>

              {/* Tech badges placed in a circular pattern */}
              {techStack.map((tech, i) => (
                <TechBadge
                  key={tech.name}
                  tech={tech}
                  index={i}
                  total={techStack.length}
                  isInView={isInView}
                />
              ))}
            </div>
          </motion.div>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            <span className="mb-4 inline-block text-sm font-medium tracking-wide text-purple">
              ABOUT US
            </span>
            <h2 className="mb-6 text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
              Why{" "}
              <span className="text-purple">CodeFlee</span>?
            </h2>
            <p className="mb-8 text-lg leading-relaxed text-muted">
              We are a digital service provider offering advanced software
              development, web development, and app development solutions. Our
              mission is to empower businesses with technology that drives real
              results.
            </p>

            <div className="space-y-4">
              {highlights.map((item, i) => (
                <motion.div
                  key={item}
                  initial={{ opacity: 0, x: 20 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.4, delay: 0.4 + i * 0.1 }}
                  className="flex items-center gap-3"
                >
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-purple">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="white" className="h-3.5 w-3.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                    </svg>
                  </div>
                  <span className="text-sm font-medium">{item}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
