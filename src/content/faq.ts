import type { KnowledgeEntry } from "@/content/knowledge";

/**
 * The questions worth asking out loud, grouped for the static answers section.
 * Each one points at an entry in `knowledge` so there is a single place where
 * the facts live — the section only decides wording and order.
 */
export type FaqItem = { question: string; entryId: KnowledgeEntry["id"] };

export type FaqGroup = {
  title: string;
  items: FaqItem[];
};

export const faqGroups: FaqGroup[] = [
  {
    title: "The work",
    items: [
      { question: "What does he actually do?", entryId: "what-does-he-do" },
      { question: "Which projects are worth looking at?", entryId: "projects" },
      { question: "What is NIC?", entryId: "nic" },
      { question: "How long has he been doing this?", entryId: "experience" },
    ],
  },
  {
    title: "The stack",
    items: [
      { question: "What is his stack?", entryId: "stack" },
      { question: "How deep does the Laravel work go?", entryId: "laravel" },
      { question: "Which database does he reach for?", entryId: "database" },
      { question: "Has he shipped mobile apps?", entryId: "flutter" },
      { question: "Does he actually use AI, or just talk about it?", entryId: "ai" },
    ],
  },
  {
    title: "Working together",
    items: [
      { question: "Is he available for freelance work?", entryId: "availability" },
      { question: "What does a project cost?", entryId: "rates" },
      { question: "Where is he based, and in which timezone?", entryId: "location" },
      { question: "Why hire one person instead of an agency?", entryId: "why-him" },
      { question: "Is there a CV?", entryId: "resume" },
      { question: "How do I get in touch?", entryId: "contact" },
    ],
  },
];
