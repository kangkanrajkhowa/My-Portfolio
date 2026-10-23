"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { profile } from "@/content/profile";
import { scrollToSection } from "@/lib/motion";

const HeroCanvas = dynamic(
  () => import("@/components/three/HeroScene").then((mod) => mod.HeroCanvas),
  { ssr: false },
);

const marqueeItems = [
  "Laravel",
  "React",
  "TypeScript",
  "PostgreSQL",
  "Tailwind CSS",
  "Node.js",
  "LLM APIs",
  "Figma",
  "Flutter",
  "GitHub Actions",
  "RAG",
  "CodeIgniter",
];

export function Hero() {
  const [roleIndex, setRoleIndex] = useState(0);
  const [clock, setClock] = useState("");

  useEffect(() => {
    const id = window.setInterval(() => {
      setRoleIndex((current) => (current + 1) % profile.roles.length);
    }, 2800);
    return () => window.clearInterval(id);
  }, []);

  useEffect(() => {
    const formatter = new Intl.DateTimeFormat("en-GB", {
      timeZone: profile.timezone,
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
    const tick = () => setClock(formatter.format(new Date()));
    tick();
    const id = window.setInterval(tick, 30000);
    return () => window.clearInterval(id);
  }, []);

  return (
    <section
      id="top"
      className="relative flex min-h-[100svh] flex-col justify-end overflow-hidden"
    >
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="absolute inset-0 bg-[radial-gradient(60%_50%_at_50%_38%,color-mix(in_oklab,var(--violet)_16%,transparent),transparent_70%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(45%_40%_at_72%_62%,color-mix(in_oklab,var(--lime)_10%,transparent),transparent_72%)]" />
        <div className="absolute inset-0 opacity-70">
          <HeroCanvas />
        </div>
        <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-bg via-bg/70 to-transparent" />
      </div>

      <div className="shell relative z-10 pb-10 pt-32 md:pt-40">
        <div className="flex items-start justify-between">
          <p className="eyebrow">
            {profile.location} · <span className="tabular">{clock || "—"}</span> IST
          </p>
          <span className="hidden items-center gap-2 rounded-full border border-line px-3 py-1.5 text-[11px] text-muted md:inline-flex">
            <span className="accent-dot" />
            {profile.availability}
          </span>
        </div>

        <p className="bengali mt-8 text-2xl text-muted md:text-3xl">
          {profile.greeting}
        </p>

        <h1 className="display mt-3 text-[clamp(3.4rem,12.5vw,10.5rem)]">
          <span className="reveal-line">
            <span style={{ animationDelay: "120ms" }}>Kangkan</span>
          </span>
          <span className="reveal-line">
            <span style={{ animationDelay: "240ms" }}>
              Rajkhowa<span className="text-lime">.</span>
            </span>
          </span>
        </h1>

        <div className="mt-10 grid gap-10 border-t border-line pt-8 md:grid-cols-[1.15fr_1fr] md:items-end">
          <div>
            <p className="flex h-7 items-center gap-2 text-lg md:text-xl">
              <span className="text-muted">I&apos;m a</span>
              <span key={roleIndex} className="font-medium text-lime">
                {profile.roles[roleIndex]}
              </span>
            </p>
            <p className="mt-3 max-w-md text-sm leading-relaxed text-muted md:text-base">
              {profile.tagline}
            </p>
            <div className="mt-7 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => scrollToSection("#work")}
                className="btn btn-primary group"
                data-cursor
              >
                View work
                <ArrowRight
                  size={15}
                  className="transition-transform group-hover:translate-x-1"
                />
              </button>
              <button
                type="button"
                onClick={() => scrollToSection("#contact")}
                className="btn btn-ghost"
                data-cursor
              >
                Get a quote
              </button>
              <a
                href="https://www.github.com/kangkanrajkhowa/"
                target="_blank"
                rel="noreferrer noopener"
                className="hidden items-center gap-1 text-xs text-muted transition-colors hover:text-fg sm:inline-flex"
              >
                GitHub <ArrowUpRight size={13} />
              </a>
            </div>
          </div>

          <dl className="grid grid-cols-3 gap-4 text-sm">
            {[
              { k: "Based in", v: "Guwahati" },
              { k: "Focus", v: "Fullstack + AI" },
              { k: "Since", v: "Laravel → Next" },
            ].map((item) => (
              <div key={item.k} className="border-l border-line pl-3">
                <dt className="text-[11px] uppercase tracking-[0.12em] text-muted">
                  {item.k}
                </dt>
                <dd className="mt-1 text-[13px] font-medium">{item.v}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>

      <div className="relative z-10 border-y border-line py-3">
        <div className="mask-x overflow-hidden">
          <div className="marquee gap-8">
            {[...marqueeItems, ...marqueeItems].map((item, index) => (
              <span
                key={`${item}-${index}`}
                className="flex shrink-0 items-center gap-8 text-[11px] uppercase tracking-[0.2em] text-muted"
              >
                {item}
                <span className="size-1 rounded-full bg-lime/70" />
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
