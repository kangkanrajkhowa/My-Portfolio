import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Download } from "lucide-react";
import { profile } from "@/content/profile";
import { experience } from "@/content/experience";
import { groupMeta, groups, skills } from "@/content/skills";
import { getProject } from "@/content/projects";
import { absoluteUrl, asset } from "@/lib/site";

export const metadata: Metadata = {
  title: "Resume",
  description:
    "Résumé of Kangkan Rajkhowa — full-stack developer with 5+ years in secure e-governance and payment systems for the Government of Assam. PHP, Laravel, Oracle and PostgreSQL.",
  keywords: [
    "Kangkan Rajkhowa resume",
    "full stack developer CV Guwahati",
    "Laravel developer Assam",
    "e-governance developer",
    "PHP developer India",
  ],
  alternates: { canonical: absoluteUrl("/resume/") },
  openGraph: {
    title: "Kangkan Rajkhowa — Résumé",
    description:
      "Full-stack developer, 5+ years of e-governance and payment platforms for 100,000+ users. PHP, Laravel, Oracle, PostgreSQL.",
    url: absoluteUrl("/resume/"),
    type: "profile",
  },
};

/** CV project order — the five client and government builds that carry the résumé. */
const resumeProjectSlugs = [
  "egras-assam-web",
  "atmanirbhar-assam",
  "city-center-store-directory",
  "icai-guwahati",
  "sheujhut",
];

const contactLines = [
  { label: profile.email, href: `mailto:${profile.email}` },
  { label: profile.phone, href: `tel:${profile.phoneHref}` },
];

export default function ResumePage() {
  const resumeProjects = resumeProjectSlugs
    .map((slug) => getProject(slug))
    .filter((project) => project !== undefined);

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
          <div className="flex flex-wrap items-start justify-between gap-6">
            <div>
              <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">
                {profile.name}
              </h1>
              <p className="mt-1.5 text-sm font-medium text-neutral-700">
                {profile.headline} · E-Governance &amp; Payments
              </p>
              <p className="mt-1 text-[11px] text-neutral-500">
                {profile.locationLine}
              </p>
            </div>
            <div className="text-[11px] leading-relaxed text-neutral-600 sm:text-right">
              {contactLines.map((line) => (
                <p key={line.label}>
                  <a href={line.href} className="hover:text-neutral-900">
                    {line.label}
                  </a>
                </p>
              ))}
              <p className="mt-2 flex flex-wrap gap-x-3 gap-y-0.5 sm:justify-end">
                <a
                  href="https://kangkanrajkhowa.netlify.app"
                  className="hover:text-neutral-900"
                >
                  kangkanrajkhowa.netlify.app
                </a>
                <a
                  href="https://www.linkedin.com/in/kangkanrajkhowa/"
                  className="hover:text-neutral-900"
                >
                  LinkedIn
                </a>
                <a
                  href="https://github.com/kangkanrajkhowa"
                  className="hover:text-neutral-900"
                >
                  GitHub
                </a>
              </p>
            </div>
          </div>
        </header>

        <section className="mt-6">
          <h2 className="text-[10px] font-semibold uppercase tracking-[0.18em] text-neutral-500">
            Summary
          </h2>
          <p className="mt-2 text-[13px] leading-relaxed text-neutral-700">
            {profile.summary}
          </p>
        </section>

        <section className="mt-7">
          <h2 className="text-[10px] font-semibold uppercase tracking-[0.18em] text-neutral-500">
            Experience
          </h2>
          <div className="mt-3 space-y-5">
            {experience.map((item) => (
              <div key={`${item.role}-${item.org}`}>
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <h3 className="text-[13px] font-semibold">
                    {item.role} — {item.org}
                  </h3>
                  <span className="text-[11px] text-neutral-500">
                    {item.period}
                  </span>
                </div>
                <p className="mt-0.5 text-[11px] text-neutral-500">
                  {item.location}
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
            {resumeProjects.map((project) => (
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
              Languages
            </h2>
            <p className="mt-2 text-[12px] leading-relaxed text-neutral-700">
              English (professional), Assamese (native), Hindi (fluent)
            </p>
          </div>
          <div>
            <h2 className="text-[10px] font-semibold uppercase tracking-[0.18em] text-neutral-500">
              References
            </h2>
            <p className="mt-2 text-[12px] leading-relaxed text-neutral-700">
              Available on request — scientist and project-lead referees at NIC.
            </p>
          </div>
        </section>

        <footer className="mt-8 flex flex-wrap items-center justify-between gap-2 border-t border-neutral-200 pt-4 text-[10px] text-neutral-500">
          <span>kangkan.in · github.com/kangkanrajkhowa</span>
          <span>Updated {new Date().getFullYear()}</span>
        </footer>
      </article>

      <p className="no-print mt-6 text-center text-[11px] text-muted">
        Print this page or download the PDF — both come from this same source.
      </p>
    </main>
  );
}
