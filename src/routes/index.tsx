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
      { title: "Ad Soyad — Full-Stack Developer & Designer" },
      {
        name: "description",
        content:
          "Portfolio of Ad Soyad — a full-stack developer and designer crafting premium digital products with motion, detail, and intent.",
      },
      { property: "og:title", content: "Ad Soyad — Portfolio" },
      { property: "og:description", content: "Premium dark-luxury portfolio. Design, code, motion." },
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
