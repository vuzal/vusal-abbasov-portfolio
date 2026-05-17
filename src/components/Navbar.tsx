import { useEffect, useState } from "react";
import { motion } from "framer-motion";

const links = [
  { href: "#home", label: "Home" },
  { href: "#about", label: "About" },
  { href: "#skills", label: "Skills" },
  { href: "#projects", label: "Projects" },
  { href: "#contact", label: "Contact" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${scrolled ? "py-3" : "py-6"
        }`}
    >
      <div className={`mx-auto max-w-6xl px-6 ${scrolled ? "glass rounded-full" : ""}`}>
        <nav className="flex items-center justify-between py-3">
          <a href="#home" className="flex items-center gap-2.5">
            {/* VA emblem */}
            <div className="relative flex items-center justify-center w-8 h-8 rounded-lg"
              style={{ background: "linear-gradient(135deg, #FFD700 0%, #00f5ff 100%)" }}
            >
              <span className="text-black font-black text-sm tracking-tighter select-none">VA</span>
              <div className="absolute inset-0 rounded-lg"
                style={{ boxShadow: "0 0 12px rgba(255,215,0,0.4), 0 0 24px rgba(0,245,255,0.15)" }}
              />
            </div>
            {/* Full name */}
            <span className="font-display font-bold text-sm tracking-tight"
              style={{ background: "linear-gradient(90deg, #FFD700, #00f5ff)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}
            >
              Vusal Abbasov
            </span>
          </a>
          <ul className="hidden md:flex items-center gap-8 text-sm text-muted-foreground">
            {links.map((l) => (
              <li key={l.href}>
                <a href={l.href} className="relative group text-muted-foreground hover:text-foreground transition-colors duration-300">
                  {l.label}
                  <span className="absolute -bottom-1 left-0 w-0 h-px group-hover:w-full transition-all duration-300"
                    style={{ background: "linear-gradient(90deg, #FFD700, #00f5ff)" }}
                  />
                </a>
              </li>
            ))}
          </ul>
          <a
            href="#contact"
            className="hidden sm:inline-flex items-center rounded-full px-4 py-2 text-xs font-medium glass border border-primary/30 text-primary hover:bg-primary hover:text-primary-foreground transition-colors"
          >
            Let's talk
          </a>
        </nav>
      </div>
    </motion.header>
  );
}
