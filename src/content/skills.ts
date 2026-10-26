export type SkillGroup =
  | "frontend"
  | "backend"
  | "data"
  | "devops"
  | "design"
  | "mobile"
  | "ai";

export type Skill = {
  name: string;
  group: SkillGroup;
  level: 1 | 2 | 3 | 4 | 5;
};

export const groupMeta: Record<
  SkillGroup,
  { label: string; blurb: string; accent: string }
> = {
  frontend: {
    label: "Frontend",
    blurb: "Pixel-accurate, accessible interfaces that stay fast.",
    accent: "#C6F24E",
  },
  backend: {
    label: "Backend",
    blurb: "APIs, admin panels and business logic that hold up.",
    accent: "#7C5CFF",
  },
  data: {
    label: "Data",
    blurb: "Schemas, queries and reporting that make sense of the mess.",
    accent: "#4CC9F0",
  },
  devops: {
    label: "DevOps",
    blurb: "Pipelines, Linux boxes and deploys that do not wake me up.",
    accent: "#F7A072",
  },
  design: {
    label: "Design",
    blurb: "Interfaces designed before they are coded.",
    accent: "#FF8FA3",
  },
  mobile: {
    label: "Mobile",
    blurb: "Flutter apps that feel native on both stores.",
    accent: "#7BE0AD",
  },
  ai: {
    label: "AI & ML",
    blurb:
      "Currently learning: LLMs, model providers, retrieval, agents and automation — explored in side projects.",
    accent: "#FFD166",
  },
};

export const skills: Skill[] = [
  // frontend
  { name: "HTML", group: "frontend", level: 5 },
  { name: "CSS", group: "frontend", level: 5 },
  { name: "JavaScript", group: "frontend", level: 5 },
  { name: "TypeScript", group: "frontend", level: 4 },
  { name: "React", group: "frontend", level: 4 },
  { name: "Tailwind CSS", group: "frontend", level: 5 },
  { name: "Sass", group: "frontend", level: 5 },
  { name: "Bootstrap", group: "frontend", level: 5 },
  { name: "jQuery", group: "frontend", level: 4 },
  { name: "Styled Components", group: "frontend", level: 3 },

  // backend
  { name: "PHP", group: "backend", level: 5 },
  { name: "Laravel", group: "backend", level: 5 },
  { name: "CodeIgniter", group: "backend", level: 5 },
  { name: "Node.js", group: "backend", level: 4 },
  { name: "REST APIs", group: "backend", level: 5 },
  { name: "JSON", group: "backend", level: 5 },

  // data
  { name: "PostgreSQL", group: "data", level: 5 },
  { name: "MySQL", group: "data", level: 5 },
  { name: "MongoDB", group: "data", level: 3 },

  // devops
  { name: "Git", group: "devops", level: 5 },
  { name: "GitHub Actions", group: "devops", level: 4 },
  { name: "CI/CD", group: "devops", level: 4 },
  { name: "Linux", group: "devops", level: 4 },

  // design
  { name: "Figma", group: "design", level: 5 },
  { name: "Adobe XD", group: "design", level: 4 },
  { name: "Design", group: "design", level: 5 },

  // mobile
  { name: "Flutter", group: "mobile", level: 3 },
  { name: "Dart", group: "mobile", level: 3 },

  // ai
  { name: "LLM API integration", group: "ai", level: 4 },
  { name: "Prompt engineering", group: "ai", level: 4 },
  { name: "RAG & vector search", group: "ai", level: 3 },
  { name: "AI-assisted development", group: "ai", level: 5 },
  { name: "Python for ML", group: "ai", level: 3 },
  { name: "Agent workflows", group: "ai", level: 3 },
];

export const groups = Object.keys(groupMeta) as SkillGroup[];
