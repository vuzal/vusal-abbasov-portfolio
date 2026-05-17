import { motion } from "framer-motion";
import { Reveal } from "./Reveal";
import { usePortfolio } from "@/lib/portfolioData";
import { Server, Database, Wrench, Globe } from "lucide-react";

const CATEGORY_META: Record<string, { icon: typeof Server; color: string }> = {
  "Backend": { icon: Server, color: "#FFD700" },
  "Database": { icon: Database, color: "#00f5ff" },
  "DevOps & Tools": { icon: Wrench, color: "#a78bfa" },
  "Frontend": { icon: Globe, color: "#34d399" },
  "Other": { icon: Wrench, color: "#f87171" },
};

export function Skills() {
  const { data } = usePortfolio();
  const skills = data.skills;

  // Kateqoriyalara görə qruplaşdır
  const grouped = skills.reduce<Record<string, typeof skills>>((acc, s) => {
    const cat = s.category || "Other";
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(s);
    return acc;
  }, {});

  const categories = Object.keys(grouped);

  return (
    <section id="skills" className="relative py-32 px-6">
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <p className="text-xs tracking-[0.3em] text-accent uppercase mb-4">Skills</p>
        </Reveal>
        <Reveal delay={0.1}>
          <h2 className="font-display text-4xl md:text-6xl font-semibold tracking-tight max-w-3xl">
            The technology stack behind  <span className="text-gradient-gold-cyan">scalable solutions.</span>
          </h2>
        </Reveal>

        <div className="mt-16 grid md:grid-cols-2 gap-6">
          {categories.map((cat, ci) => {
            const meta = CATEGORY_META[cat] ?? { icon: Wrench, color: "#FFD700" };
            const Icon = meta.icon;
            return (
              <Reveal key={cat} delay={ci * 0.1}>
                <div
                  className="rounded-2xl p-6 border border-white/5 h-full"
                  style={{ background: "rgba(255,255,255,0.02)" }}
                >
                  {/* Kateqoriya başlığı */}
                  <div className="flex items-center gap-3 mb-5">
                    <div
                      className="flex items-center justify-center w-9 h-9 rounded-xl"
                      style={{ background: `${meta.color}18` }}
                    >
                      <Icon className="h-4 w-4" style={{ color: meta.color }} />
                    </div>
                    <h3 className="font-display font-semibold text-lg" style={{ color: meta.color }}>
                      {cat}
                    </h3>
                  </div>

                  {/* Skills */}
                  <div className="flex flex-wrap gap-2">
                    {grouped[cat].map((s, i) => (
                      <motion.span
                        key={s.id}
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: ci * 0.1 + i * 0.05 }}
                        whileHover={{ scale: 1.05 }}
                        className="px-3 py-1.5 rounded-full text-sm font-medium border transition-all cursor-default"
                        style={{
                          background: `${meta.color}10`,
                          borderColor: `${meta.color}30`,
                          color: "rgba(255,255,255,0.85)",
                        }}
                      >
                        {s.name}
                      </motion.span>
                    ))}
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}