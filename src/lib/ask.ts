import { knowledge, type KnowledgeEntry } from "@/content/knowledge";
import { tokenize } from "@/lib/utils";

const STOPWORDS = new Set([
  "a", "an", "the", "is", "are", "was", "were", "do", "does", "did", "of", "to",
  "in", "on", "for", "with", "and", "or", "at", "by", "from", "about", "his",
  "her", "he", "she", "it", "they", "you", "your", "me", "my", "i", "we", "us",
  "what", "who", "how", "why", "when", "where", "can", "could", "would", "should",
  "tell", "show", "give", "please", "any", "some", "there", "this", "that",
]);

const SYNONYMS: Record<string, string[]> = {
  js: ["javascript"],
  ts: ["typescript"],
  nextjs: ["next", "react"],
  next: ["nextjs", "react"],
  postgres: ["postgresql", "database", "data"],
  sql: ["postgresql", "mysql", "database"],
  mongo: ["mongodb", "database"],
  llms: ["llm", "ai"],
  gpt: ["llm", "ai", "openai"],
  chatbot: ["ai", "llm"],
  machine: ["ai", "ml"],
  job: ["work", "role", "experience"],
  company: ["nic", "employer", "work"],
  cv: ["resume"],
  contact: ["email", "reach"],
  reach: ["contact", "email"],
  cost: ["price", "rate", "budget"],
  price: ["rate", "cost", "budget"],
  hire: ["availability", "freelance", "contact"],
  gov: ["government", "nic", "egras"],
  ui: ["design"],
  ux: ["design"],
  mobile: ["flutter", "app"],
  site: ["website", "this site"],
};

export type AskResult = {
  entry: KnowledgeEntry | null;
  score: number;
  suggestions: string[];
};

const SUGGESTIONS = [
  "What is his stack?",
  "Tell me about eGRAS",
  "Is he available for freelance?",
  "What AI skills does he have?",
];

function expand(tokens: string[]) {
  const expanded = new Set(tokens);
  for (const token of tokens) {
    for (const extra of SYNONYMS[token] ?? []) {
      expanded.add(extra);
    }
    // naive singularisation: "chatbots" -> "chatbot", "projects" -> "project"
    if (token.endsWith("s") && token.length > 4) {
      const singular = token.slice(0, -1);
      expanded.add(singular);
      for (const extra of SYNONYMS[singular] ?? []) {
        expanded.add(extra);
      }
    }
  }
  return expanded;
}

export function ask(query: string): AskResult {
  const raw = tokenize(query).filter(
    (token) => token.length > 1 && !STOPWORDS.has(token),
  );

  if (raw.length === 0) {
    return { entry: null, score: 0, suggestions: SUGGESTIONS };
  }

  const tokens = [...expand(raw)];
  const phrase = query.toLowerCase().trim();

  let best: KnowledgeEntry | null = null;
  let bestScore = 0;

  for (const entry of knowledge) {
    let score = 0;

    for (const keyword of entry.keywords) {
      if (keyword.includes(" ")) {
        if (phrase.includes(keyword)) score += 4;
        continue;
      }
      for (const token of tokens) {
        if (token === keyword) score += 3;
        else if (token.length > 2 && keyword.startsWith(token)) score += 1.6;
        else if (token.length > 3 && keyword.includes(token)) score += 1.2;
      }
    }

    for (const token of tokens) {
      if (entry.answer.toLowerCase().includes(token)) score += 0.35;
    }

    if (score > bestScore) {
      bestScore = score;
      best = entry;
    }
  }

  if (bestScore < 2.2) {
    return {
      entry: null,
      score: bestScore,
      suggestions: best?.followUps?.length ? best.followUps : SUGGESTIONS,
    };
  }

  return {
    entry: best,
    score: bestScore,
    suggestions: best?.followUps ?? SUGGESTIONS,
  };
}

export const starterPrompts = SUGGESTIONS;
