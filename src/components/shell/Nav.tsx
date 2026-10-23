"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Command, Menu, X } from "lucide-react";
import { profile } from "@/content/profile";
import { scrollToSection } from "@/lib/motion";
import { ThemeToggle } from "@/components/shell/ThemeToggle";
import { cn } from "@/lib/utils";

const links = [
  { id: "about", label: "About" },
  { id: "skills", label: "Skills" },
  { id: "work", label: "Work" },
  { id: "experience", label: "Experience" },
  { id: "contact", label: "Contact" },
];

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState("about");
  const [menuOpen, setMenuOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 24);

      let current = "about";
      for (const link of links) {
        const element = document.getElementById(link.id);
        if (!element) continue;
        const top = element.getBoundingClientRect().top;
        if (top <= 160) current = link.id;
      }
      setActive(current);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const jump = (id: string) => {
    setMenuOpen(false);
    window.setTimeout(() => scrollToSection(`#${id}`), 60);
  };

  return (
    <>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-[55] transition-all duration-500",
          scrolled ? "glass border-b border-line py-2.5" : "py-5",
        )}
      >
        <div className="shell flex items-center justify-between gap-6">
          <button
            type="button"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="group flex items-center gap-2.5 text-sm font-semibold tracking-tight"
            aria-label="Back to top"
          >
            <span className="grid size-9 place-items-center rounded-full border border-line-strong text-xs transition-colors group-hover:border-lime group-hover:text-lime">
              KR
            </span>
            <span className="hidden sm:block">
              {profile.firstName}
              <span className="text-lime">.</span>
            </span>
          </button>

          <nav className="hidden items-center gap-1 md:flex" aria-label="Primary">
            {links.map((link) => (
              <button
                key={link.id}
                type="button"
                onClick={() => jump(link.id)}
                className={cn(
                  "relative rounded-full px-3.5 py-2 text-[13px] transition-colors",
                  active === link.id
                    ? "text-fg"
                    : "text-muted hover:text-fg",
                )}
              >
                {link.label}
                {active === link.id && (
                  <span className="absolute inset-x-3 -bottom-0.5 h-px bg-lime" />
                )}
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() =>
                window.dispatchEvent(new CustomEvent("kr-command-open"))
              }
              className="hidden items-center gap-2 rounded-full border border-line px-3 py-2 text-xs text-muted transition-colors hover:border-line-strong hover:text-fg sm:flex"
              aria-label="Open command palette"
            >
              <Command size={13} /> K
            </button>
            <ThemeToggle />
            <button
              type="button"
              onClick={() => router.push("/resume/")}
              className="btn btn-primary btn-sm hidden sm:inline-flex"
            >
              Résumé
            </button>
            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              className="inline-flex size-10 items-center justify-center rounded-full border border-line md:hidden"
              aria-label="Open menu"
              aria-expanded={menuOpen}
            >
              <Menu size={18} />
            </button>
          </div>
        </div>
      </header>

      <div
        className={cn(
          "fixed inset-0 z-[75] flex flex-col bg-bg px-6 py-6 transition-all duration-500 md:hidden",
          menuOpen
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0",
        )}
        aria-hidden={!menuOpen}
        inert={!menuOpen}
      >
        <div className="flex items-center justify-between">
          <span className="text-xs uppercase tracking-[0.2em] text-muted">
            Menu
          </span>
          <button
            type="button"
            onClick={() => setMenuOpen(false)}
            className="inline-flex size-10 items-center justify-center rounded-full border border-line"
            aria-label="Close menu"
          >
            <X size={18} />
          </button>
        </div>

        <nav className="mt-16 flex flex-col gap-2" aria-label="Mobile">
          {links.map((link, index) => (
            <button
              key={link.id}
              type="button"
              onClick={() => jump(link.id)}
              className="group flex items-baseline justify-between border-b border-line py-4 text-left"
            >
              <span className="display text-4xl tracking-tight">{link.label}</span>
              <span className="tabular text-xs text-muted">
                0{index + 1}
              </span>
            </button>
          ))}
        </nav>

        <div className="mt-auto flex flex-col gap-3">
          <button
            type="button"
            onClick={() => {
              setMenuOpen(false);
              router.push("/resume/");
            }}
            className="btn btn-primary w-full"
          >
            Résumé
          </button>
          <a href={`mailto:${profile.email}`} className="btn btn-ghost w-full">
            {profile.email}
          </a>
        </div>
      </div>
    </>
  );
}
