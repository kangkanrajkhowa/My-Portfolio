import { describe, expect, it } from "vitest";
import { projects, getProject, getAdjacentProjects } from "@/content/projects";
import { groups, groupMeta, skills } from "@/content/skills";
import { knowledge } from "@/content/knowledge";
import { faqGroups } from "@/content/faq";
import { experience } from "@/content/experience";
import { profile } from "@/content/profile";
import { socials } from "@/content/socials";

describe("projects", () => {
  it("has unique slugs and sequential indexes", () => {
    const slugs = new Set(projects.map((project) => project.slug));
    expect(slugs.size).toBe(projects.length);
    projects.forEach((project, index) => {
      expect(project.index).toBe(String(index + 1).padStart(2, "0"));
    });
  });

  it("has complete case-study copy", () => {
    for (const project of projects) {
      expect(project.summary.length).toBeGreaterThan(40);
      expect(project.problem.length).toBeGreaterThan(40);
      expect(project.approach.length).toBeGreaterThan(40);
      expect(project.outcome.length).toBeGreaterThan(40);
      expect(project.stack.length).toBeGreaterThan(1);
      expect(project.slug).toMatch(/^[a-z0-9-]+$/);
    }
  });

  it("resolves lookups and neighbours", () => {
    expect(getProject("egras-assam-web")?.title).toContain("eGRAS");
    expect(getProject("nope")).toBeUndefined();

    const middle = getAdjacentProjects("egras-assam-web");
    expect(middle.prev).toBeDefined();
    expect(middle.next).toBeDefined();

    const first = getAdjacentProjects(projects[0].slug);
    expect(first.prev).toBeUndefined();
  });
});

describe("skills", () => {
  it("covers every group including AI", () => {
    for (const group of groups) {
      expect(groupMeta[group].label.length).toBeGreaterThan(2);
      expect(skills.some((skill) => skill.group === group)).toBe(true);
    }
    expect(groupMeta.ai.label).toBe("AI & ML");
    expect(skills.filter((skill) => skill.group === "ai").length).toBeGreaterThanOrEqual(5);
  });

  it("keeps levels within range and names unique", () => {
    const names = new Set(skills.map((skill) => skill.name));
    expect(names.size).toBe(skills.length);
    for (const skill of skills) {
      expect(skill.level).toBeGreaterThanOrEqual(1);
      expect(skill.level).toBeLessThanOrEqual(5);
    }
  });
});

describe("knowledge base", () => {
  it("has non-trivial answers and keywords", () => {
    const ids = new Set(knowledge.map((entry) => entry.id));
    expect(ids.size).toBe(knowledge.length);
    for (const entry of knowledge) {
      expect(entry.answer.length).toBeGreaterThan(30);
      expect(entry.keywords.length).toBeGreaterThan(0);
    }
  });
});

describe("answers section", () => {
  it("resolves every published question to a knowledge answer", () => {
    const ids = new Set(knowledge.map((entry) => entry.id));
    expect(faqGroups.length).toBeGreaterThan(0);

    for (const group of faqGroups) {
      expect(group.items.length).toBeGreaterThan(0);
      for (const item of group.items) {
        expect(item.question.trim().endsWith("?")).toBe(true);
        expect(ids.has(item.entryId)).toBe(true);
      }
    }
  });

  it("does not publish the same question twice", () => {
    const questions = faqGroups.flatMap((group) =>
      group.items.map((item) => item.question),
    );
    expect(new Set(questions).size).toBe(questions.length);
  });
});

describe("profile and experience", () => {
  it("contains the essentials", () => {
    expect(profile.email).toContain("@");
    expect(profile.roles.length).toBeGreaterThan(1);
    expect(profile.bio.length).toBeGreaterThan(2);
    expect(socials.length).toBeGreaterThan(3);
    expect(experience.length).toBeGreaterThan(1);
  });
});
