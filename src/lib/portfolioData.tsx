import { createContext, useContext, useEffect, useState, ReactNode, useCallback } from "react";

export type SkillCategory = "Frontend" | "Backend" | "Database" | "Other" |"DevOps & Tools";
export type SkillLevel = "Beginner" | "Intermediate" | "Advanced" | "Expert";

export type Project = {
  id: string;
  title: string;
  desc: string;
  tech: string[];
  live?: string;
  github?: string;
  image?: string;
};

export type Skill = {
  id: string;
  name: string;
  category: SkillCategory;
  level: SkillLevel;
};

export type AboutData = {
  name: string;
  jobTitle: string;
  bio: string;
  available: boolean;
};

export type ContactInfo = {
  email: string;
  linkedin: string;
  github: string;
  cv: string;
};

export type PortfolioData = {
  projects: Project[];
  skills: Skill[];
  about: AboutData;
  contact: ContactInfo;
};

export const LEVEL_VALUE: Record<SkillLevel, number> = {
  Beginner: 55,
  Intermediate: 72,
  Advanced: 86,
  Expert: 95,
};

export const DEFAULT_DATA: PortfolioData = {
  about: {
    name: "Vusal",
    jobTitle: "Java Backend Developer",
    bio: "I design and develop high-performance server-side architectures. Leveraging the power of Java and ecosystem frameworks, I build secure APIs and optimized database models — ensuring high availability, modern microservices deployment, and flawless system integration.",
    available: true,
  },
  contact: {
    email: "hello@example.com",
    linkedin: "https://linkedin.com",
    github: "https://github.com",
    cv: "",
  },
  projects: [
    { id: "p1", title: "Nebula Finance", desc: "A premium fintech dashboard with real-time portfolio analytics and motion-driven storytelling.", tech: ["Next.js", "TypeScript", "D3"], live: "", github: "", image: "" },
    { id: "p2", title: "Aurora Studio", desc: "Brand & web platform for a creative studio. Editorial typography, custom WebGL transitions.", tech: ["React", "Three.js", "GSAP"], live: "", github: "", image: "" },
    { id: "p3", title: "Lumen OS", desc: "Design system & component library powering 40+ internal tools.", tech: ["Figma", "Storybook", "TS"], live: "", github: "", image: "" },
    { id: "p4", title: "Sable Commerce", desc: "Headless commerce platform with sub-second navigation and a custom checkout pipeline.", tech: ["Remix", "Stripe", "Postgres"], live: "", github: "", image: "" },
  ],
  skills: [
    { id: "s1", name: "React", category: "Frontend", level: "Expert" },
    { id: "s2", name: "TypeScript", category: "Frontend", level: "Expert" },
    { id: "s4", name: "Node.js", category: "Backend", level: "Advanced" },
    { id: "s5", name: "Framer Motion", category: "Frontend", level: "Advanced" },
    { id: "s6", name: "PostgreSQL", category: "Backend", level: "Intermediate" },
  ],
};

const STORAGE_KEY = "portfolio_data_v1";
const EVENT = "portfolio-data-change";

function loadData(): PortfolioData {
  if (typeof window === "undefined") return DEFAULT_DATA;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_DATA;
    const parsed = JSON.parse(raw);
    return { ...DEFAULT_DATA, ...parsed };
  } catch {
    return DEFAULT_DATA;
  }
}

type Ctx = {
  data: PortfolioData;
  setData: (updater: (d: PortfolioData) => PortfolioData) => void;
  reset: () => void;
};

const PortfolioContext = createContext<Ctx | null>(null);

export function PortfolioProvider({ children }: { children: ReactNode }) {
  const [data, setDataState] = useState<PortfolioData>(DEFAULT_DATA);

  useEffect(() => {
    setDataState(loadData());
    const onChange = () => setDataState(loadData());
    window.addEventListener(EVENT, onChange);
    window.addEventListener("storage", onChange);
    return () => {
      window.removeEventListener(EVENT, onChange);
      window.removeEventListener("storage", onChange);
    };
  }, []);

  const setData = useCallback((updater: (d: PortfolioData) => PortfolioData) => {
    setDataState((prev) => {
      const next = updater(prev);
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
        window.dispatchEvent(new Event(EVENT));
      } catch { }
      return next;
    });
  }, []);

  const reset = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setDataState(DEFAULT_DATA);
    window.dispatchEvent(new Event(EVENT));
  }, []);

  return (
    <PortfolioContext.Provider value={{ data, setData, reset }}>
      {children}
    </PortfolioContext.Provider>
  );
}

export function usePortfolio() {
  const ctx = useContext(PortfolioContext);
  if (!ctx) throw new Error("usePortfolio must be used within PortfolioProvider");
  return ctx;
}

// Admin auth
const AUTH_KEY = "admin_auth";
const ADMIN_PASSWORD = "vusal2306";
const TTL_MS = 24 * 60 * 60 * 1000;

export function isAdminAuthed(): boolean {
  if (typeof window === "undefined") return false;
  try {
    const raw = localStorage.getItem(AUTH_KEY);
    if (!raw) return false;
    const { expires } = JSON.parse(raw);
    if (typeof expires !== "number" || Date.now() > expires) {
      localStorage.removeItem(AUTH_KEY);
      return false;
    }
    return true;
  } catch {
    return false;
  }
}

export function tryAdminLogin(password: string): boolean {
  if (password !== ADMIN_PASSWORD) return false;
  localStorage.setItem(AUTH_KEY, JSON.stringify({ expires: Date.now() + TTL_MS }));
  return true;
}

export function adminLogout() {
  localStorage.removeItem(AUTH_KEY);
}
