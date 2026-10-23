import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Download } from "lucide-react";
import { profile } from "@/content/profile";
import { experience } from "@/content/experience";
import { groupMeta, groups, skills } from "@/content/skills";
import { projects } from "@/content/projects";
import { socials } from "@/content/socials";
import { asset, absoluteUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: "Résumé",
  description:
    "Résumé of Kangkan Rajkhowa — fullstack developer and UI/UX designer based in Guwahati, Assam.",
  alternates: { canonical: absoluteUrl("/resume/") },
};

export default function ResumePage() {
  return (
    <main id="main" className="print-page mx-auto max-w-4xl px-5 py-12 md:px-6">
      <div className="no-print mb-8 flex flex-wrap items-center justify-between gap-3">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs text-muted transition-colors hover:text-fg"
        >
          <ArrowLeft size={14} /> Back to the portfolio
        </Link>
        <a href={asset("/resume.pdf")} className="btn btn-primary btn-sm" download>
          <Download size={14} /> Download PDF
        </a>
      </div>

      <article className="overflow-hidden rounded-3xl border border-line bg-white px-7 py-10 text-neutral-900 shadow-2xl md:px-12 md:py-14 print:rounded-none print:border-0 print:px-0 print:py-0 print:shadow-none">
        <header className="border-b border-neutral-200 pb-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">
                {profile.name}
              </h1>
              <p className="mt-1 text-sm text-neutral-600">
                Fullstack Developer · UI/UX Designer
              </p>
            </div>
            <div className="text-right text-[11px] leading-relaxed text-neutral-600">
              <p>{profile.email}</p>
              <p>{profile.phone}</p>
              <p>{profile.location}</p>
              <p className="mt-1 text-neutral-500">github.com/kangkanrajkhowa</p>
            </div>
          </div>
        </header>

        <section className="mt-6">
          <h2 className="text-[10px] font-semibold uppercase tracking-[0.18em] text-neutral-500">
            Profile
          </h2>
          <p className="mt-2 text-[13px] leading-relaxed text-neutral-700">
            {profile.bio[0]} {profile.bio[1]}
          </p>
        </section>

        <section className="mt-7">
          <h2 className="text-[10px] font-semibold uppercase tracking-[0.18em] text-neutral-500">
            Experience
          </h2>
          <div className="mt-3 space-y-5">
            {experience.map((item) => (
              <div key={item.role}>
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <h3 className="text-[13px] font-semibold">
                    {item.role} — {item.org}
                  </h3>
                  <span className="text-[11px] text-neutral-500">
                    {item.period}
                  </span>
                </div>
                <p className="mt-1 text-[12px] leading-relaxed text-neutral-600">
                  {item.summary}
                </p>
                <ul className="mt-1.5 list-disc space-y-0.5 pl-4 text-[12px] leading-relaxed text-neutral-700">
                  {item.bullets.map((bullet) => (
                    <li key={bullet}>{bullet}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-7">
          <h2 className="text-[10px] font-semibold uppercase tracking-[0.18em] text-neutral-500">
            Selected projects
          </h2>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            {projects.slice(0, 6).map((project) => (
              <div key={project.slug}>
                <h3 className="text-[12px] font-semibold">{project.title}</h3>
                <p className="mt-0.5 text-[11px] leading-relaxed text-neutral-600">
                  {project.summary}
                </p>
                <p className="mt-1 text-[10px] text-neutral-500">
                  {project.stack.join(" · ")}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-7">
          <h2 className="text-[10px] font-semibold uppercase tracking-[0.18em] text-neutral-500">
            Skills
          </h2>
          <div className="mt-2 space-y-1.5">
            {groups.map((group) => (
              <p key={group} className="text-[12px] leading-relaxed text-neutral-700">
                <span className="font-semibold text-neutral-900">
                  {groupMeta[group].label}:
                </span>{" "}
                {skills
                  .filter((skill) => skill.group === group)
                  .map((skill) => skill.name)
                  .join(", ")}
              </p>
            ))}
          </div>
        </section>

        <section className="mt-7 grid gap-4 sm:grid-cols-2">
          <div>
            <h2 className="text-[10px] font-semibold uppercase tracking-[0.18em] text-neutral-500">
              Certifications
            </h2>
            <p className="mt-2 text-[12px] leading-relaxed text-neutral-700">
              Master Flutter Application Development — codedamn
            </p>
          </div>
          <div>
            <h2 className="text-[10px] font-semibold uppercase tracking-[0.18em] text-neutral-500">
              Languages
            </h2>
            <p className="mt-2 text-[12px] leading-relaxed text-neutral-700">
              English, Assamese, Hindi
            </p>
          </div>
        </section>

        <footer className="mt-8 flex flex-wrap items-center justify-between gap-2 border-t border-neutral-200 pt-4 text-[10px] text-neutral-500">
          <span>
            {socials
              .slice(0, 3)
              .map((social) => social.href.replace("https://www.", "").replace(/\/$/, ""))
              .join(" · ")}
          </span>
          <span>Updated {new Date().getFullYear()}</span>
        </footer>
      </article>

      <p className="no-print mt-6 text-center text-[11px] text-muted">
        Print this page or download the PDF — both come from this same source.
      </p>
    </main>
  );
}
