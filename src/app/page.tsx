import { Nav } from "@/components/shell/Nav";
import { Footer } from "@/components/shell/Footer";
import { Preloader } from "@/components/shell/Preloader";
import { Cursor } from "@/components/shell/Cursor";
import { ScrollProgress } from "@/components/shell/ScrollProgress";
import { Spotlight } from "@/components/shell/Spotlight";
import { SmoothScroll } from "@/components/shell/SmoothScroll";
import { CommandPalette } from "@/components/shell/CommandPalette";
import { Toaster } from "@/components/ui/toast";
import { BackToTop } from "@/components/shell/BackToTop";
import { Hero } from "@/components/sections/Hero";
import { About } from "@/components/sections/About";
import { Skills } from "@/components/sections/Skills";
import { Work } from "@/components/sections/Work";
import { Experience } from "@/components/sections/Experience";
import { Stats } from "@/components/sections/Stats";
import { AskAI } from "@/components/sections/AskAI";
import { Contact } from "@/components/sections/Contact";

export default function HomePage() {
  return (
    <>
      <Preloader />
      <Cursor />
      <ScrollProgress />
      <Spotlight />
      <SmoothScroll />
      <CommandPalette />
      <Toaster />
      <Nav />

      <main id="main">
        <Hero />
        <About />
        <Skills />
        <Work />
        <Experience />
        <Stats />
        <AskAI />
        <Contact />
      </main>

      <Footer />
      <BackToTop />
    </>
  );
}
