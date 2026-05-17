import { motion } from "framer-motion";
import { Link } from "@tanstack/react-router";
import { Github, Linkedin, Mail } from "lucide-react";
import { usePortfolio } from "@/lib/portfolioData";

const NAV_LINKS = [
  { href: "#home", label: "Home" },
  { href: "#about", label: "About" },
  { href: "#skills", label: "Skills" },
  { href: "#projects", label: "Projects" },
  { href: "#contact", label: "Contact" },
];

export function Footer() {
  const { data } = usePortfolio();
  const { contact, about } = data;

  const socials = [
    contact.github && { href: contact.github, Icon: Github, label: "GitHub" },
    contact.linkedin && { href: contact.linkedin, Icon: Linkedin, label: "LinkedIn" },
    contact.email && { href: `mailto:${contact.email}`, Icon: Mail, label: "Email" },
  ].filter(Boolean) as { href: string; Icon: typeof Github; label: string }[];

  return (
    <footer className="relative px-6 pb-10 pt-24 overflow-hidden">
      {/* Background glow */}
      <div
        aria-hidden
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[200px] pointer-events-none -z-10"
        style={{
          background: "radial-gradient(ellipse at center, rgba(255,215,0,0.06), transparent 70%)",
        }}
      />

      <div className="mx-auto max-w-6xl">
        {/* Üst hissə */}
        <div className="grid md:grid-cols-3 gap-12 pb-12">

          {/* Logo + Bio */}
          <div className="md:col-span-1">
            <a href="#home" className="flex items-center gap-2.5 mb-4">
              <div
                className="flex items-center justify-center w-9 h-9 rounded-xl font-black text-sm text-black select-none"
                style={{ background: "linear-gradient(135deg, #FFD700 0%, #00f5ff 100%)" }}
              >
                VA
              </div>
              <span
                className="font-display font-bold text-sm tracking-tight"
                style={{
                  background: "linear-gradient(90deg, #FFD700, #00f5ff)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                Vusal Abbasov
              </span>
            </a>
            <p className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.35)" }}>
              Java Backend Developer building scalable server-side architectures and robust digital solutions.
            </p>
          </div>

          {/* Nav linklər */}
          <div className="md:col-span-1">
            <p className="text-[10px] tracking-[0.3em] uppercase mb-4" style={{ color: "rgba(255,255,255,0.3)" }}>
              Navigation
            </p>
            <ul className="space-y-2.5">
              {NAV_LINKS.map((l) => (
                <li key={l.href}>
                  <a
                    href={l.href}
                    className="text-sm transition-colors duration-200"
                    style={{ color: "rgba(255,255,255,0.45)" }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = "#FFD700")}
                    onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.45)")}
                  >
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Sosial + Contact */}
          <div className="md:col-span-1">
            <p className="text-[10px] tracking-[0.3em] uppercase mb-4" style={{ color: "rgba(255,255,255,0.3)" }}>
              Connect
            </p>
            <div className="space-y-3">
              {socials.map(({ href, Icon, label }) => (
                <a
                  key={label}
                  href={href}
                  target={!href.startsWith("mailto") ? "_blank" : undefined}
                  rel="noreferrer"
                  className="flex items-center gap-3 text-sm transition-colors duration-200 group"
                  style={{ color: "rgba(255,255,255,0.45)" }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = "#FFD700")}
                  onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.45)")}
                >
                  <Icon className="h-4 w-4" />
                  {label}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Ayırıcı xətt */}
        <motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          style={{
            transformOrigin: "0% 50%",
            background: "linear-gradient(90deg, #FFD700, #00f5ff)",
            height: "1px",
          }}
        />

        {/* Alt hissə */}
        <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
          <span className="text-xs" style={{ color: "rgba(255,255,255,0.25)" }}>
            © {new Date().getFullYear()} {about.name}. All rights reserved.
            <Link
              to="/admin"
              aria-label="Admin"
              className="ml-2 opacity-0 hover:opacity-100 transition-opacity select-none"
              style={{ color: "#FFD700" }}
            >
              ·
            </Link>
          </span>
          <span className="text-xs" style={{ color: "rgba(255,255,255,0.25)" }}>
            Designed & built with{" "}
            <span style={{ color: "#FFD700" }}>♥</span>{" "}
            in dark mode
          </span>
        </div>
      </div>
    </footer>
  );
}