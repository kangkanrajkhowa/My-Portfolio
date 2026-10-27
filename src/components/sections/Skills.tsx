"use client";

import { type CSSProperties, useMemo, useState } from "react";
import { groupMeta, groups, skills, type Skill, type SkillGroup } from "@/content/skills";
import { Lottie } from "@/components/ui/Lottie";
import { cn } from "@/lib/utils";

const RING_RADII = [104, 152, 200];

/** Depth reads as a cell treatment, not a count of filled segments. */
const DEPTH: Record<Skill["level"], { label: string; state: string }> = {
  5: { label: "Expert", state: "is-expert" },
  4: { label: "Strong", state: "is-strong" },
  3: { label: "Working", state: "is-working" },
  2: { label: "Basic", state: "is-basic" },
  1: { label: "Learning", state: "is-learning" },
};

const LEGEND = [5, 4, 3, 2, 1] as const;

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

  const focusedSkill = useMemo(
    () => skills.find((skill) => skill.name === hovered) ?? null,
    [hovered],
  );

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
            <div className="mb-6 flex items-baseline justify-between gap-4">
              <p className="text-xs uppercase tracking-[0.18em] text-muted">
                {activeGroup === "all"
                  ? "Everything I work with"
                  : groupMeta[activeGroup].label}
              </p>
              <p className="text-right text-[11px] text-muted">
                {activeGroup === "all" ? "" : groupMeta[activeGroup].blurb}
              </p>
            </div>

            <div className="heatmap" role="group" aria-label="Skill depth by group">
              {groups.map((group) => {
                const meta = groupMeta[group];
                const groupSkills = skills.filter((skill) => skill.group === group);

                return (
                  <div
                    key={group}
                    className="heatmap-row"
                    data-dim={activeGroup !== "all" && activeGroup !== group}
                  >
                    <p className="heatmap-label">
                      <span
                        className="size-1.5 shrink-0 rounded-full"
                        style={{ background: meta.accent }}
                      />
                      {meta.label}
                    </p>

                    <div className="heatmap-cells">
                      {groupSkills.map((skill) => {
                        const depth = DEPTH[skill.level];
                        return (
                          <button
                            key={skill.name}
                            type="button"
                            className={cn(
                              "heatmap-cell",
                              depth.state,
                              hovered === skill.name && "is-focused",
                            )}
                            style={{ "--accent": meta.accent } as CSSProperties}
                            aria-label={`${skill.name} — ${depth.label}`}
                            onMouseEnter={() => setHovered(skill.name)}
                            onMouseLeave={() => setHovered(null)}
                            onFocus={() => setHovered(skill.name)}
                            onBlur={() => setHovered(null)}
                          />
                        );
                      })}
                    </div>

                    <span className="heatmap-count">{groupSkills.length}</span>
                  </div>
                );
              })}
            </div>

            <div className="mt-5 flex flex-wrap items-center justify-between gap-4 border-t border-line pt-4">
              <p className="min-h-5 text-xs text-muted" aria-live="polite">
                {focusedSkill ? (
                  <>
                    <span className="text-fg">{focusedSkill.name}</span>
                    <span className="mx-1.5 text-line-strong">·</span>
                    {DEPTH[focusedSkill.level].label}
                  </>
                ) : (
                  "Hover or focus a cell to read its depth"
                )}
              </p>

              <ul className="flex flex-wrap items-center gap-x-3 gap-y-1.5">
                {LEGEND.map((level) => (
                  <li key={level} className="flex items-center gap-1.5 text-[10px] text-muted">
                    <span
                      className={cn("heatmap-cell heatmap-legend", DEPTH[level].state)}
                      style={{ "--accent": "var(--fg)" } as CSSProperties}
                      aria-hidden="true"
                    />
                    {DEPTH[level].label}
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-8 rounded-2xl border border-line bg-panel/50 p-5">
              <Lottie
                src="/lottie/wave.json"
                className="mb-5 h-24 w-full max-w-[300px]"
              />
              <p className="flex items-center gap-2 text-xs uppercase tracking-[0.16em] text-muted">
                <span className="size-1.5 rounded-full bg-lime" />
                AI &amp; ML — actively learning
              </p>
              <p className="mt-2 text-sm leading-relaxed text-muted">
                I&apos;m learning LLM APIs, different model providers, retrieval
                and agentic workflows by building small experiments — seeing
                what genuinely helps ship better software.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
