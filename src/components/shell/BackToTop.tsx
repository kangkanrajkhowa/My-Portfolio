"use client";

import { ArrowUp } from "lucide-react";
import { useEffect, useState } from "react";

export function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // "Significant section" = roughly one viewport deep, so it is not a
    // fidget button that pops up the moment the user moves at all.
    const threshold = Math.max(window.innerHeight * 0.6, 700);
    const onScroll = () => setVisible(window.scrollY > threshold);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  if (!visible) return null;

  return (
    <button
      type="button"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      aria-label="Back to top"
      data-cursor
      data-cursor-label="Top"
      className="fixed bottom-6 right-6 z-[60] inline-flex size-11 items-center justify-center rounded-full border border-line-strong bg-bg-elev backdrop-blur-md text-fg transition-all duration-300 hover:border-lime hover:text-lime hover:-translate-y-1"
    >
      <ArrowUp size={18} />
    </button>
  );
}