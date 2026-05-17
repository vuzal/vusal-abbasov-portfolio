import { motion } from "framer-motion";
import { Github, Linkedin, Mail } from "lucide-react";
import { usePortfolio } from "@/lib/portfolioData";

export function SocialRail() {
  const { data } = usePortfolio();
  const items = [
    data.contact.github && { Icon: Github, href: data.contact.github, label: "GitHub" },
    data.contact.linkedin && { Icon: Linkedin, href: data.contact.linkedin, label: "LinkedIn" },
    data.contact.email && { Icon: Mail, href: `mailto:${data.contact.email}`, label: "Email" },
  ].filter(Boolean) as { Icon: typeof Github; href: string; label: string }[];

  return (
    <motion.aside
      initial={{ x: -40, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ delay: 1.2, duration: 0.6 }}
      className="hidden lg:flex fixed left-6 top-1/2 -translate-y-1/2 z-40 flex-col gap-4"
      aria-label="Social links"
    >
      {items.map(({ Icon, href, label }) => (
        <a
          key={label}
          href={href}
          target="_blank"
          rel="noreferrer"
          aria-label={label}
          className="group h-10 w-10 grid place-items-center rounded-full glass hover:border-primary/60 transition-all hover:-translate-y-0.5"
        >
          <Icon className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
        </a>
      ))}
      <div className="mx-auto h-16 w-px bg-gradient-to-b from-border to-transparent" />
    </motion.aside>
  );
}
