export type ExperienceItem = {
  role: string;
  org: string;
  period: string;
  location: string;
  summary: string;
  bullets: string[];
  accent: string;
};

export const experience: ExperienceItem[] = [
  {
    role: "Senior Developer",
    org: "National Informatics Centre (NIC)",
    period: "Present",
    location: "Guwahati, Assam",
    summary:
      "Building and maintaining public-sector platforms used across Assam — payment systems, scheme portals and internal MIS dashboards.",
    bullets: [
      "Develop and maintain large Laravel and CodeIgniter applications backed by PostgreSQL.",
      "Ship reporting dashboards with Chart.js used by departmental officers and banks.",
      "Work directly with government stakeholders to turn policy requirements into working software.",
    ],
    accent: "#C6F24E",
  },
  {
    role: "Freelance Developer & Designer",
    org: "Independent",
    period: "Evenings & weekends",
    location: "Remote",
    summary:
      "End-to-end delivery for small businesses and institutions: design in Figma, build in Laravel or React, deploy and hand over.",
    bullets: [
      "Design and build marketing sites, directories and admin panels for local clients.",
      "Handle everything from wireframes to DNS, hosting and post-launch support.",
      "Keep the stack boring on purpose so clients can maintain it after handover.",
    ],
    accent: "#7C5CFF",
  },
  {
    role: "Open Source Contributor",
    org: "GitHub",
    period: "Ongoing",
    location: "The internet",
    summary:
      "Publishing small tools, design utilities and experiments — plus reading far more source code than I write.",
    bullets: [
      "Maintain CSS and UI utility projects used by other developers.",
      "Explore AI-assisted workflows and document what actually helps.",
    ],
    accent: "#4CC9F0",
  },
];
