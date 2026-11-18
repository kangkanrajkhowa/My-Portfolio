"use client";

import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";
import { prefersReducedMotion } from "@/lib/motion";
import { cn } from "@/lib/utils";

/**
 * The logo in the header is also a "back to top" control, but it stops being
 * obvious once it scrolls out of the way of the eye. This is the explicit one:
 * it appears after the hero and stays reachable from anywhere on a long page.
 */
export function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 700);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <button
      type="button"
      aria-label="Back to top"
      tabIndex={visible ? 0 : -1}
      aria-hidden={!visible}
      onClick={() =>
        window.scrollTo({
          top: 0,
          behavior: prefersReducedMotion() ? "auto" : "smooth",
        })
      }
      className={cn(
        "glass group fixed bottom-5 right-5 z-[65] inline-flex items-center gap-2 rounded-full border border-line-strong px-4 py-3 text-[10px] font-medium uppercase tracking-[0.18em] text-muted shadow-[0_18px_40px_-24px_rgba(0,0,0,0.9)] transition-all duration-500 hover:border-lime hover:text-lime sm:bottom-8 sm:right-8",
        visible
          ? "pointer-events-auto translate-y-0 opacity-100"
          : "pointer-events-none translate-y-3 opacity-0",
      )}
    >
      <ArrowUp
        size={14}
        className="transition-transform duration-300 group-hover:-translate-y-0.5"
      />
      Top
    </button>
  );
}
