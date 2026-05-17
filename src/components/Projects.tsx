import { useRef, MouseEvent } from "react";
import { motion } from "framer-motion";
import { ArrowUpRight, Github as GithubIcon, ExternalLink } from "lucide-react";
import { Reveal } from "./Reveal";
import { usePortfolio, Project } from "@/lib/portfolioData";

const ACCENTS = ["#FFD700", "#00f5ff", "#FFD700", "#00f5ff", "#a78bfa", "#34d399"];

function ProjectCard({ p, i }: { p: Project; i: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const accent = ACCENTS[i % ACCENTS.length];

  const onMove = (e: MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    el.style.transform = `perspective(1000px) rotateX(${-y * 6}deg) rotateY(${x * 6}deg) scale(1.02)`;
    el.style.setProperty("--mx", `${(x + 0.5) * 100}%`);
    el.style.setProperty("--my", `${(y + 0.5) * 100}%`);
  };

  const onLeave = () => {
    const el = ref.current;
    if (!el) return;
    el.style.transform = "perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)";
  };

  return (
    <Reveal delay={i * 0.1}>
      <div
        ref={ref}
        onMouseMove={onMove}
        onMouseLeave={onLeave}
        className="group relative rounded-2xl overflow-hidden transition-transform duration-300 will-change-transform cursor-hover"
        style={{
          transformStyle: "preserve-3d",
          background: "rgba(255,255,255,0.02)",
          border: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        {/* Şəkil hissəsi */}
        <div className="relative h-52 overflow-hidden">
          {p.image ? (
            <img
              src={p.image}
              alt={p.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div
              className="w-full h-full flex items-center justify-center"
              style={{ background: `linear-gradient(135deg, ${accent}15, rgba(0,0,0,0.4))` }}
            >
              <span
                className="font-display text-6xl font-black opacity-20 select-none"
                style={{ color: accent }}
              >
                {String(i + 1).padStart(2, "0")}
              </span>
            </div>
          )}

          {/* Overlay gradient */}
          <div
            className="absolute inset-0"
            style={{ background: "linear-gradient(to bottom, transparent 40%, rgba(10,10,12,0.95) 100%)" }}
          />

          {/* Nömrə badge */}
          <div className="absolute top-4 left-4">
            <span
              className="text-[10px] font-bold tracking-[0.25em] uppercase px-2.5 py-1 rounded-full"
              style={{
                background: `${accent}20`,
                border: `1px solid ${accent}40`,
                color: accent,
              }}
            >
              {String(i + 1).padStart(2, "0")}
            </span>
          </div>

          {/* Link düymələri - hover-da görünür */}
          <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-1 group-hover:translate-y-0">
            {p.live && (
              <motion.a
                href={p.live}
                target="_blank"
                rel="noreferrer"
                whileHover={{ scale: 1.1 }}
                className="h-9 w-9 grid place-items-center rounded-full"
                style={{ background: accent, color: "#000" }}
              >
                <ExternalLink className="h-4 w-4" />
              </motion.a>
            )}
            {p.github && (
              <motion.a
                href={p.github}
                target="_blank"
                rel="noreferrer"
                whileHover={{ scale: 1.1 }}
                className="h-9 w-9 grid place-items-center rounded-full"
                style={{ background: "rgba(255,255,255,0.1)", backdropFilter: "blur(8px)", color: "#fff" }}
              >
                <GithubIcon className="h-4 w-4" />
              </motion.a>
            )}
          </div>

          {/* Hover glow */}
          <div
            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
            style={{
              background: `radial-gradient(300px circle at var(--mx,50%) var(--my,50%), ${accent}18, transparent 60%)`,
            }}
          />
        </div>

        {/* Mətn hissəsi */}
        <div className="p-6">
          <h3
            className="font-display text-xl font-bold tracking-tight"
            style={{ color: "rgba(255,255,255,0.92)" }}
          >
            {p.title}
          </h3>
          <p className="mt-2 text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.45)" }}>
            {p.desc}
          </p>

          {/* Tech tags */}
          {p.tech.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-1.5">
              {p.tech.map((t) => (
                <span
                  key={t}
                  className="text-[11px] px-2.5 py-1 rounded-full font-medium"
                  style={{
                    background: `${accent}10`,
                    border: `1px solid ${accent}25`,
                    color: "rgba(255,255,255,0.6)",
                  }}
                >
                  {t}
                </span>
              ))}
            </div>
          )}

          {/* Alt hissə */}
          <div
            className="mt-5 pt-4 flex items-center justify-between"
            style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
          >
            <div className="flex gap-4">
              {p.live && (
                <a
                  href={p.live}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-medium"
                  style={{ color: accent }}
                >
                  <ExternalLink className="h-3 w-3" />
                  Live Demo
                </a>
              )}
              {p.github && (
                <a
                  href={p.github}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-medium"
                  style={{ color: "rgba(255,255,255,0.4)" }}
                >
                  <GithubIcon className="h-3 w-3" />
                  Source Code
                </a>
              )}
            </div>
            <motion.div
              className="h-8 w-8 grid place-items-center rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              style={{ background: `${accent}15`, border: `1px solid ${accent}30` }}
              whileHover={{ rotate: 45 }}
            >
              <ArrowUpRight className="h-3.5 w-3.5" style={{ color: accent }} />
            </motion.div>
          </div>
        </div>
      </div>
    </Reveal>
  );
}

export function Projects() {
  const { data } = usePortfolio();

  return (
    <section id="projects" className="relative py-32 px-6">
      <div className="mx-auto max-w-6xl">
        {/* Başlıq */}
        <div className="flex items-end justify-between flex-wrap gap-6 mb-16">
          <div>
            <Reveal>
              <p className="text-xs tracking-[0.3em] text-accent uppercase mb-4">Selected Work</p>
            </Reveal>
            <Reveal delay={0.1}>
              <h2 className="font-display text-4xl md:text-6xl font-semibold tracking-tight max-w-2xl">
                Production-ready{" "}
                <span className="text-gradient-gold-cyan">backend solutions.</span>
              </h2>
            </Reveal>
          </div>
          <Reveal delay={0.2}>
            <p
              className="text-sm max-w-xs leading-relaxed"
              style={{ color: "rgba(255,255,255,0.4)" }}
            >
              A curated set of recent work — clean architecture, database optimization, and scalable backend design.
            </p>
          </Reveal>
        </div>

        {/* Grid */}
        {data.projects.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {data.projects.map((p, i) => (
              <ProjectCard key={p.id} p={p} i={i} />
            ))}
          </div>
        ) : (
          <div
            className="rounded-2xl p-16 text-center"
            style={{
              background: "rgba(255,255,255,0.02)",
              border: "1px solid rgba(255,255,255,0.06)",
            }}
          >
            <p className="text-muted-foreground text-sm">
              No projects yet. Add some from the admin panel.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}