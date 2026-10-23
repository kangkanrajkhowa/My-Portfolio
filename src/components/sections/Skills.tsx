"use client";

import { useMemo, useState } from "react";
import { groupMeta, groups, skills, type SkillGroup } from "@/content/skills";
import { cn } from "@/lib/utils";

const RING_RADII = [104, 152, 200];

export function Skills() {
  const [activeGroup, setActiveGroup] = useState<SkillGroup | "all">("all");
  const [hovered, setHovered] = useState<string | null>(null);

  const visible = useMemo(
    () =>
      activeGroup === "all"
        ? skills
        : skills.filter((skill) => skill.group === activeGroup),
    [activeGroup],
  );

  const orbitGroups = activeGroup === "all" ? groups : [activeGroup];

  return (
    <section id="skills" className="section border-y border-line bg-bg-elev/40">
      <div className="shell">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="eyebrow">02 — Toolkit</p>
            <h2 className="display mt-6 text-4xl md:text-5xl">
              I develop skills <span className="serif text-lime">regularly</span>.
            </h2>
            <p className="mt-4 max-w-xl text-sm leading-relaxed text-muted md:text-base">
              Most days are spent learning and building — starting from scratch,
              or adding the customised features that make an ageing system shine
              again.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setActiveGroup("all")}
              className={cn(
                "rounded-full border px-3.5 py-1.5 text-xs transition-colors",
                activeGroup === "all"
                  ? "border-lime bg-lime text-on-accent"
                  : "border-line text-muted hover:border-line-strong hover:text-fg",
              )}
            >
              All
            </button>
            {groups.map((group) => (
              <button
                key={group}
                type="button"
                onClick={() => setActiveGroup(group)}
                className={cn(
                  "rounded-full border px-3.5 py-1.5 text-xs transition-colors",
                  activeGroup === group
                    ? "border-lime bg-lime text-on-accent"
                    : "border-line text-muted hover:border-line-strong hover:text-fg",
                )}
              >
                {groupMeta[group].label}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-14 grid gap-14 lg:grid-cols-[0.95fr_1.05fr] lg:gap-16">
          <div className="relative hidden md:block">
            <div className="orbit-stage">
              {RING_RADII.map((radius, index) => (
                <div
                  key={radius}
                  className="orbit-ring"
                  style={{
                    width: radius * 2,
                    height: radius * 2,
                    opacity: 0.55 - index * 0.12,
                  }}
                  aria-hidden="true"
                />
              ))}

              <div className="relative z-10 text-center">
                <p className="text-[10px] uppercase tracking-[0.28em] text-muted">
                  {activeGroup === "all" ? "Full stack" : groupMeta[activeGroup].label}
                </p>
                <p className="display mt-2 text-2xl">
                  {visible.length} <span className="text-muted">skills</span>
                </p>
              </div>

              {orbitGroups.map((group, groupIndex) => {
                const meta = groupMeta[group];
                const groupSkills = skills.filter((skill) => skill.group === group);
                const radius = RING_RADII[groupIndex % RING_RADII.length];
                const offset = (groupIndex * 137) % 360;

                return (
                  <div
                    key={group}
                    className={cn(
                      "orbit-spin",
                      groupIndex % 2 === 1 && "reverse",
                      groupIndex === 2 && "slow",
                    )}
                    aria-hidden="true"
                  >
                    {groupSkills.slice(0, 7).map((skill, skillIndex) => {
                      const angle =
                        offset + (360 / Math.min(groupSkills.length, 7)) * skillIndex;
                      return (
                        <div
                          key={skill.name}
                          className="orbit-chip"
                          style={{
                            transform: `rotate(${angle}deg) translateX(${radius}px)`,
                          }}
                        >
                          <span
                            className={cn(
                              "rounded-full border px-2.5 py-1 text-[10px] whitespace-nowrap backdrop-blur-sm transition-colors",
                              hovered === skill.name
                                ? "border-lime text-lime"
                                : "border-line bg-bg/70 text-muted",
                            )}
                            style={{
                              animation: `orbit ${
                                groupIndex === 2 ? 80 : groupIndex === 1 ? 62 : 46
                              }s linear infinite reverse`,
                              borderColor:
                                hovered === skill.name ? meta.accent : undefined,
                            }}
                          >
                            {skill.name}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                );
              })}
            </div>

            <p className="mt-4 text-center text-[11px] text-muted">
              Hover a chip to highlight · rings regroup when you filter
            </p>
          </div>

          <div>
            <div className="mb-6 flex items-baseline justify-between">
              <p className="text-xs uppercase tracking-[0.18em] text-muted">
                {activeGroup === "all"
                  ? "Everything I work with"
                  : groupMeta[activeGroup].label}
              </p>
              <p className="text-[11px] text-muted">
                {activeGroup === "all" ? "" : groupMeta[activeGroup].blurb}
              </p>
            </div>

            <ul className="grid grid-cols-1 gap-x-8 gap-y-1 sm:grid-cols-2">
              {visible.map((skill) => {
                const meta = groupMeta[skill.group];
                return (
                  <li key={skill.name}>
                    <button
                      type="button"
                      onMouseEnter={() => setHovered(skill.name)}
                      onMouseLeave={() => setHovered(null)}
                      onFocus={() => setHovered(skill.name)}
                      onBlur={() => setHovered(null)}
                      className="group flex w-full items-center justify-between gap-4 border-b border-line py-3 text-left"
                    >
                      <span className="flex items-center gap-2.5 text-sm">
                        <span
                          className="size-1.5 rounded-full transition-transform group-hover:scale-150"
                          style={{ background: meta.accent }}
                        />
                        {skill.name}
                      </span>
                      <span
                        className="flex items-center gap-1"
                        role="img"
                        aria-label={`${skill.level} of 5`}
                      >
                        {Array.from({ length: 5 }).map((_, index) => (
                          <span
                            key={index}
                            className="h-1 w-3 rounded-full transition-colors"
                            style={{
                              background:
                                index < skill.level
                                  ? meta.accent
                                  : "color-mix(in oklab, var(--muted) 28%, transparent)",
                            }}
                          />
                        ))}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>

            <div className="mt-8 rounded-2xl border border-line bg-panel/50 p-5">
              <p className="flex items-center gap-2 text-xs uppercase tracking-[0.16em] text-muted">
                <span className="size-1.5 rounded-full bg-lime" />
                AI &amp; ML — now part of the day job
              </p>
              <p className="mt-2 text-sm leading-relaxed text-muted">
                LLM APIs, retrieval and agent workflows are wired into how I
                design, build and document software — not bolted on as a demo.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
