import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState, FormEvent } from "react";
import { motion } from "framer-motion";
import {
  LogOut,
  FolderKanban,
  Sparkles,
  User,
  Mail,
  Plus,
  Trash2,
  Pencil,
  X,
  Check,
  RotateCcw,
  GripVertical,
} from "lucide-react";
import {
  usePortfolio,
  isAdminAuthed,
  tryAdminLogin,
  adminLogout,
  saveAbout,
  saveContact,
  saveProject,
  deleteProject,
  saveSkill,
  deleteSkill,
  Project,
  Skill,
  SkillCategory,
  SkillLevel,
} from "@/lib/portfolioData";

export const Route = createFileRoute("/admin")({
  component: AdminRoute,
  head: () => ({
    meta: [
      { title: "Admin Panel" },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
});

function AdminRoute() {
  const [authed, setAuthed] = useState(false);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    setAuthed(isAdminAuthed());
    setChecked(true);
  }, []);

  if (!checked) return null;
  if (!authed) return <LoginGate onSuccess={() => setAuthed(true)} />;
  return <AdminPanel onLogout={() => setAuthed(false)} />;
}

function LoginGate({ onSuccess }: { onSuccess: () => void }) {
  const [pw, setPw] = useState("");
  const [error, setError] = useState(false);
  const [shake, setShake] = useState(0);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (tryAdminLogin(pw)) {
      onSuccess();
    } else {
      setError(true);
      setShake((s) => s + 1);
      setPw("");
    }
  };

  return (
    <div className="min-h-screen grid place-items-center bg-background px-6">
      <motion.form
        onSubmit={submit}
        key={shake}
        initial={shake ? { x: 0 } : false}
        animate={shake ? { x: [-12, 12, -8, 8, -4, 4, 0] } : { x: 0 }}
        transition={{ duration: 0.45 }}
        className="w-full max-w-sm glass gradient-border rounded-2xl p-8"
      >
        <h1 className="font-display text-2xl font-semibold tracking-tight">Admin access</h1>
        <p className="mt-1 text-sm text-muted-foreground">Enter password to continue.</p>
        <input
          type="password"
          autoFocus
          value={pw}
          onChange={(e) => { setPw(e.target.value); setError(false); }}
          placeholder="Password"
          className={`mt-6 w-full rounded-lg bg-secondary/40 border px-4 py-3 text-sm outline-none transition-colors ${error ? "border-red-500" : "border-border focus:border-primary"}`}
        />
        {error && <p className="mt-2 text-xs text-red-500">Wrong password. Try again.</p>}
        <button
          type="submit"
          className="mt-5 w-full rounded-lg bg-primary text-primary-foreground py-3 text-sm font-medium hover:opacity-90 transition-opacity"
        >
          Unlock
        </button>
      </motion.form>
    </div>
  );
}

type Section = "projects" | "skills" | "about" | "contact";

function AdminPanel({ onLogout }: { onLogout: () => void }) {
  const [section, setSection] = useState<Section>("projects");
  const { reset } = usePortfolio();
  const navigate = useNavigate();

  const logout = () => {
    adminLogout();
    onLogout();
    navigate({ to: "/" });
  };

  const navItems: { id: Section; label: string; Icon: typeof FolderKanban }[] = [
    { id: "projects", label: "Projects", Icon: FolderKanban },
    { id: "skills", label: "Skills", Icon: Sparkles },
    { id: "about", label: "About", Icon: User },
    { id: "contact", label: "Contact Info", Icon: Mail },
  ];

  return (
    <div className="min-h-screen bg-[#0b0b0d] text-foreground flex">
      <aside className="w-60 shrink-0 border-r border-border/60 bg-[#0e0e11] p-4 flex flex-col">
        <div className="px-2 py-3">
          <p className="text-[10px] tracking-[0.3em] text-muted-foreground uppercase">Portfolio</p>
          <p className="font-display text-lg font-semibold">Admin</p>
        </div>
        <nav className="mt-4 space-y-1">
          {navItems.map(({ id, label, Icon }) => (
            <button
              key={id}
              onClick={() => setSection(id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                section === id
                  ? "bg-primary/15 text-primary"
                  : "text-muted-foreground hover:bg-secondary/40 hover:text-foreground"
              }`}
            >
              <Icon className="h-4 w-4" />
              {label}
            </button>
          ))}
        </nav>
        <div className="mt-auto space-y-2">
          <button
            onClick={() => { if (confirm("Reset all portfolio data to defaults?")) reset(); }}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-muted-foreground hover:bg-secondary/40 hover:text-foreground transition-colors"
          >
            <RotateCcw className="h-3.5 w-3.5" /> Reset to defaults
          </button>
        </div>
      </aside>

      <main className="flex-1 flex flex-col min-w-0">
        <header className="h-14 border-b border-border/60 px-6 flex items-center justify-between bg-[#0e0e11]">
          <h1 className="font-display text-lg font-semibold">Admin Panel</h1>
          <button
            onClick={logout}
            className="inline-flex items-center gap-2 text-sm px-3 py-1.5 rounded-lg border border-border hover:border-primary hover:text-primary transition-colors"
          >
            <LogOut className="h-4 w-4" /> Logout
          </button>
        </header>
        <div className="flex-1 overflow-auto p-8">
          {section === "projects" && <ProjectsAdmin />}
          {section === "skills" && <SkillsAdmin />}
          {section === "about" && <AboutAdmin />}
          {section === "contact" && <ContactAdmin />}
        </div>
      </main>
    </div>
  );
}

// ---------------- Projects ----------------

function emptyProject(): Project {
  return { id: `p_${Date.now()}`, title: "", desc: "", tech: [], live: "", github: "", image: "" };
}

function ProjectsAdmin() {
  const { data, setData } = usePortfolio();
  const [editing, setEditing] = useState<Project | null>(null);

  const save = async (p: Project) => {
    await saveProject(p);
    setData((d) => {
      const exists = d.projects.some((x) => x.id === p.id);
      return {
        ...d,
        projects: exists ? d.projects.map((x) => (x.id === p.id ? p : x)) : [...d.projects, p],
      };
    });
    setEditing(null);
  };

  const remove = async (id: string) => {
    if (!confirm("Delete this project?")) return;
    await deleteProject(id);
    setData((d) => ({ ...d, projects: d.projects.filter((p) => p.id !== id) }));
  };

  return (
    <div className="max-w-4xl">
      <SectionHeader
        title="Projects"
        action={
          <button
            onClick={() => setEditing(emptyProject())}
            className="inline-flex items-center gap-2 text-sm px-3 py-2 rounded-lg bg-primary text-primary-foreground hover:opacity-90 transition-opacity"
          >
            <Plus className="h-4 w-4" /> Add new project
          </button>
        }
      />
      <div className="mt-6 space-y-3">
        {data.projects.map((p) => (
          <div
            key={p.id}
            className="flex items-start justify-between gap-4 p-4 rounded-xl border border-border/60 bg-[#101014]"
          >
            <div className="min-w-0">
              <p className="font-medium truncate">{p.title || "Untitled"}</p>
              <p className="text-sm text-muted-foreground line-clamp-2">{p.desc}</p>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {p.tech.map((t) => (
                  <span key={t} className="text-[10px] px-2 py-0.5 rounded-full bg-secondary/50 text-muted-foreground">{t}</span>
                ))}
              </div>
            </div>
            <div className="flex gap-1 shrink-0">
              <IconBtn onClick={() => setEditing(p)} title="Edit"><Pencil className="h-4 w-4" /></IconBtn>
              <IconBtn onClick={() => remove(p.id)} title="Delete" danger><Trash2 className="h-4 w-4" /></IconBtn>
            </div>
          </div>
        ))}
        {data.projects.length === 0 && <p className="text-sm text-muted-foreground">No projects yet.</p>}
      </div>
      {editing && <ProjectModal project={editing} onClose={() => setEditing(null)} onSave={save} />}
    </div>
  );
}

function ProjectModal({ project, onClose, onSave }: { project: Project; onClose: () => void; onSave: (p: Project) => void }) {
  const [p, setP] = useState<Project>(project);
  const [techInput, setTechInput] = useState("");
  const [saving, setSaving] = useState(false);

  const addTech = () => {
    const v = techInput.trim();
    if (!v) return;
    setP({ ...p, tech: [...p.tech, v] });
    setTechInput("");
  };

  const handleSave = async () => {
    setSaving(true);
    await onSave(p);
    setSaving(false);
  };

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/70 p-4" onClick={onClose}>
      <div
        className="w-full max-w-xl rounded-2xl border border-border bg-[#0e0e11] p-6 max-h-[90vh] overflow-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <h3 className="font-display text-lg font-semibold">{project.title ? "Edit project" : "New project"}</h3>
          <IconBtn onClick={onClose} title="Close"><X className="h-4 w-4" /></IconBtn>
        </div>
        <div className="mt-5 space-y-4">
          <Field label="Title">
            <input className={inputCls} value={p.title} onChange={(e) => setP({ ...p, title: e.target.value })} />
          </Field>
          <Field label="Description">
            <textarea rows={3} className={inputCls + " resize-none"} value={p.desc} onChange={(e) => setP({ ...p, desc: e.target.value })} />
          </Field>
          <Field label="Technologies">
            <div className="flex flex-wrap gap-1.5 mb-2">
              {p.tech.map((t, i) => (
                <span key={i} className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full bg-secondary/60">
                  {t}
                  <button onClick={() => setP({ ...p, tech: p.tech.filter((_, j) => j !== i) })}>
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                className={inputCls}
                value={techInput}
                onChange={(e) => setTechInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addTech(); } }}
                placeholder="Type and press Enter"
              />
              <button onClick={addTech} className="px-3 rounded-lg border border-border text-sm hover:border-primary">Add</button>
            </div>
          </Field>
          <Field label="Live URL">
            <input className={inputCls} value={p.live ?? ""} onChange={(e) => setP({ ...p, live: e.target.value })} />
          </Field>
          <Field label="GitHub URL">
            <input className={inputCls} value={p.github ?? ""} onChange={(e) => setP({ ...p, github: e.target.value })} />
          </Field>
          <Field label="Project Image">
            <div className="space-y-3">
              {p.image && (
                <div className="relative w-full h-40 rounded-xl overflow-hidden border border-white/10">
                  <img src={p.image} alt="preview" className="w-full h-full object-cover" />
                  <button
                    onClick={() => setP({ ...p, image: "" })}
                    className="absolute top-2 right-2 h-7 w-7 grid place-items-center rounded-full bg-black/60 hover:bg-red-500/80 transition-colors"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              )}
              <label
                className="flex flex-col items-center justify-center w-full h-28 rounded-xl cursor-pointer transition-colors"
                style={{ background: "#2a2a32", border: "2px dashed rgba(255,255,255,0.15)" }}
                onMouseEnter={(e) => (e.currentTarget.style.borderColor = "rgba(255,215,0,0.4)")}
                onMouseLeave={(e) => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.15)")}
              >
                <input
                  type="file"
                  accept="image/*"
                  className="sr-only"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    const reader = new FileReader();
                    reader.onload = () => setP({ ...p, image: reader.result as string });
                    reader.readAsDataURL(file);
                  }}
                />
                <div className="flex flex-col items-center gap-2 text-muted-foreground">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span className="text-sm">Click to upload image</span>
                  <span className="text-xs opacity-50">PNG, JPG, WebP</span>
                </div>
              </label>
            </div>
          </Field>
        </div>
        <div className="mt-6 flex justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2 text-sm rounded-lg border border-border hover:border-foreground/60">Cancel</button>
          <button
            onClick={handleSave}
            disabled={!p.title.trim() || saving}
            className="px-4 py-2 text-sm rounded-lg bg-primary text-primary-foreground disabled:opacity-40 hover:opacity-90"
          >
            {saving ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ---------------- Skills ----------------

const CATEGORIES: SkillCategory[] = ["Backend", "Database", "DevOps & Tools", "Frontend", "Other"];
const LEVELS: SkillLevel[] = ["Beginner", "Intermediate", "Advanced", "Expert"];

function SkillsAdmin() {
  const { data, setData } = usePortfolio();
  const [dragIndex, setDragIndex] = useState<number | null>(null);

  const addSkill = async () => {
    const newSkill: Skill = { id: `s_${Date.now()}`, name: "", category: "Backend", level: "Intermediate" };
    await saveSkill(newSkill);
    setData((d) => ({ ...d, skills: [...d.skills, newSkill] }));
  };

  const update = async (id: string, patch: Partial<Skill>) => {
    setData((d) => {
      const updated = d.skills.map((s) => (s.id === id ? { ...s, ...patch } : s));
      const skill = updated.find((s) => s.id === id);
      if (skill) saveSkill(skill);
      return { ...d, skills: updated };
    });
  };

  const remove = async (id: string) => {
    if (!confirm("Delete this skill?")) return;
    await deleteSkill(id);
    setData((d) => ({ ...d, skills: d.skills.filter((s) => s.id !== id) }));
  };

  const onDrop = (target: number) => {
    if (dragIndex === null || dragIndex === target) return;
    setData((d) => {
      const arr = [...d.skills];
      const [m] = arr.splice(dragIndex, 1);
      arr.splice(target, 0, m);
      return { ...d, skills: arr };
    });
    setDragIndex(null);
  };

  return (
    <div className="max-w-4xl">
      <SectionHeader
        title="Skills"
        action={
          <button
            onClick={addSkill}
            className="inline-flex items-center gap-2 text-sm px-3 py-2 rounded-lg bg-primary text-primary-foreground hover:opacity-90 transition-opacity"
          >
            <Plus className="h-4 w-4" /> Add new skill
          </button>
        }
      />
      <p className="mt-2 text-xs text-muted-foreground">Drag the handle to reorder.</p>
      <div className="mt-6 space-y-2">
        {data.skills.map((s, i) => (
          <div
            key={s.id}
            draggable
            onDragStart={() => setDragIndex(i)}
            onDragOver={(e) => e.preventDefault()}
            onDrop={() => onDrop(i)}
            className={`flex items-center gap-3 p-3 rounded-xl border border-border/60 bg-[#101014] ${dragIndex === i ? "opacity-50" : ""}`}
          >
            <GripVertical className="h-4 w-4 text-muted-foreground cursor-grab shrink-0" />
            <input
              className="flex-1 min-w-0 rounded-lg px-3 py-2 text-sm outline-none transition-colors"
              style={{ background: "#2a2a32", border: "1px solid rgba(255,255,255,0.2)", color: "#ffffff" }}
              placeholder="Skill adı..."
              value={s.name}
              onChange={(e) => update(s.id, { name: e.target.value })}
            />
            <select
              className="w-36 rounded-lg px-3 py-2 text-sm outline-none transition-colors"
              style={{ background: "#2a2a32", border: "1px solid rgba(255,255,255,0.2)", color: "#ffffff" }}
              value={s.category}
              onChange={(e) => update(s.id, { category: e.target.value as SkillCategory })}
            >
              {CATEGORIES.map((c) => <option key={c} value={c} style={{ background: "#1a1a1f" }}>{c}</option>)}
            </select>
            <select
              className="w-40 rounded-lg px-3 py-2 text-sm outline-none transition-colors"
              style={{ background: "#2a2a32", border: "1px solid rgba(255,255,255,0.2)", color: "#ffffff" }}
              value={s.level}
              onChange={(e) => update(s.id, { level: e.target.value as SkillLevel })}
            >
              {LEVELS.map((l) => <option key={l} value={l} style={{ background: "#1a1a1f" }}>{l}</option>)}
            </select>
            <IconBtn onClick={() => remove(s.id)} danger title="Delete"><Trash2 className="h-4 w-4" /></IconBtn>
          </div>
        ))}
        {data.skills.length === 0 && <p className="text-sm text-muted-foreground">No skills yet.</p>}
      </div>
    </div>
  );
}

// ---------------- About ----------------

function AboutAdmin() {
  const { data, setData } = usePortfolio();
  const [a, setA] = useState(data.about);
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => { setA(data.about); }, [data.about]);

  const save = async () => {
    setSaving(true);
    await saveAbout(a);
    setData((d) => ({ ...d, about: a }));
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 1500);
  };

  return (
    <div className="max-w-2xl">
      <SectionHeader title="About" />
      <div className="mt-6 space-y-5">
        <Field label="Name">
          <input className={inputCls} value={a.name} onChange={(e) => setA({ ...a, name: e.target.value })} />
        </Field>
        <Field label="Job title / current role">
          <input className={inputCls} value={a.jobTitle} onChange={(e) => setA({ ...a, jobTitle: e.target.value })} />
        </Field>
        <Field label="Bio">
          <textarea rows={6} className={inputCls + " resize-none"} value={a.bio} onChange={(e) => setA({ ...a, bio: e.target.value })} />
        </Field>
        <label className="flex items-center gap-3 cursor-pointer select-none">
          <span className="relative">
            <input
              type="checkbox"
              checked={a.available}
              onChange={(e) => setA({ ...a, available: e.target.checked })}
              className="sr-only peer"
            />
            <span className="block w-10 h-6 rounded-full bg-secondary peer-checked:bg-primary transition-colors" />
            <span className="absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-transform peer-checked:translate-x-4" />
          </span>
          <span className="text-sm">Show "Currently available for work" badge</span>
        </label>
        <div>
          <button onClick={save} disabled={saving} className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm hover:opacity-90 disabled:opacity-50">
            {saved ? <><Check className="h-4 w-4" /> Saved</> : saving ? "Saving..." : "Save changes"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ---------------- Contact ----------------

function ContactAdmin() {
  const { data, setData } = usePortfolio();
  const [c, setC] = useState(data.contact);
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => { setC(data.contact); }, [data.contact]);

  const save = async () => {
    setSaving(true);
    await saveContact(c);
    setData((d) => ({ ...d, contact: c }));
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 1500);
  };

  return (
    <div className="max-w-2xl">
      <SectionHeader title="Contact info" />
      <div className="mt-6 space-y-5">
        <Field label="Email">
          <input className={inputCls} value={c.email} onChange={(e) => setC({ ...c, email: e.target.value })} />
        </Field>
        <Field label="LinkedIn URL">
          <input className={inputCls} value={c.linkedin} onChange={(e) => setC({ ...c, linkedin: e.target.value })} />
        </Field>
        <Field label="GitHub URL">
          <input className={inputCls} value={c.github} onChange={(e) => setC({ ...c, github: e.target.value })} />
        </Field>
        <Field label="CV / Resume">
          <div className="space-y-3">
            {c.cv && (
              <div
                className="flex items-center justify-between px-4 py-3 rounded-xl"
                style={{ background: "rgba(255,215,0,0.08)", border: "1px solid rgba(255,215,0,0.2)" }}
              >
                <div className="flex items-center gap-2">
                  <span style={{ color: "#FFD700" }}>✓</span>
                  <span className="text-sm text-white/70">CV yüklənib</span>
                </div>
                <button onClick={() => setC({ ...c, cv: "" })} className="text-xs text-red-400 hover:text-red-300 transition-colors">
                  Sil
                </button>
              </div>
            )}
            <label
              className="flex flex-col items-center justify-center w-full h-24 rounded-xl cursor-pointer transition-colors"
              style={{ background: "#2a2a32", border: "2px dashed rgba(255,255,255,0.15)" }}
              onMouseEnter={(e) => (e.currentTarget.style.borderColor = "rgba(255,215,0,0.4)")}
              onMouseLeave={(e) => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.15)")}
            >
              <input
                type="file"
                accept=".pdf,.doc,.docx"
                className="sr-only"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  const reader = new FileReader();
                  reader.onload = () => setC({ ...c, cv: reader.result as string });
                  reader.readAsDataURL(file);
                }}
              />
              <div className="flex flex-col items-center gap-2 text-muted-foreground">
                <span className="text-2xl">📄</span>
                <span className="text-sm">CV faylı seçin</span>
                <span className="text-xs opacity-50">PDF, DOC, DOCX</span>
              </div>
            </label>
          </div>
        </Field>
        <div>
          <button onClick={save} disabled={saving} className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm hover:opacity-90 disabled:opacity-50">
            {saved ? <><Check className="h-4 w-4" /> Saved</> : saving ? "Saving..." : "Save changes"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ---------------- Shared ----------------

const inputCls =
  "w-full rounded-lg bg-[#1a1a1f] border border-white/20 px-3 py-2 text-sm outline-none focus:border-primary transition-colors text-white placeholder:text-white/40";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs uppercase tracking-wider text-muted-foreground mb-1.5">{label}</label>
      {children}
    </div>
  );
}

function SectionHeader({ title, action }: { title: string; action?: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between">
      <h2 className="font-display text-2xl font-semibold tracking-tight">{title}</h2>
      {action}
    </div>
  );
}

function IconBtn({ children, onClick, title, danger }: { children: React.ReactNode; onClick: () => void; title?: string; danger?: boolean }) {
  return (
    <button
      onClick={onClick}
      title={title}
      className={`h-8 w-8 grid place-items-center rounded-lg border border-border/60 transition-colors ${
        danger
          ? "text-muted-foreground hover:text-red-500 hover:border-red-500/50"
          : "text-muted-foreground hover:text-foreground hover:border-foreground/50"
      }`}
    >
      {children}
    </button>
  );
}