"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";
import { projects } from "@/content/projects";

export function Work() {
  const trackRef = useRef<HTMLDivElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);

  const updateEdges = useCallback(() => {
    const el = viewportRef.current;
    if (!el) return;
    setAtStart(el.scrollLeft <= 8);
    setAtEnd(el.scrollLeft + el.clientWidth >= el.scrollWidth - 8);
  }, []);

  const scrollCards = (direction: -1 | 1) => {
    const el = viewportRef.current;
    if (!el) return;
    const card = el.querySelector<HTMLElement>("[data-work-card]");
    const step = card ? card.offsetWidth + 20 : Math.min(el.clientWidth * 0.85, 500);
    const max = el.scrollWidth - el.clientWidth;
    const target = Math.max(0, Math.min(el.scrollLeft + direction * step, max));

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      el.scrollLeft = target;
      return;
    }

    // Native smooth scrolling is unreliable inside a scroll-snap row, so
    // ease the offset ourselves — it works the same in every browser.
    const start = el.scrollLeft;
    const change = target - start;
    const started = performance.now();
    const duration = 420;

    const tick = (now: number) => {
      const progress = Math.min(1, (now - started) / duration);
      const eased = 1 - (1 - progress) ** 3;
      el.scrollLeft = start + change * eased;
      if (progress < 1) requestAnimationFrame(tick);
      else updateEdges();
    };

    requestAnimationFrame(tick);
  };

  useEffect(() => {
    updateEdges();
    window.addEventListener("resize", updateEdges);
    return () => window.removeEventListener("resize", updateEdges);
  }, [updateEdges]);

  return (
    <section id="work" className="relative overflow-hidden">
      <div className="flex min-h-[100svh] flex-col justify-center py-20">
        <div className="shell flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="eyebrow">03 — Selected work</p>
            <h2 className="display mt-6 text-4xl md:text-5xl">
              See my work which will{" "}
              <span className="serif text-lime">amaze</span> you.
            </h2>
          </div>
          <p className="max-w-sm text-sm leading-relaxed text-muted">
            A few things I have designed, built and maintained — from a mall
            directory a client updates themselves, to tax systems used across
            Assam.
          </p>
        </div>

        <div className="relative mt-12">
          <div
            ref={viewportRef}
            onScroll={updateEdges}
            className="overflow-x-auto pb-4 no-scrollbar"
            data-testid="work-viewport"
          >
          <div
            ref={trackRef}
            className="flex snap-x snap-mandatory gap-5 pr-6 will-change-transform lg:snap-none"
            style={{
              paddingLeft:
                "calc(max(0px, (100vw - 1280px) / 2) + clamp(1.25rem, 4vw, 3.5rem))",
            }}
          >
            {projects.map((project) => (
              <Link
                key={project.slug}
                href={`/work/${project.slug}/`}
                data-cursor
                data-cursor-label="View"
                data-work-card
                className="group relative flex w-[min(80vw,500px)] shrink-0 snap-start flex-col overflow-hidden rounded-[24px] border border-line bg-panel transition-all duration-500 hover:border-line-strong"
              >
                <div
                  className="relative h-56 overflow-hidden md:h-64"
                  style={{ background: project.gradient }}
                >
                  <div
                    className="absolute inset-0 opacity-[0.14]"
                    style={{
                      backgroundImage:
                        "linear-gradient(to right, #fff 1px, transparent 1px), linear-gradient(to bottom, #fff 1px, transparent 1px)",
                      backgroundSize: "42px 42px",
                    }}
                    aria-hidden="true"
                  />
                  <div
                    className="absolute -right-14 -top-16 size-56 rounded-full blur-3xl transition-transform duration-700 group-hover:scale-125"
                    style={{ background: project.accent, opacity: 0.24 }}
                    aria-hidden="true"
                  />
                  <div className="absolute inset-0 flex items-end justify-between p-6">
                    <span
                      className="display text-6xl md:text-7xl"
                      style={{ color: project.accent, opacity: 0.9 }}
                    >
                      {project.index}
                    </span>
                    <span className="chip !bg-black/30 !text-white/80">
                      {project.category}
                    </span>
                  </div>

                  <div className="absolute inset-x-6 top-6 flex items-center justify-between text-[10px] uppercase tracking-[0.2em] text-white/50">
                    <span>{project.stack[0]}</span>
                    <span>{String(project.stack.length).padStart(2, "0")} tools</span>
                  </div>
                </div>

                <div className="flex flex-1 flex-col p-6">
                  <div className="flex items-start justify-between gap-4">
                    <h3 className="text-lg font-medium tracking-tight transition-colors group-hover:text-lime md:text-xl">
                      {project.title}
                    </h3>
                    <ArrowUpRight
                      size={18}
                      className="mt-1 shrink-0 text-muted transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-lime"
                    />
                  </div>
                  <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-muted">
                    {project.summary}
                  </p>
                  <div className="mt-5 flex flex-wrap gap-1.5 pt-1">
                    {project.stack.slice(0, 4).map((tech) => (
                      <span key={tech} className="chip">
                        {tech}
                      </span>
                    ))}
                    {project.stack.length > 4 && (
                      <span className="chip">+{project.stack.length - 4}</span>
                    )}
                  </div>
                </div>
              </Link>
            ))}

            <div className="flex w-[280px] shrink-0 snap-start flex-col justify-between rounded-[24px] border border-dashed border-line-strong p-6">
              <p className="text-[10px] uppercase tracking-[0.2em] text-muted">
                More on GitHub
              </p>
              <div>
                <p className="display text-3xl leading-tight">
                  Six years of
                  <br />
                  <span className="serif text-lime">commits</span>.
                </p>
                <a
                  href="https://github.com/kangkanrajkhowa"
                  target="_blank"
                  rel="noreferrer noopener"
                  className="btn btn-ghost btn-sm mt-5"
                >
                  Open GitHub <ArrowUpRight size={14} />
                </a>
              </div>
            </div>
          </div>

          </div>

          {/* Arrow navigation — scrolls the row one card at a time */}
          <button
            type="button"
            onClick={() => scrollCards(-1)}
            disabled={atStart}
            aria-label="Previous project"
            className="absolute left-2 top-1/2 z-20 hidden size-11 -translate-y-1/2 items-center justify-center rounded-full border border-line bg-bg/90 text-fg backdrop-blur-md transition-colors hover:border-lime hover:text-lime disabled:pointer-events-none disabled:opacity-30 md:flex"
          >
            <ArrowLeft size={18} />
          </button>
          <button
            type="button"
            onClick={() => scrollCards(1)}
            disabled={atEnd}
            aria-label="Next project"
            className="absolute right-2 top-1/2 z-20 hidden size-11 -translate-y-1/2 items-center justify-center rounded-full border border-line bg-bg/90 text-fg backdrop-blur-md transition-colors hover:border-lime hover:text-lime disabled:pointer-events-none disabled:opacity-30 md:flex"
          >
            <ArrowRight size={18} />
          </button>
        </div>

        <div className="shell mt-8 flex items-center gap-3 text-[11px] text-muted">
          <span className="hidden h-px w-16 bg-line-strong md:block" />
          <span className="hidden md:inline">
            Use the arrows to move through the work
          </span>
          <span className="md:hidden">Swipe through the work →</span>
        </div>
      </div>
    </section>
  );
}
