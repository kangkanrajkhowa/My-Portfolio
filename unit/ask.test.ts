import { describe, expect, it } from "vitest";
import { ask } from "@/lib/ask";

describe("ask()", () => {
  it("answers stack questions", () => {
    const result = ask("What is his tech stack?");
    expect(result.entry?.id).toBe("stack");
    expect(result.entry?.answer).toContain("Laravel");
  });

  it("answers project questions by name", () => {
    expect(ask("tell me about egras").entry?.id).toBe("egras");
    expect(ask("what is city center store directory").entry?.id).toBe("city-center");
  });

  it("answers AI questions with the AI entry", () => {
    const result = ask("Does he know AI and LLMs?");
    expect(result.entry?.id).toBe("ai");
  });

  it("maps synonyms", () => {
    expect(ask("does he build chatbots").entry?.id).toBe("ai");
    expect(ask("can i hire him?").entry?.id).toBe("availability");
  });

  it("falls back gracefully for unknown questions", () => {
    const result = ask("what is the airspeed velocity of an unladen swallow");
    expect(result.entry).toBeNull();
    expect(result.suggestions.length).toBeGreaterThan(0);
  });

  it("handles empty input", () => {
    const result = ask("   ");
    expect(result.entry).toBeNull();
    expect(result.score).toBe(0);
  });
});
