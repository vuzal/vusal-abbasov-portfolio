import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { ArrowDownRight, Code2, Database, Server } from "lucide-react";
import { MagneticButton } from "./MagneticButton";
import { usePortfolio } from "@/lib/portfolioData";

function Typewriter({ roles }: { roles: string[] }) {
  const [i, setI] = useState(0);
  const [text, setText] = useState("");
  const [del, setDel] = useState(false);

  useEffect(() => {
    if (roles.length === 0) return;
    const cur = roles[i % roles.length];
    const t = setTimeout(() => {
      if (!del) {
        const next = cur.slice(0, text.length + 1);
        setText(next);
        if (next === cur) setTimeout(() => setDel(true), 1500);
      } else {
        const next = cur.slice(0, text.length - 1);
        setText(next);
        if (next === "") {
          setDel(false);
          setI((i + 1) % roles.length);
        }
      }
    }, del ? 35 : 70);
    return () => clearTimeout(t);
  }, [text, del, i, roles]);

  return (
    <span
      style={{
        background: "linear-gradient(90deg, #FFD700, #00f5ff)",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
      }}
    >
      {text}
      <span
        className="inline-block w-[2px] h-[0.9em] -mb-1 ml-0.5 animate-pulse"
        style={{ background: "#FFD700" }}
      />
    </span>
  );
}

const STATS = [
  { icon: Server, label: "Backend", value: "Java & Spring" },
  { icon: Database, label: "Database", value: "PostgreSQL" },
  { icon: Code2, label: "Architecture", value: "Microservices" },
];

export function Hero() {
  const ref = useRef<HTMLDivElement>(null);
  const { data } = usePortfolio();
  const roles = ["Java Backend Developer", "Spring Boot Engineer", "API Architect"];

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const move = (e: MouseEvent) => {
      const r = el.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width;
      const y = (e.clientY - r.top) / r.height;
      el.style.setProperty("--mx", `${x * 100}%`);
      el.style.setProperty("--my", `${y * 100}%`);
    };
    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, []);

  return (
    <section
      id="home"
      ref={ref}
      className="relative min-h-screen flex items-center overflow-hidden"
    >
      {/* Reactive gradient mesh */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10"
        style={{
          background: `
            radial-gradient(600px circle at var(--mx,50%) var(--my,30%), rgba(255,215,0,0.15), transparent 60%),
            radial-gradient(800px circle at calc(100% - var(--mx,50%)) calc(100% - var(--my,50%)), rgba(0,245,255,0.12), transparent 60%),
            var(--gradient-hero)
          `,
        }}
      />

      {/* Grid pattern */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10 opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      {/* Particles */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        {Array.from({ length: 20 }).map((_, i) => (
          <motion.span
            key={i}
            className="absolute rounded-full"
            style={{
              left: `${(i * 37) % 100}%`,
              top: `${(i * 53) % 100}%`,
              width: 2 + (i % 2),
              height: 2 + (i % 2),
              background: i % 2 ? "#FFD700" : "#00f5ff",
              opacity: 0.25,
            }}
            animate={{ y: [0, -25, 0], opacity: [0.15, 0.5, 0.15] }}
            transition={{ duration: 6 + (i % 4), repeat: Infinity, delay: i * 0.2 }}
          />
        ))}
      </div>

      <div className="relative mx-auto max-w-6xl px-6 pt-32 pb-20 w-full">
        <div className="grid lg:grid-cols-2 gap-16 items-center min-h-[80vh]">

          {/* Sol hissə */}
          <div>
            {data.about.available && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.6 }}
                className="inline-flex items-center gap-2 rounded-full glass px-3 py-1.5 text-xs text-muted-foreground mb-8"
              >
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75 animate-ping" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
                </span>
                Currently available for work
              </motion.div>
            )}

            {/* Logo + Name */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8, ease: [0.2, 0.8, 0.2, 1] }}
              className="flex items-center gap-4 mb-6"
            >
              <div
                className="relative flex items-center justify-center w-16 h-16 rounded-2xl shrink-0"
                style={{ background: "linear-gradient(135deg, #FFD700 0%, #00f5ff 100%)" }}
              >
                <span className="text-black font-black text-2xl tracking-tighter select-none">
                  VA
                </span>
                <div
                  className="absolute inset-0 rounded-2xl"
                  style={{
                    boxShadow: "0 0 25px rgba(255,215,0,0.4), 0 0 50px rgba(0,245,255,0.15)",
                  }}
                />
              </div>
              <div className="flex flex-col leading-none">
                <span className="font-display font-black text-[clamp(2.2rem,5vw,4.5rem)] tracking-tighter text-white">
                  Vusal
                </span>
                <span
                  className="font-display font-black text-[clamp(2.2rem,5vw,4.5rem)] tracking-tighter"
                  style={{
                    background: "linear-gradient(90deg, #FFD700, #00f5ff)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  Abbasov
                </span>
              </div>
            </motion.div>

            {/* Typewriter */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.0, duration: 0.6 }}
              className="text-lg md:text-xl max-w-lg leading-relaxed"
              style={{ color: "rgba(255,255,255,0.55)" }}
            >
              I'm a <Typewriter roles={roles} />{" "}
              designing and building scalable server-side architectures and robust digital solutions.
            </motion.p>

            {/* CTA */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.3, duration: 0.6 }}
              className="mt-10 flex flex-wrap items-center gap-4"
            >
              <MagneticButton href="#projects">
                <span className="group inline-flex items-center gap-3 rounded-full px-7 py-4 text-sm font-semibold bg-primary text-primary-foreground glow-gold transition-all hover:scale-[1.02]">
                  View my work
                  <ArrowDownRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:translate-y-0.5" />
                </span>
              </MagneticButton>

              <MagneticButton href="#contact">
                <span
                  className="inline-flex items-center gap-2 rounded-full px-7 py-4 text-sm font-medium transition-all hover:scale-[1.02]"
                  style={{
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(255,255,255,0.12)",
                  }}
                >
                  Contact me
                </span>
              </MagneticButton>
            </motion.div>
          </div>

          {/* Sağ hissə — Kartlar */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.8, duration: 0.9, ease: [0.2, 0.8, 0.2, 1] }}
            className="hidden lg:flex flex-col gap-4"
          >
            {/* Böyük kart */}
            <div
              className="rounded-2xl p-8"
              style={{
                background: "rgba(255,255,255,0.02)",
                border: "1px solid rgba(255,255,255,0.06)",
              }}
            >
              <p
                className="text-[10px] tracking-[0.3em] uppercase mb-3"
                style={{ color: "rgba(255,255,255,0.3)" }}
              >
                Specialization
              </p>
              <p className="font-display text-2xl font-bold text-white leading-snug">
                Backend Engineering
                <br />
                <span
                  style={{
                    background: "linear-gradient(90deg, #FFD700, #00f5ff)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  {"& API Architecture"}
                </span>
              </p>
              <div className="mt-6 flex flex-wrap gap-2">
                {["Java", "Spring Boot", "PostgreSQL", "Docker", "REST API", "Microservices"].map((t) => (
                  <span
                    key={t}
                    className="text-xs px-3 py-1 rounded-full"
                    style={{
                      background: "rgba(255,215,0,0.08)",
                      border: "1px solid rgba(255,215,0,0.2)",
                      color: "rgba(255,255,255,0.6)",
                    }}
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>

            {/* Kiçik kartlar */}
            <div className="grid grid-cols-3 gap-4">
              {STATS.map(({ icon: Icon, label, value }, idx) => (
                <motion.div
                  key={label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.2 + idx * 0.1, duration: 0.5 }}
                  className="rounded-2xl p-4 flex flex-col gap-3"
                  style={{
                    background: "rgba(255,255,255,0.02)",
                    border: "1px solid rgba(255,255,255,0.06)",
                  }}
                >
                  <div
                    className="h-8 w-8 grid place-items-center rounded-lg"
                    style={{ background: "rgba(255,215,0,0.1)" }}
                  >
                    <Icon className="h-4 w-4" style={{ color: "#FFD700" }} />
                  </div>
                  <div>
                    <p className="text-[10px] text-white/30 uppercase tracking-wider">{label}</p>
                    <p className="text-sm font-semibold text-white/80 mt-0.5">{value}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.2 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-[10px] tracking-[0.3em] uppercase"
          style={{ color: "rgba(255,255,255,0.25)" }}
        >
          Scroll
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 1.6, repeat: Infinity }}
            className="h-8 w-px"
            style={{
              background: "linear-gradient(to bottom, rgba(255,255,255,0.3), transparent)",
            }}
          />
        </motion.div>
      </div>
    </section>
  );
}