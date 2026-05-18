import { createContext, useContext, useEffect, useState, ReactNode, useCallback } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

export type SkillCategory = "Frontend" | "Backend" | "Database" | "Other" | "DevOps & Tools";
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
    name: "Vusal Abbasov",
    jobTitle: "Java Backend Developer",
    bio: "I design and develop high-performance server-side architectures. Leveraging the power of Java and ecosystem frameworks, I build secure APIs and optimized database models.",
    available: true,
  },
  contact: {
    email: "",
    linkedin: "",
    github: "",
    cv: "",
  },
  projects: [],
  skills: [],
};

type Ctx = {
  data: PortfolioData;
  setData: (updater: (d: PortfolioData) => PortfolioData) => void;
  reset: () => void;
  loading: boolean;
};

const PortfolioContext = createContext<Ctx | null>(null);

// Supabase-dən məlumatları oxu
async function fetchFromSupabase(): Promise<PortfolioData | null> {
  try {
    const [aboutRes, skillsRes, projectsRes, contactRes] = await Promise.all([
      supabase.from("about").select("*").limit(1).single(),
      supabase.from("skills").select("*").order("sort_order"),
      supabase.from("projects").select("*").order("sort_order"),
      supabase.from("contact").select("*").limit(1).single(),
    ]);

    if (aboutRes.error && aboutRes.error.code !== "PGRST116") return null;
    if (contactRes.error && contactRes.error.code !== "PGRST116") return null;

    const about: AboutData = aboutRes.data
      ? {
          name: aboutRes.data.name ?? DEFAULT_DATA.about.name,
          jobTitle: aboutRes.data.job_title ?? DEFAULT_DATA.about.jobTitle,
          bio: aboutRes.data.bio ?? DEFAULT_DATA.about.bio,
          available: aboutRes.data.available ?? DEFAULT_DATA.about.available,
        }
      : DEFAULT_DATA.about;

    const contact: ContactInfo = contactRes.data
      ? {
          email: contactRes.data.email ?? "",
          linkedin: contactRes.data.linkedin ?? "",
          github: contactRes.data.github ?? "",
          cv: contactRes.data.cv ?? "",
        }
      : DEFAULT_DATA.contact;

    const skills: Skill[] = (skillsRes.data ?? []).map((s) => ({
      id: s.id,
      name: s.name,
      category: s.category as SkillCategory,
      level: s.level as SkillLevel,
    }));

    const projects: Project[] = (projectsRes.data ?? []).map((p) => ({
      id: p.id,
      title: p.title,
      desc: p.description ?? "",
      tech: p.tech ?? [],
      live: p.live ?? "",
      github: p.github ?? "",
      image: p.image ?? "",
    }));

    return { about, contact, skills, projects };
  } catch {
    return null;
  }
}

export function PortfolioProvider({ children }: { children: ReactNode }) {
  const [data, setDataState] = useState<PortfolioData>(DEFAULT_DATA);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFromSupabase().then((d) => {
      if (d) setDataState(d);
      setLoading(false);
    });
  }, []);

  const setData = useCallback((updater: (d: PortfolioData) => PortfolioData) => {
    setDataState((prev) => updater(prev));
  }, []);

  const reset = useCallback(async () => {
    await Promise.all([
      supabase.from("about").delete().neq("id", "00000000-0000-0000-0000-000000000000"),
      supabase.from("skills").delete().neq("id", "00000000-0000-0000-0000-000000000000"),
      supabase.from("projects").delete().neq("id", "00000000-0000-0000-0000-000000000000"),
      supabase.from("contact").delete().neq("id", "00000000-0000-0000-0000-000000000000"),
    ]);
    setDataState(DEFAULT_DATA);
  }, []);

  return (
    <PortfolioContext.Provider value={{ data, setData, reset, loading }}>
      {children}
    </PortfolioContext.Provider>
  );
}

export function usePortfolio() {
  const ctx = useContext(PortfolioContext);
  if (!ctx) throw new Error("usePortfolio must be used within PortfolioProvider");
  return ctx;
}

// ─── Supabase yazma funksiyaları (admin panel üçün) ───

export async function saveAbout(about: AboutData) {
  const { data: existing } = await supabase.from("about").select("id").limit(1).single();
  if (existing) {
    return supabase.from("about").update({
      name: about.name,
      job_title: about.jobTitle,
      bio: about.bio,
      available: about.available,
    }).eq("id", existing.id);
  } else {
    return supabase.from("about").insert({
      name: about.name,
      job_title: about.jobTitle,
      bio: about.bio,
      available: about.available,
    });
  }
}

export async function saveContact(contact: ContactInfo) {
  const { data: existing } = await supabase.from("contact").select("id").limit(1).single();
  if (existing) {
    return supabase.from("contact").update(contact).eq("id", existing.id);
  } else {
    return supabase.from("contact").insert(contact);
  }
}

export async function saveProject(project: Project) {
  const { data: existing } = await supabase.from("projects").select("id").eq("id", project.id).single();
  if (existing) {
    return supabase.from("projects").update({
      title: project.title,
      description: project.desc,
      tech: project.tech,
      live: project.live,
      github: project.github,
      image: project.image,
    }).eq("id", project.id);
  } else {
    return supabase.from("projects").insert({
      title: project.title,
      description: project.desc,
      tech: project.tech,
      live: project.live,
      github: project.github,
      image: project.image,
    });
  }
}

export async function deleteProject(id: string) {
  return supabase.from("projects").delete().eq("id", id);
}

export async function saveSkill(skill: Skill) {
  const { data: existing } = await supabase.from("skills").select("id").eq("id", skill.id).single();
  if (existing) {
    return supabase.from("skills").update({
      name: skill.name,
      category: skill.category,
      level: skill.level,
    }).eq("id", skill.id);
  } else {
    return supabase.from("skills").insert({
      name: skill.name,
      category: skill.category,
      level: skill.level,
    });
  }
}

export async function deleteSkill(id: string) {
  return supabase.from("skills").delete().eq("id", id);
}

// ─── Admin auth (localStorage-da qalır) ───

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