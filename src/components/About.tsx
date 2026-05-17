import { motion } from "framer-motion";
import { Reveal } from "./Reveal";
import { usePortfolio } from "@/lib/portfolioData";
import photo from "@/assets/me.jpeg";

export function About() {
  const { data } = usePortfolio();
  const { about, skills } = data;
  const tags = Array.from(new Set(skills.map((s) => s.name))).slice(0, 12);
  const initials = about.name
    .split(/\s+/)
    .map((n) => n[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <section id="about" className="relative py-32 px-6">
      <div className="mx-auto max-w-6xl grid lg:grid-cols-2 gap-16 items-center">
        <Reveal>
          <div className="relative aspect-[4/5] rounded-3xl overflow-hidden">
            <motion.div
              aria-hidden
              className="absolute -inset-[2px] rounded-3xl opacity-80"
              style={{ background: "conic-gradient(from 0deg, var(--gold), var(--cyan), var(--gold))" }}
              animate={{ rotate: 360 }}
              transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
            />
            <div className="absolute inset-[2px] rounded-3xl bg-card overflow-hidden">
              <div
                className="absolute inset-0"
                style={{
                  background:
                    "radial-gradient(circle at 50% 30%, rgba(255,215,0,0.18), transparent 60%), radial-gradient(circle at 70% 80%, rgba(0,245,255,0.18), transparent 60%)",
                }}
              />
              <img
                src={photo}
                alt={about.name}
                className="absolute inset-0 w-full h-full object-cover object-center"
              />
              <div className="absolute bottom-6 left-6 right-6 rounded-2xl px-4 py-3 flex items-center justify-between text-xs"
                style={{ background: "rgba(0,0,0,0.75)", backdropFilter: "blur(12px)", border: "1px solid rgba(255,215,0,0.25)" }}
              >
                <span style={{ color: "rgba(255,255,255,0.6)" }}>Role</span>
                <span className="font-medium" style={{ background: "linear-gradient(90deg, #FFD700, #00f5ff)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                  {about.jobTitle}
                </span>
              </div>
            </div>
          </div>
        </Reveal>

        <div>
          <Reveal>
            <p className="text-xs tracking-[0.3em] text-accent uppercase mb-4">About</p>
          </Reveal>
          <Reveal delay={0.1}>
            <h2 className="font-display text-4xl md:text-6xl font-semibold tracking-tight">
              A backend engineer obsessed with <span className="text-gradient-gold-cyan">scalable architecture.</span>
            </h2>
          </Reveal>
          <Reveal delay={0.2}>
            <p className="mt-6 text-lg text-muted-foreground leading-relaxed whitespace-pre-line">
              {about.bio}
            </p>
          </Reveal>

          <Reveal delay={0.4}>
            <div className="mt-10 flex flex-wrap gap-2">
              {tags.map((t, i) => (
                <motion.span
                  key={t}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.05 * i }}
                  className="glass rounded-full px-4 py-2 text-sm border border-border hover:border-primary/60 hover:text-primary transition-colors cursor-hover"
                >
                  {t}
                </motion.span>
              ))}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
