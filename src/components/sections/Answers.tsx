import Link from "next/link";
import { Plus } from "lucide-react";
import { faqGroups } from "@/content/faq";
import { knowledge } from "@/content/knowledge";

/** Answers are looked up by id so the copy lives only in the knowledge base. */
const answerFor = (entryId: string) =>
  knowledge.find((entry) => entry.id === entryId)?.answer;

/**
 * Rendered at build time from the curated knowledge base: real text, no client
 * JavaScript and nothing to focus-trap. Native <details> keeps it keyboard
 * accessible and crawlable.
 */
export function Answers() {
  return (
    <section id="faq" className="section border-t border-line">
      <div className="shell">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="eyebrow">06 — Answers</p>
            <h2 className="display mt-6 text-4xl md:text-5xl">
              Questions people
              <br />
              actually <span className="serif text-lime">ask</span>.
            </h2>
          </div>
          <p className="max-w-xs text-sm leading-relaxed text-muted">
            Written down rather than guessed at — no chat window, no tracking,
            just the short version of each answer.
          </p>
        </div>

        <div className="mt-12 grid gap-x-10 gap-y-10 md:grid-cols-2 lg:grid-cols-3">
          {faqGroups.map((group) => (
            <div key={group.title}>
              <h3 className="text-[11px] uppercase tracking-[0.16em] text-muted">
                {group.title}
              </h3>
              <dl className="mt-4 border-t border-line">
                {group.items.map((item) => {
                  const answer = answerFor(item.entryId);
                  if (!answer) return null;

                  return (
                    <details key={item.entryId} className="group border-b border-line py-4">
                      <summary className="flex cursor-pointer list-none items-start justify-between gap-4 text-sm font-medium tracking-tight text-fg [&::-webkit-details-marker]:hidden">
                        <span>{item.question}</span>
                        <Plus
                          size={15}
                          aria-hidden="true"
                          className="faq-marker mt-0.5 shrink-0 text-muted"
                        />
                      </summary>
                      <dd className="mt-3 text-sm leading-relaxed text-muted">
                        {answer}
                      </dd>
                    </details>
                  );
                })}
              </dl>
            </div>
          ))}
        </div>

        <p className="mt-10 text-sm text-muted">
          Something not covered here?{" "}
          <Link href="#contact" className="text-lime underline-offset-4 hover:underline">
            Ask directly
          </Link>
          .
        </p>
      </div>
    </section>
  );
}
