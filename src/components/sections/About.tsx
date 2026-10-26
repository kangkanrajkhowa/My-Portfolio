import { profile } from "@/content/profile";
import { skills } from "@/content/skills";
import { projects } from "@/content/projects";
import githubStats from "@/content/github-stats.json";
import { CountUp } from "@/components/ui/CountUp";
import { Reveal } from "@/components/ui/Reveal";
import { Lottie } from "@/components/ui/Lottie";

export function About() {
  return (
    <section id="about" className="section">
      <div className="shell">
        <div className="grid gap-14 lg:grid-cols-[0.85fr_1.15fr] lg:gap-20">
          <div>
            <Reveal>
              <p className="eyebrow">01 — About</p>
              <h2 className="display mt-6 text-4xl md:text-5xl">
                Software that outlives
                <br />
                the <span className="serif text-lime">launch</span>.
              </h2>
            </Reveal>

            <Reveal delay={120} className="mt-10">
              <div className="card hover-lift relative overflow-hidden p-6">
                <div
                  className="absolute inset-0 opacity-70"
                  style={{
                    background:
                      "radial-gradient(120% 90% at 15% 0%, color-mix(in oklab, var(--violet) 28%, transparent), transparent 60%), radial-gradient(90% 80% at 100% 100%, color-mix(in oklab, var(--lime) 18%, transparent), transparent 65%)",
                  }}
                  aria-hidden="true"
                />
                <div className="relative">
                  <div className="flex items-center justify-between text-[10px] uppercase tracking-[0.2em] text-muted">
                    <span>Profile</span>
                    <span className="flex items-center gap-1.5">
                      <span className="accent-dot" /> Available
                    </span>
                  </div>
                  <div className="mt-8 flex items-center justify-between gap-4">
                    <div className="flex items-baseline gap-2">
                      <span className="display text-6xl text-lime sm:text-7xl">
                        KR
                      </span>
                      <span className="serif text-xl text-muted md:text-2xl">
                        /2026
                      </span>
                    </div>
                    <Lottie
                      src="/lottie/orbit.json"
                      className="size-28 shrink-0 sm:size-32 md:size-36"
                    />
                  </div>
                  <div className="mt-8 grid grid-cols-2 gap-4 border-t border-line pt-5 text-xs text-muted">
                    <div>
                      <p className="text-[10px] uppercase tracking-[0.14em]">
                        Role
                      </p>
                      <p className="mt-1 text-fg">Fullstack Developer</p>
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-[0.14em]">
                        Studio
                      </p>
                      <p className="mt-1 text-fg">Independent</p>
                    </div>
                  </div>
                </div>
              </div>
            </Reveal>

            <Reveal delay={200} className="mt-8">
              <dl className="grid grid-cols-3 gap-4">
                {[
                  { value: projects.length, label: "Case studies", suffix: "" },
                  { value: skills.length, label: "Technologies", suffix: "+" },
                  {
                    value: githubStats.user.publicRepos,
                    label: "Public repos",
                    suffix: "",
                  },
                ].map((stat) => (
                  <div key={stat.label}>
                    <dd className="display text-3xl md:text-4xl">
                      <CountUp value={stat.value} suffix={stat.suffix} />
                    </dd>
                    <dt className="mt-1 text-[11px] uppercase tracking-[0.12em] text-muted">
                      {stat.label}
                    </dt>
                  </div>
                ))}
              </dl>
            </Reveal>
          </div>

          <div className="lg:pt-14">
            <Reveal>
              <div className="space-y-5 text-base leading-relaxed text-muted md:text-lg">
                {profile.bio.map((paragraph) => (
                  <p key={paragraph.slice(0, 24)}>{paragraph}</p>
                ))}
              </div>
            </Reveal>

            <div className="mt-10 space-y-0 border-t border-line">
              {profile.principles.map((principle, index) => (
                <Reveal key={principle.title} delay={index * 90}>
                  <div className="group flex gap-5 border-b border-line py-6">
                    <span className="tabular pt-1 text-xs text-lime">
                      0{index + 1}
                    </span>
                    <div>
                      <h3 className="text-sm font-medium tracking-tight md:text-base">
                        {principle.title}
                      </h3>
                      <p className="mt-1 text-sm text-muted">{principle.body}</p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>

            <Reveal delay={120} className="mt-8 flex flex-wrap gap-2">
              {[
                "Senior developer @ NIC",
                "Freelance evenings",
                "Open source",
                "Guwahati, IN",
              ].map((tag) => (
                <span key={tag} className="chip">
                  {tag}
                </span>
              ))}
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
