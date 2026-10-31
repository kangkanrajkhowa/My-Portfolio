import { Nav } from "@/components/shell/Nav";
import { Footer } from "@/components/shell/Footer";
import { Toaster } from "@/components/ui/toast";
import { Hero } from "@/components/sections/Hero";
import { About } from "@/components/sections/About";
import { Skills } from "@/components/sections/Skills";
import { Work } from "@/components/sections/Work";
import { Experience } from "@/components/sections/Experience";
import { Stats } from "@/components/sections/Stats";
import { Contact } from "@/components/sections/Contact";

export default function HomePage() {
  return (
    <>
      <Toaster />
      <Nav />

      <main id="main">
        <Hero />
        <About />
        <Skills />
        <Work />
        <Experience />
        <Stats />
        <Contact />
      </main>

      <Footer />
    </>
  );
}
