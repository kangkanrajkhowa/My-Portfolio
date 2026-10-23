import stats from "@/content/github-stats.json";
import { CountUp } from "@/components/ui/CountUp";
import { Reveal } from "@/components/ui/Reveal";
import { formatCompact } from "@/lib/utils";

const LANGUAGE_COLORS: Record<string, string> = {
  CSS: "#563d7c",
  PHP: "#4f5d95",
  JavaScript: "#f1e05a",
  TypeScript: "#3178c6",
  SCSS: "#c6538c",
  Twig: "#c1d026",
  HTML: "#e34c26",
  Dart: "#00B4AB",
  Java: "#b07219",
  Blade: "#f7523f",
  Python: "#3572A5",
  Shell: "#89e051",
};

const totalBytes = stats.languages.reduce((sum, lang) => sum + lang.bytes, 0) || 1;

export function Stats() {
  const languages = stats.languages.map((language) => ({
    ...language,
    percent: (language.bytes / totalBytes) * 100,
    color: LANGUAGE_COLORS[language.name] ?? "#8a8f98",
  }));

  return (
    <section id="stats" className="section">
      <div className="shell">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="eyebrow">05 — Live from GitHub</p>
            <h2 className="display mt-6 text-4xl md:text-5xl">
              Receipts, not <span className="serif text-lime">claims</span>.
            </h2>
          </div>
          <p className="text-[11px] uppercase tracking-[0.16em] text-muted">
            Synced at build ·{" "}
            {new Date(stats.generatedAt).toLocaleDateString("en-IN", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            })}
          </p>
        </div>

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { label: "Public repos", value: stats.user.publicRepos },
            { label: "Original repos", value: stats.totals.repos },
            { label: "Languages", value: stats.totals.languages },
            { label: "Followers", value: stats.user.followers },
          ].map((stat, index) => (
            <Reveal key={stat.label} delay={index * 70} className="min-w-0">
              <div className="card hover-lift p-6">
                <p className="text-[11px] uppercase tracking-[0.14em] text-muted">
                  {stat.label}
                </p>
                <p className="display mt-4 text-4xl">
                  <CountUp value={stat.value} />
                </p>
                <p className="mt-2 text-[11px] text-muted">
                  {formatCompact(stat.value)} total
                </p>
              </div>
            </Reveal>
          ))}
        </div>

        <div className="mt-4 grid gap-4 lg:grid-cols-[1.05fr_0.95fr]">
          <Reveal className="min-w-0">
            <div className="card h-full p-6 md:p-8">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium">Language mix</p>
                <span className="chip">across repos</span>
              </div>

              <div className="mt-6 flex h-3 w-full overflow-hidden rounded-full">
                {languages.map((language) => (
                  <span
                    key={language.name}
                    style={{
                      width: `${language.percent}%`,
                      background: language.color,
                    }}
                    title={`${language.name} ${language.percent.toFixed(1)}%`}
                  />
                ))}
              </div>

              <ul className="mt-6 grid grid-cols-1 gap-x-6 gap-y-3 sm:grid-cols-2">
                {languages.map((language) => (
                  <li
                    key={language.name}
                    className="flex items-center justify-between gap-2 text-xs"
                  >
                    <span className="flex items-center gap-2 text-muted">
                      <span
                        className="size-2 rounded-full"
                        style={{ background: language.color }}
                      />
                      {language.name}
                    </span>
                    <span className="tabular text-muted">
                      {language.percent.toFixed(1)}%
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>

          <Reveal delay={100} className="min-w-0">
            <div className="card h-full p-6 md:p-8">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium">Recently active</p>
                <a
                  href={`https://github.com/${stats.user.login}`}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="text-[11px] text-muted transition-colors hover:text-lime"
                >
                  @{stats.user.login} ↗
                </a>
              </div>
              <ul className="mt-4 divide-y divide-line">
                {stats.topRepos.slice(0, 4).map((repo) => (
                  <li key={repo.name}>
                    <a
                      href={repo.url}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="group flex items-start justify-between gap-4 py-3"
                    >
                      <span className="min-w-0">
                        <span className="block truncate text-sm transition-colors group-hover:text-lime">
                          {repo.name}
                        </span>
                        <span className="mt-0.5 block truncate text-[11px] text-muted">
                          {repo.description}
                        </span>
                      </span>
                      <span className="tabular shrink-0 text-[11px] text-muted">
                        ★ {repo.stars}
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
