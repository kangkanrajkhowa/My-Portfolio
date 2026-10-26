"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Command } from "cmdk";
import {
  ArrowUpRight,
  Check,
  Command as CommandIcon,
  Copy,
  Download,
  Mail,
  Moon,
  Sparkles,
} from "lucide-react";
import { projects } from "@/content/projects";
import { profile } from "@/content/profile";
import { scrollToSection } from "@/lib/motion";
import { toast } from "@/components/ui/toast";

const sections = [
  { id: "about", label: "About" },
  { id: "skills", label: "Skills" },
  { id: "work", label: "Work" },
  { id: "experience", label: "Experience" },
  { id: "stats", label: "GitHub stats" },
  { id: "ask", label: "Ask my portfolio" },
  { id: "contact", label: "Contact" },
];

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setOpen((current) => !current);
      }
      if (event.key === "Escape") setOpen(false);
    };

    const onOpen = () => setOpen(true);

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("kr-command-open", onOpen);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("kr-command-open", onOpen);
    };
  }, []);

  const go = useCallback(
    (id: string) => {
      setOpen(false);
      window.setTimeout(() => scrollToSection(`#${id}`), 80);
    },
    [],
  );

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(profile.email);
      setCopied(true);
      toast("Email copied to clipboard");
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      toast("Could not copy — email is in the contact section");
    }
  };

  const toggleTheme = () => {
    const root = document.documentElement;
    const next = root.dataset.theme === "light" ? "dark" : "light";
    root.dataset.theme = next;
    localStorage.setItem("kr-theme", next);
    toast(`${next === "dark" ? "Dark" : "Light"} mode`);
  };

  return (
    <Command.Dialog
      open={open}
      onOpenChange={setOpen}
      label="Command menu"
      shouldFilter
    >
      <Command.Input placeholder="Jump to a section, project or action…" />
      <Command.List
        data-lenis-prevent
        className="overscroll-contain"
      >
        <Command.Empty>No results found.</Command.Empty>

        <Command.Group heading="Sections">
          {sections.map((section) => (
            <Command.Item key={section.id} onSelect={() => go(section.id)}>
              <ArrowUpRight size={15} />
              {section.label}
            </Command.Item>
          ))}
        </Command.Group>

        <Command.Group heading="Projects">
          {projects.map((project) => (
            <Command.Item
              key={project.slug}
              value={`${project.title} ${project.stack.join(" ")}`}
              onSelect={() => {
                setOpen(false);
                router.push(`/work/${project.slug}/`);
              }}
            >
              <span className="tabular text-xs text-muted">{project.index}</span>
              {project.title}
            </Command.Item>
          ))}
        </Command.Group>

        <Command.Group heading="Actions">
          <Command.Item onSelect={() => go("ask")}>
            <Sparkles size={15} />
            Ask my portfolio AI
          </Command.Item>
          <Command.Item onSelect={copyEmail}>
            {copied ? <Check size={15} /> : <Copy size={15} />}
            Copy email address
          </Command.Item>
          <Command.Item
            onSelect={() => {
              setOpen(false);
              router.push("/resume/");
            }}
          >
            <Download size={15} />
            Open résumé
          </Command.Item>
          <Command.Item onSelect={toggleTheme}>
            <Moon size={15} />
            Toggle theme
          </Command.Item>
          <Command.Item
            onSelect={() => {
              setOpen(false);
              router.push("/#contact");
            }}
          >
            <Mail size={15} />
            Start a project
          </Command.Item>
        </Command.Group>
      </Command.List>

      <div className="flex items-center justify-between border-t border-line px-4 py-2.5 text-[11px] text-muted">
        <span className="flex items-center gap-1.5">
          <CommandIcon size={12} /> K to toggle
        </span>
        <span>↑↓ navigate · ↵ select · esc close</span>
      </div>
    </Command.Dialog>
  );
}
