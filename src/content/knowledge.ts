export type KnowledgeEntry = {
  id: string;
  answer: string;
  keywords: string[];
  followUps?: string[];
};

/**
 * Hand-written knowledge base for the on-site assistant.
 * Everything here is curated, not generated — answers are deterministic.
 */
export const knowledge: KnowledgeEntry[] = [
  {
    id: "who",
    answer:
      "Kangkan Rajkhowa is a fullstack developer and UI/UX designer from Guwahati, Assam. He works as a senior developer at the National Informatics Centre (NIC) during the day and takes on freelance product work in the evenings.",
    keywords: ["who", "about", "kangkan", "intro", "yourself", "profile"],
    followUps: ["What is his stack?", "Show me his best projects"],
  },
  {
    id: "what-does-he-do",
    answer:
      "He designs and builds software end to end: Figma mockups, Laravel or React front ends, PostgreSQL schemas, admin panels and the deployment pipeline. Most of his work is public-sector and small-business software.",
    keywords: ["do", "work", "job", "role", "services", "build", "makes"],
  },
  {
    id: "location",
    answer:
      "Guwahati, Assam, India — IST (UTC+5:30). He works remotely with clients and teams anywhere.",
    keywords: ["where", "location", "based", "city", "guwahati", "assam", "timezone", "remote"],
  },
  {
    id: "availability",
    answer:
      "He is open to freelance projects and collaborations. The contact form on this page is the fastest way to start a conversation.",
    keywords: ["available", "availability", "freelance", "hire", "hiring", "work together", "projects"],
    followUps: ["How do I contact him?"],
  },
  {
    id: "contact",
    answer:
      "Use the contact section on this page, or email kangkan.raj@gmail.com. He is also on LinkedIn, GitHub and X — all linked in the footer.",
    keywords: ["contact", "email", "reach", "message", "phone", "call", "linkedin"],
  },
  {
    id: "stack",
    answer:
      "Frontend: HTML, CSS, JavaScript, TypeScript, React, Tailwind CSS, Sass and Bootstrap. Backend: PHP, Laravel, CodeIgniter, Node.js and REST APIs. Data: PostgreSQL, MySQL and MongoDB. Plus Git, GitHub Actions and Figma. This site itself runs on Next.js, React and Three.js.",
    keywords: ["stack", "tech", "technology", "tools", "languages", "frameworks", "skills"],
    followUps: ["What AI skills does he have?"],
  },
  {
    id: "ai",
    answer:
      "AI & ML is now a core part of his toolkit: LLM API integration (OpenAI, Gemini, Claude), prompt engineering, RAG with vector search, AI-assisted development and Python for ML. He uses agents to automate the boring parts of shipping software.",
    keywords: [
      "ai",
      "ml",
      "machine",
      "learning",
      "llm",
      "gpt",
      "openai",
      "prompt",
      "rag",
      "agent",
      "artificial",
      "chatbot",
      "chat",
    ],
    followUps: ["Which AI tools does he use daily?"],
  },
  {
    id: "ai-workflow",
    answer:
      "Daily: an AI coding assistant for scaffolding and refactors, LLM APIs inside products where they genuinely help, and retrieval over a project’s own documentation. He is deliberately conservative — AI where it saves time, humans where correctness matters.",
    keywords: ["ai tools", "copilot", "workflow", "daily", "assistant", "claude", "gemini"],
  },
  {
    id: "laravel",
    answer:
      "Laravel is his deepest backend tool. He has shipped production Laravel systems for government departments — routing, queues, role-based access, reporting and large PostgreSQL datasets.",
    keywords: ["laravel", "php", "backend", "framework"],
  },
  {
    id: "react",
    answer:
      "React and TypeScript for interactive interfaces, with Tailwind CSS for styling. This portfolio is built on Next.js 16 with React 19, Three.js for the hero and GSAP for the scroll choreography.",
    keywords: ["react", "next", "nextjs", "frontend", "typescript", "tailwind"],
  },
  {
    id: "design",
    answer:
      "He designs in Figma and Adobe XD before writing code — layout, type scale, component states and motion. He cares about accessible contrast, keyboard navigation and interfaces that explain themselves.",
    keywords: ["design", "ui", "ux", "figma", "adobe", "xd", "interface"],
  },
  {
    id: "projects",
    answer:
      "Seven selected projects: City Center Store Directory, Personal Management System, Custom Hover Effects, eGRAS Assam Web and Mobile, Atmanirbhar Assam and ICAI Guwahati. Each has a case study on this site.",
    keywords: ["projects", "portfolio", "work", "case", "study", "built"],
    followUps: ["Tell me about eGRAS", "What is City Center Store Directory?"],
  },
  {
    id: "city-center",
    answer:
      "City Center Store Directory is a searchable mall directory with a client-managed admin panel — Laravel, MySQL, DataTables and Bootstrap. It is live at storefinder.brahmaputracitycenter.com.",
    keywords: ["city center", "store", "directory", "mall", "brahmaputra"],
  },
  {
    id: "egras",
    answer:
      "eGRAS is Assam’s Government Receipt Accounting System — the portal that accepts online payment of state taxes through bank channels. He worked on the Laravel web application, the mobile companion and the PostgreSQL reporting layer, including Chart.js dashboards.",
    keywords: ["egras", "tax", "government", "receipt", "challan", "assam"],
  },
  {
    id: "atmanirbhar",
    answer:
      "Atmanirbhar Assam is a portal and MIS that tracks applications under state banking schemes, used by the Finance Department and SLBC to monitor progress bank by bank. Built on CodeIgniter and PostgreSQL.",
    keywords: ["atmanirbhar", "scheme", "bank", "mis", "finance"],
  },
  {
    id: "icai",
    answer:
      "ICAI Guwahati is the branch website for the Institute of Chartered Accountants of India — announcements, events and member resources, built in PHP with Bootstrap and DataTables.",
    keywords: ["icai", "chartered", "accountant", "guwahati"],
  },
  {
    id: "nic",
    answer:
      "NIC is India’s National Informatics Centre, the government’s technology arm. As a senior developer there, he builds public platforms for Assam — payment systems, scheme portals and internal dashboards.",
    keywords: ["nic", "national informatics", "government", "employer", "company"],
  },
  {
    id: "experience",
    answer:
      "Senior developer at NIC, freelance developer and designer for small businesses, and an ongoing open-source contributor. The experience section of this page has the details.",
    keywords: ["experience", "career", "years", "background", "history", "worked"],
  },
  {
    id: "open-source",
    answer:
      "He publishes small tools and design utilities — the Custom Hover Effects collection and Personal Management System are the most visible ones. His GitHub is github.com/kangkanrajkhowa.",
    keywords: ["open source", "github", "repository", "contribute", "oss"],
  },
  {
    id: "resume",
    answer:
      "There is a full résumé page at /resume, with a print-ready PDF download. It mirrors the experience and skills on this site.",
    keywords: ["resume", "cv", "download", "pdf", "curriculum"],
  },
  {
    id: "this-site",
    answer:
      "Built with Next.js 16, React 19, TypeScript and Tailwind CSS 4. The hero is a custom Three.js shader, motion is GSAP plus Lenis, and it is statically exported and deployed by GitHub Actions on every push.",
    keywords: ["this site", "website", "built", "stack", "three", "gsap", "next"],
  },
  {
    id: "tracking",
    answer:
      "No ads, no affiliate links, no analytics, no tracking and no paywall. That has been the rule since the first version of this site.",
    keywords: ["tracking", "analytics", "ads", "privacy", "cookies"],
  },
  {
    id: "rates",
    answer:
      "Project pricing depends on scope. Share what you need through the contact form and he will reply with an estimate — usually within a couple of days.",
    keywords: ["rate", "price", "cost", "budget", "quote", "charge", "pricing"],
  },
  {
    id: "languages",
    answer:
      "English and Assamese, with Hindi for everyday conversation. Documentation and code comments are always in English.",
    keywords: ["language", "english", "assamese", "hindi", "speak"],
  },
  {
    id: "education",
    answer:
      "Formal education details are not listed on this site — the work and the certifications (including a Flutter development certification) speak for themselves. Ask directly for a full CV.",
    keywords: ["education", "college", "degree", "study", "university", "school"],
  },
  {
    id: "certifications",
    answer:
      "Certified in Flutter application development through codedamn, and continuously learning React Native and Firebase.",
    keywords: ["certification", "certificate", "course", "flutter", "learning"],
  },
  {
    id: "flutter",
    answer:
      "Flutter and Dart for cross-platform mobile work — the eGRAS mobile companion is the largest example.",
    keywords: ["flutter", "dart", "mobile", "android", "ios", "app"],
  },
  {
    id: "database",
    answer:
      "PostgreSQL is the default for serious work; MySQL for smaller Laravel projects; MongoDB when the data is genuinely document-shaped.",
    keywords: ["database", "postgres", "postgresql", "mysql", "mongo", "sql", "data"],
  },
  {
    id: "why-him",
    answer:
      "One person, end to end: design, build, deploy and hand over with documentation. Government-grade reliability without agency overhead.",
    keywords: ["why", "choose", "different", "better", "value", "benefit"],
  },
  {
    id: "greeting",
    answer: "নমস্কাৰ! Ask me anything about Kangkan’s work, stack or availability.",
    keywords: ["hi", "hello", "hey", "namaste", "nomoskar", "greetings"],
    followUps: ["What is his stack?", "Show me his best projects"],
  },
];
