import { ArrowUp } from "lucide-react";
import { profile } from "@/content/profile";
import { socials } from "@/content/socials";
import { socialIconMap } from "@/components/ui/brand-icons";

export function Footer() {
  return (
    <footer className="relative border-t border-line pb-10 pt-16">
      <div className="shell">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr]">
          <div>
            <p className="eyebrow">Say hello</p>
            <h2 className="display mt-5 text-5xl md:text-6xl">
              Let&apos;s build something
              <br />
              worth <span className="serif text-lime">keeping</span>.
            </h2>
            <a
              href={`mailto:${profile.email}`}
              className="mt-6 inline-flex items-center gap-2 text-lg text-muted transition-colors hover:text-lime"
            >
              {profile.email}
              <span aria-hidden="true">↗</span>
            </a>
          </div>

          <div className="grid grid-cols-2 gap-x-6 gap-y-3 self-end">
            {socials.map((social) => {
              const Icon = socialIconMap[social.icon];
              return (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="group flex items-center gap-2 text-sm text-muted transition-colors hover:text-fg"
                >
                  <Icon size={15} />
                  {social.label}
                  <span className="text-muted opacity-0 transition-opacity group-hover:opacity-100">
                    ↗
                  </span>
                </a>
              );
            })}
          </div>
        </div>

        <div className="hairline my-12" />

        <div className="flex flex-col-reverse items-start justify-between gap-6 text-xs text-muted md:flex-row md:items-center">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
            <span>© {new Date().getFullYear()} {profile.name}</span>
            <span className="hidden md:inline">·</span>
            <span>No ads. No tracking. No paywall.</span>
            <span className="hidden md:inline">·</span>
            <span>Built with Next.js, Three.js &amp; GSAP</span>
          </div>

          <div className="flex items-center gap-5">
            <span className="bengali text-sm text-fg">{profile.signoff}</span>
            <a
              href="#top"
              className="inline-flex items-center gap-1.5 rounded-full border border-line px-3 py-1.5 transition-colors hover:border-lime hover:text-lime"
            >
              Back to top <ArrowUp size={12} />
            </a>
          </div>
        </div>

        <p className="mt-6 text-[11px] text-muted">
          Portfolio — Guwahati, Assam · {profile.availability}
        </p>
      </div>
    </footer>
  );
}
