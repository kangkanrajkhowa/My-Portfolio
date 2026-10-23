"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

type Theme = "dark" | "light";

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>("dark");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const current = (document.documentElement.dataset.theme as Theme) || "dark";
    setTheme(current);
    setMounted(true);
  }, []);

  const apply = (next: Theme) => {
    const root = document.documentElement;

    const commit = () => {
      root.dataset.theme = next;
      localStorage.setItem("kr-theme", next);
      setTheme(next);
    };

    const doc = document as Document & {
      startViewTransition?: (callback: () => void) => { finished: Promise<void> };
    };

    if (doc.startViewTransition && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      doc.startViewTransition(commit);
    } else {
      commit();
    }
  };

  if (!mounted) {
    return (
      <span
        className="inline-flex size-10 items-center justify-center rounded-full border border-line"
        aria-hidden="true"
      />
    );
  }

  const next: Theme = theme === "dark" ? "light" : "dark";

  return (
    <button
      type="button"
      onClick={() => apply(next)}
      className="group inline-flex size-10 items-center justify-center rounded-full border border-line text-muted transition-colors hover:border-line-strong hover:text-fg"
      aria-label={`Switch to ${next} theme`}
      data-cursor
    >
      {theme === "dark" ? (
        <Sun size={16} className="transition-transform duration-500 group-hover:rotate-45" />
      ) : (
        <Moon size={16} className="transition-transform duration-500 group-hover:-rotate-12" />
      )}
    </button>
  );
}
