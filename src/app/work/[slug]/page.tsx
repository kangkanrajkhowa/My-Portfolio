import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";
import {
  getAdjacentProjects,
  getProject,
  projects,
} from "@/content/projects";
import { Nav } from "@/components/shell/Nav";
import { Footer } from "@/components/shell/Footer";
import { Cursor } from "@/components/shell/Cursor";
import { ScrollProgress } from "@/components/shell/ScrollProgress";
import { Spotlight } from "@/components/shell/Spotlight";
import { Toaster } from "@/components/ui/toast";
import { absoluteUrl } from "@/lib/site";

type Params = { slug: string };

export function generateStaticParams(): Params[] {
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) return { title: "Case study not found" };

  return {
    title: project.title,
    description: project.summary,
    alternates: { canonical: absoluteUrl(`/work/${project.slug}/`) },
    openGraph: {
      title: project.title,
      description: project.summary,
      type: "article",
      url: absoluteUrl(`/work/${project.slug}/`),
    },
  };
}

export default async function CaseStudyPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();

  const { prev, next } = getAdjacentProjects(slug);

  return (
    <>
      <Cursor />
      <ScrollProgress />
      <Spotlight />
      <Toaster />
      <Nav />

      <main id="main" className="pt-28">
        <article>
          <div className="shell">
            <Link
              href="/#work"
              className="inline-flex items-center gap-2 text-xs text-muted transition-colors hover:text-fg"
            >
              <ArrowLeft size={14} /> All work
            </Link>

            <div className="mt-8 flex items-center gap-3 text-[11px] uppercase tracking-[0.18em] text-muted">
              <span className="tabular" style={{ color: project.accent }}>
                {project.index}
              </span>
              <span className="h-px w-8 bg-line-strong" />
              {project.category}
            </div>

            <h1 className="display mt-5 max-w-4xl text-[clamp(2.6rem,7vw,5.5rem)]">
              {project.title}
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-relaxed text-muted md:text-lg">
              {project.summary}
            </p>

            <div className="mt-10 flex flex-wrap items-center gap-3">
              {project.links.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="btn btn-primary btn-sm"
                >
                  {link.label} <ArrowUpRight size={14} />
                </a>
              ))}
              <a href="mailto:kangkan.raj@gmail.com" className="btn btn-ghost btn-sm">
                Similar project? Let&apos;s talk
              </a>
            </div>

            <div
              className="relative mt-12 h-[240px] overflow-hidden rounded-[28px] border border-line md:h-[340px]"
              style={{ background: project.gradient }}
            >
              <div
                className="absolute inset-0 opacity-[0.12]"
                style={{
                  backgroundImage:
                    "linear-gradient(to right, #fff 1px, transparent 1px), linear-gradient(to bottom, #fff 1px, transparent 1px)",
                  backgroundSize: "56px 56px",
                }}
                aria-hidden="true"
              />
              <div
                className="absolute -right-20 -top-24 size-80 rounded-full blur-3xl"
                style={{ background: project.accent, opacity: 0.28 }}
                aria-hidden="true"
              />
              <div className="absolute inset-0 flex items-end justify-between p-8">
                <span
                  className="display text-[7rem] leading-none md:text-[10rem]"
                  style={{ color: project.accent, opacity: 0.85 }}
                >
                  {project.index}
                </span>
                <div className="hidden gap-2 md:flex">
                  {project.stack.slice(0, 3).map((tech) => (
                    <span key={tech} className="chip !bg-black/25 !text-white/75">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-16 grid gap-12 lg:grid-cols-[0.55fr_1fr] lg:gap-20">
              <aside className="space-y-8">
                <div>
                  <p className="text-[10px] uppercase tracking-[0.18em] text-muted">
                    Stack
                  </p>
                  <ul className="mt-3 flex flex-wrap gap-1.5">
                    {project.stack.map((tech) => (
                      <li key={tech} className="chip">
                        {tech}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-[0.18em] text-muted">
                    Category
                  </p>
                  <p className="mt-2 text-sm">{project.category}</p>
                </div>
                <div className="rounded-2xl border border-line bg-panel/50 p-5">
                  <p className="text-[10px] uppercase tracking-[0.18em] text-muted">
                    Want the details?
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-muted">
                    I can walk through the architecture, the trade-offs and what I
                    would do differently today.
                  </p>
                  <a
                    href="mailto:kangkan.raj@gmail.com"
                    className="mt-4 inline-flex items-center gap-1.5 text-xs text-lime"
                  >
                    Email me <ArrowUpRight size={13} />
                  </a>
                </div>
              </aside>

              <div className="space-y-10">
                {[
                  { label: "The problem", body: project.problem },
                  { label: "The approach", body: project.approach },
                  { label: "The outcome", body: project.outcome },
                ].map((section, index) => (
                  <section key={section.label}>
                    <p className="flex items-center gap-2 text-[10px] uppercase tracking-[0.18em] text-muted">
                      <span className="tabular text-lime">0{index + 1}</span>
                      {section.label}
                    </p>
                    <p className="mt-3 text-base leading-relaxed text-fg/90 md:text-lg">
                      {section.body}
                    </p>
                  </section>
                ))}
              </div>
            </div>
          </div>

          <div className="shell mt-20 border-t border-line pt-10">
            <div className="grid gap-4 md:grid-cols-2">
              {prev ? (
                <Link
                  href={`/work/${prev.slug}/`}
                  className="group card hover-lift flex flex-col gap-2 p-6"
                >
                  <span className="flex items-center gap-2 text-[10px] uppercase tracking-[0.18em] text-muted">
                    <ArrowLeft size={12} /> Previous
                  </span>
                  <span className="text-lg transition-colors group-hover:text-lime">
                    {prev.title}
                  </span>
                </Link>
              ) : (
                <span />
              )}
              {next && (
                <Link
                  href={`/work/${next.slug}/`}
                  className="group card hover-lift flex flex-col items-end gap-2 p-6 text-right md:col-start-2"
                >
                  <span className="flex items-center gap-2 text-[10px] uppercase tracking-[0.18em] text-muted">
                    Next <ArrowRight size={12} />
                  </span>
                  <span className="text-lg transition-colors group-hover:text-lime">
                    {next.title}
                  </span>
                </Link>
              )}
            </div>
          </div>
        </article>
      </main>

      <div className="mt-20">
        <Footer />
      </div>
    </>
  );
}
