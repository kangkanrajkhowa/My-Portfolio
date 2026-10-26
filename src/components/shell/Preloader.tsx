"use client";

import { useEffect, useState } from "react";
import { profile } from "@/content/profile";

type Phase = "idle" | "visible" | "leaving" | "done";

export function Preloader() {
  const [phase, setPhase] = useState<Phase>("idle");
  const [count, setCount] = useState(0);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const visited = sessionStorage.getItem("kr-visited") === "1";
    // If the page took a while to become interactive, do not add an intro on
    // top of the wait — it delays the first meaningful paint.
    const slowStart = performance.now() > 1800;

    if (reduced || visited || slowStart) {
      setPhase("done");
      return;
    }

    setPhase("visible");
    const start = performance.now();
    let frame = 0;

    const tick = (now: number) => {
      const progress = Math.min(1, (now - start) / 650);
      const eased = 1 - (1 - progress) ** 3;
      setCount(Math.round(eased * 100));

      if (progress < 1) {
        frame = requestAnimationFrame(tick);
      } else {
        sessionStorage.setItem("kr-visited", "1");
        window.setTimeout(() => setPhase("leaving"), 120);
        window.setTimeout(() => setPhase("done"), 800);
      }
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, []);

  if (phase === "idle" || phase === "done") return null;

  return (
    <div
      className="fixed inset-0 z-[90] flex flex-col justify-between bg-bg px-6 py-8 transition-[clip-path,opacity] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] md:px-12"
      style={{
        clipPath: phase === "leaving" ? "inset(0 0 100% 0)" : "inset(0 0 0 0)",
        opacity: phase === "leaving" ? 0 : 1,
      }}
      aria-hidden="true"
      data-testid="preloader"
    >
      <div className="flex items-center justify-between text-xs uppercase tracking-[0.2em] text-muted">
        <span>{profile.name}</span>
        <span>Portfolio — 2026</span>
      </div>

      <div className="flex flex-col items-start gap-4">
        <p className="bengali text-2xl text-muted">{profile.greeting}</p>
        <div className="overflow-hidden">
          <h1 className="display text-[16vw] leading-[0.85] md:text-[10vw]">
            {profile.firstName}
            <span className="text-lime">.</span>
          </h1>
        </div>
        <p className="max-w-sm text-sm text-muted">
          Loading a portfolio built from scratch, on purpose.
        </p>
      </div>

      <div className="flex items-end justify-between">
        <div className="h-[2px] w-full max-w-xs overflow-hidden bg-line">
          <div
            className="h-full bg-lime transition-transform duration-100"
            style={{ transform: `scaleX(${count / 100})`, transformOrigin: "left" }}
          />
        </div>
        <span className="tabular ml-6 text-3xl font-medium">{String(count).padStart(3, "0")}</span>
      </div>
    </div>
  );
}
