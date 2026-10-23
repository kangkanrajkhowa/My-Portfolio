import { experience } from "@/content/experience";
import { Reveal } from "@/components/ui/Reveal";

export function Experience() {
  return (
    <section id="experience" className="section border-y border-line bg-bg-elev/40">
      <div className="shell">
        <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
          <div className="lg:sticky lg:top-32 lg:self-start">
            <p className="eyebrow">04 — Experience</p>
            <h2 className="display mt-6 text-4xl md:text-5xl">
              Where the work
              <br />
              actually <span className="serif text-lime">happens</span>.
            </h2>
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-muted">
              Government platforms by day, client products by night. Different
              stakes, same standard: it has to keep working after I hand it over.
            </p>
          </div>

          <div className="relative">
            <div
              className="absolute left-[7px] top-2 bottom-2 w-px bg-line-strong"
              aria-hidden="true"
            />
            <ol className="space-y-10">
              {experience.map((item, index) => (
                <Reveal as="li" key={item.role} delay={index * 80}>
                  <div className="relative pl-8">
                    <span
                      className="absolute left-0 top-1.5 size-[15px] rounded-full border-2 bg-bg"
                      style={{ borderColor: item.accent }}
                      aria-hidden="true"
                    />
                    <div className="flex flex-wrap items-baseline justify-between gap-2">
                      <h3 className="text-lg font-medium tracking-tight">
                        {item.role}
                      </h3>
                      <span className="chip">{item.period}</span>
                    </div>
                    <p className="mt-1 text-sm text-lime/90">
                      {item.org} · {item.location}
                    </p>
                    <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted">
                      {item.summary}
                    </p>
                    <ul className="mt-4 space-y-1.5">
                      {item.bullets.map((bullet) => (
                        <li
                          key={bullet}
                          className="flex gap-2.5 text-[13px] leading-relaxed text-muted"
                        >
                          <span
                            className="mt-[7px] size-1 shrink-0 rounded-full"
                            style={{ background: item.accent }}
                          />
                          {bullet}
                        </li>
                      ))}
                    </ul>
                  </div>
                </Reveal>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
}
