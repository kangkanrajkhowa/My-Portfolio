"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, Sparkles } from "lucide-react";
import { ask, starterPrompts } from "@/lib/ask";

type Message = {
  id: number;
  role: "user" | "assistant";
  text: string;
};

const GREETING =
  "নমস্কাৰ! I’m a small assistant trained on Kangkan’s work. Ask about his stack, projects, AI skills or availability.";

function Typewriter({ text, onDone }: { text: string; onDone?: () => void }) {
  const [visible, setVisible] = useState("");
  const doneRef = useRef(onDone);
  doneRef.current = onDone;

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setVisible(text);
      doneRef.current?.();
      return;
    }

    let index = 0;
    const id = window.setInterval(() => {
      index += 2;
      setVisible(text.slice(0, index));
      if (index >= text.length) {
        window.clearInterval(id);
        doneRef.current?.();
      }
    }, 14);

    return () => window.clearInterval(id);
  }, [text]);

  return <>{visible || "\u00A0"}</>;
}

export function AskAI() {
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, role: "assistant", text: GREETING },
  ]);
  const [input, setInput] = useState("");
  const [thinking, setThinking] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>(starterPrompts);
  const scrollRef = useRef<HTMLDivElement>(null);
  const counter = useRef(2);

  useEffect(() => {
    const element = scrollRef.current;
    if (!element) return;
    element.scrollTop = element.scrollHeight;
  }, [messages, thinking]);

  const submit = (raw: string) => {
    const query = raw.trim();
    if (!query || thinking) return;

    setInput("");
    setMessages((current) => [
      ...current,
      { id: counter.current++, role: "user", text: query },
    ]);
    setThinking(true);

    const result = ask(query);

    window.setTimeout(() => {
      const answer =
        result.entry?.answer ??
        "I don’t have a written answer for that one yet. Try asking about his stack, a specific project, AI skills or availability — or email kangkan.raj@gmail.com.";

      setMessages((current) => [
        ...current,
        { id: counter.current++, role: "assistant", text: answer },
      ]);
      setSuggestions(result.suggestions);
      setThinking(false);
    }, 480);
  };

  return (
    <section id="ask" className="section border-y border-line bg-bg-elev/40">
      <div className="shell">
        <div className="grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:items-center">
          <div>
            <p className="eyebrow">06 — Ask my portfolio</p>
            <h2 className="display mt-6 text-4xl md:text-5xl">
              Don&apos;t read.
              <br />
              Just <span className="serif text-lime">ask</span>.
            </h2>
            <p className="mt-5 max-w-md text-sm leading-relaxed text-muted">
              A small assistant wired to a hand-written knowledge base — no
              API keys, no network calls, no hallucinated job titles. It is also
              a live demo of the AI work in the skills section.
            </p>

            <div className="mt-7 flex flex-wrap gap-2">
              {["AI skills", "eGRAS", "Freelance"].map((topic) => (
                <button
                  key={topic}
                  type="button"
                  onClick={() => submit(topic === "AI skills" ? "What AI skills does he have?" : topic === "eGRAS" ? "Tell me about eGRAS" : "Is he available for freelance?")}
                  className="chip transition-colors hover:border-lime hover:text-lime"
                >
                  {topic}
                </button>
              ))}
            </div>

            <p className="mt-8 flex items-center gap-2 text-[11px] text-muted">
              <Sparkles size={13} className="text-lime" />
              Answers are curated, not generated.
            </p>
          </div>

          <div className="card overflow-hidden">
            <div className="flex items-center justify-between border-b border-line px-5 py-3">
              <span className="flex items-center gap-2 text-xs text-muted">
                <span className="accent-dot" />
                Portfolio assistant
              </span>
              <span className="text-[10px] uppercase tracking-[0.16em] text-muted">
                offline · deterministic
              </span>
            </div>

            <div
              ref={scrollRef}
              role="log"
              aria-live="polite"
              aria-label="Conversation with the portfolio assistant"
              className="h-[340px] space-y-4 overflow-y-auto px-5 py-5 no-scrollbar"
            >
              {messages.map((message, index) => (
                <div
                  key={message.id}
                  className={
                    message.role === "user"
                      ? "ml-auto max-w-[85%] rounded-2xl rounded-br-sm bg-lime px-4 py-2.5 text-sm text-on-accent"
                      : "max-w-[92%] rounded-2xl rounded-bl-sm border border-line bg-panel/70 px-4 py-3 text-sm leading-relaxed text-muted"
                  }
                >
                  {message.role === "assistant" && index === messages.length - 1 ? (
                    <Typewriter text={message.text} />
                  ) : (
                    message.text
                  )}
                </div>
              ))}

              {thinking && (
                <div className="flex w-16 items-center justify-center gap-1 rounded-2xl border border-line bg-panel/70 px-4 py-3">
                  {[0, 1, 2].map((dot) => (
                    <span
                      key={dot}
                      className="size-1.5 animate-bounce rounded-full bg-muted"
                      style={{ animationDelay: `${dot * 120}ms` }}
                    />
                  ))}
                </div>
              )}
            </div>

            <div className="border-t border-line px-4 py-3">
              <div className="mb-2 flex flex-wrap gap-1.5">
                {suggestions.slice(0, 3).map((suggestion) => (
                  <button
                    key={suggestion}
                    type="button"
                    onClick={() => submit(suggestion)}
                    className="rounded-full border border-line px-2.5 py-1 text-[10px] text-muted transition-colors hover:border-lime hover:text-lime"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>

              <form
                onSubmit={(event) => {
                  event.preventDefault();
                  submit(input);
                }}
                className="flex items-center gap-2"
              >
                <label htmlFor="ask-input" className="sr-only">
                  Ask a question about Kangkan
                </label>
                <input
                  id="ask-input"
                  value={input}
                  onChange={(event) => setInput(event.target.value)}
                  placeholder="Ask anything…"
                  className="field !rounded-full !py-2.5 text-sm"
                  autoComplete="off"
                />
                <button
                  type="submit"
                  disabled={thinking || !input.trim()}
                  className="btn btn-primary btn-sm shrink-0 disabled:cursor-not-allowed disabled:opacity-40"
                  aria-label="Send question"
                >
                  Ask <ArrowUpRight size={14} />
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
