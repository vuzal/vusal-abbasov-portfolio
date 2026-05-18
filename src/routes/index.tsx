import { createFileRoute } from "@tanstack/react-router";

import { ScrollProgress } from "@/components/ScrollProgress";
import { Navbar } from "@/components/Navbar";
import { SocialRail } from "@/components/SocialRail";
import { Hero } from "@/components/Hero";
import { About } from "@/components/About";
import { Skills } from "@/components/Skills";
import { Projects } from "@/components/Projects";
import { Contact } from "@/components/Contact";
import { Footer } from "@/components/Footer";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "Vüsal Abbasov — Backend Developer" },
      {
        name: "description",
        content:
          "Portfolio of Vüsal Abbasov — a backend developer crafting high-performance backend systems and clean digital experiences.",
      },
      { property: "og:title", content: "Vüsal Abbasov — Portfolio" },
      { property: "og:description", content: "Premium developer portfolio. Enterprise Java, databases, and modern web architecture." },
    ],
  }),
});
function Index() {
  return (
    <main className="relative">
      
      <ScrollProgress />
      <Navbar />
      <SocialRail />
      <Hero />
      <About />
      <Skills />
      <Projects />
      <Contact />
      <Footer />
    </main>
  );
}
