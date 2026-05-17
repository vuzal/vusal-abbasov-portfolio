import { useState, FormEvent } from "react";
import { motion } from "framer-motion";
import { Send, Mail, Linkedin, Github, FileText, ArrowUpRight } from "lucide-react";
import { Reveal } from "./Reveal";
import { usePortfolio } from "@/lib/portfolioData";

// Dizayn eynidir, sadəcə funksionallıq üçün "name" əlavə olundu
function Field({
  label,
  name,
  type = "text",
  textarea,
}: {
  label: string;
  name: string;
  type?: string;
  textarea?: boolean;
}) {
  const [v, setV] = useState("");
  const [focus, setFocus] = useState(false);
  const active = focus || v.length > 0;
  const id = label.toLowerCase().replace(/\s/g, "-");

  const cls =
    "w-full bg-transparent outline-none text-sm text-white placeholder:text-white/20 transition-colors py-3 px-4";

  return (
    <div
      className="relative rounded-xl transition-all duration-300"
      style={{
        background: "rgba(255,255,255,0.03)",
        border: `1px solid ${focus ? "rgba(255,215,0,0.4)" : "rgba(255,255,255,0.08)"}`,
      }}
    >
      <label
        htmlFor={id}
        className="block text-[10px] tracking-widest uppercase px-4 pt-3 transition-all duration-200"
        style={{ color: active ? "#FFD700" : "rgba(255,255,255,0.35)" }}
      >
        {label}
      </label>
      {textarea ? (
        <textarea
          id={id}
          name={name}
          rows={4}
          value={v}
          required
          onChange={(e) => setV(e.target.value)}
          onFocus={() => setFocus(true)}
          onBlur={() => setFocus(false)}
          className={cls + " resize-none pb-3"}
          placeholder={`Your ${label.toLowerCase()}...`}
        />
      ) : (
        <input
          id={id}
          name={name}
          type={type}
          value={v}
          required
          onChange={(e) => setV(e.target.value)}
          onFocus={() => setFocus(true)}
          onBlur={() => setFocus(false)}
          className={cls + " pb-3"}
          placeholder={`Your ${label.toLowerCase()}...`}
        />
      )}
    </div>
  );
}

const SOCIAL_ICONS: Record<string, typeof Mail> = {
  email: Mail,
  linkedin: Linkedin,
  github: Github,
  cv: FileText,
};

export function Contact() {
  const { data } = usePortfolio();
  const { contact } = data;
  const [sent, setSent] = useState(false);
  // Inputların içini vizual olaraq sıfırlamaq üçün key state-i
  const [formKey, setFormKey] = useState(0); 

  // Email göndərmə API funksiyası
  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    
    // BURAYA web3forms.com saytından aldığın Access Key-i yazırsan
    formData.append("access_key", import.meta.env.VITE_WEB3FORMS_KEY); 
    formData.append("subject", "Portfolio saytından yeni mesaj var!");

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        setSent(true);
        setFormKey((prev) => prev + 1); // Formu uğurla sıfırlayır
        setTimeout(() => setSent(false), 2500);
      } else {
        alert("Mesaj göndərilərkən xəta baş verdi.");
      }
    } catch (error) {
      console.error(error);
      alert("Şəbəkə xətası baş verdi.");
    }
  };

  const socials = [
    contact.email && {
      key: "email",
      label: "Email",
      href: `mailto:${contact.email}`,
      value: contact.email,
    },
    contact.linkedin && {
      key: "linkedin",
      label: "LinkedIn",
      href: contact.linkedin,
      value: "linkedin.com",
    },
    contact.github && {
      key: "github",
      label: "GitHub",
      href: contact.github,
      value: "github.com",
    },
    contact.cv && {
      key: "cv",
      label: "Resume",
      href: contact.cv,
      value: "Download CV",
    },
  ].filter(Boolean) as { key: string; label: string; href: string; value: string }[];

  return (
    <section id="contact" className="relative py-32 px-6 overflow-hidden">
      {/* Background glow */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10 pointer-events-none"
        style={{
          background:
            "radial-gradient(800px circle at 50% 100%, rgba(255,215,0,0.06), transparent 60%)",
        }}
      />

      <div className="mx-auto max-w-6xl">
        {/* Başlıq */}
        <div className="text-center mb-16">
          <Reveal>
            <p className="text-xs tracking-[0.3em] text-accent uppercase mb-4">Contact</p>
          </Reveal>
          <Reveal delay={0.1}>
            <h2 className="font-display text-5xl md:text-7xl font-semibold tracking-tighter">
              Let's build something{" "}
              <span className="text-gradient-gold-cyan">great.</span>
            </h2>
          </Reveal>
          <Reveal delay={0.2}>
            <p className="mt-5 text-base max-w-md mx-auto" style={{ color: "rgba(255,255,255,0.4)" }}>
              Have a backend project, collaboration idea, or just want to connect? I'm always open to new opportunities.
            </p>
          </Reveal>
        </div>

        <div className="grid lg:grid-cols-5 gap-8 items-start">
          {/* Sol — Sosial linklər */}
          <Reveal delay={0.2} className="lg:col-span-2">
            <div className="space-y-3">
              {socials.map(({ key, label, href, value }, idx) => {
                const Icon = SOCIAL_ICONS[key] ?? Mail;
                return (
                  <motion.a
                    key={key}
                    href={href}
                    target={key !== "email" ? "_blank" : undefined}
                    rel="noreferrer"
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1 * idx }}
                    whileHover={{ x: 4 }}
                    className="group flex items-center justify-between p-4 rounded-2xl transition-all duration-300"
                    style={{
                      background: "rgba(255,255,255,0.02)",
                      border: "1px solid rgba(255,255,255,0.06)",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = "rgba(255,215,0,0.25)";
                      e.currentTarget.style.background = "rgba(255,215,0,0.04)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)";
                      e.currentTarget.style.background = "rgba(255,255,255,0.02)";
                    }}
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className="h-10 w-10 grid place-items-center rounded-xl"
                        style={{ background: "rgba(255,215,0,0.1)" }}
                      >
                        <Icon className="h-4 w-4" style={{ color: "#FFD700" }} />
                      </div>
                      <div>
                        <p className="text-xs text-white/40 mb-0.5">{label}</p>
                        <p className="text-sm font-medium text-white/80">{value}</p>
                      </div>
                    </div>
                    <ArrowUpRight
                      className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-all duration-200 -translate-y-0.5 group-hover:translate-y-0"
                      style={{ color: "#FFD700" }}
                    />
                  </motion.a>
                );
              })}

              {/* Availability card */}
              <div
                className="p-4 rounded-2xl mt-4"
                style={{
                  background: "rgba(52,211,153,0.05)",
                  border: "1px solid rgba(52,211,153,0.15)",
                }}
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75 animate-ping" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
                  </span>
                  <span className="text-xs font-medium text-emerald-400">Available for work</span>
                </div>
                <p className="text-xs" style={{ color: "rgba(255,255,255,0.35)" }}>
                  Open to backend roles, freelance projects, and collaborations.
                </p>
              </div>
            </div>
          </Reveal>

          {/* Sağ — Form */}
          <Reveal delay={0.3} className="lg:col-span-3">
            <div
              className="rounded-2xl p-8"
              style={{
                background: "rgba(255,255,255,0.02)",
                border: "1px solid rgba(255,255,255,0.06)",
              }}
            >
              <h3 className="font-display text-xl font-semibold mb-6">Send a message</h3>
              
              {/* key atributu formu sıfırlamağa kömək edir */}
              <form key={formKey} onSubmit={submit} className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <Field label="Name" name="name" />
                  <Field label="Email" name="email" type="email" />
                </div>
                <Field label="Subject" name="subject" />
                <Field label="Message" name="message" textarea />
                <div className="pt-2">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.97 }}
                    type="submit"
                    className="group w-full inline-flex items-center justify-center gap-3 rounded-xl px-8 py-4 text-sm font-semibold transition-all"
                    style={{
                      background: sent
                        ? "rgba(52,211,153,0.15)"
                        : "linear-gradient(135deg, #FFD700, #f59e0b)",
                      color: sent ? "#34d399" : "#000",
                      border: sent ? "1px solid rgba(52,211,153,0.3)" : "none",
                    }}
                  >
                    {sent ? (
                      <>Message sent ✓</>
                    ) : (
                      <>
                        Send Message
                        <Send className="h-4 w-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                      </>
                    )}
                  </motion.button>
                </div>
              </form>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}